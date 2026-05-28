---
description: Command-center por landing — regenera LANDINGS.csv (estado+métricas+decisiones) cruzando sitemap, GSC, git y la capa humana. Para no perder el hilo. Invoca con /sj-dashboard.
---

# /sj-dashboard — command-center por landing

Regenera la vista por landing para que no se pierda el hilo entre tantas. Columnas
derivadas = de la verdad (no mienten); capa humana = persiste y se fusiona.

## Qué hacer

1. **Correr el generador**:
   - Rápido: `bash scripts/audit/dashboard.sh`
   - Completo (+ HTTP 200 por landing): `bash scripts/audit/dashboard.sh --net`
   - Si el usuario acaba de soltar un export GSC nuevo, recordarle que el fichero
     debe llamarse `Páginas.csv` en el cwd (el script lo cruza por URL).

2. **Salida**:
   - `LANDINGS.csv` → la hoja (Excel/Numbers/Sheets). Ordenada grupo→sector→provincia.
     Agrupar/pivotar ahí da el "árbol".
   - `LANDINGS_DASHBOARD.md` → mirror narrativo con sello de frescura, solo filas
     con decisión/próximo paso.

3. **Interpretar** (no volcar el CSV): resumir en ≤12 líneas — cuántas landings,
   cuántas con decisión pendiente / próximo paso, y las 3-5 más urgentes
   (title desincronizado + alto imp, footer legal, etc.).

4. **Capa humana**: si en la sesión se tomó una decisión sobre una landing, **editar
   `data/landings-notas.csv`** (no el CSV generado — se sobrescribe). Una fila por
   slug: `slug,decision,notas,proximo_paso`. Si el slug no existe, añadir fila.

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
