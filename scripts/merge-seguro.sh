#!/usr/bin/env bash
# merge-seguro.sh — mergea un PR sólo si es seguro, y comprueba que producción
# acaba sirviendo exactamente lo que se mergeó.
#
#   scripts/merge-seguro.sh <nº PR>
#   scripts/merge-seguro.sh <nº PR> --dry    (sólo comprueba, no mergea)
#
# Nace de dos incidentes con el mismo síntoma —producción sirviendo algo
# distinto de lo aprobado, sin ningún error visible— y causas distintas:
#   · 17-sep-2026 (PR #106): el merge no disparó deploy. HTTP 200 con la
#     versión vieja durante 20 h.
#   · 21-sep-2026 (PR #109): el squash sólo incorporó 1 de los 5 commits.
#     Deploy correcto, contenido incompleto.
#
# Por eso comprueba ANTES (que el PR vea todos los commits) y DESPUÉS (que la
# web pública sirva byte a byte lo que hay en main).

set -uo pipefail

PROD="https://salariojusto.es"
PR="${1:-}"
DRY=""; [ "${2:-}" = "--dry" ] && DRY=1

rojo()  { printf '\033[31m%s\033[0m\n' "$*"; }
verde() { printf '\033[32m%s\033[0m\n' "$*"; }
ambar() { printf '\033[33m%s\033[0m\n' "$*"; }

if [ -z "$PR" ]; then
  echo "Uso: scripts/merge-seguro.sh <nº PR> [--dry]"
  echo "Ejemplo: scripts/merge-seguro.sh 111"
  exit 64
fi

command -v gh >/dev/null || { rojo "Falta la CLI 'gh'."; exit 69; }

echo "═══ PR #$PR ═══"

# ── 0 · Datos del PR ─────────────────────────────────────────────────────────
DATOS=$(gh pr view "$PR" --json state,headRefName,baseRefName,title,mergeable 2>/dev/null) || {
  rojo "No se puede leer el PR #$PR."; exit 69; }
ESTADO=$(printf '%s' "$DATOS" | python3 -c 'import json,sys;print(json.load(sys.stdin)["state"])')
RAMA=$(printf   '%s' "$DATOS" | python3 -c 'import json,sys;print(json.load(sys.stdin)["headRefName"])')
BASE=$(printf   '%s' "$DATOS" | python3 -c 'import json,sys;print(json.load(sys.stdin)["baseRefName"])')
TITULO=$(printf '%s' "$DATOS" | python3 -c 'import json,sys;print(json.load(sys.stdin)["title"])')
echo "  $TITULO"
echo "  $RAMA → $BASE · estado: $ESTADO"

[ "$ESTADO" = "OPEN" ] || { rojo "El PR no está abierto (estado: $ESTADO)."; exit 1; }

# ── 1 · ¿El PR ve todos los commits de la rama? (incidente del #109) ─────────
echo
echo "── 1 · Commits"
git fetch -q origin "$RAMA" "$BASE" 2>/dev/null
VISTOS=$(gh pr view "$PR" --json commits --jq '.commits | length')
REALES=$(git rev-list --count "origin/$BASE..origin/$RAMA" 2>/dev/null || echo "?")
echo "  el PR ve:        $VISTOS"
echo "  la rama tiene:   $REALES"
if [ "$VISTOS" != "$REALES" ]; then
  rojo "  ✗ ABORTADO — el squash se dejaría $((REALES - VISTOS)) commit(s)."
  echo
  echo "  Qué hacer: cerrar este PR y abrir uno nuevo desde la misma rama."
  echo "  Los commits no se pierden, siguen en la rama y en local."
  exit 1
fi
verde "  ✓ coinciden"

# ── 2 · Qué páginas publicadas toca ──────────────────────────────────────────
PAGS=$(gh pr view "$PR" --json files --jq '.files[].path' | grep -E '^[^/]+\.html$' || true)
N=$(printf '%s' "$PAGS" | grep -c . || true)
echo
echo "── 2 · Páginas publicadas que toca: ${N:-0}"
printf '%s\n' "$PAGS" | sed 's/^/     /' | head -12

if [ -n "$DRY" ]; then
  echo; ambar "── modo --dry: no se mergea. Todo lo anterior está comprobado."
  exit 0
fi

# ── 3 · Merge ────────────────────────────────────────────────────────────────
echo
echo "── 3 · Mergeando (squash)"
gh pr merge "$PR" --squash --delete-branch || { rojo "  ✗ el merge falló."; exit 1; }
git checkout -q "$BASE" && git pull --ff-only -q
SHA=$(git rev-parse --short HEAD)
verde "  ✓ $BASE = $SHA"

# ── 4 · ¿Llegó todo a main? (incidente del #109) ─────────────────────────────
echo
echo "── 4 · Contenido en $BASE"
FALLO=0
for f in $PAGS; do
  [ -f "$f" ] || { rojo "     ✗ $f no está en $BASE"; FALLO=1; }
done
[ "$FALLO" = "0" ] && verde "  ✓ las ${N:-0} páginas están en $BASE"

# ── 5 · ¿Lo sirve producción? (incidente del #106) ───────────────────────────
echo
echo "── 5 · Producción · esperando al deploy"
for f in $PAGS; do
  OK=0
  for intento in 1 2 3 4 5 6; do
    sleep 20
    TMP=$(mktemp)
    CODE=$(curl -sS -o "$TMP" -w '%{http_code}' -L --max-time 30 "$PROD/$f" 2>/dev/null || echo 000)
    if [ "$CODE" = "200" ] && cmp -s "$f" "$TMP"; then
      verde "  ✓ $f — idéntico a $BASE ($(wc -c < "$f" | tr -d ' ') bytes)"
      OK=1; rm -f "$TMP"; break
    fi
    rm -f "$TMP"
  done
  if [ "$OK" = "0" ]; then
    rojo "  ✗ $f — producción NO sirve lo que hay en $BASE (http $CODE)"
    echo "     El 200 no basta: o no se ha desplegado, o se desplegó otra cosa."
    echo "     Revisar el deployment de Production en Vercel antes de reindexar."
    FALLO=1
  fi
done

echo
if [ "$FALLO" = "0" ]; then
  verde "═══ TODO CORRECTO · $BASE = $SHA y producción lo sirve ═══"
  echo "Siguiente paso: pedir reindexación en GSC de las URLs que lo merezcan (Criterio #28)."
else
  rojo "═══ REVISAR · el merge se hizo pero producción no cuadra ═══"
  exit 1
fi
