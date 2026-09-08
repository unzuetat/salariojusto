#!/usr/bin/env python3
"""
MCP server para Google Search Console (SalarioJusto).

Reutiliza el MISMO Service Account que GA4 (~/.config/ga4-salariojusto.json).
El SA debe estar añadido como usuario (permiso "Restringido" basta) en la
propiedad de Search Console.

Registro (sesión interactiva de Claude Code):
  claude mcp add gsc -- /Users/telmo/Projects/salariojusto/.venv/bin/python \
      /Users/telmo/Projects/salariojusto/scripts/mcp/gsc-server.py

Config opcional por env:
  GSC_CREDENTIALS_FILE   Path al JSON del SA. Default: ~/.config/ga4-salariojusto.json
  GSC_SITE_URL           Propiedad por defecto (ej. "sc-domain:salariojusto.es").
                         Si no se fija, se usa la primera que devuelva sites.list().
"""
import os
from datetime import date, timedelta
from pathlib import Path

from google.oauth2 import service_account
from googleapiclient.discovery import build
from mcp.server.fastmcp import FastMCP

CREDS = Path(os.environ.get("GSC_CREDENTIALS_FILE", Path.home() / ".config" / "ga4-salariojusto.json"))
SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly"]
# GSC tiene ~2-3 días de latencia en los datos.
LAG_DAYS = 3

mcp = FastMCP("gsc-salariojusto")

_svc = None
_default_site = os.environ.get("GSC_SITE_URL")


def _service():
    global _svc
    if _svc is None:
        creds = service_account.Credentials.from_service_account_file(str(CREDS), scopes=SCOPES)
        _svc = build("searchconsole", "v1", credentials=creds, cache_discovery=False)
    return _svc


def _resolve_site(site: str | None) -> str:
    if site:
        return site
    if _default_site:
        return _default_site
    entries = _service().sites().list().execute().get("siteEntry", [])
    if not entries:
        raise RuntimeError("El Service Account no tiene ninguna propiedad de GSC asignada.")
    # Preferir property de dominio si existe.
    for e in entries:
        if e["siteUrl"].startswith("sc-domain:"):
            return e["siteUrl"]
    return entries[0]["siteUrl"]


def _window(days: int) -> tuple[str, str]:
    end = date.today() - timedelta(days=LAG_DAYS)
    start = end - timedelta(days=days - 1)
    return start.isoformat(), end.isoformat()


def _query(dimensions, days, limit, site=None, dimension_filters=None):
    start, end = _window(days)
    body = {
        "startDate": start,
        "endDate": end,
        "dimensions": dimensions,
        "rowLimit": limit,
    }
    if dimension_filters:
        body["dimensionFilterGroups"] = [{"filters": dimension_filters}]
    resp = _service().searchanalytics().query(siteUrl=_resolve_site(site), body=body).execute()
    out = []
    for row in resp.get("rows", []):
        item = {dim: row["keys"][i] for i, dim in enumerate(dimensions)}
        item["clicks"] = row.get("clicks", 0)
        item["impressions"] = row.get("impressions", 0)
        item["ctr"] = round(row.get("ctr", 0) * 100, 2)
        item["position"] = round(row.get("position", 0), 2)
        out.append(item)
    return {"site": _resolve_site(site), "range": [start, end], "rows": out}


@mcp.tool()
def gsc_sites() -> list[dict]:
    """Lista las propiedades de Search Console visibles para el Service Account."""
    entries = _service().sites().list().execute().get("siteEntry", [])
    return [{"siteUrl": e["siteUrl"], "permission": e["permissionLevel"]} for e in entries]


@mcp.tool()
def gsc_top_queries(days: int = 28, limit: int = 50, site: str | None = None) -> dict:
    """Top consultas (queries) por clics: la demanda real, incluida la NO capturada.
    days = ventana en días hacia atrás (dato con ~3 días de lag)."""
    return _query(["query"], days, limit, site)


@mcp.tool()
def gsc_top_pages(days: int = 28, limit: int = 50, site: str | None = None) -> dict:
    """Top páginas por clics (clicks, impresiones, CTR, posición media)."""
    return _query(["page"], days, limit, site)


@mcp.tool()
def gsc_page_queries(page: str, days: int = 28, limit: int = 25, site: str | None = None) -> dict:
    """Consultas que llevan tráfico a una URL concreta. `page` = URL absoluta."""
    filt = [{"dimension": "page", "operator": "equals", "expression": page}]
    return _query(["query"], days, limit, site, dimension_filters=filt)


@mcp.tool()
def gsc_query_pages(query_contains: str, days: int = 28, limit: int = 25, site: str | None = None) -> dict:
    """Para una query (match parcial), qué páginas la reciben. Útil para detectar
    demanda sin landing dedicada (canibalización o hueco de contenido)."""
    filt = [{"dimension": "query", "operator": "contains", "expression": query_contains}]
    return _query(["query", "page"], days, limit, site, dimension_filters=filt)


if __name__ == "__main__":
    mcp.run()
