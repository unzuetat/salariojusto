#!/usr/bin/env python3
"""
Fetch daily GA4 report and write to analisis/ga4/YYYY-MM-DD.csv

Auth: Service Account JSON key. La service account debe estar añadida como
Viewer en la GA4 Property (Admin → Property access management).

Env vars / config:
  GA4_PROPERTY_ID           GA4 property ID numérico. Requerido.
  GA4_CREDENTIALS_FILE      Path al JSON de la service account.
                            Default: ~/.config/ga4-salariojusto.json

CLI:
  python scripts/ga4-fetch.py              -> yesterday
  python scripts/ga4-fetch.py 2026-05-20   -> single date
  python scripts/ga4-fetch.py 2026-05-01 2026-05-20  -> range (one file per day)
"""
import csv
import os
import sys
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    DateRange,
    Dimension,
    Metric,
    OrderBy,
    RunReportRequest,
)
from google.oauth2 import service_account

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "analisis" / "ga4"
DEFAULT_CREDENTIALS = Path.home() / ".config" / "ga4-salariojusto.json"
SCOPES = ["https://www.googleapis.com/auth/analytics.readonly"]

DIMENSIONS = ["date", "pagePath", "sessionDefaultChannelGroup"]
METRICS = ["sessions", "totalUsers", "screenPageViews", "averageSessionDuration"]


def client_from_env() -> tuple[BetaAnalyticsDataClient, str]:
    property_id = os.environ.get("GA4_PROPERTY_ID")
    if not property_id:
        sys.exit("ERROR: GA4_PROPERTY_ID env var missing")

    cred_path = Path(os.environ.get("GA4_CREDENTIALS_FILE", str(DEFAULT_CREDENTIALS)))
    if not cred_path.is_file():
        sys.exit(f"ERROR: credentials file not found: {cred_path}")

    creds = service_account.Credentials.from_service_account_file(
        str(cred_path), scopes=SCOPES
    )
    return BetaAnalyticsDataClient(credentials=creds), property_id


def fetch_day(client: BetaAnalyticsDataClient, property_id: str, day: date) -> list[dict]:
    iso = day.isoformat()
    req = RunReportRequest(
        property=f"properties/{property_id}",
        dimensions=[Dimension(name=d) for d in DIMENSIONS],
        metrics=[Metric(name=m) for m in METRICS],
        date_ranges=[DateRange(start_date=iso, end_date=iso)],
        order_bys=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name="sessions"), desc=True)],
        limit=100000,
    )
    resp = client.run_report(req)
    rows = []
    for r in resp.rows:
        row = {d: v.value for d, v in zip(DIMENSIONS, r.dimension_values)}
        row.update({m: v.value for m, v in zip(METRICS, r.metric_values)})
        rows.append(row)
    return rows


def write_csv(day: date, rows: list[dict]) -> Path:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out = OUT_DIR / f"{day.isoformat()}.csv"
    cols = DIMENSIONS + METRICS
    with out.open("w", encoding="utf-8", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=cols)
        w.writeheader()
        w.writerows(rows)
    return out


def parse_args() -> tuple[date, date]:
    args = sys.argv[1:]
    if not args:
        d = (datetime.now(timezone.utc) - timedelta(days=1)).date()
        return d, d
    if len(args) == 1:
        d = date.fromisoformat(args[0])
        return d, d
    if len(args) == 2:
        return date.fromisoformat(args[0]), date.fromisoformat(args[1])
    sys.exit("usage: ga4-fetch.py [YYYY-MM-DD [YYYY-MM-DD]]")


def main():
    start, end = parse_args()
    client, property_id = client_from_env()
    day = start
    while day <= end:
        rows = fetch_day(client, property_id, day)
        out = write_csv(day, rows)
        print(f"{day} -> {out} ({len(rows)} rows)")
        day += timedelta(days=1)


if __name__ == "__main__":
    main()
