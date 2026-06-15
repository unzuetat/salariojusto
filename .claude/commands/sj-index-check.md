---
description: Verifica si Google tiene indexadas y propagadas las URLs del sitio. Compara el HTML local contra Google SERP + (opcional) cabeceras de producción. Determinista. Invoca con /sj-index-check o /sj-index-check <url> [--exhaustive].
---

# /sj-index-check — health-gate de indexación Google

Verifica, sin esperar las 2-4 semanas habituales, si Google tiene:
1. Las URLs **en el índice** (aparecen en `site:`).
2. El **cuerpo editorial actual** rastreado (no una versión vieja cacheada).
3. (con `--exhaustive`) la **producción sirviendo correctamente** la versión última.

Usar tras un refresh + reindex GSC para confirmar propagación antes de mover ficha (apelar AdSense, planear sprint, evaluar A/B de title).

## Argumentos

```
/sj-index-check                                # auto-detecta TODAS las URLs del sitemap.xml
/sj-index-check guias.html                     # 1 URL específica
/sj-index-check guias.html convenios.html      # varias URLs
/sj-index-check --exhaustive                   # + curl con UA Googlebot a cada URL
/sj-index-check guias.html --exhaustive        # combinables
```

URLs sin prefijo se interpretan como rutas del root (`https://salariojusto.es/<arg>`). Acepta también URL completa.

## Qué hacer

### 1. Resolver URLs a verificar

- Si hay args (que no sean flags): usar esos. Validar que cada uno existe como archivo en el repo (Read).
- Si NO hay args: parsear `sitemap.xml` con `grep -oE '<loc>[^<]+</loc>' sitemap.xml | sed -E 's/<\/?loc>//g'` y verificar.
- Flag `--exhaustive` activa el bloque 2e (curl Googlebot).

### 2. Por cada URL (en paralelo cuando sea posible)

**2a. Lee HTML local** (Read sobre el archivo del repo). Extrae 4 piezas de "fingerprint":

```bash
# Title
grep -oE '<title>[^<]+</title>' <archivo> | head -1 | sed -E 's/<\/?title>//g'
# og:title
grep -oE '<meta property="og:title" content="[^"]+"' <archivo> | sed -E 's/.*content="//; s/"$//'
# Meta description
grep -oE '<meta name="description" content="[^"]+"' <archivo> | sed -E 's/.*content="//; s/"$//'
# Primer H2 con id (suele ser distintivo del cuerpo editorial)
grep -oE '<h2[^>]*id="[^"]+"[^>]*>[^<]+</h2>' <archivo> | head -1 | sed -E 's/<[^>]+>//g'
```

Si no hay H2 con id útil, escoger una frase de 6-10 palabras del primer `<p>` editorial (no del directorio de cards). La huella debe ser **suficientemente única** como para que Google la devuelva con cero ruido — evita frases genéricas tipo "Salario Mínimo Interprofesional" o "Convenios colectivos".

**2b. 🕐 GATE TEMPORAL — chequeo previo de edad real del archivo** (siempre, sin red).

```bash
GIT_EPOCH=$(git log -1 --format='%at' -- <archivo>)
HOURS=$(( ($(date -u +%s) - GIT_EPOCH) / 3600 ))
```

**⚠️ Por qué git log y NO `last-modified` HTTP**: Vercel re-toca la cabecera HTTP `last-modified` con cada deploy aunque el contenido del archivo no haya cambiado. Si esta semana ha habido cualquier deploy a producción (incluso de otra landing), todas las URLs muestran `last-modified` reciente — el HTTP no refleja la edición real del cuerpo editorial. La fecha del último commit del archivo en git es la fuente de verdad inmutable. Esto se detectó tras la v1 del skill: el bug habría hecho saltar el gate erróneamente para landings editadas días atrás pero deployadas hoy.

Si `HOURS < 48`:
- **No emitir veredicto ❌/⏳ negativo**. Marcar como **🕐 Demasiado pronto para chequear (editada hace ${HOURS}h)**.
- Estimación realista: Google tarda entre 24h y 7 días en rastrear una URL refrescada tras un push, incluso con "Solicitar indexación" en GSC.
- Acción sugerida: "Volver a correr `/sj-index-check <url>` en $((48 - HOURS))h aprox." Saltar los pasos 2c-2e para esta URL (ahorra cuota WebSearch).

Solo si `HOURS ≥ 48`, continuar con 2c-2f. El `last-modified` HTTP **sí se usa, pero solo en el paso 2f con `--exhaustive`** para validar producción (no para gating temporal).

**2c. `site:URL` en Google con title forzado** (WebSearch). En vez de `site:URL_exacta` solo (poco fiable con motores tipo Bing/DuckDuckGo), usar:

Query principal: `site:salariojusto.es "<title_local>"` — fuerza match con el title exacto del HTML.
- ≥1 resultado y nuestra URL aparece → **INDEXADA con title local actual** ✅
- 0 resultados → ir a 2c-FALLBACK.

Query fallback 2c-FALLBACK: `site:salariojusto.es <3-4 keywords del slug>`. Ejemplo: para `convenio-limpieza-asturias.html` usar `site:salariojusto.es convenio limpieza asturias`.
- ≥1 resultado y nuestra URL aparece → **INDEXADA pero con title distinto** (puede ser reescritura de Google O versión vieja en el índice). Capturar el title del SERP para 2e.
- 0 resultados → **NO INDEXADA** ❌. La URL no está en el índice de Google.

**2d. Buscar la huella editorial entre comillas** (WebSearch). Solo si 2c confirmó indexada.

Query: `"<frase única del cuerpo nuevo>"` (las comillas son esenciales, búsqueda exacta).
- Nuestra URL aparece → **CUERPO NUEVO INDEXADO** ✅
- No aparece → Google aún no ha rastreado el cuerpo refrescado. Si han pasado >7 días desde last-modified, marcar como ⏳ persistente (puede requerir reindex manual).

**2e. Comparar title local vs title SERP** (solo si 2c-FALLBACK devolvió title distinto):
- **NO concluir directamente que Google tiene versión vieja**. Google reescribe títulos con frecuencia (ver memoria `feedback_diagnostico_title_serp_vs_rastreado`). El SERP NO es fuente de verdad del title rastreado. Marcar como ⚠️ "title difiere — verificar manualmente en GSC 'Ver página rastreada'".

**2f. (Solo con `--exhaustive`) Verificación de producción completa** con UA Googlebot — esto es la verificación AMPLIADA del paso 2b (que solo lee `last-modified`):

```bash
curl -sI -A "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" \
  "https://salariojusto.es/<ruta>" | head -20
```

Capturar:
- HTTP status (debe ser 200)
- `x-vercel-cache` (HIT/MISS/STALE/REVALIDATED — MISS prolongado tras deploy es bandera)
- `last-modified` (ya leído en 2b, mostrar)
- `content-length` (≫ que el original confirma que sirve el cuerpo nuevo)

Si HTTP ≠ 200, **mostrar prominente**: producción sirve error → Google no puede indexar. Cualquier diagnóstico de Google es inválido hasta que prod responda 200.

### 3. Componer tabla resumen

```
| URL | En índice | Cuerpo nuevo | Title coincide | Prod | Veredicto |
|-----|-----------|--------------|----------------|------|-----------|
| guias.html | ✅ | ✅ | ✅ | 200 HIT | ✅ Propagado |
| plantillas-*.html | ✅ | ⏳ | ⚠️ | 200 HIT | ⏳ En índice, cuerpo aún viejo |
```

**Veredictos posibles** (en orden de gravedad):
- ✅ **Propagado** — todo OK.
- 🕐 **Demasiado pronto** — last-modified < 48h. No es señal negativa, Google necesita tiempo. Volver a chequear en 2-3 días.
- ⏳ **En índice, cuerpo viejo** — indexada pero la huella nueva no aparece pese a llevar ≥48h. Esperar 2-7 días más; si pasa de 7 días, considerar reindex manual en GSC.
- ⚠️ **Title difiere** — title del SERP no coincide con el local. Verificar en GSC "Ver página rastreada". Posibles causas: reescritura de Google (frecuente), versión vieja, A/B de Google.
- ❌ **No indexada** — ni `site:` con title ni fallback con keywords devuelven la URL. Solicitar indexación en GSC.
- 🚨 **Prod sirve error** (solo --exhaustive) — HTTP ≠ 200. Bloqueante. No tiene sentido hablar de indexación hasta arreglar producción.

### 4. Acciones recomendadas

Por cada URL con problema, sugerir paso siguiente concreto:

- **🕐 Demasiado pronto** → "Volver a correr `/sj-index-check <url>` en `(48h - <horas-desde-modificación>)` aprox. Sin acción inmediata; este resultado es informativo."
- **❌ No indexada** → "Pegar en GSC 'Inspeccionar URL' → 'Solicitar indexación'. Cuota: ~10/día por propiedad."
- **⏳ Cuerpo viejo** → "Confirmar primero que el deploy llegó (`/sj-index-check <url> --exhaustive` para ver last-modified). Si la versión nueva está en prod y ya han pasado >7 días, forzar reindex en GSC."
- **⚠️ Title difiere** → "Abrir GSC → Inspeccionar URL → 'Ver página rastreada' (fuente de verdad real). Decidir si es reescritura de Google (frecuente) o versión vieja indexada."
- **🚨 Prod 4xx/5xx** → "Verificar Vercel dashboard, redeploy si necesario. Reintentar el chequeo cuando prod responda 200."

### 5. Cierre

Una línea de síntesis: "X de N URLs propagadas correctamente. Y pendientes (lista). Z bloqueadas por (motivo)."

## Reglas y notas

- **No invocar reindex GSC desde el skill** — el usuario lo hace manualmente porque la cuota es escasa.
- **No volcar resultados crudos de WebSearch** — solo el diagnóstico estructurado.
- **No inventar URLs** — si el archivo no existe localmente, marcarlo y saltar.
- **Memoria relevante**: `feedback_diagnostico_title_serp_vs_rastreado` (SERP no es fuente de verdad; GSC "Ver página rastreada" sí). Citarla cuando salga un ⚠️.
- **Respeto al usuario**: la skill es informativa, no actúa. Nunca push, nunca edit, solo lectura + WebSearch + curl.
- **Velocidad**: para sitios grandes (60+ URLs), agrupar WebSearches por lotes y reportar progreso. Si el sitemap tiene >30 URLs y el usuario invoca sin args, pedir confirmación antes de empezar (puede consumir mucho tiempo y cuota WebSearch).

## Salida esperada

Una tabla resumen + bloque de acciones recomendadas + línea de síntesis. Total ~25-40 líneas. No volcar el HTML local, no listar todos los resultados de WebSearch, no incluir el sitemap entero.
