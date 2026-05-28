#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# sj-dashboard · Command-center por landing de salariojusto.es
#
# Capa DETERMINISTA. Genera LANDINGS.csv cruzando las fuentes de verdad:
#   - estructura: sitemap.xml (set indexable autoritativo) + slug
#   - estado:     en sitemap · HTTP en vivo (--net) · title local
#   - métricas:   último Páginas.csv (export GSC) en el cwd
#   - actividad:  git log del fichero (última fecha + commit)
#   - HUMANO:     data/landings-notas.csv (decision/notas/proximo_paso) ← persiste
#
# Las columnas derivadas se REGENERAN (no pueden mentir). Solo la capa humana
# se edita a mano, en data/landings-notas.csv, y sobrevive a cada regeneración.
#
# Uso:
#   scripts/audit/dashboard.sh           # rápido (sin red)
#   scripts/audit/dashboard.sh --net     # + HTTP 200 en vivo por landing (lento)
# ─────────────────────────────────────────────────────────────────────────────
set -u
cd "$(dirname "$0")/../.." || exit 2
ROOT="$(pwd)"
CSV="$ROOT/LANDINGS.csv"
MD="$ROOT/LANDINGS_DASHBOARD.md"
NOTES="$ROOT/data/landings-notas.csv"
PAGS="$ROOT/Páginas.csv"
NET=0; [ "${1:-}" = "--net" ] && NET=1
STAMP="$(date '+%Y-%m-%d %H:%M')"

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

# índice métricas GSC: slug -> "clics;imp;ctr;pos"
declare_metrics() {
  [ -f "$PAGS" ] || return 0
  awk -F',' 'NR>1 && $1 ~ /salariojusto\.es\// {
    u=$1; sub(/^https?:\/\/(www\.)?salariojusto\.es\//,"",u);
    print u "\t" $2 ";" $3 ";" $4 ";" $5
  }' "$PAGS"
}
MIDX=$(mktemp); declare_metrics > "$MIDX"

# notas humanas: pre-parsear a TSV robusto (respeta comas dentro de campos
# entrecomillados — decimales españoles "2,3%", listas, etc.). RFC4180, 1 línea/registro.
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
COUNT=0; STALE_NOTE=0
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
  if [ "$NET" = "1" ]; then http=$(curl -s -o /dev/null -w "%{http_code}" -L --max-time 10 "$url" 2>/dev/null); fi
  m=$(grep -F "$slug"$'\t' "$MIDX" 2>/dev/null | head -1 | cut -f2)
  clics="${m%%;*}"; rest="${m#*;}"; imp="${rest%%;*}"; rest="${rest#*;}"; ctr="${rest%%;*}"; pos="${rest##*;}"
  [ "$m" = "" ] && { clics=""; imp=""; ctr=""; pos=""; }
  gitln=$(git log -1 --date=short --format='%ad~%s' -- "$slug" 2>/dev/null)
  gfecha="${gitln%%~*}"; gmsg="${gitln#*~}"; [ "$gitln" = "" ] && { gfecha=""; gmsg=""; }
  dec=$(note_get "$slug" 2); not=$(note_get "$slug" 3); pro=$(note_get "$slug" 4)
  [ -n "$not$dec$pro" ] && STALE_NOTE=$((STALE_NOTE+1))
  COUNT=$((COUNT+1))
  {
    csv "$grupo"; printf ','; csv "$sector"; printf ','; csv "$prov"; printf ','
    csv "$slug"; printf ','; csv "$url"; printf ','; csv "$ensit"; printf ','
    csv "$http"; printf ','; csv "$clics"; printf ','; csv "$imp"; printf ','
    csv "$ctr"; printf ','; csv "$pos"; printf ','; csv "$gfecha"; printf ','
    csv "$gmsg"; printf ','; csv "$dec"; printf ','; csv "$not"; printf ','
    csv "$pro"; printf '\n'
  } >> "$ROWS"
done < <(mapfile_locs)

# CSV final (cabecera + filas ordenadas por grupo, sector, provincia)
{
  echo 'grupo,sector,provincia,slug,url,en_sitemap,http,clics,imp,ctr,pos,ult_fecha,ult_commit,decision,notas,proximo_paso'
  sort -t',' -k1,1 -k2,2 -k3,3 "$ROWS"
} > "$CSV"

# Mirror Markdown para MC (narrativo + sello de frescura)
{
  echo "# LANDINGS — command-center (mirror de LANDINGS.csv)"
  echo ""
  echo "**Generado:** $STAMP · **Fuente:** sitemap.xml + Páginas.csv + git + data/landings-notas.csv"
  echo "**Landings:** $COUNT · **Con nota humana:** $STALE_NOTE"
  echo ""
  echo "> Columnas derivadas REGENERADAS (no editar). Capa humana en \`data/landings-notas.csv\`."
  echo "> CSV abrible en Excel/Sheets: \`LANDINGS.csv\`. Regenerar: \`/sj-dashboard\`."
  echo ""
  echo "| Grupo | Sector | Prov | Slug | CTR | Pos | Últ. | Decisión | Próximo paso |"
  echo "|---|---|---|---|---|---|---|---|---|"
  tail -n +2 "$CSV" | awk -F'","' '{
    for(i=1;i<=NF;i++){gsub(/^"|"$/,"",$i)}
    if($14!=""||$16!="")
      printf "| %s | %s | %s | %s | %s | %s | %s | %s | %s |\n",$1,$2,$3,$4,$10,$11,$12,$14,$16
  }'
  echo ""
  echo "_(solo se listan filas con decisión/próximo paso; el CSV completo tiene las $COUNT)_"
} > "$MD"

rm -f "$MIDX" "$ROWS" "$NOTES_TSV"
echo "sj-dashboard :: landings=$COUNT con_nota=$STALE_NOTE net=$NET"
echo "→ LANDINGS.csv (Excel/Sheets) · LANDINGS_DASHBOARD.md (mirror MC)"
[ -f "$PAGS" ] || echo "⚠️  no había Páginas.csv en cwd → columnas GSC vacías (suelta el export y regenera)"
