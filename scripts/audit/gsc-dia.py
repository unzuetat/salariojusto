#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
scripts/audit/gsc-dia.py — posición DIARIA, con y sin fragmentos #ancla.

Para qué: la ventana de 28 días esconde lo que pasa un día concreto, y los
2-3 últimos días de GSC llegan incompletos (se rellenan primero con cola larga
mal posicionada, y luego se corrigen al alza). Este script deja ver las dos cosas:
la serie diaria y cuánto pesan las consultas nuevas cada día.

Regla de lectura: si los dos últimos días caen mucho y las "consultas nuevas"
de esos días entran en posición muy peor que los días anteriores, espera 2-3
días antes de dar la caída por buena.

Uso:
    .venv/bin/python scripts/audit/gsc-dia.py              # últimos 21 días
    .venv/bin/python scripts/audit/gsc-dia.py --dias 30
"""
import argparse, os
from datetime import date, timedelta
from pathlib import Path
from google.oauth2 import service_account
from googleapiclient.discovery import build

CREDS = Path(os.environ.get("GSC_CREDENTIALS_FILE", Path.home() / ".config" / "ga4-salariojusto.json"))
SITE = os.environ.get("GSC_SITE_URL", "sc-domain:salariojusto.es")
DOW = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"]

svc = build("searchconsole", "v1", cache_discovery=False,
            credentials=service_account.Credentials.from_service_account_file(
                str(CREDS), scopes=["https://www.googleapis.com/auth/webmasters.readonly"]))


def serie(desde, hasta, sin_anclas):
    body = {"startDate": desde, "endDate": hasta, "dimensions": ["date"], "rowLimit": 200}
    if sin_anclas:
        body["dimensionFilterGroups"] = [{"filters": [
            {"dimension": "page", "operator": "notContains", "expression": "#"}]}]
    return {r["keys"][0]: r for r in svc.searchanalytics().query(
        siteUrl=SITE, body=body).execute().get("rows", [])}


def consultas(dia):
    return {r["keys"][0]: r for r in svc.searchanalytics().query(siteUrl=SITE, body={
        "startDate": dia, "endDate": dia, "dimensions": ["query"],
        "rowLimit": 25000}).execute().get("rows", [])}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dias", type=int, default=21)
    a = ap.parse_args()
    hasta = date.today().isoformat()
    desde = (date.today() - timedelta(days=a.dias + 14)).isoformat()

    limpio = serie(desde, hasta, True)
    mezcla = serie(desde, hasta, False)
    dias = sorted(limpio)
    if not dias:
        print("Sin datos.")
        return 1

    # base de consultas conocidas: los 14 días anteriores a la ventana que se imprime
    corte = dias[max(0, len(dias) - a.dias)]
    base = set()
    for d in [x for x in dias if x < corte]:
        base |= set(consultas(d))

    print("Consultas conocidas antes de %s: %d" % (corte, len(base)))
    print()
    print("%-12s %-11s %8s %8s %8s %8s   %s" % (
        "día", "", "pos", "pos GSC", "clics", "impr", "consultas nuevas (nº · pos · % impr)"))
    for d in [x for x in dias if x >= corte]:
        y, m, dd = map(int, d.split("-"))
        r, rm = limpio[d], mezcla.get(d, limpio[d])
        A = consultas(d)
        ia = sum(x["impressions"] for x in A.values()) or 1
        nue = [k for k in A if k not in base]
        inn = sum(A[k]["impressions"] for k in nue)
        pn = sum(A[k]["position"] * A[k]["impressions"] for k in nue) / inn if inn else 0
        print("%-12s %-11s %8.2f %8.2f %8.0f %8.0f   %4d · pos %5.1f · %2.0f%%" % (
            d, DOW[date(y, m, dd).weekday()], r["position"], rm["position"],
            r["clicks"], r["impressions"], len(nue), pn, 100 * inn / ia))
    print()
    print("· «pos» excluye las URLs con #ancla · «pos GSC» es lo que verías en la interfaz")
    print("· Si los últimos días caen Y sus consultas nuevas entran en posición muy peor")
    print("  que los días anteriores, probablemente son datos aún incompletos: re-mide en 2-3 días.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
