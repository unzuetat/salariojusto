#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# sj-dashboard · Command-center por landing de salariojusto.es
#
# Capa DETERMINISTA. Genera LANDINGS.csv cruzando las fuentes de verdad:
#   - estructura: sitemap.xml (set indexable autoritativo) + slug
#   - estado:     en sitemap · HTTP en vivo (--net) · last-modified prod (--net)
#   - título:     <title> local del HTML
#   - métricas:   3 ventanas GSC si los exports están en analisis/:
#                   · analisis/gsc-paginas.csv      → 3m (existente)
#                   · analisis/gsc-paginas-7d.csv   → 7d (opcional)
#                   · analisis/gsc-paginas-28d.csv  → 28d (opcional)
#   - actividad:  git log del fichero (última fecha + commit)
#   - reindex:    data/gsc-reindex-log.csv (capa humana, log de solicitudes GSC)
#   - HUMANO:     data/landings-notas.csv (decision/notas/proximo_paso) ← persiste
#
# Las columnas derivadas se REGENERAN (no pueden mentir). Solo la capa humana
# se edita a mano, y sobrevive a cada regeneración:
#   - data/landings-notas.csv   → decisiones editoriales
#   - data/gsc-reindex-log.csv  → registro de solicitudes de indexación GSC
#
# Uso:
#   scripts/audit/dashboard.sh           # rápido (sin red)
#   scripts/audit/dashboard.sh --net     # + HTTP 200 + last-modified prod (lento)
# ─────────────────────────────────────────────────────────────────────────────
set -u
cd "$(dirname "$0")/../.." || exit 2
ROOT="$(pwd)"
CSV="$ROOT/LANDINGS.csv"
MD="$ROOT/LANDINGS_DASHBOARD.md"
NOTES="$ROOT/data/landings-notas.csv"
REINDEX_LOG="$ROOT/data/gsc-reindex-log.csv"
PAGS_3M="$ROOT/analisis/gsc-paginas.csv"
PAGS_7D="$ROOT/analisis/gsc-paginas-7d.csv"
PAGS_28D="$ROOT/analisis/gsc-paginas-28d.csv"
# Compat: si hay un Páginas.csv en cwd, usarlo como 3m (comportamiento heredado)
PAGS_LEGACY="$ROOT/Páginas.csv"
[ -f "$PAGS_LEGACY" ] && PAGS_3M="$PAGS_LEGACY"
NET=0; [ "${1:-}" = "--net" ] && NET=1
STAMP="$(date '+%Y-%m-%d %H:%M')"
UA='Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'

csv() { printf '%s' "\"$(printf '%s' "$1" | sed 's/"/""/g')\""; }

# Set de landings = <loc> .html del sitemap (autoritativo) + slug
mapfile_locs() { grep -oE "<loc>[^<]+</loc>" "$ROOT/sitemap.xml" 2>/dev/null | sed -E 's/<\/?loc>//g'; }

grupo_de() { # $1 slug -> "grupo|sector|provincia"
  s="$1"
  case "$s" in
    convenio-limpieza-edificios-locales.html) echo "Convenios|Limpieza|· PILAR";;
    convenio-hosteleria.html)                 echo "Convenios|Hostelería|· PILAR";;
    convenio-limpieza-*)   p="${s#convenio-limpieza-}";   echo "Convenios|Limpieza|${p%.html}";;
    convenio-hosteleria-*) p="${s#convenio-hosteleria-}"; echo "Convenios|Hostelería|${p%.html}";;
    convenio-oficinas-*)   p="${s#convenio-oficinas-}";   echo "Convenios|Oficinas|${p%.html}";;
    convenio-construccion-*) p="${s#convenio-construccion-}"; echo "Convenios|Construcción|${p%.html}";;
    convenio-metal-*)      p="${s#convenio-metal-}";      echo "Convenios|Metal|${p%.html}";;
    convenio-tecnicos-*)   echo "Convenios|Espectáculos|—";;
    plantilla-*|plantillas-*|pedir-banda-*) echo "Kit|Plantilla|—";;
    ley-transparencia-*|rangos-salariales-*) echo "Core|Directiva|—";;
    salarios.html|guias.html|convenios.html|mapa-del-sitio.html|sobre.html|sala-de-prensa.html|index.html) echo "Core|Hub/Util|—";;
    *) echo "Otros|—|—";;
  esac
}

# Construir índice métricas GSC por ventana. Soporta:
#  · gsc-paginas*.csv con formato ";" (encabezado: url;clicks_*;impressions_*;ctr;avg_position)
#  · Páginas.csv legacy con "," (export GSC original)
build_metric_idx() { # $1 archivo $2 archivo_salida (TSV slug → "clics;imp;ctr;pos")
  local f="$1" out="$2"
  [ -f "$f" ] || { : > "$out"; return 0; }
  # Detectar separador: si la primera línea contiene ";" es el formato gsc-paginas.csv
  local sep=","
  head -1 "$f" 2>/dev/null | grep -q ";" && sep=";"
  awk -F"$sep" 'NR>1 && $1 ~ /salariojusto\.es\// {
    u=$1; sub(/^https?:\/\/(www\.)?salariojusto\.es\//,"",u);
    print u "\t" $2 ";" $3 ";" $4 ";" $5
  }' "$f" > "$out"
}
MIDX_3M=$(mktemp); build_metric_idx "$PAGS_3M" "$MIDX_3M"
MIDX_7D=$(mktemp); build_metric_idx "$PAGS_7D" "$MIDX_7D"
MIDX_28D=$(mktemp); build_metric_idx "$PAGS_28D" "$MIDX_28D"

# Reindex log: slug → "fecha_solicitud;resultado;intentos;notas"
REIDX=$(mktemp)
if [ -f "$REINDEX_LOG" ]; then
  awk -F',' 'NR>1 && $1!="" { print $1 "\t" $2 ";" $3 ";" $4 ";" $5 }' "$REINDEX_LOG" > "$REIDX"
fi

# notas humanas: pre-parsear a TSV robusto (RFC4180, decimales españoles, etc.)
NOTES_TSV=$(mktemp)
if [ -f "$NOTES" ]; then
  awk '
  function parse(line,   i,c,f,inq,o,n){
    n=0; f=""; inq=0
    for(i=1;i<=length(line);i++){ c=substr(line,i,1)
      if(inq){ if(c=="\""){ if(substr(line,i+1,1)=="\""){f=f "\"";i++} else inq=0 } else f=f c }
      else { if(c=="\""){inq=1} else if(c==","){o[++n]=f;f=""} else f=f c } }
    o[++n]=f
    gsub(/\t/," ",o[1]); gsub(/\t/," ",o[2]); gsub(/\t/," ",o[3]); gsub(/\t/," ",o[4])
    printf "%s\t%s\t%s\t%s\n", o[1],o[2],o[3],o[4]
  }
  NR>1 && length($0){ parse($0) }
  ' "$NOTES" > "$NOTES_TSV"
fi
note_get() { # $1 slug, $2 col (2=decision 3=notas 4=proximo)
  awk -F'\t' -v s="$1" -v c="$2" '$1==s{print $c; exit}' "$NOTES_TSV"
}

ROWS=$(mktemp)
COUNT=0; STALE_NOTE=0; WITH_REINDEX=0
while IFS= read -r loc; do
  path="${loc#https://salariojusto.es/}"
  case "$path" in ""|*/) continue;; esac
  case "$path" in *.html) ;; *) continue;; esac
  slug="$path"; url="$loc"
  IFS='|' read -r grupo sector prov <<< "$(grupo_de "$slug")"
  lf="$ROOT/$slug"
  ensit="sí"
  tloc=""
  [ -f "$lf" ] && tloc=$(grep -oiE "<title>[^<]*</title>" "$lf" | head -1 | sed -E 's/<\/?[Tt][Ii][Tt][Ll][Ee]>//g; s/^ +| +$//g')
  [ -f "$lf" ] || ensit="(sin fichero)"
  http=""
  last_mod=""
  if [ "$NET" = "1" ]; then
    headers=$(curl -sI -A "$UA" --max-time 10 "$url" 2>/dev/null)
    http=$(printf '%s' "$headers" | head -1 | grep -oE 'HTTP/[0-9.]+ [0-9]+' | awk '{print $2}')
    last_mod=$(printf '%s' "$headers" | grep -i '^last-modified' | head -1 | sed 's/\r//g; s/^[Ll]ast-[Mm]odified: //')
  fi
  # GSC 3 ventanas
  m3=$(grep -F "$slug"$'\t' "$MIDX_3M" 2>/dev/null | head -1 | cut -f2)
  c3m="${m3%%;*}"; r="${m3#*;}"; i3m="${r%%;*}"; r="${r#*;}"; t3m="${r%%;*}"; p3m="${r##*;}"
  [ "$m3" = "" ] && { c3m=""; i3m=""; t3m=""; p3m=""; }
  m7=$(grep -F "$slug"$'\t' "$MIDX_7D" 2>/dev/null | head -1 | cut -f2)
  c7d="${m7%%;*}"; r="${m7#*;}"; i7d="${r%%;*}"; r="${r#*;}"; t7d="${r%%;*}"; p7d="${r##*;}"
  [ "$m7" = "" ] && { c7d=""; i7d=""; t7d=""; p7d=""; }
  m28=$(grep -F "$slug"$'\t' "$MIDX_28D" 2>/dev/null | head -1 | cut -f2)
  c28d="${m28%%;*}"; r="${m28#*;}"; i28d="${r%%;*}"; r="${r#*;}"; t28d="${r%%;*}"; p28d="${r##*;}"
  [ "$m28" = "" ] && { c28d=""; i28d=""; t28d=""; p28d=""; }
  # Git activity
  gitln=$(git log -1 --date=short --format='%ad~%s' -- "$slug" 2>/dev/null)
  gfecha="${gitln%%~*}"; gmsg="${gitln#*~}"; [ "$gitln" = "" ] && { gfecha=""; gmsg=""; }
  # Reindex log
  rln=$(grep -F "$slug"$'\t' "$REIDX" 2>/dev/null | head -1 | cut -f2)
  reidx_fecha="${rln%%;*}"; r="${rln#*;}"; reidx_res="${r%%;*}"; r="${r#*;}"; reidx_int="${r%%;*}"; reidx_notas="${r##*;}"
  [ "$rln" = "" ] && { reidx_fecha=""; reidx_res=""; reidx_int=""; reidx_notas=""; }
  [ -n "$reidx_fecha" ] && WITH_REINDEX=$((WITH_REINDEX+1))
  # Human layer
  dec=$(note_get "$slug" 2); not=$(note_get "$slug" 3); pro=$(note_get "$slug" 4)
  [ -n "$not$dec$pro" ] && STALE_NOTE=$((STALE_NOTE+1))
  COUNT=$((COUNT+1))
  {
    csv "$grupo"; printf ','; csv "$sector"; printf ','; csv "$prov"; printf ','
    csv "$slug"; printf ','; csv "$url"; printf ','; csv "$ensit"; printf ','
    csv "$http"; printf ','; csv "$tloc"; printf ','; csv "$last_mod"; printf ','
    csv "$c7d"; printf ','; csv "$i7d"; printf ','; csv "$t7d"; printf ','; csv "$p7d"; printf ','
    csv "$c28d"; printf ','; csv "$i28d"; printf ','; csv "$t28d"; printf ','; csv "$p28d"; printf ','
    csv "$c3m"; printf ','; csv "$i3m"; printf ','; csv "$t3m"; printf ','; csv "$p3m"; printf ','
    csv "$gfecha"; printf ','; csv "$gmsg"; printf ','
    csv "$reidx_fecha"; printf ','; csv "$reidx_res"; printf ','; csv "$reidx_int"; printf ','; csv "$reidx_notas"; printf ','
    csv "$dec"; printf ','; csv "$not"; printf ','; csv "$pro"; printf '\n'
  } >> "$ROWS"
done < <(mapfile_locs)

# CSV final (cabecera + filas ordenadas por grupo, sector, provincia)
{
  echo 'grupo,sector,provincia,slug,url,en_sitemap,http,title,last_modified,clics_7d,imp_7d,ctr_7d,pos_7d,clics_28d,imp_28d,ctr_28d,pos_28d,clics_3m,imp_3m,ctr_3m,pos_3m,ult_git_fecha,ult_git_commit,reindex_fecha,reindex_resultado,reindex_intentos,reindex_notas,decision,notas,proximo_paso'
  sort -t',' -k1,1 -k2,2 -k3,3 "$ROWS"
} > "$CSV"

# Avisos sobre fuentes GSC disponibles
GSC_AVAIL=""
[ -f "$PAGS_3M" ]  && GSC_AVAIL="${GSC_AVAIL}3m "
[ -f "$PAGS_7D" ]  && GSC_AVAIL="${GSC_AVAIL}7d "
[ -f "$PAGS_28D" ] && GSC_AVAIL="${GSC_AVAIL}28d "
[ -z "$GSC_AVAIL" ] && GSC_AVAIL="ninguna"

# Mirror Markdown para MC (narrativo + sello de frescura)
{
  echo "# LANDINGS — command-center (mirror de LANDINGS.csv)"
  echo ""
  echo "**Generado:** $STAMP · **Fuente:** sitemap.xml + GSC ($GSC_AVAIL) + git + data/landings-notas.csv + data/gsc-reindex-log.csv"
  echo "**Landings:** $COUNT · **Con nota humana:** $STALE_NOTE · **Con reindex registrado:** $WITH_REINDEX"
  echo ""
  echo "> Columnas derivadas REGENERADAS (no editar). Capa humana en \`data/landings-notas.csv\` y \`data/gsc-reindex-log.csv\`."
  echo "> CSV abrible en Excel/Sheets: \`LANDINGS.csv\`. Regenerar: \`/sj-dashboard\`."
  echo ""
  echo "## Landings con decisión / próximo paso / reindex registrado"
  echo ""
  echo "| Grupo | Sector | Prov | Slug | CTR 3m | Pos 3m | Últ. modif | Reindex | Decisión | Próximo paso |"
  echo "|---|---|---|---|---|---|---|---|---|---|"
  tail -n +2 "$CSV" | awk -F'","' '{
    for(i=1;i<=NF;i++){gsub(/^"|"$/,"",$i)}
    # Mostrar solo si hay decisión, próximo paso o reindex registrado
    if($28!=""||$30!=""||$24!="")
      printf "| %s | %s | %s | %s | %s | %s | %s | %s | %s | %s |\n",$1,$2,$3,$4,$20,$21,$9,$24,$28,$30
  }'
  echo ""
  echo "_(solo se listan filas con decisión/próximo paso o reindex registrado; el CSV completo tiene las $COUNT)_"
} > "$MD"

rm -f "$MIDX_3M" "$MIDX_7D" "$MIDX_28D" "$ROWS" "$NOTES_TSV" "$REIDX"
echo "sj-dashboard :: landings=$COUNT con_nota=$STALE_NOTE con_reindex=$WITH_REINDEX gsc=$GSC_AVAIL net=$NET"
echo "→ LANDINGS.csv (Excel/Sheets) · LANDINGS_DASHBOARD.md (mirror MC)"
[ -f "$PAGS_3M" ] || echo "⚠️  no había export GSC 3m → columnas clics_3m/imp_3m vacías (suelta el CSV en analisis/ o root y regenera)"
[ -f "$PAGS_7D" ] || echo "ℹ️  no había export GSC 7d (opcional, generar en GSC con período 7 días y guardar en analisis/gsc-paginas-7d.csv)"
[ -f "$PAGS_28D" ] || echo "ℹ️  no había export GSC 28d (opcional, generar en GSC con período 28 días y guardar en analisis/gsc-paginas-28d.csv)"
