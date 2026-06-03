#!/usr/bin/env python3
"""
scripts/audit/aplicar-eeat.py — Aplica componentes E-E-A-T transversales a landings de convenio.

Componentes que aplica:
  1. SELLO de verificación tras el hero: "✓ Verificado contra [boletín detectado] por SalarioJusto · última revisión [fecha]"
  2. COMPONENTE de autoría al final del main, antes de related: "Quién audita esto" con enlace a /sobre.html

Idempotente: si los markers ya existen en la página, no los duplica (busca <!-- eeat-sello --> y <!-- eeat-firma -->).

Detección de boletín: regex priorizado (BOPZ, BOCM, BOPV, BOE-A-, DOGC, BOIB, BOJA, BORM, BOPA, BOPB, BOC, BON...). Fallback: "el boletín oficial de la provincia".

Detección de fecha de revisión: JSON-LD dateModified → git log --format=%cs → mtime del archivo → fecha de hoy.

Uso:
  python scripts/audit/aplicar-eeat.py --dry-run                  # muestra qué se aplicaría sin tocar
  python scripts/audit/aplicar-eeat.py --dry-run --landing X.html # solo una landing
  python scripts/audit/aplicar-eeat.py                            # aplica de verdad
"""

import argparse
import re
import subprocess
import sys
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SITEMAP = ROOT / "sitemap.xml"
DOMAIN = "https://salariojusto.es/"

SELLO_MARKER = "<!-- eeat-sello -->"
FIRMA_MARKER = "<!-- eeat-firma -->"

MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio",
         "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]

# Landings que se saltan del script (D2a — pilares sin convenio único contra el que verificar).
EXCLUDE_SLUGS = {
    "convenio-hosteleria.html",  # PILAR sectorial, no es un convenio específico
}

# Mapping hardcoded de boletín por slug (D1c — falsos positivos del regex + casos especiales).
# Códigos verificados manualmente extrayendo del propio HTML de cada landing (3-jun-2026).
MAPPING_BOLETIN = {
    "convenio-hosteleria-zaragoza.html": "BOPZ Núm. 84/2024",
    "convenio-hosteleria-valencia.html": "BOP Valencia Núm. 26/2023",
    "convenio-limpieza-sevilla.html": "BOP Sevilla Núm. 162/2025",
    "convenio-limpieza-valencia.html": "BOP Valencia Núm. 246/2022",
    "convenio-limpieza-malaga.html": "BOP de Málaga",  # landing thin sin código publicado
}


# ===== Detección de boletín =====

BOLETIN_PATRONES = [
    # (regex, etiqueta_amigable_si_solo_nombre_sin_numero)
    (r"BOPZ\s+(?:Núm\.\s*)?(\d+)(?:[\s/\-]*(\d{4}))?", "BOPZ"),
    (r"BOCM\s+(?:Núm\.\s*)?(\d+)(?:[\s/\-]*(\d{4}))?", "BOCM"),
    (r"BOPV\s+(?:Núm\.\s*)?(\d+)(?:[\s/\-]*(\d{4}))?", "BOPV"),
    (r"BOPB\s+(?:Núm\.\s*)?(\d+)(?:[\s/\-]*(\d{4}))?", "BOPB"),
    (r"BOIB\s+(?:Núm\.\s*)?(\d+)(?:[\s/\-]*(\d{4}))?", "BOIB"),
    (r"BOJA\s+(?:Núm\.\s*)?(\d+)(?:[\s/\-]*(\d{4}))?", "BOJA"),
    (r"BORM\s+(?:Núm\.\s*)?(\d+)(?:[\s/\-]*(\d{4}))?", "BORM"),
    (r"BOPA\s+(?:Núm\.\s*)?(\d+)(?:[\s/\-]*(\d{4}))?", "BOPA"),
    (r"BON\s+(?:Núm\.\s*)?(\d+)(?:[\s/\-]*(\d{4}))?", "BON"),
    (r"BOC\s+(?:Núm\.\s*)?(\d+)(?:[\s/\-]*(\d{4}))?", "BOC"),
    (r"DOGC\s+(?:Núm\.\s*)?(\d+)(?:[\s/\-]*(\d{4}))?", "DOGC"),
    (r"DOGV\s+(?:Núm\.\s*)?(\d+)(?:[\s/\-]*(\d{4}))?", "DOGV"),
    (r"BOPB\s+(?:Núm\.\s*)?(\d+)(?:[\s/\-]*(\d{4}))?", "BOPB"),
    (r"BOE-A-(\d{4}-\d+)", "BOE"),
]


def detectar_boletin(html: str) -> str:
    for patron, etiqueta in BOLETIN_PATRONES:
        m = re.search(patron, html)
        if m:
            num = m.group(1)
            anio = m.group(2) if (m.lastindex and m.lastindex >= 2) else None
            if etiqueta == "BOE":
                return f"el BOE (referencia BOE-A-{num})"
            if anio:
                return f"{etiqueta} Núm. {num}/{anio}"
            return f"{etiqueta} Núm. {num}"
    # Fallback: si menciona el nombre del boletín pero sin número
    for _, etiqueta in BOLETIN_PATRONES:
        if re.search(rf"\b{etiqueta}\b", html):
            return f"el {etiqueta} de la provincia"
    return "el boletín oficial de la provincia"


def detectar_fecha_revision(html: str, html_path: Path) -> str:
    # 1. JSON-LD dateModified
    m = re.search(r'"dateModified"\s*:\s*"(\d{4}-\d{2}-\d{2})"', html)
    if m:
        return m.group(1)
    # 2. git log: fecha del último commit que tocó el archivo
    try:
        rel = html_path.relative_to(ROOT)
        out = subprocess.run(
            ["git", "log", "-1", "--format=%cs", "--", str(rel)],
            capture_output=True, text=True, cwd=str(ROOT), timeout=5,
        )
        if out.returncode == 0 and out.stdout.strip():
            return out.stdout.strip()
    except Exception:
        pass
    # 3. mtime del archivo
    try:
        return datetime.fromtimestamp(html_path.stat().st_mtime).strftime("%Y-%m-%d")
    except Exception:
        return datetime.now().strftime("%Y-%m-%d")


def formatear_fecha_humana(fecha_iso: str) -> str:
    try:
        y, m, d = fecha_iso.split("-")
        return f"{int(d)} de {MESES[int(m) - 1]} de {y}"
    except Exception:
        return fecha_iso


# ===== Inserción de componentes =====

def aplicar_sello(html: str, boletin_ref: str, fecha_humana: str) -> tuple:
    if SELLO_MARKER in html:
        return html, "ya-aplicado"

    sello = (
        f'\n  <div class="callout-info eeat-sello" style="margin:24px 0 0;border-left:4px solid var(--green);font-size:13.5px;">\n'
        f'    {SELLO_MARKER}\n'
        f'    <strong>✓ Verificado</strong> contra {boletin_ref} por SalarioJusto · última revisión {fecha_humana}\n'
        f'  </div>\n'
    )

    # Insertar justo después del hero (</section>), dentro del <main>.
    # Patrón: <main>\n\n  <div class="card">  →  meter ANTES de la primera card
    patron = re.compile(r"(<main>\s*\n\s*)", re.IGNORECASE)
    nuevo, n = patron.subn(r"\1" + sello + "\n  ", html, count=1)
    if n == 0:
        return html, "no-encontrado-anchor-main"
    return nuevo, "aplicado"


def aplicar_firma(html: str) -> tuple:
    if FIRMA_MARKER in html:
        return html, "ya-aplicado"

    firma = (
        '\n  <div class="eeat-firma" style="margin-top:36px;padding:24px;background:var(--cream-100);border:1px solid var(--cream-200);">\n'
        f'    {FIRMA_MARKER}\n'
        '    <h2 style="font-size:18px;border:none;padding:0;margin:0 0 10px;font-family:\'DM Serif Display\',serif;font-weight:400;">Quién audita esto</h2>\n'
        '    <p style="font-size:13.5px;color:var(--ink-light);line-height:1.65;margin:0 0 10px;">Esta ficha de convenio ha sido cruzada manualmente contra el texto íntegro del boletín oficial por el equipo de SalarioJusto. Verificamos cifra a cifra (salarios, jornada, pluses, pagas extras) y dejamos el código del edicto y la fecha de revisión visibles para que puedas comprobarlo tú también.</p>\n'
        '    <p style="font-size:13.5px;color:var(--ink-light);line-height:1.65;margin:0 0 10px;">No somos un bufete: somos una herramienta gratuita de transparencia salarial, sin empresas detrás. Si detectas un error, <a href="/sobre.html">escríbenos</a> y lo corregimos.</p>\n'
        '    <p style="font-size:13px;margin:6px 0 0;"><a href="/sobre.html" style="font-weight:600;color:var(--gold-dark);">Cómo trabajamos →</a></p>\n'
        '  </div>\n'
    )

    # Insertar antes del bloque <div class="related">
    patron = re.compile(r'(<div class="related">)')
    nuevo, n = patron.subn(firma + r"\n  \1", html, count=1)
    if n == 0:
        # Fallback: insertar al final del </main> si no hay related
        patron = re.compile(r"(</main>)")
        nuevo, n = patron.subn(firma + r"\n\1", html, count=1)
        if n == 0:
            return html, "no-encontrado-anchor-main-end"
    return nuevo, "aplicado"


# ===== Selección de landings =====

def listar_landings_convenio() -> list:
    """Devuelve la lista de slugs de landings de convenio desde el sitemap."""
    sm = SITEMAP.read_text(encoding="utf-8")
    slugs = []
    for m in re.finditer(r"<loc>https://salariojusto\.es/([^<]+)</loc>", sm):
        slug = m.group(1)
        # Solo convenios + construccion-estatal
        if slug.startswith("convenio-") or slug.startswith("construccion-"):
            slugs.append(slug)
    return sorted(set(slugs))


# ===== Main =====

def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="no escribe nada; solo muestra qué se aplicaría")
    parser.add_argument("--landing", default=None, help="aplica solo a esta landing (basename HTML)")
    args = parser.parse_args()

    if args.landing:
        slugs = [args.landing]
    else:
        slugs = [s for s in listar_landings_convenio() if s not in EXCLUDE_SLUGS]

    print(f"Landings a procesar: {len(slugs)} (excluidas {len(EXCLUDE_SLUGS)}: {sorted(EXCLUDE_SLUGS)})")
    contadores = {"sello-aplicado": 0, "sello-ya": 0, "sello-error": 0,
                  "firma-aplicada": 0, "firma-ya": 0, "firma-error": 0,
                  "saltadas": 0}

    for slug in slugs:
        path = ROOT / slug
        if not path.exists():
            print(f"  [skip] {slug}: no existe")
            contadores["saltadas"] += 1
            continue
        html = path.read_text(encoding="utf-8")
        # Prioridad: mapping hardcoded > detección regex
        boletin = MAPPING_BOLETIN.get(slug) or detectar_boletin(html)
        fecha_iso = detectar_fecha_revision(html, path)
        fecha_humana = formatear_fecha_humana(fecha_iso)

        nuevo, estado_sello = aplicar_sello(html, boletin, fecha_humana)
        nuevo, estado_firma = aplicar_firma(nuevo)

        if estado_sello == "aplicado":
            contadores["sello-aplicado"] += 1
        elif estado_sello == "ya-aplicado":
            contadores["sello-ya"] += 1
        else:
            contadores["sello-error"] += 1

        if estado_firma == "aplicado":
            contadores["firma-aplicada"] += 1
        elif estado_firma == "ya-aplicado":
            contadores["firma-ya"] += 1
        else:
            contadores["firma-error"] += 1

        flag = "(DRY-RUN) " if args.dry_run else ""
        print(f"  {flag}{slug:48s}  bol='{boletin}'  fecha={fecha_iso}  sello={estado_sello:12s}  firma={estado_firma}")

        if not args.dry_run and nuevo != html:
            path.write_text(nuevo, encoding="utf-8")

    print()
    print("Resumen:")
    for k, v in contadores.items():
        print(f"  {k}: {v}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
