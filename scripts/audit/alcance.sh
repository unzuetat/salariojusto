#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# sj-alcance · Auditoría integral de URLs: ¿toda página es alcanzable a clicks
# desde la home, y ninguna página enlazada se ve vacía?
#
# Causa de rechazo AdSense documentada por el usuario (19-may): no es solo
# "contenido de poco valor" en abstracto — es que existan enlaces que llevan a
# páginas huérfanas, vacías o casi vacías. Regla: "si la web falla en algo, que
# NO SE NOTE". Toda página debe estar disponible navegando a clicks desde /.
#
# Método (determinista, BFS sobre el grafo de enlaces internos):
#   1. PÁGINAS = todos los *.html de la raíz salvo google*.html (stub GSC).
#   2. Grafo: por página, enlaces internos href="/x.html" y href="/" (→home).
#      Solo se aceptan rutas que matchean ^/[a-z0-9-]+\.html$ o ^/$ (descarta
#      literales JS ${...}, anclas, externos, assets).
#   3. BFS desde / (index.html) → profundidad (nº de clicks) mínima por página.
#   4. ❌ HUÉRFANAS = páginas reales nunca alcanzadas desde la home.
#   5. ❌ ALCANZABLE-PERO-VACÍA = página alcanzable con < MINCHARS de texto
#      visible (se ve vacía → rechazo AdSense asegurado).
#   6. ⚠️ Cruce con sitemap.xml: en sitemap pero inalcanzable / alcanzable pero
#      fuera de sitemap. Profundidad > MAXDEPTH (enterrada). Callejones (sin
#      enlaces internos de salida → el usuario queda atrapado).
#
# Dependencia: perl (ships con macOS/Linux). Determinista.
# Exit 1 si hay huérfanas o páginas alcanzables vacías (gate-able con /goal).
# Uso: scripts/audit/alcance.sh                 # MINCHARS 1000, MAXDEPTH 3
#      scripts/audit/alcance.sh 1500 4          # custom
# ─────────────────────────────────────────────────────────────────────────────
set -u
cd "$(dirname "$0")/../.." || exit 2
ROOT="$(pwd)"; OUT="$ROOT/alcance.md"
MINCHARS="${1:-1000}"     # texto visible mínimo para no considerar "vacía"
MAXDEPTH="${2:-3}"        # clicks máximos tolerados desde la home
command -v perl >/dev/null || { echo "perl no disponible (necesario)"; exit 2; }

# ── 1. Universo de páginas reales (canónico: /ruta.html ; home = /index.html)
#     Incluye el mirror /en/ — AdSense también lo ve (sección del dominio).
PAGES=$(mktemp)
for f in "$ROOT"/*.html "$ROOT"/en/*.html; do
  [ -f "$f" ] || continue
  rel="${f#$ROOT/}"
  case "$rel" in google*.html) continue;; esac
  echo "/$rel"
done | sort -u > "$PAGES"

# ── 2. Grafo de adyacencia  src<TAB>dst  (rutas canónicas, dst real existente)
EDGES=$(mktemp)
while IFS= read -r src; do
  sf="$ROOT/${src#/}"
  [ -f "$sf" ] || continue
  perl -0777 -ne '
    s/<script\b.*?<\/script>//gis;            # los href de plantillas JS no son navegables
    while (/href\s*=\s*"([^"]+)"/gi) {
      my $h = $1; $h =~ s/[#?].*$//;           # quita ancla / query
      # Acepta:  /              → home
      #          /x.html        → página raíz
      #          /x/            → directorio → /x/index.html
      #          /x/y.html      → página en subdir (p.ej. /en/index.html)
      next unless $h =~ m{^/([a-z0-9-]+/)*([a-z0-9-]+\.html)?$};
      if    ($h eq "/")        { print "/index.html\n"; }
      elsif ($h =~ m{/$})      { print "${h}index.html\n"; }
      else                     { print "$h\n"; }
    }
  ' "$sf" | sort -u | while IFS= read -r dst; do
    # solo aristas a páginas reales del universo
    grep -qxF "$dst" "$PAGES" && printf '%s\t%s\n' "$src" "$dst"
  done
done < "$PAGES" >> "$EDGES"

# ── 3. BFS desde /index.html → profundidad mínima
DEPTH=$(mktemp)        # ruta<TAB>profundidad
echo -e "/index.html\t0" > "$DEPTH"
frontier="/index.html"; d=0
while [ -n "$frontier" ]; do
  next=""
  for node in $frontier; do
    while IFS=$'\t' read -r s t; do
      [ "$s" = "$node" ] || continue
      grep -qxF "$t" <(cut -f1 "$DEPTH") && continue   # ya visitada
      printf '%s\t%s\n' "$t" "$((d+1))" >> "$DEPTH"
      next="$next $t"
    done < "$EDGES"
  done
  frontier="$next"; d=$((d+1))
  [ "$d" -gt 50 ] && break
done

# ── 4/5. Huérfanas y alcanzables-vacías
ORPHANS=$(comm -23 "$PAGES" <(cut -f1 "$DEPTH" | sort -u))
visible_chars(){ perl -0777 -ne '
  s/<script\b.*?<\/script>//gis; s/<style\b.*?<\/style>//gis;
  s/<!--.*?-->//gs; s/<[^>]+>/ /g; s/&[a-z]+;/ /gi; s/\s+/ /g;
  print length($_);' "$1"; }

THIN=$(mktemp)         # ruta<TAB>chars<TAB>profundidad  (alcanzable + vacía)
while IFS=$'\t' read -r path dp; do
  pf="$ROOT/${path#/}"; [ -f "$pf" ] || continue
  c=$(visible_chars "$pf")
  [ "${c:-0}" -lt "$MINCHARS" ] && printf '%s\t%s\t%s\n' "$path" "$c" "$dp" >> "$THIN"
done < "$DEPTH"

# ── 6. Cruces: sitemap, profundidad, callejones
SMAP=$(mktemp)
if [ -f "$ROOT/sitemap.xml" ]; then
  grep -oE '<loc>[^<]+</loc>' "$ROOT/sitemap.xml" \
   | sed -E 's|</?loc>||g; s|https?://[^/]+||; s|/$|/index.html|' \
   | grep -E '\.html$' | sort -u > "$SMAP"
fi
SMAP_UNREACH=$(comm -23 "$SMAP" <(cut -f1 "$DEPTH" | sort -u) 2>/dev/null)
REACH_NOSMAP=$(comm -23 <(cut -f1 "$DEPTH" | sort -u) "$SMAP" 2>/dev/null | grep -vx '/index.html')
DEEP=$(awk -F'\t' -v m="$MAXDEPTH" '$2+0>m{print $1" (d="$2")"}' "$DEPTH")
DEADEND=""
while IFS=$'\t' read -r path dp; do
  grep -q "^$path	" "$EDGES" 2>/dev/null || DEADEND="$DEADEND $path"
done < "$DEPTH"

NP=$(wc -l < "$PAGES" | tr -d ' ')
NR=$(cut -f1 "$DEPTH" | sort -u | wc -l | tr -d ' ')
NO=$(printf '%s\n' "$ORPHANS" | grep -c . || true)
NT=$(wc -l < "$THIN" | tr -d ' ')
MAXD=$(awk -F'\t' '$2>m{m=$2}END{print m+0}' "$DEPTH")
HARD=$(( NO + NT ))

# ── Informe
{
echo "# Alcance de URLs — ¿todo es navegable a clicks y nada se ve vacío?"
echo ""
echo "**Generado:** $(date '+%Y-%m-%d %H:%M') · Páginas: $NP · Alcanzables desde \`/\`: $NR · Prof. máx: $MAXD click(s)"
echo ""
echo "Criterio AdSense (usuario 19-may): no debe haber enlaces a páginas huérfanas o que se vean vacías. Todo debe alcanzarse navegando desde la home."
echo ""
echo "| | |"
echo "|---|---|"
echo "| ❌ Huérfanas (inalcanzables desde \`/\`) | $NO |"
echo "| ❌ Alcanzables pero vacías (<$MINCHARS car) | $NT |"
echo "| ⚠️ En sitemap pero inalcanzables | $(printf '%s\n' "$SMAP_UNREACH" | grep -c . || true) |"
echo "| ⚠️ Alcanzables pero fuera de sitemap | $(printf '%s\n' "$REACH_NOSMAP" | grep -c . || true) |"
echo "| ⚠️ Enterradas (> $MAXDEPTH clicks) | $(printf '%s\n' "$DEEP" | grep -c . || true) |"
echo "| Páginas analizadas | $NP |"
echo ""
echo "## ❌ Huérfanas — existen pero NO se llega a ellas desde la home"
echo ""
if [ -n "$ORPHANS" ]; then printf '%s\n' "$ORPHANS" | sed 's/^/- `/; s/$/`/'
else echo "_Ninguna. Todo el universo es alcanzable._"; fi
echo ""
echo "## ❌ Alcanzables pero se ven vacías (rechazo AdSense asegurado)"
echo ""
if [ -s "$THIN" ]; then
  echo "| Página | Texto visible (car) | Profundidad |"
  echo "|---|---|---|"
  sort -t'	' -k2 -n "$THIN" | awk -F'\t' '{printf "| `%s` | %s | %s click(s) |\n",$1,$2,$3}'
else echo "_Ninguna página alcanzable está por debajo de $MINCHARS car._"; fi
echo ""
echo "## ⚠️ Cruce con sitemap.xml"
echo ""
echo "**En sitemap pero inalcanzables navegando** (Google las indexa pero el usuario no las encuentra):"
if [ -n "$SMAP_UNREACH" ]; then printf '%s\n' "$SMAP_UNREACH" | sed 's/^/- `/; s/$/`/'; else echo "- _ninguna_"; fi
echo ""
echo "**Alcanzables pero fuera del sitemap** (navegables pero no se piden indexar):"
if [ -n "$REACH_NOSMAP" ]; then printf '%s\n' "$REACH_NOSMAP" | sed 's/^/- `/; s/$/`/'; else echo "- _ninguna_"; fi
echo ""
echo "## ⚠️ Enterradas (> $MAXDEPTH clicks desde la home)"
echo ""
if [ -n "$DEEP" ]; then printf '%s\n' "$DEEP" | sed 's/^/- `/; s/$/`/'; else echo "_Ninguna; todo a ≤ $MAXDEPTH clicks._"; fi
echo ""
echo "## ⚠️ Callejones sin salida (página alcanzable sin enlaces internos de salida)"
echo ""
if [ -n "$(echo "$DEADEND" | tr -d ' ')" ]; then for p in $DEADEND; do echo "- \`$p\`"; done
else echo "_Ninguno; toda página alcanzable enlaza hacia dentro._"; fi
echo ""
echo "_Interpretación: las huérfanas o se enlazan desde un hub/menú o se quitan del sitemap y se ocultan. Las vacías: redactar contenido o despublicar+quitar enlaces+quitar de sitemap ANTES de que AdSense las vea. NO re-solicitar AdSense con huérfanas/vacías > 0 (ver memoria reference_adsense)._"
} > "$OUT"

rm -f "$PAGES" "$EDGES" "$DEPTH" "$THIN" "$SMAP"
echo "sj-alcance :: paginas=$NP alcanzables=$NR huerfanas=$NO vacias=$NT → alcance.md"
[ "$HARD" -eq 0 ] && exit 0 || exit 1
