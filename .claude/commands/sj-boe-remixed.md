---
description: Construye un convenio BOE remixed completo siguiendo el playbook validado. Invoca con /sj-boe-remixed <provincia> o /sj-boe-remixed <sector>-<provincia>.
argument-hint: <provincia> [hostelería por defecto] · ejemplos: gipuzkoa, maresme, cadiz, limpieza-asturias
---

# /sj-boe-remixed — convenio BOE remixed end-to-end

Reescribe una landing thin de convenio en formato BOE remixed: TOC compacto, tabla salarial colapsable por familia, bloques editoriales completos (jornada, vacaciones, pluses, subrogación, fijo discontinuo, IT, marco legal), mini-comparaciones embebidas con cifras reales del corpus.

Sigue el playbook consolidado en memoria: [[feedback_playbook_boe_remixed]]. No duplicar pasos — leer el playbook desde memoria al arrancar y aplicarlo.

## Reglas no negociables

Estas reglas tienen prioridad sobre velocidad o completitud:

1. **Solo fuentes oficiales y datos reales.** Mínimo 2 fuentes coincidentes (online o BOP) para cada cifra/artículo antes de afirmarlo en el HTML. Si solo 1 → marcar provisional o parar.
2. **Si las fuentes online no se cruzan, pedir el BOE letra a letra al usuario.** Mensaje exacto: *"No tengo cruce de fuentes online suficientes para los campos X, Y, Z. ¿Puedes copiar y pegar el texto del BOE/BOP por trozos? Necesito vigencia, jornada, vacaciones, licencias, pluses con cuantías, horas extras, subrogación, fijo discontinuo, IT, comisión paritaria, partes firmantes."*
3. **Nunca afirmar "el único X del corpus" sin `grep` previo** de todos los JSONs y HTMLs del corpus auditado para verificar.
4. **Nunca push sin OK explícito del usuario.** Commit local sí, push no.
5. **Lenguaje inclusivo** ([[feedback_lenguaje_inclusivo]]) — "personal", "plantilla", "Camarera/o de Pisos".

## Argumentos

- `<provincia>` — nombre canónico en minúsculas. Sector hostelería por defecto. Ejemplos: `gipuzkoa`, `maresme`, `cadiz`, `granada`, `valladolid`.
- `<sector>-<provincia>` — para sectores distintos. Ejemplos: `limpieza-asturias`, `metal-bizkaia`. Solo cuando el usuario lo pida explícitamente.

## Qué hacer

### Fase 1 — Diagnóstico previo

1. Lee la landing actual: `convenio-<sector>-<provincia>.html`. Si no existe, parar y avisar.
2. Lee el JSON gemelo: `data/convenios/<sector>_<prov-corto>.json`. Si no existe, parar y avisar (no podemos remixar sin datos estructurados).
3. Comprueba con un bash one-liner:
   - `wc -l` líneas de HTML
   - `grep -c "<h2[^>]*>" <archivo>` H2 reales
   - `grep "lastmod\|priority" sitemap.xml | grep <provincia>` presencia y prioridad
   - GA4 traffic del día anterior: `grep "convenio-<sector>-<provincia>" analisis/ga4/$(date -d 'yesterday' +%Y-%m-%d).csv`
4. Reporta diagnóstico al usuario en una tabla breve y pide confirmación antes de seguir. Si la landing ya tiene >12 H2 o >900 líneas, **avisar que parece ya remixada** y preguntar si rehacer.

### Fase 2 — Obtener datos editoriales

**Orden estricto (no saltarse pasos):**

1. **Intenta el PDF oficial primero.** Lee `urlBop` del JSON. WebFetch con prompt extractor de los 13 bloques canónicos.
2. **Si el PDF devuelve binario, redirect a consent o error de certificado:** WebSearch `convenio <sector> <provincia> <año> BOP código texto`.
3. **WebFetch en paralelo a las 3 aggregadores fiables:**
   - `noticias.juridicas.com/base_datos/Laboral/...`
   - `iberley.es/convenios/sector/...`
   - `ccoo.app/convenio/...`
4. **Cruza los datos en una tabla mental** (artículo / fuente A / fuente B / fuente C). Si las 3 coinciden → verificado. Si 2 coinciden y 1 dice algo distinto → verificado con nota. Si solo 1 responde con datos para 5+ campos críticos → **STOP, aplicar regla 2**.
5. Muestra al usuario una tabla resumen de los datos verificados antes de empezar a redactar. Pídele confirmación.

Datos a extraer (13 bloques de [[metodo-enriquecer-convenio-thin]]):
vigencia · jornada anual + distribución · vacaciones · licencias retribuidas · pluses con cuantías concretas · horas extras · subrogación · contrato fijo discontinuo · incapacidad temporal · régimen disciplinario · comisión paritaria · partes firmantes · cláusula revisión · particularidades únicas.

### Fase 3 — Decisiones editoriales (con el usuario)

1. **Identifica los ángulos únicos** comparando contra el resto del corpus auditado (Madrid, Valencia, Barcelona, Tarragona, Sevilla, Baleares, Bizkaia, Zaragoza, Granada). `grep` en HTMLs y JSONs para verificar antes de afirmar singularidad.
2. **Pregunta al usuario con `AskUserQuestion`** cuál es el ángulo principal a destacar en el hero. Ofrece 2-3 opciones basadas en los hallazgos reales.
3. Decide estructura de tabla salarial:
   - Si ≤15 filas → tabla plana
   - Si 15-40 filas → 2-4 acordeones `<details>` por familia
   - Si >40 filas → 4-6 acordeones, todos cerrados por defecto
4. Confirma con el usuario antes de construir.

### Fase 4 — Construcción HTML

Edit incremental siguiendo el playbook [[feedback_playbook_boe_remixed]] Fase 3 punto por punto. Orden:

1. CSS extras (copiar literal de Sevilla o Zaragoza, las dos más completas).
2. Hero con ángulo único confirmado en Fase 3.
3. TOC compacto con 11-14 chips → IDs en H2.
4. Bloque "¿Te cubre?" con check-list y asimilaciones únicas.
5. Tabla salarial agrupada en `<details>` (script Node temporal en `scripts/reagrupar-tabla-<provincia>.js`, ejecutar, validar 0 huérfanas, borrar el script).
6. Bloques editoriales: jornada, vacaciones, pluses (con `.plus-destacado` para los únicos), subrogación, fijo discontinuo, baja médica. Incluir `<div id="comparativa"></div>` antes de `<!-- CALLOUTS:START -->`.
7. FAQ enriquecido (6-8 preguntas que respondan a los ángulos únicos).
8. Marco legal y partes firmantes (tabla + check-list firmantes + check-list paritaria + check-list particularidades).
9. IDs en todos los H2 verificados con `grep` final.

Para cada bloque con cifra diferenciadora, añade callout con mini-comparación: *"vs Madrid X · vs Valencia Y · vs Sevilla Z"* (regla 3 de [[feedback_boe_remixed_patron_visual]]).

Validar HTML balance con Node antes del commit:
```js
node -e "const fs=require('fs');const h=fs.readFileSync('FILE','utf8');
['h2','table','div','ul','details','summary','tr'].forEach(t=>{
  const o=(h.match(new RegExp('<'+t+'[^>]*>','g'))||[]).length;
  const c=(h.match(new RegExp('</'+t+'>','g'))||[]).length;
  console.log(t+':',o,'/',c);
});"
```

### Fase 5 — Protección y entrega

1. `skipHtmlGeneration: true` en el JSON gemelo (después de `"codigo"`).
2. `sitemap.xml`: actualizar `lastmod` a hoy, `priority` a `0.85`.
3. Levantar servidor local `python -m http.server 8765` en background.
4. Dar al usuario la URL `http://localhost:8765/convenio-<sector>-<provincia>.html` para validación visual.
5. **Esperar OK explícito** antes de commitear. Si el usuario dice "ok commit", crear commit local con mensaje completo (qué cambió, ángulos únicos, fuentes verificadas, métricas H2 antes/después, regla absoluta sobre ultraactividad/exclusividad si aplica). Co-Authored-By Claude.
6. **No hacer push.** Avisar al usuario que el commit está local y esperar `git push` explícito.

## Lo que el comando NO hace

- **No solicita indexación en GSC** (tarea manual del usuario).
- **No anota Tanda en MC GSC_STATUS** (se hace después, agrupando varias landings).
- **No hace push** sin OK explícito.
- **No verifica autoridad/utilidad de ángulos únicos** — eso es juicio editorial conjunto.
- **No regenera el callout dataset** entre marcadores `<!-- CALLOUTS:START/END -->`. Se conserva intacto (lo genera `scripts/generate-callouts.js` desde dataset).

## Si encuentras un obstáculo

- **PDF oficial no parseable** → fallback aggregadores → si tampoco, regla 2 (pedir BOE letra a letra).
- **Solo 1 fuente con datos** → regla 2.
- **Fuentes contradictorias** en una cifra → mostrar la discrepancia al usuario y preguntar antes de elegir.
- **Tabla con prefijos heterogéneos** (no encaja en N familias obvias) → mostrar prefijos detectados y pedir agrupación al usuario.
- **HTML balance falla post-edit** → no commitear, revertir el último Edit y reportar qué tag está descompensado.
- **Tentación de afirmar "el único X"** → grep el corpus antes. Si no eres 100% seguro, frasear como "uno de los pocos del corpus" o "compartido con [provincias]".

## Salida final esperada

Cuando el comando termina (tras OK del usuario para commit), reporta:

```
✅ Convenio BOE remixed Hostelería <Provincia> completado · commit <hash>

  H2: <antes> → <después>
  Líneas: <antes> → <después>
  Tabla salarial: <N> filas reagrupadas en <M> acordeones
  Fuentes verificadas: <lista>
  Ángulos únicos: <bullets>
  Particularidades comparadas: <lista de comparaciones embebidas>

Pendiente del usuario:
  · git push origin main (cuando confirmes)
  · Solicitar indexación en GSC
  · Anotar en MC GSC_STATUS cuando agrupemos tanda
```

Relacionado: [[feedback_playbook_boe_remixed]] (playbook 4 fases) · [[feedback_boe_remixed_patron_visual]] (reglas visuales TOC + tablas + comparaciones) · [[feedback_metodo_enriquecer_convenio_thin]] (rúbrica 13 bloques) · [[feedback_nunca_inventar]] · [[feedback_landing_json_sincronizar]].
