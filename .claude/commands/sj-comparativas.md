---
description: Verifica que el N de las comparativas "X frente a otras provincias del sector" coincide con el dataset (única fuente de verdad). Determinista. Invoca con /sj-comparativas.
---

# /sj-comparativas — coherencia del N en comparativas de sector

Las landings de convenio incluyen un callout "X frente a otras provincias del
sector" con rankings tipo "6ª de 8" y frases "las 8 provincias auditadas". Ese
`N` es variable: cambia al añadir un convenio/provincia. Este check garantiza que
no quede obsoleto ni inventado.

1. Correr: `bash scripts/audit/comparativas.sh`
2. Leer `comparativas.md`. Triar (≤10 líneas):
   - **HARD** (`N` incoherente): un ranking "Nª de M" o "M provincias" cuyo `M`
     no está en `{allCount, comparableCount, allCount-1}` del dataset. Causa típica:
     se actualizó `analisis/dataset-{sector}.json` y NO se regeneró un callout, o un
     callout MANUAL (Madrid, Bizkaia) quedó desfasado. Arreglar:
     - AUTO → `node scripts/generate-callouts.js` (seguro: solo toca el bloque entre
       marcadores `<!-- CALLOUTS:START/END -->`, no fuentes ni sitemap → NO afecta al
       bloqueo P1 de los otros generadores).
     - MANUAL (en `MANUAL_OVERRIDE` de generate-callouts.js) → editar a mano.
   - **WARN** (fuera del corpus): landing del sector en sitemap pero ausente del
     dataset → no participa en comparativas. Es ACEPTABLE bajo la política "corpus
     auditado = subset" (decisión usuario): el corpus es un subconjunto curado con
     cifras verificadas. Solo entra al dataset cuando hay cifras comparables
     verificadas (regla `feedback_nunca_inventar`). Revisión humana, no urgente.
3. Fuente de verdad única = `analisis/dataset-{sector}.json`. Nunca hardcodear el
   `N` en prosa nueva sin que salga del dataset.
4. No arreglar sin OK. Nunca push a main sin OK.
