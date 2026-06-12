#!/usr/bin/env bash
# sj-comparativas · Verifica que el "N" de las comparativas entre provincias del
# sector (callouts "X frente a otras provincias del sector") es coherente con la
# ÚNICA fuente de verdad: analisis/dataset-{sector}.json.
#
# Política (decisión usuario, corpus auditado = subset):
#   El corpus comparativo es un subconjunto curado con cifras verificadas. Los N
#   válidos que pueden aparecer en un callout son exactamente:
#     - allCount        (total provincias del dataset)        → ranking de jornada
#     - comparableCount (con comparable_salary)               → ranking salarial
#     - allCount - 1    (las "otras" provincias auditadas)    → intro + lista
#   Cualquier "Nª de M" o "M provincias" con M fuera de ese conjunto = drift.
#
# Además:
#   - La lista "Provincias comparadas / Comparado con: ..." debe tener allCount-1 nombres.
#   - Avisa de landings del sector (en sitemap) que están FUERA del corpus (no en
#     el dataset): no participan en ninguna comparativa → revisión humana.
#
# Determinista. Exit 1 si hay HARD. Genérico para cualquier analisis/dataset-*.json.
set -u
cd "$(dirname "$0")/../.." || exit 2
ROOT="$(pwd)"; OUT="$ROOT/comparativas.md"

HARD=0; WARN=0
TH=$(mktemp); TW=$(mktemp); TI=$(mktemp)

for ds in "$ROOT"/analisis/dataset-*.json; do
  [ -f "$ds" ] || continue
  sector=$(basename "$ds" .json); sector=${sector#dataset-}

  # Fuente de verdad: counts + lista de landings del corpus.
  counts=$(node -e "
    const d=require('$ds');
    const all=d.provincias.length;
    const cmp=d.provincias.filter(p=>p.comparable_salary).length;
    console.log(all+' '+cmp);
  " 2>/dev/null)
  [ -z "$counts" ] && { echo "- ⚠️ dataset-$sector no parseable" >> "$TW"; WARN=$((WARN+1)); continue; }
  ALL=${counts% *}; CMP=${counts#* }
  CORPUS_LANDINGS=$(node -e "const d=require('$ds');process.stdout.write(d.provincias.map(p=>p.landing).join('\n'))" 2>/dev/null)
  VALID="$ALL $CMP $((ALL-1))"
  echo "- **$sector**: dataset=$ALL provincias, comparables=$CMP → N válidos: {$(echo $VALID | tr ' ' ',' )}" >> "$TI"

  # Recorrer landings del sector que tengan callout comparativo.
  for h in "$ROOT"/convenio-"$sector"-*.html "$ROOT"/convenio-"$sector".html; do
    [ -f "$h" ] || continue
    b=$(basename "$h")
    # Región del callout: del H2 "frente a otras provincias" al footer "pilar sectorial".
    region=$(awk '/frente a otras provincias del sector/{f=1} f{print} /pilar sectorial/{if(f)exit}' "$h")
    [ -z "$region" ] && continue

    # 1) Todos los "Nª de M" (ranking, exige ª) y "M provincias" dentro de la región.
    while IFS= read -r m; do
      [ -z "$m" ] && continue
      case " $VALID " in
        *" $m "*) : ;;
        *) HARD=$((HARD+1)); echo "- ❌ \`$b\` N=$m fuera del corpus (válidos: $VALID)" >> "$TH" ;;
      esac
    done < <(printf '%s\n' "$region" | grep -oE "[0-9]+ª(-[0-9]+ª)? de [0-9]+" | grep -oE "de [0-9]+$" | grep -oE "[0-9]+")
    while IFS= read -r m; do
      [ -z "$m" ] && continue
      case " $VALID " in
        *" $m "*) : ;;
        *) HARD=$((HARD+1)); echo "- ❌ \`$b\` \"$m provincias\" fuera del corpus (válidos: $VALID)" >> "$TH" ;;
      esac
    done < <(printf '%s\n' "$region" | grep -oE "[0-9]+ provincias" | grep -oE "^[0-9]+")

    # 2) Lista "Provincias comparadas:" / "Comparado con:" → debe tener allCount-1 nombres.
    lista=$(printf '%s\n' "$region" | grep -oiE "(Provincias comparadas|Comparado con): [^.<]+" | head -1 | sed -E 's/.*(comparadas|con): //I')
    if [ -n "$lista" ]; then
      n=$(printf '%s' "$lista" | awk -F',' '{print NF}')
      if [ "$n" -ne "$((ALL-1))" ]; then
        HARD=$((HARD+1)); echo "- ❌ \`$b\` lista de provincias comparadas tiene $n nombres, esperados $((ALL-1))" >> "$TH"
      fi
    fi
  done

  # 3) Landings del sector en sitemap pero FUERA del corpus (sin comparativa auditada).
  for s in $(grep -oE "convenio-$sector-[a-z-]+\.html" "$ROOT/sitemap.xml" 2>/dev/null | sort -u); do
    case "$CORPUS_LANDINGS" in
      *"$s"*) : ;;
      *) WARN=$((WARN+1)); echo "- ⚠️ \`$s\` en sitemap pero fuera del corpus comparativo de $sector (no participa en comparativas)" >> "$TW" ;;
    esac
  done
done

{
echo "# Comparativas entre provincias — coherencia de N"
echo ""
echo "**Generado:** $(date '+%Y-%m-%d %H:%M')  ·  Fuente de verdad: \`analisis/dataset-{sector}.json\`"
echo ""
echo "| | |"
echo "|---|---|"
echo "| ❌ HARD (N incoherente con el corpus) | $HARD |"
echo "| ⚠️ WARN (landing fuera del corpus) | $WARN |"
echo ""
echo "## Corpus por sector"
echo ""; cat "$TI"
echo ""
echo "## ❌ Incoherencias de N (HARD)"
echo ""; [ -s "$TH" ] && cat "$TH" || echo "_Todos los N coinciden con el dataset._"
echo ""
echo "## ⚠️ Fuera del corpus (revisión humana)"
echo ""; [ -s "$TW" ] && cat "$TW" || echo "_Ninguna._"
echo ""
echo "_Al cambiar el dataset: re-correr \`node scripts/generate-callouts.js\` regenera los callouts AUTO (seguro: solo toca el bloque entre marcadores, no fuentes ni sitemap). Los MANUAL_OVERRIDE (Madrid, Bizkaia) se actualizan a mano._"
} > "$OUT"

rm -f "$TH" "$TW" "$TI"
echo "sj-comparativas :: HARD=$HARD WARN=$WARN → comparativas.md"
[ $HARD -eq 0 ] && exit 0 || exit 1
