#!/usr/bin/env bash
# sj-convenios-patron · Verifica el patrón unificado de convenios.
#   - Cada data/convenios/*.json tiene notaEditorial (salvo exentos conocidos).
#   - Cada convenio-*.html sigue la fórmula ganadora de title
#     (cifra-arrancante €/mes  ·  o al menos provincia + año).
# Determinista. Exit 1 si hay HARD (title sin patrón en landing con tráfico-objetivo).
set -u
cd "$(dirname "$0")/../.." || exit 2
ROOT="$(pwd)"; OUT="$ROOT/patron-convenios.md"
# JSON exentos de notaEditorial (marcos estatales, no convenios con tablas):
EXEMPT_NOTA="construccion_estatal.json"
in_list(){ case " $2 " in *" $1 "*) return 0;; *) return 1;; esac; }

WARN=0; HARD=0
TJ=$(mktemp); TT=$(mktemp)

for j in "$ROOT"/data/convenios/*.json; do
  [ -f "$j" ] || continue
  b=$(basename "$j")
  has=$(node -e "try{const d=require('$j');process.stdout.write(d.notaEditorial?'1':'0')}catch(e){process.stdout.write('ERR')}" 2>/dev/null)
  if [ "$has" = "0" ]; then
    if in_list "$b" "$EXEMPT_NOTA"; then
      echo "- \`$b\` sin notaEditorial — exento (marco estatal)" >> "$TJ"
    else
      WARN=$((WARN+1)); echo "- ❗ \`$b\` SIN notaEditorial (patrón unificado lo exige)" >> "$TJ"
    fi
  elif [ "$has" = "ERR" ]; then
    WARN=$((WARN+1)); echo "- ⚠️ \`$b\` no parseable por node" >> "$TJ"
  fi
done

# Fórmula ganadora en titles de convenios. HARD si el title NO arranca con cifra
# (€/dígito) Y además no contiene un año 20xx → genérico, deja CTR sobre la mesa.
for h in "$ROOT"/convenio-*.html; do
  [ -f "$h" ] || continue
  b=$(basename "$h")
  t=$(grep -oiE "<title>[^<]*</title>" "$h" | head -1 | sed -E 's/<\/?[Tt][Ii][Tt][Ll][Ee]>//g; s/^ +//')
  arranca_cifra=0; tiene_anio=0
  printf '%s' "$t" | grep -qE '^[0-9€]' && arranca_cifra=1
  printf '%s' "$t" | grep -qE '20(2[4-9]|3[0-9])' && tiene_anio=1
  if [ $arranca_cifra -eq 0 ] && [ $tiene_anio -eq 0 ]; then
    HARD=$((HARD+1)); echo "- ❌ \`$b\` title sin patrón (ni cifra-arrancante ni año): \`$t\`" >> "$TT"
  elif [ $arranca_cifra -eq 0 ]; then
    WARN=$((WARN+1)); echo "- ⚠️ \`$b\` sin cifra-arrancante (tiene año, mejorable): \`$t\`" >> "$TT"
  fi
done

{
echo "# Patrón unificado de convenios"
echo ""
echo "**Generado:** $(date '+%Y-%m-%d %H:%M')"
echo ""
echo "| | |"
echo "|---|---|"
echo "| ❌ HARD (title sin patrón alguno) | $HARD |"
echo "| ⚠️ WARN (notaEditorial / mejorable) | $WARN |"
echo ""
echo "## notaEditorial en data/convenios/*.json"
echo ""; [ -s "$TJ" ] && cat "$TJ" || echo "_Todos con notaEditorial._"
echo ""
echo "## Fórmula ganadora en titles convenio-*.html"
echo ""; [ -s "$TT" ] && cat "$TT" || echo "_Todos siguen el patrón._"
echo ""
echo "_Nota: longitud de nombres de grupos en JSON = revisión humana (heterogéneo, no se asevera)._"
} > "$OUT"

rm -f "$TJ" "$TT"
echo "sj-convenios-patron :: HARD=$HARD WARN=$WARN → patron-convenios.md"
[ $HARD -eq 0 ] && exit 0 || exit 1
