# Auditoría exhaustiva AdSense — "Contenido de poco valor"

_Fecha: 2026-07-27 · Rama: feat/metal-valencia · Método: 6 agentes en paralelo, cada uno sobre una dimensión del flag de Google, juzgando con la rúbrica de AdSense (valor y originalidad frente a lo existente), NO con `thin.py`._

Contexto: rechazo #2 confirmado 13-jul-2026. Las 168 páginas puerta `salario-neto-*` ya se retiraron el 2026-05-06 (tag `landings-thin-pre-retirada-2026-05-06`) y el rechazo **persiste**, luego la causa vive en lo que queda indexado.

---

## VEREDICTO CENTRAL (contraintuitivo)

**El problema NO es que las páginas sean finas o duplicadas — la mayoría no lo son.** Los convenios aportan ~55-60% de contenido original, el Kit de plantillas es sólido, el pilar `ley-transparencia` y `sobre.html` son fuertes.

**El problema es qué ve Google cuando rastrea.** La estrategia de `noindex` (25 páginas), correcta para evitar canibalización SEO, ha dejado el índice rastreable reducido a:

- **~40 páginas `convenio-*` de estructura casi idéntica** (81% del índice indexable), que además concentran el **96,7% de todo el tráfico**.
- **2 hubs indexados con 0 clicks en 3 meses** (`convenios.html`, `guias.html`) → un revisor los lee como páginas índice vacías.
- **La capa con más profundidad editorial — Kit (10 plantillas de 1.300-2.800 palabras), guías, y el `informe` de 6.727 palabras de investigación propia — está en `noindex`**, así que **para el rastreador no existe**.

Resultado: el sitio que Google indexa se lee como **una batería homogénea de tablas salariales por provincia + una carcasa fina de hubs vacíos y legales**, sin masa editorial diversa visible. Ese es exactamente el perfil que dispara "contenido de poco valor".

**La paradoja:** lo que hace funcionar el SEO (35+ convenios plantillados) es lo que dispara el flag, y lo que lo desactivaría (la profundidad editorial) está oculto por decisión propia.

---

## Mapa de evidencia por dimensión

| Dimensión | ¿Es la causa? | Hallazgo clave |
|---|---|---|
| **1. Boilerplate entre convenios** | Parcial (barato de cerrar) | Duplicación baja (mediana 5-6%, máx Jaccard 0,21). Pero "Quién audita esto" = 495 ch **byte-idénticos en 32/39 fichas**; bloque procedimental en 11-12; restos del generador. |
| **2. Original vs BOE** | **No** | Convenios ~55-60% original. Análisis interpretativo real (paradoja SMI Alicante, IRPF foral, ejemplos de nómina computados). Pasan el test. |
| **3. Kit plantillas** | **No** | 10 piezas de 1.300-2.800 palabras editoriales, solapamiento <12%. De lo mejor del sitio. Todas en noindex → ocultas. |
| **4. Cola informativa** | Parcial | `ley-transparencia` fuerte, `sobre` E-E-A-T sólido, cluster templado ya en noindex. Pero `salarios`↔`convenios` solapan 25% (ambos indexados) y el `informe` (lo más original) está oculto. |
| **5. Vista de Google (GSC/GA4)** | **SÍ — causa raíz** | 96,7% clicks de convenios. Índice = ~40 plantillas + hubs vacíos + legales. Editorial de calidad oculto por noindex. 1 convenio muerto. |
| **6. UX / navegación / E-E-A-T** | No (limpio) | 0 dead links, footer legal 100%, E-E-A-T sólido, autoría "Telmo" coherente. **Salvo**: incoherencia de contadores de inventario en la home (34/35/36/37 a la vez). |

---

## Plan de remediación priorizado

### 🔴 P0 — Blindar el pipeline (bloqueante, antes de tocar nada más)
Tres convenios siguen cableados al generador **sin `skipHtmlGeneration`**: `hosteleria_sev`, `hosteleria_val`, `ofydes_vlc` (`scripts/generate-convenios.js:110-142`). Un `node generate-convenios.js` **borraría su enriquecimiento manual** y los dejaría en plantilla desnuda — creando el "poco valor" que penaliza Google. Además el generador reintroduce el boilerplate de H1/H2 (líneas 401-530). **Arreglar la plantilla y poner skipHtmlGeneration ANTES de regenerar.** (Coincide con tu bloqueo ya conocido de generadores.)

### 🟠 P1 — Munición directa para la reapelación
1. **Surfacear profundidad editorial al índice.** Es la palanca que ataca la causa raíz. Candidatos a sacar de noindex (son ricos y con bajo solapamiento): el `informe-transparencia-salarial-2026` (6.727 pal., investigación propia, CTR 5,4% — verificar antes que sus datos estén cerrados) y 2-3 plantillas del Kit más autónomas. Objetivo: que el rastreador vea prosa editorial diversa, no solo tablas.
2. **Reconciliar los contadores del home a 37** (canónico del sitemap). Puntos en `index.html`: lede C2 `:2671` (36→37), "Otros sectores" `:3019` ("4 fichas"→6 reales), mega-menú Limpieza `:2171` (11→12). Es el fallo de credibilidad más visible para un revisor.
3. **Resolver los 2 hubs indexados con 0 clicks** (`convenios.html` pos 33,7 / `guias.html` pos 63,7). Revisar title + enlazado; si en 60-90 días siguen a 0, consolidar `guias` en `convenios`/home.
4. **Desduplicar `salarios`↔`convenios`** (25% solapamiento, el único entre páginas indexadas). Dejar la explicación canónica del marco en `convenios`; en `salarios` un resumen + enlace.
5. **Decidir postura del loader AdSense** durante la ventana de revisión. Está reintroducido (#65) pero sin unidades de anuncio (0 slots renderizados). Riesgo bajo, pero si se quiere review 100% limpio, gatearlo.

### 🟡 P2 — Higiene de contenido
6. **Variar "Quién audita esto"** (byte-idéntico en 32 fichas): insertar dato específico por convenio (BOP concreto, fecha auditoría) o reducir a línea + enlace a `/como-verificamos.html`.
7. **Mover el bloque procedimental** "cómo verificar tu nómina" (11-12 fichas) a la guía canónica `/reclamar-diferencias-salariales-convenio.html` que ya existe.
8. **Subir el suelo de `maresme` y `girona`** (flojas: sin ejemplo trabajado) o noindex temporal para no promediar a la baja.
9. **Resolver `convenio-hosteleria-alicante.html`** (indexable, 0 impresiones / 0 sesiones — muerta).
10. **Forzar recrawl** de las 5 páginas noindex que aún muestran impresiones en GSC (registro, rangos, pedir-banda, informe, que-es) para que caigan del índice antes de reapelar.

### 🟢 P3 — Detalle
11. **Limpiar etiquetas robots dobles** en las 10 plantillas (`noindex,nofollow` línea 6 + `index,follow` línea 10 conviven).
12. **Byline de autor humano** (`Person` + firma) en piezas cornerstone para reforzar E-E-A-T (hoy `author` = Organization).
13. **`legacy/calc-v1/index.html`** huérfano sin cookie banner → noindex explícito o retirar.

---

## Nota estratégica honesta

Según la proyección ya registrada (crumb 13-jul), AdSense aprobado daría **40-60 €/mes** frente al goal de 1.000 €. Este plan de remediación es real y ejecutable, pero conviene decidir con los ojos abiertos: **el esfuerzo de reapelación compite con construir las vías que sí escalan** (sponsors sectoriales 300-800 €/mes, lead-gen abogados laborales). La recomendación previa era mix, no AdSense en solitario. Este dossier sirve para la reapelación de agosto **y** deja el sitio más fuerte independientemente de AdSense (el índice más rico también es mejor SEO).
