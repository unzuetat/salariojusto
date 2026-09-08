#!/usr/bin/env python3
"""
Dashboard GSC de SalarioJusto — autocontenido y sin tokens de IA.

Tira datos frescos de Search Console (mismo Service Account que GA4),
los cruza con el censo de convenios y el histórico git, y regenera
analisis/gsc-dashboard.html. Ábrelo en el navegador para decidir cada
mañana qué convenio/sector acometer, sin entrar a GSC.

Uso:
    .venv/bin/python scripts/gsc-dashboard.py            # solo regenera el HTML
    .venv/bin/python scripts/gsc-dashboard.py --open     # regenera y lo abre

El HTML es autónomo (datos embebidos); solo Chart.js se carga por CDN.
GSC tiene ~3 días de lag: el dato "de hoy" llega hasta hace 3 días.
"""
import os, sys, json, re, subprocess, unicodedata
from datetime import date, timedelta
from pathlib import Path
from collections import defaultdict

from google.oauth2 import service_account
from googleapiclient.discovery import build

# --- Config ---
REPO = Path(__file__).resolve().parent.parent
CREDS = Path(os.environ.get("GSC_CREDENTIALS_FILE", Path.home() / ".config" / "ga4-salariojusto.json"))
SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly"]
SITE = os.environ.get("GSC_SITE_URL", "sc-domain:salariojusto.es")
LAG = 3
OUT_HTML = REPO / "analisis" / "gsc-dashboard.html"
HISTORY = REPO / "analisis" / "gsc-history.json"

creds = service_account.Credentials.from_service_account_file(str(CREDS), scopes=SCOPES)
svc = build("searchconsole", "v1", credentials=creds, cache_discovery=False)

def _latest_date():
    """Último día con datos reales (GSC tiene lag variable 1-3 días)."""
    lo = (date.today() - timedelta(days=10)).isoformat()
    hi = date.today().isoformat()
    rows = svc.searchanalytics().query(siteUrl=SITE, body={
        "startDate": lo, "endDate": hi, "dimensions": ["date"], "rowLimit": 30}).execute().get("rows", [])
    dates = [r["keys"][0] for r in rows]
    if not dates:
        return date.today() - timedelta(days=LAG)
    y, m, d = map(int, max(dates).split("-"))
    return date(y, m, d)

END = _latest_date()

def win(days, offset=0):
    end = END - timedelta(days=offset)
    return (end - timedelta(days=days - 1)).isoformat(), end.isoformat()

def query(dims, start, end, limit=25000, filters=None):
    body = {"startDate": start, "endDate": end, "dimensions": dims, "rowLimit": limit}
    if filters:
        body["dimensionFilterGroups"] = [{"filters": filters}]
    resp = svc.searchanalytics().query(siteUrl=SITE, body=body).execute()
    out = []
    for r in resp.get("rows", []):
        it = {d: r["keys"][i] for i, d in enumerate(dims)}
        it["clicks"] = r.get("clicks", 0); it["impr"] = r.get("impressions", 0)
        it["ctr"] = round(r.get("ctr", 0) * 100, 2); it["pos"] = round(r.get("position", 0), 2)
        out.append(it)
    return out

def totals(start, end):
    r = (svc.searchanalytics().query(siteUrl=SITE, body={"startDate": start, "endDate": end, "rowLimit": 1}).execute().get("rows") or [{}])[0]
    return {"clicks": r.get("clicks",0), "impr": r.get("impressions",0),
            "ctr": round(r.get("ctr",0)*100,2), "pos": round(r.get("position",0),2)}

def path(u): return u.replace("https://salariojusto.es", "")
def base(u): return path(u).lstrip("/")
def norm(s):
    s = unicodedata.normalize('NFD', s.lower()); s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    return re.sub(r'[^a-z ]', ' ', s)

# ============ PULL ============
print("· Consultando GSC…")
s0, e0 = win(28, 0); s1, e1 = win(28, 28)
sw, ew = win(7, 0); swp, ewp = win(7, 7)
P = {"28d": {**totals(s0,e0)}, "prev28d": {**totals(s1,e1)}}
P["28d"]["range"] = [s0, e0]

pages_now = {p["page"]: p for p in query(["page"], s0, e0)}
pages_prev = {p["page"]: p for p in query(["page"], s1, e1)}
q_now = query(["query"], s0, e0)
q7 = {x["query"]: x for x in query(["query"], sw, ew)}
q7p = {x["query"]: x for x in query(["query"], swp, ewp)}
daily_raw = query(["date"], s0, e0, limit=100)
device_raw = query(["device"], s0, e0, limit=10)

# ============ AGREGADOS BASE ============
sect = defaultdict(lambda: {"clk":0,"imp":0,"n":0})
for p in pages_now.values():
    pa = path(p["page"])
    if "#" in pa: continue
    m = re.match(r"/convenio-([a-z]+)-", pa)
    k = "home" if pa == "/" else (m.group(1) if m else "otras")
    sect[k]["clk"] += p["clicks"]; sect[k]["imp"] += p["impr"]; sect[k]["n"] += 1
sect_rows = sorted(sect.items(), key=lambda x: -x[1]["clk"])

pages = [p for p in pages_now.values() if "#" not in path(p["page"])]
top_pages = sorted(pages, key=lambda p: -p["clicks"])[:12]

deltas = []
for u in set(pages_now) | set(pages_prev):
    if "#" in path(u): continue
    a, b = pages_now.get(u, {}), pages_prev.get(u, {})
    deltas.append({"page":u, "d":a.get("clicks",0)-b.get("clicks",0), "a":b.get("clicks",0),
                   "b":a.get("clicks",0), "pa":b.get("pos",0), "pb":a.get("pos",0)})
gain = sorted(deltas, key=lambda x: -x["d"])[:8]
loss = sorted(deltas, key=lambda x: x["d"])[:6]

exp = {1:28,2:15,3:11,4:8,5:6,6:5,7:4,8:3.5,9:3,10:2.5}
def ectr(pos): return exp.get(max(1, min(10, round(pos))), 2)
cand = [p for p in pages if p["impr"] >= 2500 and p["pos"] <= 10 and p["ctr"] < ectr(p["pos"])]
for p in cand: p["lost"] = round((ectr(p["pos"]) - p["ctr"]) / 100 * p["impr"])
opp = sorted(cand, key=lambda p: -p["lost"])[:8]

buck = defaultdict(lambda: [0,0,0])
for x in q_now:
    k = "1-3" if x["pos"]<=3 else "4-10" if x["pos"]<=10 else "11-20" if x["pos"]<=20 else "21+"
    buck[k][0]+=1; buck[k][1]+=x["clicks"]; buck[k][2]+=x["impr"]

# ============ PANEL 1 · MAPA DE HUECOS (sector × provincia) ============
censo = json.load(open(REPO / "data" / "convenios" / "censo.json"))
def _find_rows(x):
    if isinstance(x, list) and x and isinstance(x[0], dict): return x
    if isinstance(x, dict):
        for v in x.values():
            r = _find_rows(v)
            if r: return r
crows = _find_rows(censo)
covered = set()
pages_per_sector = defaultdict(int)
for r in crows:
    m = re.match(r'convenio-([a-z]+)-(.+)\.html', r['archivo'])
    if m:
        covered.add((m.group(1), m.group(2)))
        pages_per_sector[m.group(1)] += 1
ALIAS = {'bizkaia':['bizkaia','vizcaya'],'gipuzkoa':['gipuzkoa','guipuzcoa'],'araba':['araba','alava'],
 'laspalmas':['las palmas','laspalmas','gran canaria'],'baleares':['baleares','mallorca','illes balears'],
 'acoruna':['coruna','a coruna'],'santacruz':['tenerife','santa cruz']}
def is_cov(sec, provterm):
    for s, p in covered:
        if s != sec: continue
        for a in ALIAS.get(p, [p]):
            if a in provterm: return True
    return False
SECTORS = {'hosteleria':['hosteleria','hosteleros'],'limpieza':['limpieza'],'metal':['metal','siderometal','siderometalurgia'],
 'construccion':['construccion'],'oficinas':['oficinas','despachos'],'comercio':['comercio'],'transporte':['transporte'],
 'sanidad':['sanidad'],'ensenanza':['ensenanza','educacion'],'agrario':['agrario','campo'],'quimica':['quimica']}
PROVS = ['madrid','barcelona','valencia','sevilla','zaragoza','malaga','murcia','bizkaia','vizcaya','gipuzkoa','guipuzcoa',
 'alava','araba','navarra','asturias','cantabria','coruna','pontevedra','ourense','lugo','leon','burgos','valladolid',
 'salamanca','zamora','palencia','soria','segovia','avila','caceres','badajoz','toledo','ciudad real','cuenca','guadalajara',
 'albacete','alicante','castellon','tarragona','lleida','girona','huesca','teruel','cadiz','cordoba','granada','huelva','jaen',
 'almeria','baleares','mallorca','las palmas','tenerife','ceuta','melilla','la rioja','rioja']
gapd = defaultdict(lambda: {"imp":0,"clk":0,"pos":[]})
demand_provs = defaultdict(set)
for x in q_now:
    qn = norm(x["query"])
    sec = next((s for s, kw in SECTORS.items() if any(k in qn for k in kw)), None)
    prov = next((p for p in PROVS if p in qn), None)
    if not sec or not prov: continue
    demand_provs[sec].add(prov)
    if is_cov(sec, prov): continue
    g = gapd[(sec, prov)]; g["imp"] += x["impr"]; g["clk"] += x["clicks"]; g["pos"].append(x["pos"])
gap_holes = []
for (sec, prov), g in gapd.items():
    if g["imp"] < 30: continue
    gap_holes.append({"sec":sec, "prov":prov, "imp":round(g["imp"]), "clk":round(g["clk"]),
                      "pos":round(sum(g["pos"])/len(g["pos"]),1)})
gap_holes = sorted(gap_holes, key=lambda x: -x["imp"])[:20]
gap_sectors = []
for sec in sorted(SECTORS, key=lambda s: -len(demand_provs.get(s, set()))):
    dp = len(demand_provs.get(sec, set()))
    if dp == 0 and pages_per_sector.get(sec, 0) == 0: continue
    gap_sectors.append({"sec":sec, "demand":dp, "pages":pages_per_sector.get(sec, 0),
                        "new": sec not in pages_per_sector})

# ============ PANEL 2 · TRACKING DE LANZAMIENTOS ============
launches = []
try:
    raw = subprocess.run(["git", "log", "--diff-filter=A", "--name-only",
                          "--format=%x00%ad", "--date=short", "--", "convenio-*.html"],
                         cwd=REPO, capture_output=True, text=True, timeout=30).stdout
    added = {}  # basename -> date (primera aparición = creación)
    cur = None
    for line in raw.splitlines():
        if line.startswith("\x00"):
            cur = line[1:].strip()
        elif line.strip().endswith(".html") and cur:
            added.setdefault(line.strip(), cur)
    cutoff = (date.today() - timedelta(days=45)).isoformat()
    bymeta = {base(u): p for u, p in pages_now.items() if "#" not in path(u)}
    for f, d in sorted(added.items(), key=lambda x: x[1], reverse=True):
        if d < cutoff: continue
        m = bymeta.get(f, {})
        launches.append({"f":f, "date":d, "clk":round(m.get("clicks",0)),
                         "imp":round(m.get("impr",0)), "pos":m.get("pos",0),
                         "live": f in bymeta})
    launches = launches[:12]
except Exception as ex:
    print("  (aviso: tracking git falló:", ex, ")")

# ============ PANEL 3 · QUICK WINS (pos 8-18, con demanda) ============
quickwins = sorted([p for p in pages if 7.5 < p["pos"] <= 18 and p["impr"] >= 600],
                   key=lambda p: -p["impr"])[:12]
quickwins = [{"p":path(p["page"]), "imp":round(p["impr"]), "clk":round(p["clicks"]),
              "ctr":p["ctr"], "pos":p["pos"]} for p in quickwins]

# ============ PANEL 4 · DEMANDA EMERGENTE (7d vs 7d previo) ============
emerging = []
for qk, a in q7.items():
    prev = q7p.get(qk, {}).get("impr", 0)
    now = a["impr"]
    if now < 60: continue
    growth = now - prev
    if prev == 0 and now >= 60:
        emerging.append({"q":qk, "now":round(now), "prev":0, "g":round(now), "new":True, "pos":a["pos"], "clk":round(a["clicks"])})
    elif prev >= 15 and now >= prev * 1.6:
        emerging.append({"q":qk, "now":round(now), "prev":round(prev), "g":round(growth), "new":False, "pos":a["pos"], "clk":round(a["clicks"])})
emerging = sorted(emerging, key=lambda x: -x["g"])[:15]

# ============ HISTÓRICO (para tendencias largas a futuro) ============
try:
    hist = json.loads(HISTORY.read_text()) if HISTORY.exists() else []
    if not any(h["date"] == e0 for h in hist):
        hist.append({"date": e0, "clicks": round(P["28d"]["clicks"]), "impr": round(P["28d"]["impr"]),
                     "ctr": P["28d"]["ctr"], "pos": P["28d"]["pos"]})
        hist = hist[-400:]
        HISTORY.write_text(json.dumps(hist, ensure_ascii=False, indent=0))
except Exception as ex:
    print("  (aviso: histórico no guardado:", ex, ")")

# ============ PAYLOAD ============
def dpct(a,b): return None if not b else round((a-b)/b*100)
def we(ds):
    y,m,d = map(int, ds.split("-")); return date(y,m,d).weekday() >= 5

payload = {
  "updated": e0, "generated": date.today().isoformat(),
  "kpi": {
    "clicks": {"v": round(P["28d"]["clicks"]), "d": dpct(P["28d"]["clicks"], P["prev28d"]["clicks"])},
    "impr": {"v": round(P["28d"]["impr"]), "d": dpct(P["28d"]["impr"], P["prev28d"]["impr"])},
    "ctr": {"v": P["28d"]["ctr"], "d": round(P["28d"]["ctr"] - P["prev28d"]["ctr"], 2)},
    "pos": {"v": P["28d"]["pos"], "d": round(P["28d"]["pos"] - P["prev28d"]["pos"], 2)},
  },
  "daily": [{"d": x["date"][5:], "c": round(x["clicks"]), "we": we(x["date"])} for x in sorted(daily_raw, key=lambda x: x["date"])],
  "sectors": [{"k": k, "clk": round(v["clk"]), "ctr": round(v["clk"]/v["imp"]*100,2) if v["imp"] else 0, "n": v["n"]} for k, v in sect_rows],
  "top_pages": [{"p": path(p["page"]), "clk": round(p["clicks"]), "imp": round(p["impr"]), "ctr": p["ctr"], "pos": p["pos"]} for p in top_pages],
  "gain": [{"p": path(x["page"]), "d": round(x["d"]), "a": round(x["a"]), "b": round(x["b"]), "pa": x["pa"], "pb": x["pb"]} for x in gain],
  "loss": [{"p": path(x["page"]), "d": round(x["d"]), "a": round(x["a"]), "b": round(x["b"]), "pa": x["pa"], "pb": x["pb"]} for x in loss],
  "opp": [{"p": path(p["page"]), "imp": round(p["impr"]), "ctr": p["ctr"], "pos": p["pos"], "lost": p["lost"]} for p in opp],
  "buckets": [{"k": k, "n": buck[k][0], "clk": round(buck[k][1]), "imp": round(buck[k][2])} for k in ["1-3","4-10","11-20","21+"]],
  "device": [{"k": x["device"].title(), "c": round(x["clicks"]), "ctr": x["ctr"]} for x in device_raw],
  "gap_sectors": gap_sectors,
  "gap_holes": gap_holes,
  "launches": launches,
  "quickwins": quickwins,
  "emerging": emerging,
}

TEMPLATE = (REPO / "scripts" / "gsc-dashboard.tmpl.html").read_text()
html = TEMPLATE.replace("__PAYLOAD__", json.dumps(payload, ensure_ascii=False))
OUT_HTML.write_text(html)
print(f"✓ {OUT_HTML.relative_to(REPO)}  ({len(html)//1024} KB) · datos hasta {e0}")
print(f"  huecos={len(gap_holes)} lanzamientos={len(launches)} quickwins={len(quickwins)} emergentes={len(emerging)}")

if "--open" in sys.argv:
    subprocess.run(["open", str(OUT_HTML)])
