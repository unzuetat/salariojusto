#!/usr/bin/env python3
"""
scripts/audit/thin.py — Regenera auditoria-thin.csv cruzando sitemap + HTML signals + GSC.

Reconstrucción heurística del snapshot original del 28-may. La fórmula exacta del CSV
original no era deducible al 100%; estos pesos se calibraron contra ese snapshot para
producir rankings comparables (±1 punto en páginas estables tras el sprint BOE remixed).

Output: auditoria-thin.csv (sobreescribe). El CSV anterior se archiva manualmente en
analisis/auditorias/YYYY-MM-DD/ antes de correr este script.

Uso:  python scripts/audit/thin.py
"""

import csv
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SITEMAP = ROOT / "sitemap.xml"
GSC_CSV = ROOT / "analisis" / "gsc-paginas.csv"
OUT_CSV = ROOT / "auditoria-thin.csv"

DOMAIN = "https://salariojusto.es/"


# ===== Extracción de señales medibles del HTML =====

def extract_signals(html: str) -> dict:
    body = re.sub(r"<script[^>]*>.*?</script>", "", html, flags=re.DOTALL | re.IGNORECASE)
    body = re.sub(r"<style[^>]*>.*?</style>", "", body, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r"<[^>]+>", " ", body)
    text = re.sub(r"\s+", " ", text).strip()
    wc = len(text.split())

    n_h2 = len(re.findall(r"<h2\b", html, flags=re.IGNORECASE))
    n_tablas = len(re.findall(r"<table\b", html, flags=re.IGNORECASE))
    n_details = len(re.findall(r"<details\b", html, flags=re.IGNORECASE))

    n_boe = len(re.findall(
        r"BOE-A-\d+|\bboe\.es\b|\bbopv\.|\bdogc\.|\bbop[\w-]*\.|\bgipuzkoa\.eus|\bcomunidad\.madrid|\bbocm\.",
        html, flags=re.IGNORECASE))
    n_arts = len(re.findall(r"\bart(?:\.|í?culo)?\s*\d+", html, flags=re.IGNORECASE))

    faq_schema = 1 if re.search(r'"@type"\s*:\s*"(FAQPage|Question)"', html) else 0
    link_oficial = 1 if re.search(
        r'href="[^"]*(?:mites\.gob\.es|sepe\.es|seg-social|boe\.es|bopv\.|dogc\.|bog|bop[\w-]*\.|bocm\.|gipuzkoa\.eus)',
        html, flags=re.IGNORECASE) else 0

    return {
        "wc": wc, "n_h2": n_h2, "n_tablas": n_tablas, "n_details": n_details,
        "n_boe": n_boe, "n_arts": n_arts, "faq_schema": faq_schema, "link_oficial": link_oficial,
    }


def extract_title(html: str) -> str:
    m = re.search(r"<title>([^<]+)</title>", html, flags=re.IGNORECASE | re.DOTALL)
    return m.group(1).strip() if m else ""


# ===== Clasificación tipo_contenido + categoria =====

def classify_tipo(slug: str) -> str:
    if slug == "index.html":
        return "home/calculadora"
    if slug in ("convenio-hosteleria.html", "convenio-limpieza-edificios-locales.html",
                "salarios.html", "convenios.html", "guias.html",
                "construccion-estatal-suelo-salarial.html"):
        return "hub-sectorial"
    if slug in ("mapa-del-sitio.html", "sala-de-prensa.html", "sobre.html"):
        return "institucional"
    if slug in ("salario-minimo-interprofesional-2026.html", "tramos-irpf-2026.html"):
        return "herramienta"
    if slug.startswith("plantilla-") or slug.startswith("pedir-banda-"):
        return "plantilla-juridica"
    if slug.startswith("convenio-"):
        return "convenio-provincial"
    return "guia-legal"


def classify_categoria(slug: str) -> str:
    if slug == "convenio-hosteleria.html" or slug.startswith("convenio-hosteleria-"):
        return "convenio-hosteleria"
    if slug == "convenio-limpieza-edificios-locales.html" or slug.startswith("convenio-limpieza-"):
        return "convenio-limpieza"
    if slug.startswith("convenio-") or slug.startswith("construccion-estatal"):
        return "otros-convenios"
    if slug in ("index.html", "salarios.html", "convenios.html", "guias.html"):
        return "core"
    if slug in ("mapa-del-sitio.html", "sala-de-prensa.html", "sobre.html"):
        return "institucional"
    if slug in ("salario-minimo-interprofesional-2026.html", "tramos-irpf-2026.html"):
        return "calculadoras"
    if slug.startswith("plantilla-") or slug.startswith("pedir-banda-"):
        return "plantillas"
    return "marco-legal"


# ===== Heurísticas de scoring =====

def compute_raw(s: dict) -> float:
    return round(
        s["wc"] / 1000
        + (s["n_h2"] + s["n_tablas"]) * 0.5
        + s["n_details"]
        + (s["n_boe"] + s["n_arts"]) / 10
        + s["faq_schema"]
        + s["link_oficial"],
        2,
    )


def compute_thin_score(raw: float, tipo: str) -> int:
    if tipo in ("home/calculadora", "herramienta"):
        # Calc/home real: cap a 3 (no tiene contenido editorial extenso por diseño)
        if raw < 4: return 1
        if raw < 7: return 2
        return 3
    if tipo == "institucional":
        # Institucional: escala normal capada a 8 (permite reflejar sobre.html rico
        # sin subir a 10 reservado para BOE remixed)
        if raw >= 22: return 8
        if raw >= 19: return 7
        if raw >= 17: return 6
        if raw >= 14: return 5
        if raw >= 10: return 4
        if raw >= 7: return 3
        if raw >= 4: return 2
        return 1
    # Bins calibrados contra CSV 28-may (convenio-provincial, guia-legal, plantilla, hub)
    if raw >= 28: return 10
    if raw >= 25: return 9
    if raw >= 22: return 8
    if raw >= 19: return 7
    if raw >= 17: return 6
    if raw >= 14: return 5
    if raw >= 12: return 4
    if raw >= 10: return 3
    if raw >= 7: return 2
    return 1


RUBRICA = {
    "convenio-provincial": "BOE-remixed (13 bloques)",
    "guia-legal": "utilidad juridica",
    "plantilla-juridica": "utilidad plantilla",
    "hub-sectorial": "hub: profundidad sectorial",
    "home/calculadora": "home/calc (no aplica thin)",
    "herramienta": "herramienta (no aplica thin)",
    "institucional": "institucional (no aplica thin)",
}


def compute_recomendacion(tipo: str, score: int) -> str:
    if tipo in ("home/calculadora", "herramienta", "institucional"):
        return "no aplica rubrica thin"
    if tipo == "hub-sectorial":
        return "OK hub" if score >= 9 else "hub: anadir directorio completo + datos comparativos"
    if tipo == "convenio-provincial":
        if score >= 9: return "OK: BOE-remixed"
        if score >= 7: return "aceptable: revisar cumplimiento 13 bloques"
        if score >= 5: return "mejorar: anadir tablas validadas + cita oficial"
        return "PRIORITARIO: enriquecer a BOE-remixed (3-4h)"
    if tipo == "guia-legal":
        if score >= 7: return "OK guia"
        return "mejorar: anadir referencia normativa + ejemplos"
    if tipo == "plantilla-juridica":
        if score >= 5: return "OK plantilla"
        if score in (3, 4): return "mejorar: anadir ejemplo + pasos + descarga"
        return "revisar utilidad real"
    return ""


def compute_prio(tipo: str, score: int, impr: int) -> float:
    if tipo != "convenio-provincial":
        return 0.0
    if score <= 4 and impr > 0:
        return round(impr * (10 - score) / 50, 1)
    if score <= 2 and impr == 0:
        return round((10 - score) * 1.0, 1)  # señal aún sin GSC, prioridad baja constante
    return 0.0


# ===== Carga GSC =====

def load_gsc() -> dict:
    out = {}
    if not GSC_CSV.exists():
        return out
    with GSC_CSV.open("r", encoding="utf-8") as f:
        reader = csv.DictReader(f, delimiter=";")
        for row in reader:
            url = (row.get("url") or "").strip()
            if not url.startswith(DOMAIN):
                continue
            slug = url[len(DOMAIN):] or "index.html"
            out[slug] = {
                "clicks_3m": int(row.get("clicks_3m", "0") or 0),
                "impressions_3m": int(row.get("impressions_3m", "0") or 0),
                "ctr": float(row.get("ctr", "0") or 0),
                "avg_position": float(row.get("avg_position", "0") or 0),
            }
    return out


# ===== Main =====

def main() -> int:
    sitemap_text = SITEMAP.read_text(encoding="utf-8")
    urls = sorted({m.group(1) or "index.html"
                   for m in re.finditer(r"<loc>https://salariojusto\.es/([^<]*)</loc>", sitemap_text)})

    gsc = load_gsc()
    rows = []
    skipped = []

    for slug in urls:
        html_path = ROOT / slug
        if not html_path.exists():
            skipped.append(slug)
            continue
        html = html_path.read_text(encoding="utf-8", errors="replace")
        title = extract_title(html)
        sig = extract_signals(html)
        tipo = classify_tipo(slug)
        cat = classify_categoria(slug)
        raw = compute_raw(sig)
        score = compute_thin_score(raw, tipo)
        rubrica = RUBRICA[tipo]
        rec = compute_recomendacion(tipo, score)
        g = gsc.get(slug, {"clicks_3m": 0, "impressions_3m": 0, "ctr": 0.0, "avg_position": 0.0})
        prio = compute_prio(tipo, score, g["impressions_3m"])

        rows.append({
            "thin_score": score,
            "tipo_contenido": tipo,
            "categoria": cat,
            "slug": slug,
            "url": DOMAIN + ("" if slug == "index.html" else slug),
            "title": title,
            "rubrica": rubrica,
            "recomendacion": rec,
            "clicks_3m": g["clicks_3m"],
            "impressions_3m": g["impressions_3m"],
            "ctr": g["ctr"],
            "avg_position": g["avg_position"],
            "prio_enriquecimiento": prio,
            "wc": sig["wc"],
            "n_h2": sig["n_h2"],
            "n_tablas": sig["n_tablas"],
            "n_details": sig["n_details"],
            "n_boe": sig["n_boe"],
            "n_arts": sig["n_arts"],
            "faq_schema": sig["faq_schema"],
            "link_oficial": sig["link_oficial"],
            "ajuste_manual": "no",
            "raw": raw,
        })

    rows.sort(key=lambda r: (-r["thin_score"], -r["raw"]))

    headers = [
        "thin_score", "tipo_contenido", "categoria", "slug", "url", "title",
        "rubrica", "recomendacion", "clicks_3m", "impressions_3m", "ctr", "avg_position",
        "prio_enriquecimiento", "wc", "n_h2", "n_tablas", "n_details", "n_boe", "n_arts",
        "faq_schema", "link_oficial", "ajuste_manual", "raw",
    ]
    with OUT_CSV.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.writer(f, quoting=csv.QUOTE_ALL)
        writer.writerow(headers)
        for r in rows:
            writer.writerow([r[h] for h in headers])

    print(f"OK: {len(rows)} filas -> {OUT_CSV.name}")
    if skipped:
        print(f"WARN: {len(skipped)} URL(s) del sitemap sin HTML local: {skipped}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
