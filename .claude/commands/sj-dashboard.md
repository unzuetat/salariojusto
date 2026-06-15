---
description: Command-center por landing — regenera LANDINGS.csv (estado+métricas+decisiones+reindex) cruzando sitemap, GSC (3 ventanas), git, log de reindex y capa humana. Para no perder el hilo. Invoca con /sj-dashboard.
---

# /sj-dashboard — command-center por landing

Regenera la vista por landing para que no se pierda el hilo entre tantas. Columnas
derivadas = de la verdad (no mienten); capa humana = persiste y se fusiona.

## Qué hacer

1. **Correr el generador**:
   - Rápido: `bash scripts/audit/dashboard.sh`
   - Completo (+ HTTP 200 + last-modified prod por landing): `bash scripts/audit/dashboard.sh --net`
   - Si el usuario acaba de soltar un export GSC nuevo, recordarle dónde va:
     - `analisis/gsc-paginas.csv` (3 meses, ya está en uso)
     - `analisis/gsc-paginas-7d.csv` (7 días, opcional)
     - `analisis/gsc-paginas-28d.csv` (28 días, opcional)
     - O `Páginas.csv` en el cwd como fallback de 3m (legacy).

2. **Salida**:
   - `LANDINGS.csv` → la hoja (Excel/Numbers/Sheets). 30 columnas: grupo, sector,
     provincia, slug, url, en_sitemap, http, title, last_modified, GSC 7d/28d/3m
     (clics, imp, ctr, pos), git (fecha + commit), reindex (fecha + resultado +
     intentos + notas), capa humana (decision, notas, proximo_paso).
     Ordenada grupo→sector→provincia. Agrupar/pivotar ahí da el "árbol".
   - `LANDINGS_DASHBOARD.md` → mirror narrativo con sello de frescura, solo filas
     con decisión/próximo paso/reindex registrado.

3. **Interpretar** (no volcar el CSV): resumir en ≤12 líneas — cuántas landings,
   cuántas con decisión pendiente / próximo paso, cuántas con reindex registrado,
   y las 3-5 más urgentes (title desincronizado + alto imp, footer legal, reindex
   pendientes con last-modified ≥48h, etc.).

4. **Capa humana — dos archivos**:
   - **`data/landings-notas.csv`** → decisiones editoriales. Una fila por slug:
     `slug,decision,notas,proximo_paso`. Si el slug no existe, añadir fila.
   - **`data/gsc-reindex-log.csv`** → registro de solicitudes de indexación GSC.
     Una fila por solicitud: `slug,fecha_solicitud,resultado,intentos,notas`.
     Valores comunes de `resultado`: `aceptada`, `rechazada`, `pendiente`, `404-window`.
     Cada vez que el usuario solicite reindex en GSC, añadir/actualizar fila.

## Exports GSC adicionales (7d y 28d)

Las métricas 7d y 28d **NO se generan automáticamente** — requieren export manual
de GSC:

1. Search Console → Rendimiento → Filtrar por fecha → "Últimos 7 días" / "Últimos 28 días"
2. Pestaña "Páginas" → Exportar → CSV.
3. Renombrar a `gsc-paginas-7d.csv` (o `-28d.csv`) y mover a `analisis/`.
4. Regenerar el dashboard.

Si los archivos no existen, las columnas 7d/28d quedan vacías y el script avisa
con un mensaje informativo (no error).

## Sincronización con MC (importante)

`LANDINGS_DASHBOARD.md` es el espejo cross-máquina. **Cuando actualicemos MC**
(cierre de sesión, `/export-mc`, o cambio relevante):
- regenerar (`/sj-dashboard`) para que el mirror esté fresco, y
- `mc_upsert_file` projectId=`salariojusto` name=`LANDINGS_DASHBOARD.md` con su contenido.

Así el dashboard nunca diverge de MC: se regenera de la verdad y se sube en el
mismo acto que el resto del estado.

## Sincronización con MC (importante)

`LANDINGS_DASHBOARD.md` es el espejo cross-máquina. **Cuando actualicemos MC**
(cierre de sesión, `/export-mc`, o cambio relevante):
- regenerar (`/sj-dashboard`) para que el mirror esté fresco, y
- `mc_upsert_file` projectId=`salariojusto` name=`LANDINGS_DASHBOARD.md` con su contenido.

Así el dashboard nunca diverge de MC: se regenera de la verdad y se sube en el
mismo acto que el resto del estado.

## Reglas

- `LANDINGS.csv` y `LANDINGS_DASHBOARD.md` son efímeros/regenerados: **no editar a
  mano, no commitear** (van en .gitignore idealmente). Lo que se versiona y edita
  es `data/landings-notas.csv` (la capa humana, en git, cross-máquina vía pull).
- Determinista por diseño: la fiabilidad viene del script versionado, no de mí.
- Nunca push a main sin OK.
