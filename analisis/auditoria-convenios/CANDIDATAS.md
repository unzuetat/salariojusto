# Ejercicio previo · Universo de métricas candidatas y filtro

**Fecha:** 2026-08-19 · **Objeto:** 54 fichas `convenio-*.html`
**Propósito:** NO es la rúbrica final. Es el banco de candidatas del que saldrá la rúbrica. Aquí se genera de más a propósito, y después se recorta con un test explícito.

---

## 1 · Cómo se genera el universo: 13 lentes

Una dimensión ("unicidad", "formato") es una respuesta, no un método: si empiezo por ahí solo encuentro lo que ya sabía. Genero desde **quién juzga la página**, que es lo que produce métricas que no se me habrían ocurrido:

| Lente | Quién mira | Qué le importa |
|---|---|---|
| L1 | Trabajador con una duda concreta | ¿me resuelve hoy mi problema? |
| L2 | Google (helpful content · E-E-A-T) | ¿esto lo hizo alguien que sabe, para personas? |
| L3 | Revisor de AdSense | ¿esto es una página o un contenedor de tablas? |
| L4 | Motor de IA que quiere citar | ¿puedo extraer una frase y atribuirla sin equivocarme? |
| L5 | Jurista / verificador | ¿es cierto, y puedo comprobarlo? |
| L6 | Arquitecto de información | ¿cómo se llega aquí y adónde lleva esto? |
| L7 | Diseñador | ¿se lee, sobre todo en móvil? |
| L8 | Editor | ¿por qué está esto aquí y en este orden? |
| L9 | Operador (tú, dentro de 6 meses) | ¿esto envejece bien y me avisa cuando caduca? |
| L10 | Competidor | ¿por qué esta página y no el BOP, CCOO o Calculadornomina? |
| L11 | Persona con lector de pantalla | ¿la tabla se puede oír? |
| L12 | El corpus entero | ¿las 54 se contradicen entre sí? |
| L13 | Negocio | ¿arreglar esto devuelve algo? |

---

## 2 · El test de selección (5 preguntas por candidata)

1. **DECISIÓN** — si sale mal, ¿sé qué hacer mañana por la mañana? Si no lo sé, es curiosidad, no métrica.
2. **MEDIBLE SIN INVENTAR** — ¿hay regla determinista o fuente citable? Si depende del ánimo del agente, o se degrada a hallazgo-con-evidencia, o cae.
3. **ESTABLE** — dos pasadas dan lo mismo. Una métrica que oscila no permite decir "mejoró".
4. **INDEPENDIENTE** — ¿capta algo que otra candidata no capta ya? Cinco proxies de "es corta" son una métrica, no cinco.
5. **DISCRIMINANTE** — ¿separa unas fichas de otras? Si las 54 sacan lo mismo, no es una métrica de calidad: **es un invariante**, y su sitio es la lista de hard-fails, no la media.

Notación: ★ núcleo · ○ segunda línea · ✕ fuera (con motivo) · **H** hard-fail (no puntúa, bloquea).
Medición: **[D]** determinista · **[J]** juicio con evidencia obligatoria · **[X]** dato externo (GSC/GA4/red).

---

## 3 · Catálogo

### L1 · Trabajador con una duda concreta

| id | Candidata | Med | Veredicto |
|---|---|---|---|
| 1.1 | La cifra del puesto más buscado aparece en la primera pantalla, con año y fuente | D+J | ★ |
| 1.2 | Duda-a-respuesta: de las 10 preguntas que un trabajador del sector se hace, ¿cuántas contesta la ficha? | J | ★ |
| 1.3 | "Cobro menos de lo que dice la tabla": ¿hay salida accionable (cálculo, plantilla, plazo de prescripción)? | D+J | ★ |
| 1.4 | Autoubicación: ¿puedo saber en 30 s si este convenio me cubre y en qué grupo estoy? | J | ★ |
| 1.5 | Contratos atípicos cubiertos (fijo discontinuo, parcial, ETT, subcontrata) | D+J | ○ |
| 1.6 | Traducción a nómina: ¿la ficha dice qué de esto aparece en tu nómina y con qué nombre? | J | ★ |
| 1.7 | Coste de leerla: tiempo estimado hasta la respuesta buscada | D | ○ (proxy de 1.1) |
| 1.8 | ¿Distingue bruto y neto sin confundir? | D+J | ○ |
| 1.9 | Camino de salida cuando el dato no existe (convenio decaído, tabla no publicada) | J | ★ |
| 1.10 | Encuesta de satisfacción / feedback en página | X | ✕ no hay instrumentación; sería un proyecto |

### L2 · Google (helpful content · E-E-A-T)

| id | Candidata | Med | Veredicto |
|---|---|---|---|
| 2.1 | Experiencia demostrada: la ficha muestra trabajo propio (cotejo del boletín, cálculo, histórico) y no solo copia | J | ★ |
| 2.2 | Autoría y responsable identificables desde la ficha ("Quién audita esto") | D | ★ H |
| 2.3 | Fecha de actualización visible y veraz (coincide con el último cambio real del contenido) | D | ★ H |
| 2.4 | Title con la fórmula validada (cifra + sector + provincia + año) | D | ★ |
| 2.5 | Meta description con cifra y motivo de clic, en rango de longitud | D | ★ |
| 2.6 | Schema `FAQPage` + `BreadcrumbList` presentes y válidos | D | ★ H |
| 2.7 | Ausencia de schema que tocaría (`Article`, `Dataset`/`Table` en fichas con tablas) | D | ○ |
| 2.8 | Canonical y `noindex` coherentes y deliberados | D | ★ H |
| 2.9 | Presencia en sitemap | D | ★ H |
| 2.10 | Intención cubierta: informativa vs transaccional de la consulta objetivo | J+X | ○ |
| 2.11 | Densidad de palabra clave | D | ✕ métrica de 2011, no cambia ninguna decisión |
| 2.12 | Núm. de palabras total | D | ✕ falso positivo garantizado; sustituida por 3.2 |

### L3 · Revisor de AdSense ("poco valor")

| id | Candidata | Med | Veredicto |
|---|---|---|---|
| 3.1 | `boilerplate_ratio`: % de frases sustantivas que también aparecen en otra página | D | ★ |
| 3.2 | Prosa fuera de tabla, nav y footer (palabras de contenido real) | D | ★ |
| 3.3 | Ratio tabla/prosa: cuánto de la página es hoja de cálculo | D | ★ |
| 3.4 | Masa exclusiva: palabras que no existen en ninguna otra página del sitio | D | ★ |
| 3.5 | FAQ clonada: preguntas idénticas con el topónimo cambiado | D | ★ |
| 3.6 | Title/meta gemelos dentro del mismo sector | D | ○ |
| 3.7 | Plantilla visible: % de nodos del DOM comunes a todas las fichas | D | ○ (solapa 3.1) |
| 3.8 | Ratio anuncio/contenido | D | ✕ Auto Ads decide; no es editable por ficha |
| 3.9 | Página alcanzable pero visualmente vacía | D | ★ H |

### L4 · Motor de IA que quiere citar

| id | Candidata | Med | Veredicto |
|---|---|---|---|
| 4.1 | Frases autocontenidas: sujeto + cifra + año + fuente, sin depender del párrafo anterior | J | ★ |
| 4.2 | Atomicidad del dato: cada cifra clave vive en una frase que se puede extraer entera | D+J | ★ |
| 4.3 | Desambiguación: la ficha dice explícitamente provincia, sector y año junto a la cifra | D | ★ |
| 4.4 | Traza a fuente primaria en la misma pantalla que la cifra | D+J | ★ |
| 4.5 | Contradicción interna: dos cifras distintas para lo mismo en la misma página | D | ★ H |
| 4.6 | Consistencia con lo que ya dice el corpus sobre esa provincia | D | ○ (ver L12) |
| 4.7 | ¿Nos cita hoy algún motor para esa consulta? | X | ○ señal de resultado, no de calidad |
| 4.8 | `llms.txt` incluye la ficha | D | ○ |

### L5 · Jurista / verificador

| id | Candidata | Med | Veredicto |
|---|---|---|---|
| 5.1 | Cifras huérfanas: % de cifras sin referencia a artículo, tabla o boletín en su sección | D+J | ★ H |
| 5.2 | Sello "Verificado contra [boletín] + fecha", con el boletín correcto (forales BOB/BOG/BOTHA, BOCM, BOP; BOE solo si es estatal) | D | ★ H |
| 5.3 | HTML ↔ JSON: la tabla renderizada coincide con `data/convenios/*.json` | D | ★ H |
| 5.4 | Estado jurídico según `censo.json`, con el vocabulario correcto (decaído ≠ "congelado y aplicándose") | D | ★ H |
| 5.5 | Paradoja SMI bien construida: anual = mensual × pagas del articulado, contra 17.094 € | D+J | ★ H |
| 5.6 | Dato derivado marcado como estimación, con su fórmula | J | ★ H |
| 5.7 | Afirmación fáctica sin correlato en la fuente (invención) | J adversarial | ★ H |
| 5.8 | Afirmación tajante sobre derechos sin matiz ("tienes derecho a…" sin condiciones) | J | ★ |
| 5.9 | Régimen fiscal/territorial correcto (foral vs común; provincia vs CCAA) | D+J | ★ H |
| 5.10 | Enlaces a fuente oficial vivos y al documento exacto, no al buscador del boletín | X+J | ★ |
| 5.11 | Vigencia temporal de cada cifra (a qué año pertenece cada tabla) | D | ★ |
| 5.12 | Revisión salarial / cláusula de garantía reflejada si existe | J | ○ |
| 5.13 | Dictamen jurídico propio sobre casos dudosos | J | ✕ fuera de alcance: no somos asesoría |

### L6 · Arquitecto de información

| id | Candidata | Med | Veredicto |
|---|---|---|---|
| 6.1 | Profundidad desde la home (clicks) y no-orfandad | D | ★ H |
| 6.2 | Enlaces entrantes internos: cuántos y desde dónde (hub, hermana, guía) | D | ★ |
| 6.3 | Enlaces salientes contextuales en el cuerpo vs solo footer/nav | D | ★ |
| 6.4 | Cobertura de clúster: enlaza a hermanas del mismo sector y a otros sectores de la misma provincia | D | ★ |
| 6.5 | Anchor text descriptivo (sector + provincia), sin "aquí" ni repetición mecánica | D+J | ★ |
| 6.6 | Puente al Kit en el punto donde nace la necesidad, no al final | J | ★ |
| 6.7 | Enlaces internos rotos o anclas inexistentes | D | ★ H |
| 6.8 | Reciprocidad: si A enlaza a B, ¿B enlaza a A cuando tiene sentido? | D | ○ |
| 6.9 | Callejón sin salida (ninguna salida interna desde el cuerpo) | D | ○ |
| 6.10 | Enlaces con ancla `#` que inflan impresiones a 0% de CTR | D+X | ○ |
| 6.11 | PageRank interno estimado | D | ✕ modelo sin validar; 6.2 ya decide |

### L7 · Diseñador

| id | Candidata | Med | Veredicto |
|---|---|---|---|
| 7.1 | Tabla en móvil: contenedor con scroll propio, no desborda el body | D+navegador | ★ H |
| 7.2 | Verde al mínimo: valores salariales en tinta neutra; verde solo para el sello | D | ★ |
| 7.3 | Tokens del sistema: sin IBM Plex Mono ni estilos fuera de las variables | D | ★ H |
| 7.4 | Párrafos > 100 palabras; nota editorial fragmentada en 3-4 sub-párrafos etiquetados | D | ★ |
| 7.5 | Jerarquía de encabezados: un solo `h1`, sin saltos de nivel | D | ★ |
| 7.6 | Escaneabilidad: distancia media entre encabezados, listas, negritas con criterio | D+J | ○ |
| 7.7 | Footer legal completo (Privacidad · Aviso legal · Contacto) | D | ★ H |
| 7.8 | Conformidad con el canon Madrid sin borrar el contenido exclusivo | D+J | ★ |
| 7.9 | Tarjeta OG correcta | D | ○ |
| 7.10 | Peso de página y CLS por tablas | X | ○ |
| 7.11 | Dark mode correcto en tablas | D+navegador | ○ |
| 7.12 | Coherencia de iconografía / emojis entre fichas | J | ✕ ruido estético, no decide nada |

### L8 · Editor

| id | Candidata | Med | Veredicto |
|---|---|---|---|
| 8.1 | Sección que no aporta: bloques que nadie buscaría y solo alargan | J | ★ |
| 8.2 | Orden por importancia: lo más consultado por delante de lo accesorio | J+X | ★ |
| 8.3 | Redundancia interna: la misma idea en dos secciones de la misma ficha | D+J | ★ |
| 8.4 | Lo que falta y en esta provincia debería estar (y en otras no) | J | ★ |
| 8.5 | Legibilidad: longitud media de frase y densidad de subordinación | D | ○ |
| 8.6 | Jerga explicada en su primera aparición (ultraactividad, subrogación, absorción, prorrateo) | D+J | ★ |
| 8.7 | Categorías profesionales en lenguaje inclusivo, no copiadas del BOP en masculino | D | ★ H |
| 8.8 | Sindicatos en plural, sin protagonismo de CCOO/UGT sobre los combativos | D+J | ★ |
| 8.9 | Voz dirigida a la persona trabajadora, sin tono de folleto ni adjetivos vacíos | J | ○ |
| 8.10 | Autoría pública solo como "Telmo" | D | ★ H |
| 8.11 | Coherencia con la promesa de independencia publicada en /sobre | J | ★ H |
| 8.12 | Índice de sentimiento / tono | J | ✕ inmedible con estabilidad |

### L9 · Operador (tú, dentro de 6 meses)

| id | Candidata | Med | Veredicto |
|---|---|---|---|
| 9.1 | Frescura: días desde la verificación; ¿hay boletín posterior al sello? | D+X | ★ |
| 9.2 | Caducidad anunciada: la ficha declara cuándo dejará de ser válida (fin de vigencia, próxima revisión) | D+J | ★ |
| 9.3 | Cifras hardcodeadas en HTML que deberían venir del JSON | D | ★ |
| 9.4 | Ficha sin JSON asociado (54 HTML vs 30 JSON: mantenimiento a mano) | D | ★ |
| 9.5 | Drift generador: ¿regenerar revertiría contenido de esta ficha? | D | ★ H |
| 9.6 | Contadores del sitio (home, hub) coherentes con el censo | D | ★ H |
| 9.7 | Ventana de medición abierta: ¿se tocó hace poco y está midiendo tracción? | D | ★ (bloquea propuestas) |
| 9.8 | Deuda: `TODO`, comentarios y bloques comentados en el HTML | D | ○ |
| 9.9 | Coste de mantener esta ficha al año | J | ✕ estimación sin base |

### L10 · Competidor

| id | Candidata | Med | Veredicto |
|---|---|---|---|
| 10.1 | Ventaja declarada: ¿qué tiene esta ficha que no tenga el PDF del boletín? | J | ★ |
| 10.2 | Ventaja frente al agregador (Calculadornomina y similares): dato que ellos no dan | J | ★ |
| 10.3 | Cobertura de consulta: para las queries reales de esta URL, ¿respondemos mejor? | J+X | ○ |
| 10.4 | Posición y CTR frente a la media del corpus | X | ○ (priorización) |
| 10.5 | Auditoría del SERP en vivo | X | ✕ el SERP reescribe snippets; no es fuente de verdad |
| 10.6 | Cuota de citación en IA por consulta | X | ✕ no medible de forma sistemática hoy |

### L11 · Accesibilidad

| id | Candidata | Med | Veredicto |
|---|---|---|---|
| 11.1 | Tablas con `<th>`, `scope` y `<caption>`: audibles con lector de pantalla | D | ★ |
| 11.2 | Contraste de texto en ambos temas | D | ○ |
| 11.3 | Imágenes con `alt` significativo | D | ○ |
| 11.4 | Idioma declarado y foco visible | D | ○ |
| 11.5 | Auditoría WCAG completa | D+J | ✕ desproporcionada para este barrido |

### L12 · El corpus entero (métricas que no existen a nivel de ficha)

| id | Candidata | Med | Veredicto |
|---|---|---|---|
| 12.1 | Contradicción entre fichas: dos fichas afirman cosas incompatibles sobre la misma norma estatal o el mismo SMI | D+J | ★ H |
| 12.2 | SMI de referencia unificado en todas (17.094 € en 2026) | D | ★ H |
| 12.3 | Desviación estructural: fichas cuyo esqueleto se aleja del canon | D | ★ |
| 12.4 | Huecos de cobertura: sector×provincia con demanda y sin ficha | X | ○ (roadmap, no calidad) |
| 12.5 | Canibalización entre fichas por la misma consulta | X+J | ○ |
| 12.6 | Coherencia terminológica del corpus (un concepto, un nombre) | D | ★ |
| 12.7 | N de las comparativas coherente con el dataset | D | ★ H |

### L13 · Negocio (ordena el trabajo; no puntúa calidad)

| id | Candidata | Med | Veredicto |
|---|---|---|---|
| 13.1 | Clicks, impresiones, CTR sin filas `#`, posición media | X | ★ priorización |
| 13.2 | Sesiones y permanencia | X | ★ priorización |
| 13.3 | Páginas por sesión desde la ficha (palanca de ingresos identificada) | X | ○ |
| 13.4 | Esfuerzo estimado de arreglo vs impacto | J | ○ |
| 13.5 | Ingresos por ficha | X | ✕ AdSense no lo desglosa con fiabilidad a este nivel |

---

## 4 · Resultado del filtro

*(Cifras contadas sobre las tablas de arriba, no estimadas.)*

- **Candidatas generadas:** 119
- **★ Núcleo:** 76 — de las cuales **28 son hard-fails** (no puntúan: bloquean) y **48 puntúan** en el score compuesto
- **○ Segunda línea:** 30 (se recogen si el script ya pasa por ahí; fuera del score de la v1)
- **✕ Fuera:** 13 — `1.10 2.11 2.12 3.8 5.13 6.11 7.12 8.12 9.9 10.5 10.6 11.5 13.5`, por estos motivos:
  - *no cambia ninguna decisión*: 2.11 densidad de keyword, 8.12 índice de tono
  - *inmedible o inestable hoy*: 1.10 encuesta, 10.5 SERP en vivo, 10.6 cuota de citación IA, 11.5 WCAG completa, 9.9 coste anual, 13.5 ingresos por ficha
  - *solapada con otra mejor*: 2.12 nº de palabras (→ 3.2), 6.11 PageRank interno (→ 6.2), 3.7 plantilla DOM (→ 3.1, degradada a ○), 1.7 tiempo de lectura (→ 1.1, degradada a ○)
  - *fuera de alcance / no es nuestro papel*: 5.13 dictamen jurídico, 3.8 ratio anuncio/contenido, 7.12 coherencia de emojis

Candidatas generadas por lente: L5 verdad (13), L2 Google (12), L7 diseño (12), L8 edición (12), L6 enlazado (11), L1 trabajador (10), L3 AdSense (9), L9 operación (9), L4 IA (8), L12 corpus (7), L10 competencia (6), L11 accesibilidad (5), L13 negocio (5).

**Consecuencia del criterio 5 (discriminante):** lo que hoy cumplen las 54 fichas por igual no vale como nota — vale como alarma. Por eso 28 candidatas salen del score y entran en la lista de hard-fails. El compuesto se calcula solo sobre las 48 que efectivamente separan fichas.

---

## 5 · Lo que este ejercicio ha añadido sobre el enunciado inicial

Cosas que no estaban en la lista de partida y que las lentes han hecho aparecer:

- **L4 completa (citabilidad por IA)** — 4.1 a 4.5. Es un eje propio, no un subapartado de SEO.
- **L9 (mantenimiento)** — 9.2 caducidad anunciada, 9.3 cifras hardcodeadas, 9.4 fichas sin JSON, 9.7 ventana de medición abierta. Sin esto, la auditoría propone cambios sobre fichas que están midiendo tracción.
- **L12 (corpus)** — 12.1 y 12.2: contradicciones entre fichas. Ninguna auditoría por ficha las ve, por definición.
- **L11 (accesibilidad de tablas)** — 11.1. En un sitio cuyo activo son tablas salariales, que no sean audibles es un defecto de producto.
- **1.6 (traducción a nómina)** y **1.9 (salida cuando el dato no existe)** — las dos dudas más frecuentes y las peor cubiertas hoy.
- **10.1 / 10.2 (ventaja declarada)** — obliga a cada ficha a justificar por qué existe frente al boletín y frente al agregador.

---

## 6 · Decisiones ya tomadas

- Veredicto: **score 0-100 + hard-fails aparte**.
- Pesos: **verdad (L5) y unicidad (L3) por delante**; el reparto exacto está pendiente del punto siguiente.
- Alcance del primer barrido: **piloto de 6 fichas** para calibrar antes de gastar en 54.
- Salida: **mide y propone el parche concreto**, sin tocar HTML.

## 7 · Lo que falta cerrar

1. Recortar el núcleo de 76 (48 puntuables + 28 bloqueantes): ¿entran las 62 en la v1 o se arranca con un subconjunto?
2. Reparto de pesos entre las lentes que sí puntúan.
3. Qué 6 fichas entran en el piloto.
4. Cuántas de las ○ se recogen igualmente "porque el script ya pasa por ahí" (coste marginal cero).
