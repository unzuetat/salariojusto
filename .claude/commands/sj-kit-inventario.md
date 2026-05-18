---
description: Inventario de redacción del Kit del trabajador — cuenta palabras por plantilla y marca esqueletos. Invoca con /sj-kit-inventario.
---

# /sj-kit-inventario — estado de redacción del Kit

1. Correr: `bash scripts/audit/kit-inventario.sh`
2. Leer `kit-inventario.md`. Resumir (≤8 líneas): cuántas redactadas vs esqueleto.
3. **Si 0 esqueletos**: avisar de que la memoria `project_kit_plantillas_pendientes`
   ("solo #1 redactada") está **desactualizada** y proponer corregirla.
4. **Si hay esqueletos**: priorizar los que mapeen a la demanda de la Directiva
   (7-jun) — ver memoria `project_fase3_longtail_directiva` (Cluster 3 va aquí,
   bloqueado por Prioridad 1 si requiere regenerar vía generate-plantillas.js).
5. Es inventario, no gate (exit 0 siempre). No redactar sin OK.
