#!/usr/bin/env bash
# sj-kit-inventario · Estado de redacción del Kit del trabajador.
# Cuenta palabras del cuerpo de cada plantilla-*.html (+ hub) y marca esqueletos.
# Determinista. Exit 0 siempre (es un inventario, no un gate).
set -u
cd "$(dirname "$0")/../.." || exit 2
ROOT="$(pwd)"; OUT="$ROOT/kit-inventario.md"
UMBRAL=800   # < UMBRAL palabras de cuerpo ≈ esqueleto sin redactar

TR=$(mktemp); ESQ=0; TOT=0
for h in "$ROOT"/plantilla-*.html "$ROOT"/plantillas-transparencia-retributiva-2026.html "$ROOT"/pedir-banda-salarial-empresa-2026.html; do
  [ -f "$h" ] || continue
  b=$(basename "$h")
  # cuerpo aproximado: quitar <script>/<style> y tags
  w=$(awk 'BEGIN{IGNORECASE=1} {gsub(/<script[^>]*>.*<\/script>/,""); gsub(/<style[^>]*>.*<\/style>/,""); print}' "$h" \
       | sed -E 's/<[^>]+>/ /g' | tr -s ' \t\n' ' ' | wc -w | tr -d ' ')
  TOT=$((TOT+1))
  if [ "$w" -lt "$UMBRAL" ]; then
    ESQ=$((ESQ+1)); echo "| \`$b\` | $w | ❌ posible esqueleto (<$UMBRAL) |" >> "$TR"
  else
    echo "| \`$b\` | $w | ✅ redactada |" >> "$TR"
  fi
done

{
echo "# Inventario del Kit del trabajador"
echo ""
echo "**Generado:** $(date '+%Y-%m-%d %H:%M') · Umbral esqueleto: <$UMBRAL palabras de cuerpo"
echo ""
echo "**Total:** $TOT · **Posibles esqueletos:** $ESQ · **Redactadas:** $((TOT-ESQ))"
echo ""
echo "| Página | Palabras cuerpo | Estado |"
echo "|---|---|---|"
sort "$TR"
echo ""
if [ "$ESQ" -eq 0 ]; then
  echo "> ✅ Ninguna esqueleto. **Si la memoria del proyecto dice \"solo #1 redactada\", está"
  echo "> desactualizada** — actualizarla (project_kit_plantillas_pendientes)."
else
  echo "> $ESQ pendientes de redactar. Priorizar las que mapeen a la demanda de la Directiva 7-jun."
fi
} > "$OUT"

rm -f "$TR"
echo "sj-kit-inventario :: total=$TOT esqueletos=$ESQ → kit-inventario.md"
