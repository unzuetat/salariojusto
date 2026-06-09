---
description: Radar de oportunidades — cruza GA4 (sessions+dwell) × GSC (impr+CTR+pos) × thin_score y dispara las 4 alarmas accionables. Reemplaza el `scripts/cruzar-ga4-gsc.py` pendiente mientras no haya 7-14 días de runway GA4. Invoca con /sj-radar.
---

# /sj-radar — radar de oportunidades cruzadas

Cruza las tres fuentes de verdad del proyecto (GA4 daily, GSC 90d, auditoría thin) por URL y dispara las **4 alarmas** que el ojo humano no detecta mirando una sola fuente.

## Cuándo NO usarlo

- Si hay menos de 2 días de GA4 disponibles → no hay señal vs ruido, dilo y abortar.
- Si `analisis/gsc-paginas.csv` tiene más de 60 días desde su última modificación → pedir export GSC fresco antes.

## Qué hacer

### 1. Cargar fuentes (en paralelo)

- **GA4 sessions + dwell**: leer `analisis/ga4/RESUMEN.md`. Sacar la tabla "Top 10 páginas por sesiones" del último día disponible. Si falta el archivo o el último día es > 3 días viejo, alertar.
- **GSC 90d**: leer `analisis/gsc-paginas.csv` (separador `;`, columnas: url, clicks_3m, impressions_3m, ctr, avg_position). Indexar por URL.
- **Thin score (opcional)**: leer `auditoria-thin.csv` si existe (BOM UTF-8, fully-quoted). Indexar por URL. Si no existe, omitir esta columna.

### 2. Cruzar por URL

Para cada URL del Top 10 GA4, hacer LEFT JOIN con GSC y thin. URLs sin match GSC = "sin histórico" (recién enriquecidas o nuevas). URLs sin match thin = "sin auditar".

### 3. Tabla cruzada

Emitir tabla markdown con estas columnas (en este orden):

| URL | sessions | dwell | impr 90d | clicks | CTR | pos | thin | lectura |

- `sessions` y `dwell` del último día GA4.
- `impr/clicks/CTR/pos` GSC 90d (vacío si "sin histórico").
- `thin` columna opcional si el CSV existe.
- `lectura` columna de texto corto (≤ 6 palabras) con la clasificación del patrón (ver § 4).

### 4. Las 4 alarmas accionables

Para cada URL del top, clasificar en UNO de estos patrones (orden de chequeo). Si una URL no entra en ninguno, dejar `lectura` vacía.

| Alarma | Condición | Acción sugerida |
|---|---|---|
| ⚠️ **Pogosticking** | CTR ≥ 3% **y** dwell ≤ 30s **y** sessions ≥ 5 | El click ocurre pero el contenido no satisface. Revisar coherencia query↔hero. Si la URL está enriquecida BOE-remixed y dwell=0, antes de actuar verificar artefacto GA4 (sin scroll = sin 2º evento = dwell 0) |
| 🎯 **Quick win SEO** | dwell ≥ 60s **y** posición ≥ 8 **y** CTR ≤ 2% | Contenido bueno pero el snippet no convierte impresiones. Atacar title + meta description vía `/seo-meta` |
| ✅ **Modelo a replicar** | dwell ≥ 45s **y** CTR ≥ 5% | Combinación ideal. Aprender de su estructura para replicar en otras del mismo cluster |
| 📊 **Anomalía DoD** | Variación ≥ 50% día anterior **y** ≥ 10 sessions | Confirmar el día siguiente antes de actuar. Picos de 1 día suelen ser ruido si no se confirman |

### 5. Insights resumen (debajo de la tabla)

Tras la tabla, redactar 4 párrafos cortos (≤ 3 líneas cada uno) uno por alarma activa hoy:

- Si hay pogosticking → enumerar las URLs y mencionar si están BOE-remixed (artefacto vs problema real).
- Si hay quick win → cuál es el top candidate de la jornada.
- Si hay modelo → cuál usar como patrón.
- Si hay anomalía → qué vigilar mañana.

Si una alarma no se dispara hoy, omitir el párrafo (no escribir "sin alarmas activas").

### 6. Próximo paso útil

UNA frase final con la sugerencia accionable del día, eligiendo entre:
- Atacar quick win con `/seo-meta <ruta>`
- Investigar pogosticking sospechoso (añadir scroll tracking GA4 si dwell=0 en BOE-remixed)
- Replicar modelo en próximo enriquecimiento
- Esperar y reconfirmar anomalía mañana

Si hay varias opciones, elegir la de mayor impacto/menor coste.

## Reglas

- **No inventar cifras.** Si un dato falta, escribir vacío en la tabla o "sin dato".
- **No leer GA4_RESUMEN.md de MC** si el local en `analisis/ga4/RESUMEN.md` está al día. Solo recurrir a MC si el local es > 3 días viejo.
- **No ejecutar otros comandos como efecto colateral.** El radar es solo lectura + razonamiento. Las sugerencias del § 6 las dispara el usuario manualmente.
- **Tope de tamaño**: ≤ 40 líneas de output total (tabla + 4 párrafos + sugerencia). Si excede, recortar la tabla a top 5 en vez de top 10.
- **Crumb post-radar**: si el usuario actúa sobre alguna sugerencia, dejar al final una sola línea con "Crumb sugerido: <título corto>" para que él lo guarde en MC si quiere. NO crear el crumb automáticamente.
- **Memoria de criterios**: este radar opera con los criterios GSC #17-#20 (frescura visible, favicon canónico, cruce GA4+GSC, A/B descargas) ya formalizados. No reinterpretar; aplicarlos tal cual.
