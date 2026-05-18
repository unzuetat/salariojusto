#!/usr/bin/env bash
# sj-tanda-preflight · Gate pre-Tanda GSC. Para cada URL candidata verifica:
#   - HTTP 200 en vivo            (protocolo #6 — no quemar cuota en 404)
#   - presente en sitemap.xml     (protocolo #9 — lección Tanda F)
#   - title en vivo == title repo (protocolo #10 — el cambio ya está desplegado)
# El dedup contra GSC_STATUS.md (protocolo #7) lo hace el agente leyendo MC: no
# es mecanizable aquí (MC no es accesible desde bash). Este script reporta lo
# mecánico; el comando recuerda el paso MC.
#
# Uso:
#   scripts/audit/tanda-preflight.sh URL [URL ...]
#   scripts/audit/tanda-preflight.sh < urls.txt        (una URL por línea)
set -u
cd "$(dirname "$0")/../.." || exit 2
ROOT="$(pwd)"

URLS=()
if [ "$#" -gt 0 ]; then URLS=("$@"); else while IFS= read -r l; do [ -n "$l" ] && URLS+=("$l"); done; fi
if [ "${#URLS[@]}" -eq 0 ]; then
  echo "uso: tanda-preflight.sh URL [URL...]  |  ... < urls.txt" >&2
  echo "(sin URLs → nada que verificar)" >&2
  exit 2
fi

FAIL=0
printf '%-52s %-6s %-9s %s\n' "SLUG" "HTTP" "SITEMAP" "TITLE"
printf '%s\n' "------------------------------------------------------------------------"
for u in "${URLS[@]}"; do
  case "$u" in http*) ;; *) u="https://salariojusto.es/${u#/}";; esac
  slug="${u#https://salariojusto.es/}"
  code=$(curl -s -o /dev/null -w "%{http_code}" -L --max-time 12 "$u" 2>/dev/null)
  insite="no"; grep -qF "<loc>$u</loc>" "$ROOT/sitemap.xml" 2>/dev/null && insite="sí"
  tv=$(curl -s -L --max-time 12 "$u" 2>/dev/null | tr '\n' ' ' | grep -oiE "<title>[^<]*</title>" | head -1 | sed -E 's/<\/?[Tt][Ii][Tt][Ll][Ee]>//g; s/^ +| +$//g')
  tl=""
  [ -f "$ROOT/$slug" ] && tl=$(grep -oiE "<title>[^<]*</title>" "$ROOT/$slug" | head -1 | sed -E 's/<\/?[Tt][Ii][Tt][Ll][Ee]>//g; s/^ +| +$//g')
  tstat="OK"; [ "$tv" != "$tl" ] && tstat="≠ repo"
  bad=0
  [ "$code" != "200" ] && bad=1
  [ "$insite" != "sí" ] && bad=1
  [ "$tstat" != "OK" ] && bad=1
  [ $bad -eq 1 ] && FAIL=$((FAIL+1))
  mark=$([ $bad -eq 1 ] && echo "❌" || echo "✅")
  printf '%-52s %-6s %-9s %s %s\n' "${slug:0:52}" "$code" "$insite" "$tstat" "$mark"
done
echo "------------------------------------------------------------------------"
echo "sj-tanda-preflight :: $((${#URLS[@]}-FAIL))/${#URLS[@]} OK · $FAIL con problema"
echo "↳ Falta el paso humano/agente: dedup contra GSC_STATUS.md en MC (protocolo #7)."
[ $FAIL -eq 0 ] && exit 0 || exit 1
