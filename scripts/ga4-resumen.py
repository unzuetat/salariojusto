#!/usr/bin/env python3
"""
Genera analisis/ga4/RESUMEN.md a partir de los CSVs diarios.

Lee TODOS los archivos analisis/ga4/YYYY-MM-DD.csv y produce un markdown único
(siempre se sobreescribe) con:
- Top 10 páginas (último día) por sesiones
- Movers semana actual vs anterior (top 5 sube + top 5 baja)
- Distribución por canal (último día)
- Tendencia sitewide 7d vs 7d anteriores
- Anomalías DoD (>50% subida/caída sobre páginas con ≥10 sesiones)

Diseño: 1 solo archivo en MC que se sobreescribe → coste de contexto constante.
"""
import csv
import re
import sys
from collections import defaultdict
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
IN_DIR = ROOT / "analisis" / "ga4"
OUT_FILE = IN_DIR / "RESUMEN.md"


def normalize_date(s: str) -> str:
    """GA4 devuelve 'YYYYMMDD'; lo pasamos a 'YYYY-MM-DD'."""
    s = s.strip()
    if re.fullmatch(r"\d{8}", s):
        return f"{s[0:4]}-{s[4:6]}-{s[6:8]}"
    return s


def load_data() -> tuple[dict, list[str]]:
    """
    Returns:
      data: {iso_date: {page_path: {channel: {metric: value}}}}
      dates_sorted: lista ordenada de fechas iso disponibles
    """
    files = sorted(IN_DIR.glob("[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9].csv"))
    if not files:
        sys.exit(f"No daily CSVs found in {IN_DIR}")

    data = defaultdict(lambda: defaultdict(lambda: defaultdict(dict)))
    dates = set()
    for f in files:
        with f.open("r", encoding="utf-8") as fh:
            reader = csv.DictReader(fh)
            for row in reader:
                d = normalize_date(row["date"])
                p = row["pagePath"]
                c = row["sessionDefaultChannelGroup"] or "(unknown)"
                dates.add(d)
                data[d][p][c] = {
                    "sessions": int(row["sessions"] or 0),
                    "totalUsers": int(row["totalUsers"] or 0),
                    "screenPageViews": int(row["screenPageViews"] or 0),
                    "averageSessionDuration": float(row["averageSessionDuration"] or 0),
                }
    return data, sorted(dates)


def page_aggregates(day_data: dict) -> dict:
    """Aggregate metrics by page (suma sobre channels)."""
    agg = defaultdict(lambda: {"sessions": 0, "users": 0, "views": 0, "dwell_weighted": [], })
    for p, channels in day_data.items():
        for c, m in channels.items():
            agg[p]["sessions"] += m["sessions"]
            agg[p]["users"] += m["totalUsers"]
            agg[p]["views"] += m["screenPageViews"]
            agg[p]["dwell_weighted"].append((m["sessions"], m["averageSessionDuration"]))
    # Resolve weighted avg dwell
    for p, v in agg.items():
        total_w = sum(s for s, _ in v["dwell_weighted"])
        v["dwell"] = (sum(s * d for s, d in v["dwell_weighted"]) / total_w) if total_w else 0
        del v["dwell_weighted"]
    return dict(agg)


def channel_aggregates(day_data: dict) -> dict[str, int]:
    out = defaultdict(int)
    for p, channels in day_data.items():
        for c, m in channels.items():
            out[c] += m["sessions"]
    return dict(out)


def week_sessions_by_page(data: dict, end_iso: str, days: int) -> dict[str, int]:
    """Sessions por página en ventana [end - days + 1 .. end]."""
    end = date.fromisoformat(end_iso)
    out = defaultdict(int)
    for i in range(days):
        d = (end - timedelta(days=i)).isoformat()
        if d not in data:
            continue
        for p, channels in data[d].items():
            for c, m in channels.items():
                out[p] += m["sessions"]
    return dict(out)


def week_total_sessions(data: dict, end_iso: str, days: int) -> int:
    end = date.fromisoformat(end_iso)
    total = 0
    for i in range(days):
        d = (end - timedelta(days=i)).isoformat()
        if d not in data:
            continue
        for p, channels in data[d].items():
            for c, m in channels.items():
                total += m["sessions"]
    return total


def format_pct(n: float) -> str:
    sign = "+" if n >= 0 else ""
    return f"{sign}{n:.0f}%"


def main():
    data, dates_sorted = load_data()
    last_iso = dates_sorted[-1]
    last_day = data[last_iso]

    # Top 10 last day
    page_agg = page_aggregates(last_day)
    top_10 = sorted(page_agg.items(), key=lambda kv: -kv[1]["sessions"])[:10]

    # Channels last day
    channels = channel_aggregates(last_day)
    total_sessions_last = sum(channels.values())

    # Tendencia sitewide
    this_week = week_total_sessions(data, last_iso, 7)
    prev_week_end = (date.fromisoformat(last_iso) - timedelta(days=7)).isoformat()
    prev_week = week_total_sessions(data, prev_week_end, 7)
    delta_pct = ((this_week - prev_week) / prev_week * 100) if prev_week else 0

    # Movers WoW (filtrar páginas con min ≥5 en alguna semana, para evitar ruido)
    this_week_pages = week_sessions_by_page(data, last_iso, 7)
    prev_week_pages = week_sessions_by_page(data, prev_week_end, 7)
    deltas = []
    for p in set(this_week_pages) | set(prev_week_pages):
        t = this_week_pages.get(p, 0)
        pv = prev_week_pages.get(p, 0)
        if max(t, pv) < 5:
            continue
        if pv == 0:
            pct = float("inf") if t > 0 else 0
        else:
            pct = (t - pv) / pv * 100
        deltas.append((p, t, pv, pct))

    finite_deltas = [d for d in deltas if d[3] != float("inf")]
    movers_up = sorted(finite_deltas, key=lambda x: -x[3])[:5]
    movers_down = sorted(finite_deltas, key=lambda x: x[3])[:5]
    new_pages = sorted([d for d in deltas if d[3] == float("inf")], key=lambda x: -x[1])[:5]

    # Anomalías DoD
    anomalies = []
    if len(dates_sorted) >= 2:
        prev_iso = dates_sorted[-2]
        prev_page_agg = page_aggregates(data[prev_iso])
        all_pages = set(page_agg) | set(prev_page_agg)
        for p in all_pages:
            l = page_agg.get(p, {}).get("sessions", 0)
            pv = prev_page_agg.get(p, {}).get("sessions", 0)
            if max(l, pv) < 10:
                continue
            if pv == 0:
                continue
            pct = (l - pv) / pv * 100
            if abs(pct) >= 50:
                anomalies.append((p, l, pv, pct))
        anomalies.sort(key=lambda x: -abs(x[3]))
        anomalies = anomalies[:10]

    # Build markdown
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    md: list[str] = []
    md.append("# GA4 — Resumen automático")
    md.append("")
    md.append(
        f"_Generado: {now} · datos hasta {last_iso} · {len(dates_sorted)} días disponibles_"
    )
    md.append("")

    md.append("## Tendencia sitewide")
    md.append("")
    md.append(
        f"Sessions últimos 7 días: **{this_week}** · "
        f"vs **{prev_week}** los 7 días anteriores · "
        f"**{format_pct(delta_pct)}**"
    )
    md.append("")

    md.append(f"## Top 10 páginas por sesiones · {last_iso}")
    md.append("")
    md.append("| Página | Sessions | Users | Views | Dwell (s) |")
    md.append("|---|---:|---:|---:|---:|")
    for p, v in top_10:
        md.append(f"| `{p}` | {v['sessions']} | {v['users']} | {v['views']} | {v['dwell']:.0f} |")
    md.append("")

    if movers_up or movers_down or new_pages:
        md.append("## Movers · semana actual vs anterior")
        md.append("")
        if movers_up:
            md.append("### Top 5 que más suben")
            md.append("")
            md.append("| Página | Ahora | Antes | Δ% |")
            md.append("|---|---:|---:|---:|")
            for p, t, pv, pct in movers_up:
                md.append(f"| `{p}` | {t} | {pv} | {format_pct(pct)} |")
            md.append("")
        if movers_down:
            md.append("### Top 5 que más bajan")
            md.append("")
            md.append("| Página | Ahora | Antes | Δ% |")
            md.append("|---|---:|---:|---:|")
            for p, t, pv, pct in movers_down:
                md.append(f"| `{p}` | {t} | {pv} | {format_pct(pct)} |")
            md.append("")
        if new_pages:
            md.append("### Páginas nuevas con tracción (sin datos semana anterior)")
            md.append("")
            md.append("| Página | Sessions esta semana |")
            md.append("|---|---:|")
            for p, t, pv, _ in new_pages:
                md.append(f"| `{p}` | {t} |")
            md.append("")

    md.append(f"## Distribución por canal · {last_iso}")
    md.append("")
    md.append("| Canal | Sessions | % |")
    md.append("|---|---:|---:|")
    for c, s in sorted(channels.items(), key=lambda x: -x[1]):
        pct = (s / total_sessions_last * 100) if total_sessions_last else 0
        md.append(f"| {c} | {s} | {pct:.0f}% |")
    md.append("")

    if anomalies:
        md.append("## ⚡ Anomalías DoD (>50% en páginas con ≥10 sessions)")
        md.append("")
        md.append("| Página | Último día | Día anterior | Δ% |")
        md.append("|---|---:|---:|---:|")
        for p, l, pv, pct in anomalies:
            md.append(f"| `{p}` | {l} | {pv} | {format_pct(pct)} |")
        md.append("")

    md.append("---")
    md.append("")
    md.append("_Resumen generado automáticamente por `scripts/ga4-resumen.py`. CSVs raw en `analisis/ga4/`._")

    OUT_FILE.write_text("\n".join(md), encoding="utf-8")
    print(f"Wrote {OUT_FILE} ({OUT_FILE.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
