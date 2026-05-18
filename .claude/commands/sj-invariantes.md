---
description: Auditoría de invariantes del sitio (sitemap↔HTML↔footer legal↔IBM Plex Mono↔llms.txt). Caza el drift silencioso recurrente del proyecto. Determinista. Invoca con /sj-invariantes.
---

# /sj-invariantes — health-gate de invariantes del sitio

Audita los invariantes estructurales de salariojusto.es y reporta. La comprobación
mecánica vive en un script determinista; aquí solo orquesto e interpreto.

## Qué hacer

1. **Correr la capa determinista**:
   - Rápido (local, por defecto): `bash scripts/audit/invariantes.sh`
   - Completo (+ HTTP 200 en vivo, lento ~60 curls): `bash scripts/audit/invariantes.sh --net`
   - Usa `--net` si el usuario sospecha de drift de deploy o tras un push; si no, el modo local basta.

2. **Leer el informe** generado: `salud-invariantes.md`. El script ya clasifica
   en HARD (bugs reales) / WARN (revisar) / 🌐 (red).

3. **Triar e interpretar** (máx ~15 líneas, no volcar el informe entero):
   - **HARD · IBM Plex Mono** → es la regresión PR#22 (memoria `project_bloqueo_generadores_ibmplexmono`).
     ⚠️ El fix NO es editar el HTML a mano: lo regeneran los generadores. La causa raíz
     está en las plantillas de `generate-*.js` (Prioridad 1). Si aparece, dilo claramente
     y enlaza al bloqueo P1, no propongas parche cosmético.
   - **HARD · sitemap→fichero inexistente** → regresión tipo `construccion-estatal`
     (estuvo 18 días rota). Localizar el commit que la introdujo.
   - **HARD · footer legal** → compliance LSSI/RGPD/AdSense (memoria `project_footer_global_legal`).
   - **WARN · fuera de sitemap** → ¿landing nueva sin registrar? (lección Tanda F).
   - **WARN · llms.txt** → recordar al usuario actualizar `llms.txt` (es manual; memoria
     `feedback_recordar_llms_txt`). NO automatizar, sí proponer la línea a añadir.

4. **Proponer acciones concretas** por cada HARD, en orden de impacto. No arreglar nada
   sin OK salvo que sea trivial y el usuario lo haya pedido.

## Emparejar con /goal (fix-until-green)

El script sale con exit 1 si hay algún HARD. Para "no pares hasta dejarlo verde":
el usuario lanza `/goal el script scripts/audit/invariantes.sh sale con exit 0`
y luego `/sj-invariantes` — itero arreglando HARDs hasta que pase. Para los HARD
bloqueados por Prioridad 1 (IBM Plex Mono), avisar de que no se puede cerrar el
Goal hasta arreglar los generadores, y no entrar en bucle.

## Notas

- Determinista por diseño: la verificación es bash versionado, no juicio mío
  (el check es un invariante en sí mismo).
- `salud-invariantes.md` es efímero (no commitear). El valor es el triaje.
- Nunca push a main sin OK. Crear/editar local es libre.
