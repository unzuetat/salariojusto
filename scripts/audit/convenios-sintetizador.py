#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
scripts/audit/convenios-sintetizador.py — CAPA 3 de la auditoría de convenios.

Compone el veredicto por ficha a partir de:
  · deterministas/<slug>.json   (capa 0)
  · juicio/<EJE>/<slug>.json    (capa 1, seis agentes de eje)
  · verificacion/<slug>.json    (capa 2, verificador adversarial)

La aritmética la hace ESTE script, nunca un agente: los agentes puntúan con
evidencia, el score se calcula. Un hallazgo REFUTADO por la capa 2 se descarta;
uno MATIZADO conserva la nota pero se reetiqueta.

Uso:  python3 scripts/audit/convenios-sintetizador.py [--fecha 2026-08-20]
"""

import argparse
import csv
import json
import re
from collections import Counter, defaultdict
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BASE = ROOT / "analisis" / "auditoria-convenios"

PESOS = {"E1": 22, "E2": 22, "E3": 20, "E4": 14, "E5": 12, "E6": 10}

# Un mismo defecto raíz aflora en varias superficies (cuerpo, meta, JSON-LD, FAQ) y varios
# ejes lo reportan con códigos distintos. Contarlo N veces penaliza N veces el mismo error.
# Lo detectó el verificador sobre limpieza-zaragoza: 4 hard-fails eran un solo defecto de SMI.
FAMILIAS = {
    "SMI mal calculado o mal citado": (
        {"12.2", "12.1", "5.5", "5.7"},
        re.compile(r"(?i)\bSMI\b|salario m[íi]nimo|16\.?576|17\.?094"),
    ),
}
NOMBRES = {
    "E1": "Verdad demostrada", "E2": "Singularidad y ventaja", "E3": "Respuesta al trabajador",
    "E4": "Captación y citabilidad", "E5": "Enlazado y clúster", "E6": "Forma y lectura",
}


def ejes_aplicables(det):
    """Un explainer sectorial sin provincia ni hermanas no se juzga con la lente del clúster,
    ni se le exige competir en un buscador donde por decisión registrada no compite.
    El peso del eje excluido se redistribuye solo (el score normaliza sobre el peso vivo)."""
    fuera = {}
    censo = det.get("censo", {})
    if censo.get("tipo") == "marco":
        fuera["E5"] = "ficha tipo «marco»: sin provincia ni fichas hermanas que enlazar"
    if censo.get("indexable") is False:
        fuera.setdefault("E4", "noindex deliberado: no compite en el buscador")
    return fuera


def cargar(fecha):
    d = BASE / fecha
    det = {p.stem: json.loads(p.read_text(encoding="utf-8")) for p in (d / "deterministas").glob("*.json")}
    juicio = defaultdict(dict)
    jdir = d / "juicio"
    if jdir.exists():
        for eje_dir in sorted(jdir.iterdir()):
            if not eje_dir.is_dir():
                continue
            for p in eje_dir.glob("*.json"):
                try:
                    juicio[p.stem][eje_dir.name.upper()] = json.loads(p.read_text(encoding="utf-8"))
                except json.JSONDecodeError as e:
                    print("  aviso: %s ilegible (%s) — se ignora" % (p, e))
    ver = {}
    vdir = d / "verificacion"
    if vdir.exists():
        for p in vdir.glob("*.json"):
            try:
                ver[p.stem] = json.loads(p.read_text(encoding="utf-8"))
            except json.JSONDecodeError:
                pass
    return det, juicio, ver


def aplicar_verificacion(metricas, eje, veredictos):
    """Descarta lo refutado y reetiqueta lo matizado. Devuelve (vivas, descartadas)."""
    idx = {(v.get("eje"), v.get("id")): v for v in veredictos}
    vivas, fuera = [], []
    for m in metricas:
        v = idx.get((eje, m.get("id")))
        if v and v.get("veredicto") == "REFUTADO":
            m["_refutado"] = v
            fuera.append(m)
            continue
        if v and v.get("veredicto") == "MATIZADO":
            m["_matizado"] = v
        vivas.append(m)
    return vivas, fuera


def score(det, juicio, ver):
    veredictos = (ver or {}).get("veredictos", [])
    no_aplican = ejes_aplicables(det)
    ejes, faltan, no_eval = {}, [], []
    for eje in PESOS:
        if eje in no_aplican:
            continue
        j = juicio.get(eje)
        if not j:
            faltan.append(eje)
            continue
        vivas, fuera = aplicar_verificacion(j.get("metricas", []), eje, veredictos)
        notas = [m["nota"] for m in vivas if isinstance(m.get("nota"), int)]
        no_eval += [{"eje": eje, **x} for x in j.get("no_evaluadas", [])]
        ejes[eje] = {
            "n_metricas": len(notas),
            "bruto": round(sum(notas) / (3 * len(notas)), 3) if notas else None,
            "puntos": round(sum(notas) / (3 * len(notas)) * PESOS[eje], 1) if notas else None,
            "peso": PESOS[eje],
            "metricas": vivas,
            "descartadas_por_verificador": fuera,
            "no_evaluadas": j.get("no_evaluadas", []),
            "observacion": j.get("observacion_libre", ""),
        }
    con_datos = {k: v for k, v in ejes.items() if v["puntos"] is not None}
    peso_vivo = sum(v["peso"] for v in con_datos.values())
    total = round(sum(v["puntos"] for v in con_datos.values()) / peso_vivo * 100, 1) if peso_vivo else None
    debil = None
    if con_datos:
        debil = min(con_datos.items(), key=lambda kv: kv[1]["puntos"] / kv[1]["peso"])
    return {
        "por_eje": ejes, "ejes_ausentes": faltan,
        "ejes_no_aplican": no_aplican,
        "eje_mas_debil": {"eje": debil[0], "pct": round(debil[1]["puntos"] / debil[1]["peso"] * 100, 1)} if debil else None,
        "peso_cubierto": peso_vivo,
        "score": total,
        "score_parcial": peso_vivo < 100,
        "no_evaluadas": no_eval,
    }


def hardfails(det, juicio, ver):
    veredictos = {(v.get("eje"), v.get("id")): v for v in (ver or {}).get("veredictos", [])}
    hf = [{"origen": "determinista", **h} for h in det.get("hardfails_deterministas", [])]
    for eje, j in juicio.items():
        for h in j.get("hardfails", []):
            v = veredictos.get((eje, h.get("codigo")))
            if v and v.get("veredicto") == "REFUTADO":
                continue
            hf.append({"origen": eje, **h})
    return agrupar_por_raiz(hf)


def agrupar_por_raiz(hf):
    """Colapsa en una sola entrada los hard-fails que son superficies del mismo defecto."""
    fuera, agrupados = [], {}
    for h in hf:
        cod, det = h.get("codigo", ""), h.get("detalle", "")
        for nombre, (codigos, patron) in FAMILIAS.items():
            if cod in codigos and patron.search(det or ""):
                g = agrupados.setdefault(nombre, {"codigo": cod, "familia": nombre,
                                                  "superficies": [], "origen": h["origen"]})
                g["superficies"].append({"codigo": cod, "origen": h["origen"], "detalle": det})
                break
        else:
            fuera.append(h)
    for nombre, g in agrupados.items():
        g["detalle"] = "%s — un solo defecto raíz con %d superficie(s): %s" % (
            nombre, len(g["superficies"]),
            "; ".join("%s (%s)" % (s_["codigo"], s_["origen"]) for s_ in g["superficies"]))
        fuera.append(g)
    return fuera


def informe(slug, det, sc, hf, juicio):
    L = []
    A = L.append
    o = det["operacion"]
    A("# %s" % slug)
    A("")
    if not juicio:
        pass
    A("**Score: %s/100**%s · hard-fails: **%d**" % (
        sc["score"] if sc["score"] is not None else "—",
        " (parcial: solo %d de 100 puntos de peso evaluados)" % sc["peso_cubierto"] if sc["score_parcial"] else "",
        len(hf)))
    A("")
    if juicio and not sc.get("_verificado"):
        A("> ⚠️ **Sin verificación adversarial.** Estas notas no han pasado por la capa 2. En el piloto")
        A("> el verificador refutó o matizó cerca de un tercio de los hallazgos, así que este score no")
        A("> es comparable con el de una ficha verificada. Trátalo como provisional.")
        A("")
    A("Sector %s · estado `%s` · %s palabras de prosa · boilerplate %s · último cambio hace %s días%s" % (
        det.get("sector"), det["censo"]["estado"], det["texto"]["palabras_prosa"],
        det["corpus"]["boilerplate_ratio"], o["dias_desde_commit"],
        " · **ventana de medición abierta**" if o["ventana_medicion_abierta"] else ""))
    g = o["gsc_28d"]
    if g:
        A("GSC 28d: %s clics · %s impresiones · CTR %s · posición %s" % (
            g.get("clics"), g.get("impresiones"), g.get("ctr"), g.get("posicion")))
    A("")
    if hf:
        A("## Hard-fails — no se compensan con la nota")
        A("")
        for h in hf:
            A("- **%s** (%s) · %s" % (h.get("codigo"), h["origen"], h.get("detalle", "")))
        A("")
    A("## Ejes")
    A("")
    if sc.get("ejes_no_aplican"):
        for e, motivo in sc["ejes_no_aplican"].items():
            A("*%s no aplica a esta ficha — %s. Su peso se reparte entre los demás.*" % (e, motivo))
        A("")
    if sc.get("eje_mas_debil"):
        A("**Cuello de botella: %s (%s%% de su peso).** Es por donde empieza el arreglo." % (
            sc["eje_mas_debil"]["eje"], sc["eje_mas_debil"]["pct"]))
        A("")
    A("| eje | | puntos | peso |")
    A("|---|---|---|---|")
    for e in PESOS:
        v = sc["por_eje"].get(e)
        if not v:
            A("| %s | %s | — | %d |" % (e, NOMBRES[e], PESOS[e]))
        else:
            A("| %s | %s | %s | %d |" % (e, NOMBRES[e],
              v["puntos"] if v["puntos"] is not None else "—", v["peso"]))
    A("")
    for e in PESOS:
        v = sc["por_eje"].get(e)
        if not v:
            continue
        A("### %s · %s" % (e, NOMBRES[e]))
        A("")
        for m in sorted(v["metricas"], key=lambda x: (x.get("nota") if isinstance(x.get("nota"), int) else 9)):
            marca = "🔵" if m.get("nota") == 3 else ("🟢" if m.get("nota") == 2 else ("🟠" if m.get("nota") == 1 else "🔴"))
            extra = " · *matizado por el verificador*" if m.get("_matizado") else ""
            A("**%s %s — %s/3**%s" % (marca, m.get("id"), m.get("nota"), extra))
            A("")
            A("%s" % m.get("razon", ""))
            A("")
            for ev in (m.get("evidencia") or [])[:3]:
                A("> `%s:%s` — %s" % (ev.get("archivo", slug + ".html"), ev.get("linea"), (ev.get("cita") or "")[:300]))
            if m.get("parche"):
                A("")
                A("**Parche propuesto%s:** %s" % (
                    " (APLAZADO: ventana de medición abierta)" if m.get("aplazado_por_ventana") else "",
                    m["parche"]))
            A("")
        if v["no_evaluadas"]:
            A("*No evaluadas:* " + " · ".join("`%s` %s" % (x.get("id"), x.get("motivo", "")) for x in v["no_evaluadas"]))
            A("")
        if v["descartadas_por_verificador"]:
            A("*Descartadas por el verificador:* " + " · ".join(
                "`%s` (%s)" % (m.get("id"), (m.get("_refutado") or {}).get("motivo", "")) for m in v["descartadas_por_verificador"]))
            A("")
        if v["observacion"]:
            A("> %s" % v["observacion"])
            A("")
    return "\n".join(L)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--fecha", default=datetime.now().strftime("%Y-%m-%d"))
    args = ap.parse_args()
    d = BASE / args.fecha
    if not (d / "deterministas").exists():
        print("No hay capa 0 en %s — corre antes convenios-recolector.py" % d)
        return 1

    det, juicio, ver = cargar(args.fecha)
    (d / "fichas").mkdir(exist_ok=True)

    filas, resumen_hf, sin_juicio = [], Counter(), []
    for slug, dd in sorted(det.items()):
        j = juicio.get(slug, {})
        if not j:
            sin_juicio.append(slug)
        sc = score(dd, j, ver.get(slug))
        sc["_verificado"] = slug in ver
        hf = hardfails(dd, j, ver.get(slug))
        for h in hf:
            resumen_hf[h.get("codigo")] += 1
        (d / "fichas" / (slug + ".md")).write_text(informe(slug, dd, sc, hf, j), encoding="utf-8")
        filas.append({
            "slug": slug, "score": sc["score"], "parcial": sc["score_parcial"],
            "peso_cubierto": sc["peso_cubierto"], "hardfails": len(hf),
            **{e: (sc["por_eje"].get(e) or {}).get("puntos") for e in PESOS},
            "cuello": (sc["eje_mas_debil"] or {}).get("eje"),
            "cuello_pct": (sc["eje_mas_debil"] or {}).get("pct"),
            "clics": dd["operacion"]["gsc_28d"].get("clics", ""),
            "ventana_abierta": dd["operacion"]["ventana_medicion_abierta"],
        })

    with (d / "matriz.csv").open("w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=list(filas[0].keys()))
        w.writeheader()
        w.writerows(filas)

    con_score = [f for f in filas if f["score"] is not None]
    L = ["# Auditoría de convenios · %s" % args.fecha, "",
         "Fichas con capa 0: **%d** · con juicio de agentes: **%d**" % (len(filas), len(filas) - len(sin_juicio)), ""]
    if con_score:
        completos = [f for f in con_score if not f["parcial"]]
        parciales = [f for f in con_score if f["parcial"]]
        orden = sorted(completos, key=lambda x: (-x["hardfails"], x["cuello_pct"] if x["cuello_pct"] is not None else 999))
        L += ["## Orden de ataque",
              "",
              "Ordenado por hard-fails y luego por **eje más débil**, no por el score.",
              "El piloto demostró que el promedio de seis ejes se compensa a sí mismo y esconde",
              "el problema real: una ficha vale lo que vale su peor lente (ver `CALIBRACION.md`).",
              "",
              "| ficha | hard-fails | eje más débil | score | clics 28d |", "|---|---|---|---|---|"]
        L += ["| [%s](fichas/%s.md) | %d | %s %s%% | %s%s | %s |" % (
            f["slug"], f["slug"], f["hardfails"], f["cuello"] or "—",
            f["cuello_pct"] if f["cuello_pct"] is not None else "—",
            f["score"], " ⚠️parcial" if f["parcial"] else "", f["clics"] or "—")
            for f in orden]
        L.append("")
        if parciales:
            L += ["### Parciales — no comparables", "",
                  "Les falta el juicio de algún eje, así que su score se normaliza sobre menos peso",
                  "y sale inflado. No los ordenes junto a los completos.", "",
                  "| ficha | peso evaluado | hard-fails | clics |", "|---|---|---|---|"]
            L += ["| [%s](fichas/%s.md) | %s de 100 | %d | %s |" % (
                f["slug"], f["slug"], f["peso_cubierto"], f["hardfails"], f["clics"] or "—")
                for f in sorted(parciales, key=lambda x: x["slug"])]
            L.append("")
        media = round(sum(f["score"] for f in completos) / len(completos), 1) if completos else 0
        ss = sorted(f["score"] for f in completos) or [0]
        L += ["Media **%s** · scores de %s a %s (amplitud %.1f)." % (media, ss[0], ss[-1], ss[-1] - ss[0]), "",
              "Si la amplitud es estrecha, el compuesto no discrimina: usa el perfil por ejes y el cuello de botella.", ""]
    if resumen_hf:
        L += ["## Hard-fails del corpus", "", "| código | fichas |", "|---|---|"]
        L += ["| %s | %d |" % (c, n) for c, n in resumen_hf.most_common()]
        L.append("")
    if sin_juicio:
        L += ["## Solo capa 0 (sin juicio de agentes)", "", ", ".join(sin_juicio), ""]
    (d / "RESUMEN.md").write_text("\n".join(L), encoding="utf-8")

    print("Fichas: %d · con juicio: %d · hard-fails: %d" % (len(filas), len(filas) - len(sin_juicio), sum(resumen_hf.values())))
    print("→ %s" % (d / "RESUMEN.md"))
    print("→ %s" % (d / "fichas"))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
