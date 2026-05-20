---
description: Audita exhaustivamente todos los links del sitio (internos, assets, JSON-LD y externos). Detecta 404, anchors inexistentes, schema con URLs rotas, typos. Úsalo semanalmente. Invoca con /audit-links o /audit-links <pagina.html> o /audit-links --quick.
argument-hint: [<pagina.html> | --quick | --full] · sin args = sitio completo, todo
---

# /audit-links — auditoría de URLs del sitio

Tu trabajo: detectar **toda URL rota, ambigua o sospechosa** en el sitio salariojusto.es. Cualquier link que un humano pulse no debe acabar en 404 ni llevar a un destino inesperado.

## Argumentos

- **Sin argumentos** → audita TODO el sitio (internos + assets + JSON-LD + externos). Modo completo, puede tardar varios minutos por la verificación HTTP de externos.
- **`<pagina.html>`** → audita solo esa página (todo: internos + assets + JSON-LD + externos).
- **`--quick`** → omite la verificación HTTP de URLs externas (más rápido, ~30 s). Internos + assets + JSON-LD se siguen verificando.
- **`--full`** → explícitamente todo (es el default, redundante pero útil para claridad).

## Qué hacer

### 1. Localizar HTMLs del sitio

`Glob` con patrón `*.html` en la raíz del repo. **Excluye** archivos en:
- `_preview/`, `_og/`, `research/` (no son públicos)
- `node_modules/`, `.git/` (irrelevantes)

Si el usuario pasó un argumento que es un nombre de archivo, solo procesa ese.

### 2. Por cada HTML, extraer URLs

Usa `Grep` con regex para extraer 4 tipos:

| Tipo | Regex aproximado | Atributo |
|---|---|---|
| **Links de navegación** | `<a\s[^>]*href="([^"]+)"` | `a[href]` |
| **Imágenes** | `<img\s[^>]*src="([^"]+)"` | `img[src]` |
| **CSS / iconos** | `<link\s[^>]*href="([^"]+)"` | `link[href]` |
| **Scripts** | `<script\s[^>]*src="([^"]+)"` | `script[src]` |
| **JSON-LD URLs** | Dentro de `<script type="application/ld+json">`, buscar `"url"`, `"item"`, `"sameAs"`, `"@id"`, `"contentUrl"`, `"image"` con valor string que empiece por `http`, `/` o que sea relativo |
| **og:image / twitter:image / canonical** | `<meta\s+(property\|name)="(og:image\|twitter:image\|canonical)"\s+content="([^"]+)"` y `<link rel="canonical"\s+href="([^"]+)"` |

Para JSON-LD usa `multiline: true` en Grep. El bloque de schema puede tener saltos de línea.

### 3. Clasificar cada URL

| Clase | Patrón | Cómo verificar |
|---|---|---|
| **Anchor pura** | `#xxx` (empieza por `#`) | El `id="xxx"` o `<a name="xxx">` debe existir EN la misma página |
| **Interna absoluta** | empieza por `/` | Convertir a path local: `/foo.html` → `./foo.html`. Debe existir el archivo. Si tiene `#anchor`, validar también el anchor en el destino. |
| **Interna relativa** | sin `/` al inicio, sin `http` | Resolver respecto al directorio del archivo origen. Debe existir. |
| **External absoluta** | `https://salariojusto.es/...` | Tratar como **interna** (es nuestro dominio). Verificar archivo local. |
| **External otro dominio** | `http(s)://` a otro host | Hacer `curl -sI -o /dev/null -w "%{http_code}"` (HEAD). Si HEAD falla con 405, reintentar con GET ligero. 2xx OK, 3xx redirect (anotar pero no error), 4xx/5xx error. |
| **Especial** | `mailto:`, `tel:`, `javascript:`, `data:` | NO se verifica (válidas por definición). Listar en categoría "ignorados". |
| **Placeholder JS** | `href="#"` (anchor vacía) | Filtrar del reporte. Es patrón legítimo de botones JS, no es un link roto. |
| **Template literal JS** | Contiene `${`, `' + `, `" + `, o se ve claramente como fragmento de código (concatenación) | Filtrar del reporte. Son strings JS que el extractor capturó como URLs por error — no verificables sin ejecutar el código. |

**OJO con la regla del dominio propio**: si una URL empieza por `https://salariojusto.es/`, es tu sitio. Conviértela a path local y verifica filesystem (no hagas curl al propio dominio — es lento y depende del deploy actual, no del estado del repo).

### 4. Verificar

#### Archivos locales (internos y schema con URL del propio dominio)
- Usa `Test-Path` (PowerShell) o `[ -e file ]` (Bash). Más rápido que cualquier petición HTTP.
- Si el path es `/algo/` o `/algo` sin extensión y no existe `./algo.html`, anota como ROTO.

#### Anchors
- `Grep` el ID en el archivo destino: `id="xxx"` o `name="xxx"`.
- Si no existe, anota como ROTO con severidad MEDIA (no es 404 técnicamente, pero rompe expectativa).

#### Externas
- Usa `curl -sI -L -o /dev/null -w "%{http_code} %{url_effective}\n" "<URL>" --max-time 8`. El `-L` sigue redirects.
- Si código 2xx → OK
- Si código 3xx con URL final distinta → REDIRECT (anotar URL nueva)
- Si código 4xx/5xx o timeout → ROTO
- **Cachea resultados** en un Map en memoria durante la ejecución: si la misma URL externa aparece en 30 páginas, solo se verifica una vez.

**Paraleliza con cuidado** — si haces 100 curls en paralelo, te puede banear. Limita a 10 simultáneos.

### 5. Severidad de cada hallazgo

| Severidad | Cuándo |
|---|---|
| 🔴 **CRÍTICO** | Archivo interno 404, link en JSON-LD roto (Google ignora schema), canonical roto, og:image 404 |
| 🟠 **ALTO** | Externa 4xx/5xx, anchor inexistente, asset (img/script) 404 |
| 🟡 **MEDIO** | Externa con redirect (puede ser intencional), URL relativa ambigua sin barra inicial cuando debería tenerla |
| 🔵 **INFO** | URL externa con `?utm_*` o tracking que podría limpiarse |

### 6. Reportar

**Output esperado** (formato exacto):

```
📋 Auditoría de links · {fecha YYYY-MM-DD HH:MM}
   Páginas auditadas: {N}
   URLs únicas verificadas: {M} (internas: {x} · externas: {y} · schema: {z})
   Tiempo total: {Xs}

🚨 CRÍTICOS ({n}) — corregir antes de cualquier deploy
   ┌─ {pagina-origen.html}
   │  └ {url-rota} → {motivo conciso}
   │    💡 Sugerencia: {si la hay, ej. typo "convenio-hosteleriaa" → "convenio-hosteleria"}
   ...

⚠️ ALTOS ({n}) — corregir esta semana
   {mismo formato}

📌 MEDIOS ({n}) — revisar cuando puedas
   {mismo formato}

ℹ️ INFO ({n}) — opcional
   {mismo formato}

✅ Sin hallazgos en {n} páginas

📊 Top 5 páginas con más roturas
   1. {pagina} — {x} críticos, {y} altos
   ...

⏱️ Externas más lentas (>3s)
   {url} — {tiempo}s
   ...
```

Si el output supera ~50 líneas, **resume el bloque INFO en una sola línea** ("X URLs con redirect: ver detalle si interesa").

### 7. Guardar el reporte

Tras imprimir el reporte en chat, **escribe también un archivo** `research/auditorias/audit-links-{YYYY-MM-DD}.md` con el reporte completo, para que el usuario pueda buscar en histórico semanal.

Si la carpeta `research/auditorias/` no existe, créala. Esa ruta está gitignored (cubierta por `research/*` sin excepción), así que los reportes no entran al repo público.

## Reglas

- **No corrijas nada.** Solo reportas. Si el usuario quiere arreglar, te lo pide después.
- **No bombardees URLs externas.** Cachea durante la ejecución. Máximo 10 curl simultáneos.
- **Sugerencias solo cuando el typo es obvio.** Ej: `convnio-` → `convenio-` (typo). No inventes destinos.
- **Si encuentras un link a `/plantillas/X.html` y el archivo real es `/plantilla-X.html`** (memoria del proyecto: las plantillas viven en raíz, no en subcarpeta), eso es un CRÍTICO con sugerencia clara.
- **JSON-LD primero**: una URL rota dentro de schema hace que Google ignore TODO el structured data de esa página. Reportarla con prioridad máxima.
- **No analices SEO, calidad de copy ni accesibilidad** — eso es trabajo de `/audit-ux` y `/curator`. Aquí solo URLs.
- Tras el reporte, **no propongas siguiente paso** salvo que haya un cluster claro (ej. "8 páginas linkan a `/plantillas/solicitar-nominas.html` que no existe — esa plantilla está en tu compromiso de esta semana"). Una frase máximo.
