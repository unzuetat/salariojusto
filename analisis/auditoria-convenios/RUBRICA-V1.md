# Rúbrica v1 · Auditoría de convenios

**Fecha:** 2026-08-20 · Deriva de `CANDIDATAS.md` (119 candidatas → 76 núcleo).
**Veredicto por ficha:** score 0-100 sobre 6 ejes + lista de hard-fails aparte, que no se compensan con buena nota.

---

## 1 · Qué entra y qué no

De las 76 del núcleo:

- **28 hard-fails** → no puntúan. Bloquean. Una ficha con hard-fail no tiene nota, tiene una tarea.
- **43 puntuables** → reparten los 100 puntos en 6 ejes.
- **5 pasan a contexto** (9.3, 9.4, 9.7, 13.1, 13.2): describen el estado operativo o el tráfico, no la calidad de la página. Ordenan el trabajo, no lo juzgan.

Un matiz que salió del propio filtro y conviene tener presente: **"la verdad pesa más" se materializa sobre todo como bloqueo, no como peso.** Nueve de las trece métricas de la lente jurídica son hard-fail. Lo que queda puntuable de verdad no es *si es cierto* (eso se da por exigido), sino **cómo se demuestra y cuánto aguanta el tiempo**.

---

## 2 · Los 6 ejes puntuables

| Eje | Peso | Métricas | Qué mide |
|---|---|---|---|
| **E1 · Verdad demostrada** | 22 | 2.1 · 5.8 · 5.10 · 5.11 · 9.1 · 9.2 | Que se vea el trabajo de verificación, que cada cifra tenga año, que las fuentes lleven al documento exacto y que la ficha declare cuándo caduca |
| **E2 · Singularidad y ventaja** | 22 | 3.1 · 3.2 · 3.3 · 3.4 · 3.5 · 8.4 · 10.1 · 10.2 | Cuánto de esta página no existe en ninguna otra (nuestra o ajena), y si declara por qué merece existir frente al PDF del boletín |
| **E3 · Respuesta al trabajador** | 20 | 1.1 · 1.2 · 1.3 · 1.4 · 1.6 · 1.9 | Si resuelve la duda que trajo a la persona: su cifra, su encaje, su nómina, su salida si cobra de menos |
| **E4 · Captación y citabilidad** | 14 | 2.4 · 2.5 · 4.1 · 4.2 · 4.3 · 4.4 | Que se haga clic desde el SERP y que una IA pueda extraer y atribuir la frase sin equivocarse |
| **E5 · Enlazado y clúster** | 12 | 6.2 · 6.3 · 6.4 · 6.5 · 6.6 | Cómo se llega, adónde lleva y si el clúster sector×provincia está tejido o son islas |
| **E6 · Forma y lectura** | 10 | 7.2 · 7.4 · 7.5 · 7.8 · 8.1 · 8.2 · 8.3 · 8.6 · 8.8 · 11.1 · 12.3 · 12.6 | Que se lea, que esté ordenada por importancia, que la jerga se explique y que la tabla sea audible |

**E1 + E2 = 44 puntos.** Verdad y unicidad por delante, como pediste.

El peso es del eje, no proporcional al número de métricas: E6 agrupa doce comprobaciones baratas que valen diez puntos entre todas, porque un fallo de forma no es un fallo de producto.

### Escala por métrica

`0` ausente o mal · `1` insuficiente · `2` correcto · `3` ejemplar (nivel canon).

Score del eje = (suma obtenida ÷ máximo del eje) × peso. Score de ficha = suma de los 6 ejes.
**Ninguna puntuación es válida sin evidencia citada** (`archivo:línea` + la frase). Una métrica sin evidencia se anota como *no evaluada*, y se dice — no se rellena con un 2.

---

## 3 · Los 28 hard-fails

Lista exacta: `2.2 2.3 2.6 2.8 2.9 3.9 4.5 5.1 5.2 5.3 5.4 5.5 5.6 5.7 5.9 6.1 6.7 7.1 7.3 7.7 8.7 8.10 8.11 9.5 9.6 12.1 12.2 12.7`

**Verdad (9):** 5.1 cifra huérfana · 5.2 sello ausente o boletín equivocado · 5.3 HTML≠JSON · 5.4 estado jurídico mal nombrado · 5.5 paradoja SMI mal construida · 5.6 dato derivado sin marcar como estimación · 5.7 afirmación sin correlato en la fuente · 5.9 régimen foral/común incorrecto · 4.5 dos cifras distintas para lo mismo en la misma página.

**E-E-A-T e indexación (5):** 2.2 sin responsable identificable · 2.3 fecha de actualización falsa · 2.6 schema roto o ausente · 2.8 canonical/noindex incoherente · 2.9 fuera de sitemap.

**Acceso (3):** 6.1 huérfana o enterrada · 6.7 enlace interno roto · 3.9 alcanzable pero visualmente vacía.

**Norma de casa (8):** 7.1 tabla que desborda el body en móvil · 7.3 fuera de los tokens de diseño · 7.7 footer legal incompleto · 8.7 categorías no inclusivas · 8.10 autoría distinta de "Telmo" · 8.11 contradice la promesa de independencia · 9.5 el generador revertiría la ficha · 9.6 contadores de home/hub descuadrados con el censo.

**Corpus (3):** 12.1 dos fichas se contradicen · 12.2 SMI de referencia desalineado · 12.7 N de comparativas incoherente con el dataset.

*(5.8 —afirmación tajante sin matiz— se queda puntuable en E1: es un defecto de matiz, no de verdad. Si además resulta falsa, entra por 5.7.)*

---

## 4 · Contexto que no puntúa pero decide

| Métrica | Uso |
|---|---|
| 13.1 clicks/impresiones/CTR (sin filas `#`) · 13.2 sesiones y permanencia | Orden de ataque: qué ficha se arregla primero |
| 9.3 cifras hardcodeadas · 9.4 ficha sin JSON | Coste de mantener el arreglo |
| **9.7 ventana de medición abierta** | **Freno.** Si la ficha se tocó hace poco y está midiendo tracción, la auditoría anota pero **no propone tocarla** |

---

## 5 · Piloto de calibración: 6 fichas

Elegidas para **maximizar la varianza**, no el tráfico: si la rúbrica no separa estas seis, no separará nada.

| Ficha | Por qué está | Texto visible | GSC 28d |
|---|---|---|---|
| `convenio-tecnicos-espectaculos.html` | Suelo del corpus: la más corta y **sin sello Verificado** → debe disparar hard-fails | 12.121 | sin datos en top |
| `convenio-comercio-madrid.html` | Sector nuevo, publicada el 18-ago → prueba el freno 9.7 y la suficiencia en fichas jóvenes | 17.385 | reciente |
| `convenio-limpieza-asturias.html` | 7.511 impresiones con **CTR 1,73%**: mucha demanda, poco clic → prueba E4 | ~ | 130 clics · pos 6,33 |
| `convenio-metal-sevilla.html` | Salario **por día** + columna anual estimada → prueba 5.6 (derivado marcado) y 5.11 | 41.459* | — |
| `convenio-limpieza-zaragoza.html` | La más larga del corpus → prueba si más largo es mejor, y 8.3 redundancia interna | 47.617 | 124 clics · CTR 4,4% |
| `convenio-hosteleria-valencia.html` | Techo de tráfico del corpus → el coste de equivocarse aquí es el más alto | 39.931 | 163 clics · pos 7,2 |

Cubre 5 sectores, los dos extremos de longitud, los dos extremos de CTR, una ficha con hard-fail conocido y una en ventana de medición abierta.
*(La cifra de `metal-sevilla` es la de `hosteleria-sevilla` en el sondeo anterior; se recuenta al arrancar.)*

---

## 6 · Arquitectura de medición

**Capa 0 · Determinista (antes de cualquier agente).** Un script recolecta todo lo medible por regla sobre las 54 fichas y deja un JSON por ficha: cifras extraídas, prosa fuera de tabla, ratios, grafo de enlaces, headings, schema, sello, estado del censo, HTML↔JSON, fechas de git. Reutiliza `singularidad.sh`, `alcance.sh`, `invariantes.sh`, `convenios-patron.sh`, `comparativas.sh`, `censo-convenios.js`.
*Regla: ningún agente estima lo que un script ya sabe.* El agente recibe los números hechos.

**Capa 1 · Seis agentes de juicio, uno por eje.** Cada uno recibe la ficha, el JSON determinista y su porción de rúbrica; devuelve una puntuación 0-3 por métrica con evidencia obligatoria. Corren en paralelo y no se ven entre sí — que E3 no sepa qué opinó E6 es lo que hace que las notas sean independientes.

**Capa 2 · Verificador adversarial.** Recibe cada hallazgo e intenta **refutarlo**. Un hallazgo que no sobrevive no llega al informe. Es el seguro contra el defecto clásico de estos barridos: hallazgos plausibles y falsos.

**Capa 3 · Sintetizador.** Compone score, hard-fails, redacta el parche propuesto para cada defecto (sin tocar HTML) y aplica el freno 9.7.

Salida: `analisis/auditoria-convenios/<fecha>/` → `fichas/<slug>.md` (informe con evidencia) · `matriz.csv` (una fila por ficha, comparable entre pasadas) · `RESUMEN.md` (hard-fails del corpus, patrones transversales, 10 acciones de mayor retorno).

---

## 7 · Lo que este diseño asume, y conviene saber

- La rúbrica se calibra **con** el piloto: si un eje da la misma nota a las seis, ese eje no discrimina y hay que rehacerlo, no defenderlo.
- Las métricas de juicio con evidencia obligatoria son estables en el *hallazgo*, menos en el *número*. El informe por ficha vale más que el score; el score sirve para ver la tendencia de la misma ficha entre pasadas, no para ordenar un ranking al punto.
- Nada de esto toca HTML.
