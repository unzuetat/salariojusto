#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# sj-invariantes · Auditoría de invariantes del sitio salariojusto.es
#
# Capa DETERMINISTA del Goal empaquetado /sj-invariantes.
# El comando .claude/commands/sj-invariantes.md corre esto e interpreta la salida.
#
# Caza el patrón de fallo recurrente del proyecto: drift silencioso
# (regresión IBM Plex Mono PR#22, huecos sitemap, footer legal ausente).
#
# Uso:
#   scripts/audit/invariantes.sh            # local-only, rápido, determinista
#   scripts/audit/invariantes.sh --net      # + verifica HTTP 200 en vivo (lento)
#
# Exit code: 0 si TODOS los checks HARD pasan; 1 si hay algún HARD fail.
# (Pensado para emparejar con /goal: "no pares hasta exit 0".)
# ─────────────────────────────────────────────────────────────────────────────
set -u
cd "$(dirname "$0")/../.." || exit 2
ROOT="$(pwd)"
OUT="$ROOT/salud-invariantes.md"
NET=0
[ "${1:-}" = "--net" ] && NET=1

# Allowlist: HTMLs intencionadamente FUERA del sitemap (compliance, no SEO).
EXCLUDE_SITEMAP="aviso-legal.html contacto.html privacidad.html"
# Páginas que NO requieren los 3 enlaces legales en su footer (son las legales mismas).
EXCLUDE_FOOTER="aviso-legal.html contacto.html privacidad.html"

HARD=0; WARN=0
TMPH=$(mktemp); TMPW=$(mktemp); TMPI=$(mktemp)

in_list() { case " $2 " in *" $1 "*) return 0;; *) return 1;; esac; }

# ── CHECK 1 (HARD): regresión IBM Plex Mono (PR#22) ──────────────────────────
IBM=$(grep -lE "IBM[+ ]Plex[+ ]Mono" "$ROOT"/*.html 2>/dev/null | xargs -n1 basename 2>/dev/null)
if [ -n "$IBM" ]; then
  N=$(echo "$IBM" | wc -l | tr -d ' ')
  HARD=$((HARD+1))
  { echo "### ❌ HARD · Regresión IBM Plex Mono (PR#22) — $N página(s)";
    echo "Estas páginas vuelven a embeber IBM Plex Mono (deshace la migración sans-serif del PR#22):";
    echo "$IBM" | sed 's/^/- /'; echo ""; } >> "$TMPH"
fi

# ── CHECK 2 (HARD): <loc> de sitemap sin fichero servible ────────────────────
while IFS= read -r loc; do
  path="${loc#https://salariojusto.es/}"
  case "$path" in
    "")        f="index.html" ;;
    */)        f="${path}index.html" ;;
    *)         f="$path" ;;
  esac
  if [ ! -f "$ROOT/$f" ]; then
    HARD=$((HARD+1))
    echo "- \`$loc\` → esperaba \`$f\` (no existe)" >> "$TMPH.loc"
  fi
done < <(grep -oE "<loc>[^<]+</loc>" "$ROOT/sitemap.xml" 2>/dev/null | sed -E 's/<\/?loc>//g')
if [ -f "$TMPH.loc" ]; then
  { echo "### ❌ HARD · Sitemap apunta a ficheros inexistentes";
    cat "$TMPH.loc"; echo ""; } >> "$TMPH"
  rm -f "$TMPH.loc"
fi

# ── CHECK 3 (HARD): footer legal (Privacidad/Aviso legal/Contacto) ───────────
MISSF=""
for h in "$ROOT"/*.html; do
  b=$(basename "$h")
  case "$b" in google*.html) continue;; esac   # stubs verificación GSC, no son páginas
  in_list "$b" "$EXCLUDE_FOOTER" && continue
  miss=""
  grep -q '/privacidad.html'  "$h" || miss="$miss privacidad"
  grep -q '/aviso-legal.html' "$h" || miss="$miss aviso-legal"
  grep -q '/contacto.html'    "$h" || miss="$miss contacto"
  [ -n "$miss" ] && MISSF="$MISSF\n- \`$b\` falta:$miss"
done
if [ -n "$MISSF" ]; then
  HARD=$((HARD+1))
  { echo "### ❌ HARD · Footer legal incompleto (LSSI/RGPD/AdSense)";
    echo -e "$MISSF"; echo ""; } >> "$TMPH"
fi

# ── CHECK 4 (WARN): HTML en repo fuera del sitemap (excl. allowlist) ─────────
for h in "$ROOT"/*.html; do
  b=$(basename "$h")
  case "$b" in google*.html) continue;; esac   # stub verificación GSC
  in_list "$b" "$EXCLUDE_SITEMAP" && continue
  # index.html se sirve como raíz "/" — cuenta si está el <loc> raíz
  if [ "$b" = "index.html" ]; then
    grep -qE "<loc>https://salariojusto\.es/</loc>" "$ROOT/sitemap.xml" 2>/dev/null && continue
  fi
  grep -qE "<loc>https://salariojusto\.es/${b}</loc>" "$ROOT/sitemap.xml" 2>/dev/null && continue
  WARN=$((WARN+1))
  echo "- \`$b\` no está en sitemap.xml" >> "$TMPW"
done

# ── CHECK 5 (WARN): landing en sitemap sin referencia en llms.txt ───────────
while IFS= read -r loc; do
  path="${loc#https://salariojusto.es/}"
  case "$path" in ""|*/) continue;; esac          # solo ficheros .html de contenido
  case "$path" in *.html) ;; *) continue;; esac
  grep -qF "$path" "$ROOT/llms.txt" 2>/dev/null && continue
  WARN=$((WARN+1))
  echo "- \`$path\` en sitemap pero no en llms.txt" >> "$TMPI"
done < <(grep -oE "<loc>[^<]+</loc>" "$ROOT/sitemap.xml" 2>/dev/null | sed -E 's/<\/?loc>//g')

# ── CHECK 6 (WARN, opcional --net): HTTP 200 en vivo ─────────────────────────
NETN=0
if [ "$NET" = "1" ]; then
  while IFS= read -r loc; do
    code=$(curl -s -o /dev/null -w "%{http_code}" -L --max-time 10 "$loc" 2>/dev/null)
    if [ "$code" != "200" ]; then
      NETN=$((NETN+1))
      echo "- \`$loc\` → HTTP $code" >> "$TMPW.net"
    fi
  done < <(grep -oE "<loc>[^<]+</loc>" "$ROOT/sitemap.xml" 2>/dev/null | sed -E 's/<\/?loc>//g')
fi

# ── Informe ──────────────────────────────────────────────────────────────────
{
echo "# Salud de invariantes — salariojusto.es"
echo ""
echo "**Generado:** $(date '+%Y-%m-%d %H:%M') · **Modo:** $([ $NET = 1 ] && echo 'local + red' || echo 'local (rápido)')"
echo ""
echo "| | Resultado |"
echo "|---|---|"
echo "| ❌ Fallos HARD (bugs reales) | $HARD |"
echo "| ⚠️ Warnings (revisar) | $WARN |"
[ $NET = 1 ] && echo "| 🌐 URLs no-200 en vivo | $NETN |"
echo ""
echo "**Veredicto:** $([ $HARD -eq 0 ] && echo '✅ invariantes HARD OK' || echo '❌ hay invariantes rotos — ver abajo')"
echo ""
echo "## ❌ Fallos HARD"
echo ""
[ -s "$TMPH" ] && cat "$TMPH" || echo "_Ninguno._"
echo ""
echo "## ⚠️ Warnings — fuera de sitemap"
echo ""
[ -s "$TMPW" ] && cat "$TMPW" || echo "_Ninguno._"
echo ""
echo "## ⚠️ Warnings — cobertura llms.txt"
echo ""
[ -s "$TMPI" ] && cat "$TMPI" || echo "_Ninguno._"
if [ $NET = 1 ]; then
  echo ""
  echo "## 🌐 HTTP no-200 en vivo"
  echo ""
  [ -f "$TMPW.net" ] && cat "$TMPW.net" || echo "_Todas 200._"
fi
echo ""
echo "---"
echo "_Generado por \`scripts/audit/invariantes.sh\` · capa determinista de \`/sj-invariantes\`._"
} > "$OUT"

rm -f "$TMPH" "$TMPW" "$TMPI" "$TMPW.net" 2>/dev/null

echo "sj-invariantes :: HARD=$HARD WARN=$WARN $([ $NET = 1 ] && echo "NET_NO200=$NETN")"
echo "Informe: salud-invariantes.md"
[ $HARD -eq 0 ] && exit 0 || exit 1
