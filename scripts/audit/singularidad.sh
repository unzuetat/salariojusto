#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# sj-singularidad · Mide solapamiento de contenido entre páginas.
#
# Convierte el genérico "Google dice contenido de poco valor" en datos:
# qué % de las FRASES SUSTANTIVAS del cuerpo de cada página aparecen también
# en otras páginas (boilerplate / contenido producido en masa). Es la causa
# raíz del 2º rechazo AdSense (ver memoria reference_adsense + GSC_STATUS 30-abr).
#
# Método (determinista):
#   1. Extrae texto visible (quita <script>/<style>/<!-- -->/tags/entidades).
#   2. Trocea en frases; normaliza (minúsculas, espacios); descarta < MINLEN
#      (filtra nav/footer/labels — solo frases de contenido real).
#   3. DF = en cuántas páginas aparece cada frase. shared = frase en ≥2 págs.
#   4. Por página: boilerplate_ratio = frases compartidas / frases totales.
#   5. Lista los bloques compartidos más frecuentes (qué diferenciar primero).
#
# Grupos: convenios (convenio-*.html) y kit (plantilla-* + hub + pedir-banda).
# Dependencia: perl (ships con macOS/Linux).
#
# Exit 1 si alguna página supera UMBRAL de boilerplate (gate-able con /goal).
# Uso: scripts/audit/singularidad.sh            # umbral 0.65 por defecto
#      scripts/audit/singularidad.sh 0.50       # umbral custom
# ─────────────────────────────────────────────────────────────────────────────
set -u
cd "$(dirname "$0")/../.." || exit 2
ROOT="$(pwd)"; OUT="$ROOT/singularidad.md"
UMBRAL="${1:-0.65}"
MINLEN=45            # nº mínimo de caracteres para considerar una frase "de contenido"
command -v perl >/dev/null || { echo "perl no disponible (necesario)"; exit 2; }

# Conjunto analizado: convenios + kit (el inventario plantillado que AdSense juzga)
FILES=$(ls "$ROOT"/convenio-*.html "$ROOT"/plantilla-*.html \
           "$ROOT"/plantillas-transparencia-retributiva-2026.html \
           "$ROOT"/pedir-banda-salarial-empresa-2026.html 2>/dev/null)

grupo_de(){ case "$(basename "$1")" in
  convenio-*) echo "convenios";; *) echo "kit";; esac; }

LINES=$(mktemp)   # "slug<TAB>frase_normalizada"  (frases únicas por página)
for f in $FILES; do
  [ -f "$f" ] || continue
  slug=$(basename "$f")
  perl -0777 -ne '
    s/<script\b.*?<\/script>//gis; s/<style\b.*?<\/style>//gis;
    s/<!--.*?-->//gs; s/<[^>]+>/ /g; s/&[a-z]+;/ /gi;
    s/[ \t]+/ /g;
    for my $s (split /(?<=[.!?])\s+|\n/) {
      $s =~ s/^\s+|\s+$//g; $s = lc $s;
      print "$s\n" if length($s) >= '"$MINLEN"';
    }
  ' "$f" | sort -u | sed "s|^|$slug\t|" >> "$LINES"
done

NPAGES=$(cut -f1 "$LINES" | sort -u | wc -l | tr -d ' ')

# DF por frase (en cuántas páginas distintas aparece)
DF=$(mktemp)
cut -f2 "$LINES" | sort | uniq -c | sort -rn > "$DF"

# Por página: total frases vs frases compartidas (DF>=2)
# Construir set de frases compartidas
SHARED=$(mktemp)
awk '$1+0>=2{ $1=""; sub(/^ /,""); print }' "$DF" | sort -u > "$SHARED"

REP=$(mktemp)
for slug in $(cut -f1 "$LINES" | sort -u); do
  tot=$(awk -F'\t' -v s="$slug" '$1==s{c++}END{print c+0}' "$LINES")
  sh=$(awk -F'\t' -v s="$slug" '$1==s{print $2}' "$LINES" | grep -Fxf "$SHARED" 2>/dev/null | wc -l | tr -d ' ')
  [ "$tot" -eq 0 ] && ratio="0.00" || ratio=$(awk -v a="$sh" -v b="$tot" 'BEGIN{printf "%.2f",a/b}')
  printf '%s\t%s\t%s\t%s\t%s\n' "$(grupo_de "$ROOT/$slug")" "$slug" "$tot" "$sh" "$ratio" >> "$REP"
done

HARD=$(awk -F'\t' -v u="$UMBRAL" '$5+0>u{c++}END{print c+0}' "$REP")

{
echo "# Singularidad de contenido — solapamiento entre páginas"
echo ""
echo "**Generado:** $(date '+%Y-%m-%d %H:%M') · Páginas: $NPAGES · Umbral boilerplate: >$UMBRAL · MINLEN frase: $MINLEN car"
echo ""
echo "\`boilerplate_ratio\` = frases sustantivas del cuerpo que también aparecen en OTRA página / total. Alto = contenido en masa (lo que AdSense penaliza)."
echo ""
echo "| | |"
echo "|---|---|"
echo "| ❌ Páginas sobre umbral ($UMBRAL) | $HARD |"
echo "| Páginas analizadas | $NPAGES |"
echo ""
echo "## Ranking por boilerplate_ratio (peor primero)"
echo ""
echo "| Grupo | Página | Frases | Compartidas | Ratio |"
echo "|---|---|---|---|---|"
sort -t'	' -k5 -rn "$REP" | awk -F'\t' '{printf "| %s | `%s` | %s | %s | **%s** |\n",$1,$2,$3,$4,$5}'
echo ""
echo "## Bloques compartidos más frecuentes (diferenciar ESTOS primero)"
echo ""
echo "Frase · en cuántas páginas aparece (top 20 por frecuencia):"
echo ""
awk '$1+0>=3{n=$1; $1=""; sub(/^ /,""); s=$0; if(length(s)>120)s=substr(s,1,117)"…"; printf "- **(%s págs)** %s\n",n,s}' "$DF" | head -20
echo ""
echo "_Interpretación: bajar el ratio = añadir contenido único sustancial por página y diferenciar/recortar los bloques de arriba. NO re-solicitar revisión AdSense hasta que el nº de páginas sobre umbral sea 0 (o muy bajo) — ver memoria reference_adsense._"
} > "$OUT"

rm -f "$LINES" "$DF" "$SHARED" "$REP"
echo "sj-singularidad :: paginas=$NPAGES sobre_umbral($UMBRAL)=$HARD → singularidad.md"
[ "$HARD" -eq 0 ] && exit 0 || exit 1
