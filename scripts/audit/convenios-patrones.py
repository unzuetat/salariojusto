#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
scripts/audit/convenios-patrones.py — patrones transversales del corpus.

Los agentes de juicio encontraron defectos que resultaron ser SISTÉMICOS: no de una ficha,
sino de la plantilla o del proceso de publicación. Este script los convierte en medidas
deterministas sobre las 55 fichas, para saber cuántas afecta cada uno y decidir si el
arreglo es de ficha o de plantilla.

Regla: un defecto que afecta a más de la mitad del corpus NO se arregla ficha a ficha.

Lee los JSON de la capa 0 (no vuelve a parsear el HTML salvo para los patrones textuales).
Uso:  python3 scripts/audit/convenios-patrones.py [--fecha 2026-08-20]
"""

import argparse
import json
import re
from collections import Counter
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BASE = ROOT / "analisis" / "auditoria-convenios"

# Patrones textuales cuyo clonado detectaron los agentes (E2 sobre el piloto)
BLOQUES = {
    "bloque «¿Cobras menos…?»": r"Cobras menos de lo que fija",
    "marca bp-rotado": r"bp-rotado",
    "«procedimiento de descuelgue (Art. 34)»": r"procedimiento de descuelgue \(Art\. 34\)",
    "firma «no somos un bufete»": r"no somos un bufete",
    "«verificamos cifra a cifra»": r"verificamos cifra a cifra",
}


def pct(n, total):
    return "%d de %d (%.0f%%)" % (n, total, 100.0 * n / total) if total else "—"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--fecha", default=datetime.now().strftime("%Y-%m-%d"))
    a = ap.parse_args()
    d = BASE / a.fecha / "deterministas"
    if not d.exists():
        print("No hay capa 0 en %s" % d)
        return 1
    fichas = [json.loads(p.read_text(encoding="utf-8")) for p in sorted(d.glob("*.json"))]
    N = len(fichas)

    def cuantos(pred):
        return [f["slug"] for f in fichas if pred(f)]

    patrones = []

    def add(nombre, slugs, veredicto, detalle=""):
        patrones.append({"nombre": nombre, "n": len(slugs), "slugs": slugs,
                         "veredicto": veredicto, "detalle": detalle})

    # ── plantilla ──────────────────────────────────────────────────────
    add("Tablas sin `scope` ni `caption` (no audibles)",
        cuantos(lambda f: f["tablas"]["sin_scope"] or f["tablas"]["sin_caption"]),
        "plantilla", "un lector de pantalla recorre la escala salarial sin saber a qué columna pertenece cada cifra")
    add("Salarios en verde en tablas",
        cuantos(lambda f: f["tablas"]["verde_en_tablas"]),
        "plantilla", "el color entra por CSS (.num/.sal), no inline: se arregla en el canon, no ficha a ficha")
    add("Bloques de más de 100 palabras",
        cuantos(lambda f: f["parrafos"]["largos_100"]),
        "plantilla")
    add("Sin bloque de responsable identificable («Quién audita esto»)",
        cuantos(lambda f: not f["norma"]["quien_audita"]),
        "plantilla", "E-E-A-T: hard-fail 2.2")
    add("Sin fecha de actualización visible",
        cuantos(lambda f: not f["norma"]["fecha_actualizacion_visible"]),
        "plantilla")

    # ── trazabilidad ───────────────────────────────────────────────────
    add("Fuentes citadas pero NO clicables (0 enlaces oficiales)",
        cuantos(lambda f: not f["enlaces"]["externos_oficiales"]),
        "arreglo barato", "citan boletín, fecha y artículo, pero el lector no puede pinchar en nada")
    add("Más de un tercio de sus cifras en secciones sin fuente",
        cuantos(lambda f: f["cifras"]["pct_huerfanas"] > 0.35),
        "ficha a ficha")
    add("Cifras que solo existen en el JSON-LD, no en el texto visible",
        cuantos(lambda f: f["schema_vs_cuerpo"]["n"]),
        "ficha a ficha", "la cifra obsoleta vive en la capa que leen los motores")
    add("Citan un SMI obsoleto como si fuera el de 2026",
        cuantos(lambda f: f["smi"].get("smi_como_2026_erroneo")),
        "urgente", "el SMI 2026 es 17.094 €")
    add("No mencionan el SMI en ninguna parte",
        cuantos(lambda f: not f["smi"]["menciona_smi"]),
        "revisar", "si alguna categoría queda por debajo, el lector no se entera")

    # ── enlazado y proceso ─────────────────────────────────────────────
    add("Islas: 3 o menos páginas las enlazan",
        cuantos(lambda f: len(f["enlaces"]["entrantes_desde"]) <= 3),
        "proceso", "normalmente solo hub + home + mapa: ninguna hermana las enlaza")
    add("Sin ningún enlace al kit de plantillas",
        cuantos(lambda f: not f["enlaces"]["al_kit"]),
        "ficha a ficha")
    add("Sin enlaces internos en el cuerpo (solo nav y pie)",
        cuantos(lambda f: f["enlaces"]["internos_en_cuerpo"] == 0),
        "ficha a ficha")
    add("Con anchors genéricos («aquí», «más info»)",
        cuantos(lambda f: f["enlaces"]["anchors_genericos"]),
        "ficha a ficha")

    # ── vecindad sector×provincia (calculado aquí) ─────────────────────
    def normaliza_ambito(a):
        a = (a or "").strip().lower()
        a = re.sub(r"^(comunidad( foral)? de|provincia de|illes|islas)\s+", "", a)
        return {"balears": "baleares", "araba": "alava", "álava": "alava",
                "vizcaya": "bizkaia", "guipúzcoa": "gipuzkoa"}.get(a, a)

    porprov = {}
    for f in fichas:
        amb = normaliza_ambito(f.get("ambito"))
        if amb and amb != "estatal":
            porprov.setdefault(amb, []).append(f)
    sin_vecina, pares = [], 0
    for amb, grupo in porprov.items():
        if len(grupo) < 2:
            continue
        for f in grupo:
            html = (ROOT / f["archivo"]).read_text(encoding="utf-8", errors="replace")
            falta = [g["archivo"] for g in grupo
                     if g is not f and ('href="/%s' % g["archivo"]) not in html]
            if falta:
                pares += len(falta)
                sin_vecina.append(f["slug"])
    add("Con ficha hermana en su MISMA provincia y sin enlazarla",
        sorted(sin_vecina), "proceso",
        "quien busca «convenio <provincia>» y cae en el sector equivocado no tiene salida; "
        "son %d enlaces que faltan entre fichas que ya existen" % pares)

    # ── calidad del registro (censo.json) ──────────────────────────────
    # Hipótesis del eje E1 sobre metal-valencia: "el censo llega sin boletín y con
    # vigenciaFin null, laguna que se corresponde con sus notas bajas". La correlación
    # con el score aún no es concluyente (pocas fichas juzgadas), pero la carencia del
    # registro sí es medible y el censo es la fuente de verdad del proyecto.
    censo_all = json.loads((ROOT / "data" / "convenios" / "censo.json").read_text(encoding="utf-8"))["fichas"]
    BOL = re.compile(r"(?i)\b(BOE|BOCM|BOP[A-Z]?|BOB|BOG|BOTHA|BOIB|BORM|BOA|BOC|BOJA|BOPV|DOG|CVE|núm|nº)\b")
    pobres = []
    for c in censo_all:
        p_ = sum([bool(BOL.search(c.get("fuenteEstado") or "")), bool(c.get("vigenciaFin")),
                  bool((c.get("nota") or "").strip()), bool(c.get("revisado"))])
        if p_ <= 1:
            pobres.append(c["archivo"][:-5])
    add("Registro pobre en censo.json (1 o 0 de 4 campos útiles)",
        sorted(pobres), "registro",
        "sin boletín citado, sin fecha de fin de vigencia, sin particularidad anotada y sin ratificar: "
        "el estado de esa ficha no se puede comprobar sin abrir el HTML, que es justo lo que el censo evita")

    # ── bloques clonados ───────────────────────────────────────────────
    clonados = []
    for nombre, rx in BLOQUES.items():
        r = re.compile(rx)
        hit = [f["slug"] for f in fichas if r.search((ROOT / f["archivo"]).read_text(encoding="utf-8", errors="replace"))]
        clonados.append((nombre, hit))

    # ── informe ────────────────────────────────────────────────────────
    L = ["# Patrones transversales del corpus · %s" % a.fecha, "",
         "Los agentes de juicio encontraron defectos que resultaron ser **sistémicos**. Aquí están",
         "medidos sobre las **%d fichas** del censo." % N, "",
         "**Regla de lectura:** un defecto que afecta a más de la mitad del corpus no se arregla ficha",
         "a ficha. Se arregla en la plantilla, o en el proceso que las produce.", "",
         "## Defectos por alcance", "",
         "| patrón | alcance | dónde se arregla |", "|---|---|---|"]
    for p in sorted(patrones, key=lambda x: -x["n"]):
        if not p["n"]:
            continue
        L.append("| %s | **%s** | %s |" % (p["nombre"], pct(p["n"], N), p["veredicto"]))
    L.append("")
    L += ["## Detalle", ""]
    for p in sorted(patrones, key=lambda x: -x["n"]):
        if not p["n"]:
            continue
        L.append("### %s — %s" % (p["nombre"], pct(p["n"], N)))
        if p["detalle"]:
            L.append("")
            L.append(p["detalle"].capitalize() + ".")
        L.append("")
        muestra = p["slugs"] if p["n"] <= 12 else p["slugs"][:12]
        L.append("`" + "` · `".join(s.replace("convenio-", "") for s in muestra) + "`"
                 + (" … y %d más" % (p["n"] - 12) if p["n"] > 12 else ""))
        L.append("")
    L += ["## Bloques de texto clonados", "",
          "Repeticiones literales entre fichas. No todo lo repetido es un defecto —el aviso legal o la",
          "metodología pueden repetirse— pero la doctrina jurídica no: el «Art. 34» de una provincia no",
          "es el «Art. 34» de otra.", "",
          "| bloque | fichas |", "|---|---|"]
    for nombre, hit in sorted(clonados, key=lambda x: -len(x[1])):
        L.append("| %s | **%s** |" % (nombre, pct(len(hit), N)))
    L.append("")
    (BASE / a.fecha / "PATRONES-CORPUS.md").write_text("\n".join(L), encoding="utf-8")
    print("→ %s" % (BASE / a.fecha / "PATRONES-CORPUS.md"))
    for p in sorted(patrones, key=lambda x: -x["n"])[:8]:
        if p["n"]:
            print("   %-58s %s" % (p["nombre"][:58], pct(p["n"], N)))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
