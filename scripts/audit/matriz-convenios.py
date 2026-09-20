#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
scripts/audit/matriz-convenios.py — MATRIZ sector × provincia de lo publicado.

Para qué: ver de un vistazo qué casillas del mapa sector×provincia están
ocupadas y cuáles no, para decidir el siguiente convenio sin leer 55 líneas de
censo. Las filas van ordenadas por demanda real (impresiones GSC de 28 días de
las consultas que nombran cada provincia), así que las de arriba son las que
más tráfico mueven.

Fuente de verdad del estado y del nº de fichas: data/convenios/censo.json.
NUNCA se grepea el HTML (el grep osciló 7→10→19 en su día).

Uso:
    .venv/bin/python scripts/audit/matriz-convenios.py              # matriz
    .venv/bin/python scripts/audit/matriz-convenios.py --intencion  # + índice por provincia
    .venv/bin/python scripts/audit/matriz-convenios.py --sin-gsc    # sin llamar a GSC

Sin GSC (o sin credenciales) la matriz sigue saliendo: las filas se ordenan
entonces por nº de fichas.

El índice de --intencion es CTR observado / CTR esperado a esa posición, con la
curva ajustada sobre las propias consultas del periodo. NO es "intención de clic"
pura: mezcla cuánto clica esa gente, la competencia del SERP local y lo buena
que sea nuestra ficha. Leer con esa cautela, y mirar el nº de consultas antes de
sacar conclusiones de una provincia con poco volumen.
"""
import argparse
import json
import math
import os
import unicodedata
from datetime import date, timedelta
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
CENSO = REPO / "data" / "convenios" / "censo.json"

# provincia canónica -> variantes que la gente teclea y que aparecen en 'ambito'
PROV = {
    "Madrid": ["madrid"], "Barcelona": ["barcelona"], "Valencia": ["valencia"],
    "Bizkaia": ["bizkaia", "vizcaya", "bilbao"], "Sevilla": ["sevilla"],
    "Zaragoza": ["zaragoza"], "Alicante": ["alicante"], "Málaga": ["malaga"],
    "Murcia": ["murcia"], "Gipuzkoa": ["gipuzkoa", "guipuzcoa", "san sebastian"],
    "Álava": ["alava", "araba", "vitoria"], "Navarra": ["navarra", "pamplona"],
    "Asturias": ["asturias", "oviedo", "gijon"], "Cantabria": ["cantabria", "santander"],
    "A Coruña": ["coruna"], "Pontevedra": ["pontevedra", "vigo"],
    "Granada": ["granada"], "Cádiz": ["cadiz"], "Córdoba": ["cordoba"],
    "Almería": ["almeria"], "Jaén": ["jaen"], "Huelva": ["huelva"],
    "Toledo": ["toledo"], "Valladolid": ["valladolid"], "Burgos": ["burgos"],
    "Salamanca": ["salamanca"], "León": ["leon"], "Tarragona": ["tarragona"],
    "Girona": ["girona", "gerona"], "Lleida": ["lleida", "lerida"],
    "Baleares": ["baleares", "balears", "mallorca", "ibiza"],
    "Las Palmas": ["las palmas", "laspalmas", "gran canaria"],
    "Tenerife": ["tenerife"], "Badajoz": ["badajoz"], "Cáceres": ["caceres"],
    "Albacete": ["albacete"], "Castellón": ["castellon"], "Huesca": ["huesca"],
    "Teruel": ["teruel"], "Lugo": ["lugo"], "Ourense": ["ourense", "orense"],
    "La Rioja": ["rioja", "logrono"], "Segovia": ["segovia"], "Ávila": ["avila"],
    "Zamora": ["zamora"], "Palencia": ["palencia"], "Soria": ["soria"],
    "Guadalajara": ["guadalajara"], "Cuenca": ["cuenca"], "Ciudad Real": ["ciudad real"],
    "Maresme": ["maresme"], "Catalunya": ["catalunya", "cataluna"],
}


def norm(s):
    return "".join(c for c in unicodedata.normalize("NFD", s.lower())
                   if unicodedata.category(c) != "Mn")


def provincia_de(ambito):
    a = norm(ambito)
    for canon, variantes in PROV.items():
        if any(v in a for v in variantes):
            return canon
    return None


def carga_censo():
    d = json.loads(CENSO.read_text(encoding="utf-8"))
    return d, d["fichas"]


def demanda_gsc():
    """{provincia: (impresiones, clics, posición media, nº consultas)} de 28 días.
    Devuelve {} si no hay credenciales o falla la llamada."""
    try:
        from google.oauth2 import service_account
        from googleapiclient.discovery import build
    except ImportError:
        return {}, None
    creds = Path(os.environ.get("GSC_CREDENTIALS_FILE",
                                Path.home() / ".config" / "ga4-salariojusto.json"))
    if not creds.exists():
        return {}, None
    site = os.environ.get("GSC_SITE_URL", "sc-domain:salariojusto.es")
    fin = date.today() - timedelta(days=3)
    ini = fin - timedelta(days=27)
    try:
        svc = build("searchconsole", "v1", cache_discovery=False,
                    credentials=service_account.Credentials.from_service_account_file(
                        str(creds), scopes=["https://www.googleapis.com/auth/webmasters.readonly"]))
        rows = svc.searchanalytics().query(siteUrl=site, body={
            "startDate": ini.isoformat(), "endDate": fin.isoformat(),
            "dimensions": ["query"], "rowLimit": 25000}).execute().get("rows", [])
    except Exception as e:                                   # red, permisos, cuota
        print(f"  (GSC no disponible: {type(e).__name__}; filas ordenadas por nº de fichas)\n")
        return {}, None

    agg = {}
    for r in rows:
        k = norm(r["keys"][0])
        for canon, variantes in PROV.items():
            if any(v in k for v in variantes):
                x = agg.setdefault(canon, {"im": 0, "cl": 0, "pw": 0.0, "nq": 0})
                x["im"] += r["impressions"]; x["cl"] += r["clicks"]
                x["pw"] += r["position"] * r["impressions"]; x["nq"] += 1
                break
    # curva de CTR esperado por posición, sobre las propias consultas del periodo
    pares = [(r["position"], 100 * r["clicks"] / r["impressions"]) for r in rows
             if r["impressions"] >= 30 and r["clicks"] > 0 and r["position"] <= 40]
    curva = None
    if len(pares) >= 30:
        xs = [math.log(p) for p, _ in pares]; ys = [math.log(c) for _, c in pares]
        n = len(xs); mx = sum(xs) / n; my = sum(ys) / n
        b = sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / sum((x - mx) ** 2 for x in xs)
        curva = (my - b * mx, b, n, ini, fin)
    return agg, curva


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--intencion", action="store_true",
                    help="añade la tabla de índice de clic por provincia")
    ap.add_argument("--sin-gsc", action="store_true", help="no llamar a GSC")
    args = ap.parse_args()

    censo, fichas = carga_censo()
    agg, curva = ({}, None) if args.sin_gsc else demanda_gsc()

    # sectores como columnas: los provinciales, por nº de fichas desc
    prov_fichas, marcos, sin_mapear = {}, [], []
    for f in fichas:
        if f["tipo"] in ("marco", "estatal") or norm(f["ambito"]) == "estatal":
            marcos.append(f)
            continue
        p = provincia_de(f["ambito"])
        if p is None:
            sin_mapear.append(f)
            continue
        prov_fichas.setdefault(p, {})[f["sector"]] = f

    sectores = sorted({f["sector"] for fs in prov_fichas.values() for f in fs.values()},
                      key=lambda s: -sum(1 for fs in prov_fichas.values() if s in fs))

    def clave_orden(p):
        if agg.get(p):
            return (-agg[p]["im"], p)
        return (-len(prov_fichas[p]) * 1000, p)

    filas = sorted(prov_fichas, key=clave_orden)

    print(f"MATRIZ SECTOR × PROVINCIA · censo {censo['actualizado']} · "
          f"canon {censo['canon']['provinciales']} provinciales + {censo['canon']['marcos']} marcos "
          f"= {censo['canon']['total']}")
    if agg:
        print("Filas ordenadas por impresiones GSC de 28 días de las consultas que nombran la provincia.")
    print()
    anchos = [max(9, len(s[:11])) for s in sectores]
    cab = f"{'provincia':<14}" + "".join(f"{s[:11]:>{w+2}}" for s, w in zip(sectores, anchos))
    print(cab + f"{'total':>8}")
    print("-" * len(cab + f"{'total':>8}"))
    for p in filas:
        tiene = prov_fichas[p]
        linea = f"{p:<14}" + "".join(
            f"{('SI' if s in tiene else '·'):>{w+2}}" for s, w in zip(sectores, anchos))
        print(linea + f"{len(tiene):>8}")
    print("-" * len(cab + f"{'total':>8}"))
    tot = f"{'total':<14}" + "".join(
        f"{sum(1 for fs in prov_fichas.values() if s in fs):>{w+2}}" for s, w in zip(sectores, anchos))
    print(tot + f"{sum(len(v) for v in prov_fichas.values()):>8}")

    print(f"\nMarcos y sectoriales estatales ({len(marcos)}): "
          + " · ".join(f"{f['sector']}{'' if f['indexable'] else ' [noindex]'}" for f in marcos))
    noindex = [f["archivo"] for f in fichas if not f["indexable"]]
    if noindex:
        print(f"Noindex deliberado ({len(noindex)}): " + " · ".join(noindex))
    sin_ratificar = sum(1 for f in fichas if not f.get("revisado"))
    print(f"Estado sin ratificar en el censo (revisado:false): {sin_ratificar} de {len(fichas)}")
    if sin_mapear:
        print("Ámbitos que no casan con ninguna provincia conocida: "
              + " · ".join(f"{f['archivo']} ({f['ambito']})" for f in sin_mapear))

    if args.intencion and agg and curva:
        a, b, n, ini, fin = curva
        print(f"\nÍNDICE DE CLIC POR PROVINCIA · {ini} → {fin}")
        print(f"CTR_esp = {math.exp(a):.2f}·pos^{b:.2f} (ajustada con {n} consultas de ≥30 impr)")
        print("Mezcla intención local + competencia del SERP + calidad de la ficha. "
              "Mirar el nº de consultas antes de concluir.\n")
        print(f"{'provincia':<14}{'clics':>7}{'impr':>8}{'CTR':>8}{'pos':>7}{'esperado':>10}{'índice':>8}{'cons':>6}{'fichas':>7}")
        tabla = []
        for p, v in agg.items():
            if v["im"] < 150:
                continue
            pos = v["pw"] / v["im"]; ctr = 100 * v["cl"] / v["im"]
            esp = math.exp(a + b * math.log(pos))
            tabla.append((ctr / esp, p, v, pos, ctr, esp))
        for idx, p, v, pos, ctr, esp in sorted(tabla, key=lambda x: -x[0]):
            print(f"{p:<14}{v['cl']:>7}{v['im']:>8}{ctr:>7.2f}%{pos:>7.2f}{esp:>9.2f}%"
                  f"{idx:>8.2f}{v['nq']:>6}{len(prov_fichas.get(p, {})):>7}")


if __name__ == "__main__":
    main()
