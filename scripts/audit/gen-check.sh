#!/usr/bin/env bash
# sj-gen-check · Arnés anti-regresión de los generadores (Prioridad 1).
#
# Verifica, en una COPIA AISLADA (git worktree de HEAD — NUNCA toca tu árbol),
# que ejecutar los generadores NO:
#   (a) reintroduce IBM Plex Mono en ninguna página (regresión PR#22)
#   (b) reduce el número de URLs del sitemap.xml
#
# Es el gate de "¿el fix de Prioridad 1 funcionó?". Empareja con /goal.
#
# Uso:  scripts/audit/gen-check.sh --run     (ejecuta; sin --run solo explica)
set -u
cd "$(dirname "$0")/../.." || exit 2
ROOT="$(pwd)"

if [ "${1:-}" != "--run" ]; then
  cat <<EOF
sj-gen-check (dry — pasa --run para ejecutar)

Hará, en un git worktree temporal de HEAD (aislado, sin tocar este árbol):
  1. Censo PRE: páginas con IBM Plex Mono + nº <loc> en sitemap.xml
  2. node scripts/generate-*.js  (en la copia)
  3. Censo POST + diff
  4. Limpieza del worktree
Veredicto: exit 1 si aparece IBM Plex Mono nuevo o el sitemap pierde URLs.
EOF
  exit 0
fi

command -v git  >/dev/null || { echo "git no disponible"; exit 2; }
command -v node >/dev/null || { echo "node no disponible — no puedo correr generadores"; exit 2; }

WT=$(mktemp -d)
cleanup(){ git worktree remove --force "$WT" >/dev/null 2>&1; rm -rf "$WT" 2>/dev/null; }
trap cleanup EXIT
if ! git worktree add --detach "$WT" HEAD >/dev/null 2>&1; then
  echo "no pude crear el worktree (¿repo git limpio?). Abortado, tu árbol intacto."; exit 2
fi

ibm_count(){ grep -lE "IBM[+ ]Plex[+ ]Mono" "$1"/*.html 2>/dev/null | wc -l | tr -d ' '; }
ibm_list(){  grep -lE "IBM[+ ]Plex[+ ]Mono" "$1"/*.html 2>/dev/null | xargs -n1 basename 2>/dev/null | sort; }
loc_count(){ grep -c "<loc>" "$1/sitemap.xml" 2>/dev/null || echo 0; }

PRE_IBM=$(ibm_count "$WT"); PRE_LOC=$(loc_count "$WT")
PRE_LIST=$(ibm_list "$WT")

GENLOG=$(mktemp); GERR=0
for g in generate-convenios generate-plantillas generate-pages generate-callouts inject-seo-tags; do
  if [ -f "$WT/scripts/$g.js" ]; then
    ( cd "$WT" && node "scripts/$g.js" ) >>"$GENLOG" 2>&1 || { echo "✗ falló $g.js" >>"$GENLOG"; GERR=1; }
  fi
done

POST_IBM=$(ibm_count "$WT"); POST_LOC=$(loc_count "$WT")
POST_LIST=$(ibm_list "$WT")
NEW_IBM=$(comm -13 <(echo "$PRE_LIST") <(echo "$POST_LIST") 2>/dev/null)

HARD=0
echo "── sj-gen-check ─────────────────────────────────────────"
echo "IBM Plex Mono — antes: $PRE_IBM · después: $POST_IBM"
if [ -n "$NEW_IBM" ]; then
  HARD=1; echo "❌ páginas que GANARON IBM Plex Mono al regenerar:"; echo "$NEW_IBM" | sed 's/^/   - /'
else
  echo "✅ ninguna página nueva con IBM Plex Mono"
fi
echo "sitemap <loc> — antes: $PRE_LOC · después: $POST_LOC"
if [ "$POST_LOC" -lt "$PRE_LOC" ]; then
  HARD=1; echo "❌ el sitemap PERDIÓ $((PRE_LOC-POST_LOC)) URL(s) al regenerar"
else
  echo "✅ el sitemap no pierde URLs"
fi
[ $GERR -eq 1 ] && { echo "⚠️ algún generador falló — log:"; tail -5 "$GENLOG" | sed 's/^/   /'; }
echo "─────────────────────────────────────────────────────────"
echo "(worktree temporal eliminado; tu árbol de trabajo nunca se tocó)"
rm -f "$GENLOG"
[ $HARD -eq 0 ] && [ $GERR -eq 0 ] && { echo "VEREDICTO ✅ generadores limpios"; exit 0; }
echo "VEREDICTO ❌ regresión o fallo — Prioridad 1 NO resuelta"; exit 1
