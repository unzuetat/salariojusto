#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# adsense/noindex-apply.sh
#
# Aplica <meta name="robots" content="noindex,nofollow"> a las URLs listadas
# en data/adsense-noindex-log.csv que tengan fecha_revert vacía.
#
# Estrategia AdSense temporal: reduce el % de páginas thin del sitio
# (de 36% a ~10%) sin perder tráfico significativo (~308 imp/3m total).
#
# La pareja /noindex-revert.sh deshace el cambio en 1 comando.
#
# Uso:
#   bash scripts/adsense/noindex-apply.sh           # aplica a todas las pendientes
#   bash scripts/adsense/noindex-apply.sh --dry-run # solo lista qué tocaría
# ─────────────────────────────────────────────────────────────────────────────
set -u
cd "$(dirname "$0")/../.." || exit 2
ROOT="$(pwd)"
LOG="$ROOT/data/adsense-noindex-log.csv"
META_TAG='<meta name="robots" content="noindex,nofollow">'
DRY=0; [ "${1:-}" = "--dry-run" ] && DRY=1

[ -f "$LOG" ] || { echo "ERROR: $LOG no existe"; exit 1; }

APPLIED=0; SKIPPED=0; MISSING=0
while IFS=',' read -r slug fecha_app motivo cat score imp fecha_rev notas; do
  [ "$slug" = "slug" ] && continue          # header
  [ -z "$slug" ] && continue                # vacío
  [ -n "$fecha_rev" ] && { SKIPPED=$((SKIPPED+1)); continue; }  # ya revertido

  f="$ROOT/$slug"
  if [ ! -f "$f" ]; then
    echo "⚠️  $slug — archivo no existe, skip"
    MISSING=$((MISSING+1))
    continue
  fi

  if grep -q 'name="robots" content="noindex' "$f"; then
    echo "  ⏭️  $slug ya tiene noindex"
    SKIPPED=$((SKIPPED+1))
    continue
  fi

  if [ "$DRY" = "1" ]; then
    echo "  [DRY] $slug — aplicaría noindex (score=$score, imp=$imp)"
    APPLIED=$((APPLIED+1))
    continue
  fi

  # Insertar después de <meta name="viewport"...> (siempre presente en este sitio)
  if grep -q '<meta name="viewport"' "$f"; then
    # macOS sed requiere -i ''
    sed -i '' '/<meta name="viewport"/a\
  <meta name="robots" content="noindex,nofollow">
' "$f"
    echo "  ✅ $slug — noindex aplicado"
    APPLIED=$((APPLIED+1))
  else
    echo "  ⚠️  $slug — no encontró <meta viewport>, skip"
    MISSING=$((MISSING+1))
  fi
done < "$LOG"

echo ""
echo "Resumen: aplicados=$APPLIED skip(ya estaba o revertido)=$SKIPPED missing=$MISSING"
[ "$DRY" = "1" ] && echo "(dry-run · no se ha tocado ningún archivo)"
