# Auditoría integral de convenios · Definición de métricas (v0)

**Fecha:** 2026-08-19 · **Corpus:** 54 fichas `convenio-*.html` (+30 `data/convenios/*.json`, censo de 53 entradas)
**Estado:** BORRADOR PARA RECORTAR. Nada de esto se ejecuta todavía: primero se cierra la rúbrica, después se construyen los agentes/skills.

---

## 0. Principios de diseño de la rúbrica

1. **Determinista primero.** Toda métrica que pueda salir de un script sale de un script. Un agente solo juzga lo que un `grep` no puede juzgar. Esto evita que dos pasadas del mismo agente den números distintos.
2. **Toda métrica de juicio exige evidencia citada.** Un agente no puede decir "claridad 6/10": tiene que pegar la frase concreta y el `archivo:línea`. Sin cita, la métrica no cuenta.
3. **Hard-fail ≠ score.** Hay cosas que son un cero absoluto (una cifra sin fuente, un estado jurídico mal escrito) y no se compensan con buen diseño. Van en una lista aparte, no en la media ponderada.
4. **No duplicar lo ya construido.** Ya existen `singularidad.sh`, `alcance.sh`, `invariantes.sh`, `convenios-patron.sh`, `comparativas.sh`, `thin.py`, `censo-convenios.js`. La auditoría los *consume*, no los reescribe.
5. **Comparable en el tiempo.** Cada métrica se guarda por ficha y por fecha, para poder decir "esta ficha mejoró" y no solo "esta ficha está regular".

Notación por métrica: **[D]** determinista (script) · **[J]** juicio de agente · **[X]** externa (GSC/GA4/red).
Severidad: 🔴 hard-fail · 🟠 pesa en el score · 🟡 informativa.

---

## A · VERDAD Y TRAZABILIDAD  *(la dimensión que no se negocia)*

| # | Métrica | Cómo | Sev |
|---|---|---|---|
| A1 | **Cifras huérfanas**: % de cifras (€, %, h, días, años) del cuerpo que NO están respaldadas por una referencia a artículo/tabla/boletín en su sección | [D] extractor de cifras + ventana de contexto; [J] valida los casos dudosos | 🔴 |
| A2 | **Sello "Verificado contra [boletín] + fecha"** presente y con el boletín correcto (BOB/BOG/BOTHA forales, BOP provincial, BOCM, BOE solo si es estatal) | [D] | 🔴 |
| A3 | **HTML ↔ JSON**: cada cifra de la tabla renderizada coincide con `data/convenios/*.json` | [D] | 🔴 |
| A4 | **Estado jurídico correcto** vs `censo.json` (vigente / ultraactividad / decaído / especial) **y vocabulario correcto** (decaído ≠ "congelado y aplicándose") | [D] censo + [D] léxico prohibido | 🔴 |
| A5 | **Paradoja SMI bien construida**: el anual (mensual × nº de pagas del articulado) es lo que se compara con 17.094 €, nunca la base mensual suelta | [D] cálculo desde JSON + [J] lectura del texto | 🔴 |
| A6 | **Frescura**: días desde la última verificación; ¿hay boletín posterior a la fecha del sello? ¿el año del título es el año en curso? | [D] fecha + [X] vigilancia | 🟠 |
| A7 | **Enlaces a fuente oficial**: vivos (200) y apuntando al documento exacto, no al buscador del boletín | [X] HTTP + [J] pertinencia | 🟠 |
| A8 | **Datos derivados marcados como tales**: toda columna calculada por nosotros (p. ej. anual estimado del salario diario) dice explícitamente que es estimación y con qué fórmula | [J] | 🔴 |
| A9 | **Ausencia de invención**: ninguna afirmación fáctica sin correlato en el articulado pegado / fuente | [J] adversarial | 🔴 |

*Evidencia ya detectada en el sondeo: 2 fichas sin sello (`convenio-oficinas-bizkaia.html`, `convenio-tecnicos-espectaculos.html`).*

---

## B · UNICIDAD Y SINGULARIDAD  *(causa raíz del "poco valor" de AdSense)*

| # | Métrica | Cómo | Sev |
|---|---|---|---|
| B1 | **boilerplate_ratio**: % de frases sustantivas que aparecen también en otra ficha | [D] `singularidad.sh` | 🟠 |
| B2 | **Masa exclusiva**: nº de palabras y de bloques que no existen en ninguna otra página del sitio | [D] | 🟠 |
| B3 | **FAQ clonada**: % de preguntas cuya formulación se repite en otra ficha (misma pregunta con el topónimo cambiado) | [D] normalizando topónimos | 🟠 |
| B4 | **Title/meta gemelos**: similitud del `<title>` y la meta con las demás fichas del mismo sector | [D] | 🟠 |
| B5 | **Hecho local irreemplazable**: ¿la ficha contiene al menos N hechos que solo tienen sentido en esa provincia (polo industrial, plus de equiparación, historia de la negociación, particularidad del boletín)? | [J] | 🟠 |
| B6 | **Canibalización**: ¿otra ficha del sitio compite por la misma consulta objetivo? | [X] GSC + [J] | 🟡 |

---

## C · SUFICIENCIA Y DENSIDAD  *(thin content)*

| # | Métrica | Cómo | Sev |
|---|---|---|---|
| C1 | **Prosa fuera de tabla**: palabras de texto visible excluyendo `<table>`, nav y footer | [D] | 🟠 |
| C2 | **Ratio tabla/prosa**: una ficha que es 80% tabla es una hoja de cálculo, no una página | [D] | 🟠 |
| C3 | **Checklist de cobertura por sector**: ámbito funcional/territorial · tablas · nº de pagas · jornada anual · vacaciones · pluses · antigüedad · horas extra · nocturnidad · subrogación · vigencia y revisión · comisión paritaria · fuente oficial | [D] presencia + [J] calidad | 🟠 |
| C4 | **Explicación vs listado**: ¿cada concepto dice qué significa para la nómina, o solo lo enuncia? | [J] | 🟠 |
| C5 | **Huecos declarados**: cuando falta un dato (no publicado, convenio decaído), ¿se dice explícitamente en vez de omitirlo en silencio? | [J] | 🟠 |

*Rango real hoy: de 12.121 a 47.617 caracteres de texto visible. La cola baja (`tecnicos-espectaculos`, `limpieza-catalunya`, `hosteleria-cadiz`, `comercio-madrid`) es candidata natural a thin.*

---

## D · RESPUESTA AL USUARIO  *(¿resuelve la duda que trajo a la persona aquí?)*

| # | Métrica | Cómo | Sev |
|---|---|---|---|
| D1 | **Respuesta directa en primera pantalla**: cifra del puesto más buscado + año + fuente, extraíble en una frase (patrón piloto §6) | [D] presencia del bloque + [J] calidad | 🟠 |
| D2 | **Cobertura de consultas reales**: para cada query de GSC de esa URL, ¿la página responde? | [X] GSC + [J] | 🟠 |
| D3 | **Dudas previsibles sin respuesta**: el agente se pone en la piel del trabajador ("me pagan en 14 pagas, ¿me toca?", "soy fijo discontinuo", "cambio de empresa") y lista lo que la ficha no contesta | [J] | 🟠 |
| D4 | **Accionabilidad**: ¿hay salida clara para "cobro menos de lo que dice la tabla"? (cálculo, plantilla, plazo de reclamación, prescripción de 1 año) | [D] + [J] | 🟠 |
| D5 | **Citabilidad por IA**: frases autocontenidas con sujeto + cifra + año + fuente, sin depender del contexto anterior | [J] | 🟠 |
| D6 | **Calidad de las FAQ**: cada respuesta empieza por la respuesta y lleva cifra; ninguna es publicidad de la propia web | [J] | 🟠 |

---

## E · ENLAZADO INTERNO

| # | Métrica | Cómo | Sev |
|---|---|---|---|
| E1 | **Profundidad desde la home** (clicks mínimos) y no-orfandad | [D] `alcance.sh` | 🔴 |
| E2 | **Enlaces entrantes**: cuántas páginas del sitio enlazan a esta ficha, y desde dónde (hub, hermana, guía) | [D] grafo | 🟠 |
| E3 | **Enlaces salientes contextuales** (dentro del cuerpo) vs solo footer/nav | [D] | 🟠 |
| E4 | **Clúster sector×provincia**: ¿enlaza a hermanas del mismo sector y a otros sectores de la misma provincia? | [D] | 🟠 |
| E5 | **Anchor text**: descriptivo con sector+provincia, no "aquí"/"más info"; sin sobreoptimización repetida | [D] + [J] | 🟠 |
| E6 | **Puente al Kit**: enlace a la plantilla pertinente en el punto donde nace la necesidad, no al final | [J] | 🟠 |
| E7 | **Enlaces rotos / anclas inexistentes / anclas que inflan impresiones** | [D] + [X] | 🟠 |

*Sondeo: la ficha con menos enlaces internos tiene 6 (`hosteleria-alicante`); el cluster oficinas ronda 10.*

---

## F · FORMATO, DISEÑO Y CONSISTENCIA

| # | Métrica | Cómo | Sev |
|---|---|---|---|
| F1 | **Conformidad con el canon Madrid** (secciones esperadas y su orden), sin borrar contenido exclusivo | [D] estructura de `h2/h3` + [J] | 🟠 |
| F2 | **Verde al mínimo**: nº de celdas/valores en verde en tablas salariales (norma: cero; verde solo para el sello) | [D] | 🟠 |
| F3 | **Tokens de diseño**: sin IBM Plex Mono ni estilos fuera del sistema | [D] `invariantes.sh` | 🔴 |
| F4 | **Tablas en móvil**: contenedor con scroll propio, nº de columnas, encabezado legible, sin desbordar el body | [D] + navegador | 🟠 |
| F5 | **Bloques densos**: párrafos > 100 palabras; nota editorial fragmentada en 3-4 sub-párrafos con etiqueta en negrita | [D] | 🟠 |
| F6 | **Jerarquía de encabezados**: un solo `h1`, sin saltos de nivel, encabezados descriptivos | [D] | 🟠 |
| F7 | **Escaneabilidad**: distancia media entre encabezados, uso de listas, negritas con criterio | [D] + [J] | 🟡 |
| F8 | **Footer legal completo** (Privacidad · Aviso legal · Contacto) | [D] | 🔴 |

---

## G · CLARIDAD Y LENGUAJE

| # | Métrica | Cómo | Sev |
|---|---|---|---|
| G1 | **Legibilidad**: longitud media de frase, subordinación, densidad de jerga | [D] métrica + [J] | 🟠 |
| G2 | **Jerga explicada en su primera aparición**: ultraactividad, subrogación, absorción y compensación, prorrateo, tabla decaída | [D] + [J] | 🟠 |
| G3 | **Categorías en lenguaje inclusivo** (no copiar el BOP en masculino literal) | [D] | 🔴 |
| G4 | **Sindicatos en plural**, sin protagonismo de CCOO/UGT sobre los demás | [D] + [J] | 🟠 |
| G5 | **Voz**: se dirige a la persona trabajadora, sin adjetivos vacíos ni tono de folleto | [J] | 🟠 |
| G6 | **Autoría**: solo "Telmo" en superficie pública | [D] | 🔴 |

---

## H · SEO TÉCNICO Y SERP

| # | Métrica | Cómo | Sev |
|---|---|---|---|
| H1 | **Title con la fórmula ganadora**: cifra + sector + provincia + año | [D] `convenios-patron.sh` | 🟠 |
| H2 | **Meta description** con cifra y motivo de clic; longitud en rango | [D] | 🟠 |
| H3 | **Schema**: `FAQPage` + `BreadcrumbList` presentes y válidos; ausencia de `Article`/`Dataset` donde tocaría | [D] | 🟠 |
| H4 | **Canonical / noindex / sitemap** coherentes (y el noindex, deliberado y registrado) | [D] | 🔴 |
| H5 | **Title servido ≠ title rastreado** por Google | [X] GSC | 🟡 |
| H6 | **Tarjeta OG** con imagen y texto correctos | [D] | 🟡 |
| H7 | **Rendimiento**: peso de la página, CLS por tablas | [X] | 🟡 |

---

## I · CRITERIO EDITORIAL  *("sentido de poner una cosa u otra")*

| # | Métrica | Cómo | Sev |
|---|---|---|---|
| I1 | **Sección que no aporta**: bloques que ningún lector buscaría y que solo alargan | [J] | 🟠 |
| I2 | **Orden por importancia**: lo más consultado (tabla del puesto, pagas) por delante de lo accesorio | [J] + [X] | 🟠 |
| I3 | **Redundancia interna**: la misma idea repetida en dos secciones de la misma ficha | [D] + [J] | 🟠 |
| I4 | **Riesgo jurídico**: afirmaciones tajantes sobre derechos sin matiz ni fuente | [J] adversarial | 🔴 |
| I5 | **Coherencia con la promesa pública** (independencia, sin patrocinio) | [J] | 🔴 |
| I6 | **Lo que falta y debería estar** en esta provincia y no en otras | [J] | 🟠 |

---

## J · CONTEXTO DE PRIORIZACIÓN  *(no puntúa calidad; ordena el trabajo)*

Clicks, impresiones, CTR (excluyendo filas con `#`), posición media, sesiones y permanencia, antigüedad del último cambio y ventana de medición abierta. Sirve para decidir **qué ficha se arregla primero**, no para juzgarla.

---

## K · Formato de salida propuesto

1. `analisis/auditoria-convenios/<fecha>/fichas/<slug>.md` — informe por ficha con evidencia citada.
2. `analisis/auditoria-convenios/<fecha>/matriz.csv` — una fila por ficha, una columna por métrica (comparable en el tiempo).
3. `analisis/auditoria-convenios/<fecha>/RESUMEN.md` — hard-fails de todo el corpus, patrones transversales y las 10 acciones de mayor retorno.

**Score**: media ponderada de las dimensiones 🟠 (0-100) + lista de hard-fails 🔴 aparte, que no se compensan. Una ficha con un hard-fail no tiene nota, tiene una tarea.

---

## L · Decisiones pendientes antes de construir los agentes

1. Pesos por dimensión (¿verdad y unicidad valen el doble que formato?).
2. Escala: 0-100 compuesto vs semáforo puro por dimensión.
3. Alcance del primer barrido: las 54 fichas o un piloto de calibración.
4. ¿La auditoría solo informa, o también propone el parche concreto?
5. Qué métricas de esta lista se caen por no aportar decisión (recortar es parte del ejercicio).
