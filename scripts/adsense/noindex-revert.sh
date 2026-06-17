#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# adsense/noindex-revert.sh
#
# Deshace el noindex aplicado por noindex-apply.sh. Quita el meta tag de cada
# URL del log que NO tenga fecha_revert (en este caso revierte todas las que
# tengan noindex activo).
#
# Tras correr esto:
# 1. Verificar el diff (debe ser exactamente la eliminación del meta robots).
# 2. Commit + push + deploy.
# 3. En GSC, pedir indexación de las URLs revertidas (tanda de ~10/día).
# 4. Marcar `fecha_revert` en data/adsense-noindex-log.csv para auditoría.
#
# Uso:
#   bash scripts/adsense/noindex-revert.sh           # revierte todas las activas
#   bash scripts/adsense/noindex-revert.sh --dry-run # solo lista qué tocaría
#   bash scripts/adsense/noindex-revert.sh <slug>    # revierte solo ese slug
# ─────────────────────────────────────────────────────────────────────────────
set -u
cd "$(dirname "$0")/../.." || exit 2
ROOT="$(pwd)"
LOG="$ROOT/data/adsense-noindex-log.csv"
DRY=0; SINGLE=""
case "${1:-}" in
  --dry-run) DRY=1 ;;
  "" ) ;;
  *) SINGLE="$1" ;;
esac

[ -f "$LOG" ] || { echo "ERROR: $LOG no existe"; exit 1; }

REVERTED=0; SKIPPED=0; MISSING=0
while IFS=',' read -r slug fecha_app motivo cat score imp fecha_rev notas; do
  [ "$slug" = "slug" ] && continue
  [ -z "$slug" ] && continue
  [ -n "$SINGLE" ] && [ "$slug" != "$SINGLE" ] && continue

  f="$ROOT/$slug"
  if [ ! -f "$f" ]; then
    echo "⚠️  $slug — archivo no existe, skip"
    MISSING=$((MISSING+1))
    continue
  fi

  if ! grep -q 'name="robots" content="noindex' "$f"; then
    echo "  ⏭️  $slug ya está sin noindex"
    SKIPPED=$((SKIPPED+1))
    continue
  fi

  if [ "$DRY" = "1" ]; then
    echo "  [DRY] $slug — quitaría noindex"
    REVERTED=$((REVERTED+1))
    continue
  fi

  # Borrar la línea con noindex (preservando indentación)
  sed -i '' '/<meta name="robots" content="noindex,nofollow">/d' "$f"
  echo "  ✅ $slug — noindex eliminado"
  REVERTED=$((REVERTED+1))
done < "$LOG"

echo ""
echo "Resumen: revertidos=$REVERTED skip(ya sin noindex)=$SKIPPED missing=$MISSING"
[ "$DRY" = "1" ] && echo "(dry-run · no se ha tocado ningún archivo)"
[ "$DRY" = "0" ] && [ "$REVERTED" -gt 0 ] && echo ""
[ "$DRY" = "0" ] && [ "$REVERTED" -gt 0 ] && echo "⏭️  Próximo paso: actualizar fecha_revert en data/adsense-noindex-log.csv para auditoría"
