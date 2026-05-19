---
description: Auditoría integral de URLs — ¿toda página es alcanzable a clicks desde la home y ninguna se ve vacía? Determinista. Invoca con /sj-alcance.
---

# /sj-alcance — ¿se llega a todo y nada se ve vacío?

Causa documentada del rechazo AdSense (usuario, 19-may): no es solo "contenido
poco valor" en abstracto, es que existan **enlaces que llevan a páginas
huérfanas o vacías**. Regla rectora: si algo falla, que **no se note**.

1. **Correr**: `bash scripts/audit/alcance.sh` (umbrales por defecto:
   1000 car de texto visible, ≤3 clicks). Custom:
   `bash scripts/audit/alcance.sh 1500 4`.
2. **Leer** `alcance.md`. Triar:
   - ❌ **Huérfanas** = páginas reales sin ruta de clicks desde `/`. Cada una:
     o se enlaza desde un hub/menú/footer, o se quita del sitemap y se oculta.
   - ❌ **Alcanzables pero vacías** (<MINCHARS car). O se redactan, o se
     despublican + se quitan enlaces + se sacan del sitemap **antes** de
     que AdSense las vea. Esto es lo que tumba revisiones.
   - ⚠️ **En sitemap pero inalcanzables**: Google las indexará pero el usuario
     no las encuentra → señal de "directorio incompleto".
   - ⚠️ **Alcanzables fuera de sitemap**: navegables pero no pedidas indexar.
     Páginas legales (privacidad/aviso/contacto) suelen estar aquí a
     propósito; un **pilar** aquí es un agujero SEO real.
   - ⚠️ Enterradas (> MAXDEPTH clicks) / Callejones (sin salida): menores.
3. **Regla AdSense (memoria `reference_adsense`)**: NO re-solicitar revisión
   con huérfanas > 0 ni vacías > 0. Es el criterio objetivo, no el feeling.

## Emparejar con /goal

`/goal scripts/audit/alcance.sh sale con exit 0` + iterar enlazando/redactando
hasta cero. Es la línea base "presentable a AdSense" del eje navegación/vacío.

## Limitaciones conocidas

- Crawler estático: no ejecuta JS. Enlaces inyectados por `<script>` no se
  ven (los convenios se enlazan estáticamente desde `convenios.html`, ese
  patrón sí se cubre).
- Universo = `*.html` de la raíz + `en/*.html`. Enlaces de directorio (`/x/`)
  se resuelven a `/x/index.html` si existe.

## Reglas

- Dependencia: `perl` (ships con macOS/Linux). Determinista.
- `alcance.md` es regenerado (gitignored). No editar a mano.
- Nunca push a main sin OK. Enlazar/quitar es decisión de producto, con OK.
