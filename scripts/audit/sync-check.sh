#!/usr/bin/env bash
# sj-sync · Doctor de sincronización cross-máquina.
#
# Caza las trampas que rompen el trabajo entre máquinas (las de hoy 4-jun):
#   ❌ HARD  main local POR DETRÁS de origin/main  → trabajas sobre base muerta
#   ❌ HARD  rama actual DIVERGE de origin/main     → mergearla revertiría prod
#   ⚠️ WARN  commits locales SIN pushear            → invisibles para otra máquina
#   ⚠️ WARN  rama local sin equivalente en origin   → idem
#
# origin/main = única fuente de verdad del CÓDIGO. Correr al ARRANCAR (antes de
# trabajar) y al CERRAR (antes de /export-mc). Determinista. Exit 1 si hay HARD.
set -u
cd "$(dirname "$0")/../.." || exit 2

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "sj-sync :: no es repo git — nada que verificar"; exit 0
fi

git fetch --quiet origin 2>/dev/null
cur=$(git branch --show-current)
HARD=0; WARN=0
OUT=""

add(){ OUT="$OUT$1
"; }

# ¿existe origin/main?
if ! git rev-parse --verify --quiet origin/main >/dev/null 2>&1; then
  echo "sj-sync :: no hay origin/main — ¿remoto sin main? abortando chequeo"; exit 0
fi

# 1) main local vs origin/main
m_behind=$(git rev-list --count main..origin/main 2>/dev/null || echo "?")
m_ahead=$(git rev-list --count origin/main..main 2>/dev/null || echo "?")
if [ "$m_behind" != "0" ] && [ "$m_behind" != "?" ]; then
  HARD=$((HARD+1)); add "❌ main local está $m_behind commits POR DETRÁS de origin/main → \`git checkout main && git pull --ff-only\` ANTES de trabajar"
fi
if [ "$m_ahead" != "0" ] && [ "$m_ahead" != "?" ]; then
  WARN=$((WARN+1)); add "⚠️ main local tiene $m_ahead commits SIN PUSHEAR a origin/main"
fi

# 2) rama actual: ¿diverge de origin/main? ¿está pusheada?
if [ -n "$cur" ] && [ "$cur" != "main" ]; then
  om_ahead=$(git rev-list --count "$cur..origin/main" 2>/dev/null || echo 0)   # prod tiene, la rama no
  b_ahead=$(git rev-list --count "origin/main..$cur" 2>/dev/null || echo 0)    # la rama tiene, prod no
  if [ "$om_ahead" != "0" ] && [ "$b_ahead" != "0" ]; then
    HARD=$((HARD+1)); add "❌ rama '$cur' DIVERGE de origin/main: prod tiene $om_ahead commits que '$cur' NO tiene (y '$cur' tiene $b_ahead). Mergearla a main revertiría prod → rebasar sobre main o rescatar selectivamente"
  fi
  if ! git rev-parse --verify --quiet "origin/$cur" >/dev/null 2>&1; then
    [ "$b_ahead" != "0" ] && { WARN=$((WARN+1)); add "⚠️ rama '$cur' NO existe en origin y tiene $b_ahead commits locales → invisibles para otra máquina hasta \`git push -u origin $cur\`"; }
  fi
fi

# 3) otras ramas locales sin pushear (informativo)
for b in $(git for-each-ref --format='%(refname:short)' refs/heads/); do
  [ "$b" = "main" ] && continue
  [ "$b" = "$cur" ] && continue
  if ! git rev-parse --verify --quiet "origin/$b" >/dev/null 2>&1; then
    WARN=$((WARN+1)); add "⚠️ rama local '$b' sin equivalente en origin (sin pushear)"
  fi
done

echo "== sj-sync :: doctor de sincronización cross-máquina =="
echo "Rama actual: ${cur:-(detached)}  ·  main: -$m_behind/+$m_ahead vs origin/main"
[ -n "$OUT" ] && printf '%s' "$OUT" || echo "✅ Todo alineado con producción (origin/main). OK para trabajar."
echo "sj-sync :: HARD=$HARD WARN=$WARN"
[ $HARD -eq 0 ] && exit 0 || exit 1
