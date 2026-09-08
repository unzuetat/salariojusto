# Cola de correcciones — hallazgos verificados de la auditoría

Esta conversación **mide**; las correcciones se aplican aparte, en su rama. Aquí se acumulan
los hallazgos ya verificados a mano, para procesarlos por lotes y no abrir un hilo por cada uno.

Un hallazgo entra aquí solo si está **comprobado contra el archivo real**, no si lo dijo un agente.

---

## 1 · SMI 2026 mal en 9 fichas — 613 clics/28d
**Verificado:** 20-ago, cita textual en cada una. `hosteleria-alicante` · `limpieza-asturias` (130 clics) ·
`limpieza-bizkaia` (158) · `limpieza-laspalmas` (2) · `limpieza-malaga` (72) · `limpieza-murcia` (41) ·
`limpieza-sevilla` (22) · `limpieza-valencia` (64) · `limpieza-zaragoza` (124).

Dicen que el SMI 2026 es **16.576 €**; es **17.094 €**.

**No es buscar-y-reemplazar.** El error arrastra las frases que interpretan la diferencia:
Asturias dice "está 789,50 € por encima del SMI 2026 (16.576 €)" y contra el SMI real esa holgura
baja a 271,50 €. En alguna ficha el signo puede invertirse y convertir un "por encima" en un
"por debajo", que es el gancho editorial del sitio. Recalcular ficha a ficha con las pagas del
articulado antes de escribir.

## 2 · Dos fichas de comercio, indexables, fuera del hub `convenios.html`
**Verificado:** 20-ago con grep sobre el censo completo. De las 54 fichas, 4 no aparecen en el hub:

| ficha | indexable | en la home | veredicto |
|---|---|---|---|
| `convenio-tecnicos-espectaculos` | no | no | correcto (noindex deliberado) |
| `convenio-limpieza-catalunya` | no | no | correcto (noindex deliberado) |
| `convenio-comercio-madrid` | **sí** | sí | **falta en el hub** |
| `convenio-comercio-metal-bizkaia` | **sí** | sí | **falta en el hub** |

Las dos que faltan son del sector comercio: al abrir el sector se actualizó la home pero no el hub.
La norma de "tocar la home al añadir convenio" debe ampliarse al hub.

## 6 · El error del SMI invierte conclusiones editoriales — verificado a mano en 3 fichas

No es solo una cifra mal escrita. Con el SMI real (17.094 €) las afirmaciones se dan la vuelta.
Aritmética comprobada el 20-ago sobre las tablas publicadas:

**`limpieza-zaragoza`** — afirma *"Solo 1 de 19 categorías queda bajo el SMI 2026"*.
Recuento real sobre sus 19 categorías: **3 quedan por debajo**.

| categoría | bruto anual | vs SMI real |
|---|---|---|
| Aprendiz | 15.621,19 € | −1.472,81 € |
| **Limpiador/a** | 16.926,95 € | **−167,05 €** |
| **Peón** | 16.926,95 € | **−167,05 €** |

La ficha dice de Limpiador/a: *"está apenas 350,95 € por encima del SMI"*. Está **167,05 € por
debajo**. Y Limpiador/a es la categoría central del sector: es la cifra que va en el title y la que
busca la gente.

**`limpieza-asturias`** — sección insignia titulada *"Verificación A+B — todas las categorías cumplen
el SMI 2026"*, y en el cuerpo: *"Las 27 categorías del convenio cumplen formalmente el SMI 2026"*.
Aspirante Administrativo/a y Botones cobran 16.576,05 €: **517,95 € por debajo**, no *"apenas 5
céntimos por encima"* como afirma. La sección que vende nuestro protocolo de verificación es la que
está mal verificada.

**`hosteleria-valencia`** — no cita el SMI en ninguna parte, y publica en el hero *"De 1.100,46 €/mes
(ayudantes, riders)"*. Son 15 pagas: 1.100,46 × 15 = **16.506,90 €/año, 587,10 € por debajo del SMI**.
Un lector puede concluir que le corresponden 1.100,46 €/mes cuando su suelo legal son 1.221 €/mes.
La ficha con más tráfico del corpus (163 clics/28d) publica un salario ilegal sin advertirlo.

**Consecuencia para el orden de trabajo:** este hard-fail **no se acoge al freno de ventana abierta**.
Una cifra que invierte el sentido de la conclusión se corrige aunque la ficha esté midiendo tracción.

## 7 · Fuentes citadas pero no clicables — 4 de las 6 fichas del piloto
`tecnicos-espectaculos`, `comercio-madrid`, `limpieza-asturias` y `limpieza-zaragoza` tienen
`enlaces.externos_oficiales = []`: citan boletín, fecha, edicto, CVE y artículo —alguna hasta escribe
el dominio del BOP en texto plano seguido de *"para consulta y verificación independiente"*— pero no
hay nada que pinchar. Es el arreglo más barato del corpus: no toca ninguna cifra.


## 8 · El verde de los salarios es un problema de plantilla, no de ficha — 32 de 54
**Verificado:** 20-ago. La norma de casa dice salarios en tinta neutra. Se incumple en **32 de las
54 fichas** (~2.755 celdas de tabla), y no se veía porque **el verde no está inline: viaja en el CSS**.

El canon `hosteleria-madrid` no pinta ninguna celda, pero su hoja de estilos define:

- `td.sal{…color:var(--green)…}` (línea 179)
- dentro de `@media (max-width:720px)`: `.tabla-salarios td.sal,.tabla-salarios td.num{…color:var(--green)}` (línea 188)

Al clonar el canon, basta que una celda lleve `class="sal"` o `class="num"` para que el verde
aparezca; en móvil se fuerza incluso para `.num`. Peores casos: `hosteleria-malaga` (1.241 celdas),
`hosteleria-baleares` (173), `construccion-bizkaia` (136).

**Corrección de una creencia previa:** `metal-barcelona` y `metal-bizkaia` estaban anotados como
modelos "a cero verde". Es falso: pintan 28 y 84 celdas de salario respectivamente. No clonar de ahí.

**El arreglo es de plantilla**: cambiar esas dos reglas y propagar, no ir ficha a ficha.


## 9 · `limpieza-asturias` describe mal a `limpieza-zaragoza` en su comparativa (contradicción entre fichas)
**Verificado:** 20-ago, abriendo las dos fichas. La tabla comparativa de Asturias dice de Zaragoza:

> | Zaragoza | **Prorrogado Art. 5** + cláusulas diferidas | **~14\*** | 1.766 h | **1 de 19** (Aprendiz) |

Las tres celdas marcadas son falsas según la propia ficha de Zaragoza:

| celda en Asturias | lo que dice Zaragoza |
|---|---|
| "Prorrogado Art. 5" | *"la prórroga del Art. 5 NO operó"*; está en ultraactividad desde el 1-ene-2026, y el censo lo respalda (`estado: ultraactividad`) |
| "~14" pagas | *"Son 15 pagas en total al año (12 mensuales + 3 extras)"*, repetido en dos sitios |
| "1 de 19" bajo SMI | con el SMI real son **3 de 19** (ver punto 6) |

El asterisco de "~14\*" no tiene nota al pie en ninguna parte de la ficha. Tampoco hay excusa
temporal: el contenido de Zaragoza es del 30-jul y el último cambio de Asturias es del 4-ago.

Arrastra dos consecuencias más en la misma ficha: el cierre afirma que Asturias y Bizkaia son *"los
únicos convenios provinciales analizados"* con 15 pagas —Zaragoza es un tercero del mismo corpus— y
el enlace a Zaragoza lleva el anchor *"(prorrogado 2026)"*, que repite el error donde más se ve.

Es el tipo de fallo que ninguna auditoría ficha a ficha detecta, por definición: solo aparece
comparando el corpus consigo mismo.


## 10 · El enlazado interno es una estrella, no una red: cada ficha nueva enlaza a las viejas y ninguna vieja se actualiza
**Verificado:** 20-ago sobre el sector metal (9 fichas).

El clúster apunta hacia dentro pero no devuelve: `metal-bizkaia` recibe enlaces de 14 páginas y
`metal-barcelona` de 12, mientras **`metal-alava`, `metal-asturias` y `metal-sevilla` reciben 3**, y
los tres son `convenios.html`, `index.html` y `mapa-del-sitio.html` — es decir, ninguna ficha
hermana las enlaza. No es un defecto de esas fichas: es el proceso de publicación. Se repara
editando a las hermanas, no a la recién llegada.

**Ocurriendo ahora mismo:** `convenio-comercio-metal-barcelona.html` (creada hoy, aún sin commitear)
enlaza **5 veces** a `metal-barcelona`, y `metal-barcelona` no le devuelve **ninguno**.

**Propuesta de proceso:** al publicar una ficha nueva, el paso de "tocar la home" debe ampliarse a
"tocar la home, el hub y las dos o tres hermanas que deberían enlazarla". Ver también el punto 2:
dos fichas de comercio indexables siguen fuera del hub.

**Otros huecos verificados en el metal:**

- `metal-zaragoza` enlaza a seis hermanas del metal de otras provincias y a **ninguna** de sus dos
  vecinas de la misma provincia, que existen: `convenio-hosteleria-zaragoza.html` y
  `convenio-limpieza-zaragoza.html`. Quien busca "convenio Zaragoza" y cae en la ficha equivocada no
  tiene salida.
- `metal-barcelona` **no tiene ningún enlace al kit** de plantillas (0 coincidencias), único del
  clúster, y tampoco sección de reclamación.
- `metal-bizkaia` afirma tener un sistema "único en el corpus" y no enlaza a ninguno de los convenios
  con los que se compara.


## 11 · TRES fichas del metal afirman que Madrid tiene la antigüedad congelada; Madrid la tiene viva
**Verificado:** 20 y 24-ago, abriendo las cuatro fichas y el dataset. Resuelto por el verificador adversarial.

Lo afirman sin ninguna fuente:

- `metal-navarra:295` — *"mantiene la antigüedad por trienios, **que Madrid tiene congelada**"*
- `metal-zaragoza:449` — *"Es el mismo modelo que el metal de Barcelona y el de **Madrid**"*
- `metal-asturias:483` — *"frente a la antigüedad congelada de Zaragoza, **Madrid** y Barcelona"* ← **la encontró el verificador; ningún eje la había citado**

Madrid aporta las tres formas de respaldo: **artículo** (Art. 41, citado dos veces), **boletín** (BOCM nº 59,
declarado fuente de "todas las cifras salariales, quinquenios, bases de complementos") y **tabla** (siete
cuantías por grupo, 30,82–42,72 €/mes). Y su propio dataset lo confirma —`data/convenios/metal_mad.json`:
`"antiguedad": {"tipo": "quinquenios", "articulo": "Art. 41", "nota": "Máximo 5 quinquenios; la cuantía
se revaloriza cada año con las tablas"}`.

**Argumento estructural que lo cierra:** un *ad personam* congelado es individual y se consolida en una
fecha pasada —así lo describen la propia Zaragoza (31-12-1996) y Barcelona (31-12-1995/1999)—, y por eso
no puede publicarse como una columna con cuantía distinta por grupo que se revaloriza con la tabla del año.

**Qué corregir:** las frases de **Navarra, Zaragoza y Asturias**, no la columna de Madrid. Esto se sostiene
aunque el Art. 41 acabara diciendo otra cosa: incluso entonces, esas tres fichas estarían afirmando sin
fuente algo sobre una provincia ajena.

**Cautela:** no tocar la columna Quinquenio de Madrid sin cotejar antes el Art. 41 en el BOCM. Lo decidido
es dónde está la carga de la prueba, no la verdad material del artículo.

### Otros hallazgos del sector metal (sin verificar aún por la capa 2)

- `metal-zaragoza` **no tiene ni una línea sobre baja médica / IT** en toda la ficha.
- `metal-valencia` y `metal-zaragoza` **no dan ninguna cifra mensual**: Valencia publica el oficio en
  €/día y Zaragoza nueve tablas solo anuales, y ambas preguntan al lector "¿tu nómina llega al mínimo
  de convenio?" sin darle con qué compararla.
- **Ninguna de las nueve fichas del metal responde "trabajo media jornada, ¿cuánto me corresponde?"**.
  La única regla de proporcionalidad que aparece es para una paga de 400 €, no para el salario.


## 12 · `metal-gipuzkoa` no menciona su régimen fiscal foral ni una vez
**Verificado:** 20-ago con grep sobre las cuatro fichas del norte.

| ficha | menciones de "foral" |
|---|---|
| `metal-alava` | 9 |
| `metal-bizkaia` | 8 |
| `metal-navarra` | 5 |
| **`metal-gipuzkoa`** | **0** |

Gipuzkoa tiene régimen foral: su IRPF lo regula y recauda la Diputación Foral, no el Estado. Una
ficha de convenio que traduce el bruto a lo que la persona cobra y no lo advierte induce a error, y
choca con la regla del proyecto de que el País Vasco no es régimen común. Sus tres hermanas del norte
sí lo explican, así que el hueco es de esta ficha, no del sector.


## 13 · Cuatro fichas de Bizkaia citan el boletín equivocado en el SELLO de verificación
**Verificado:** 24-ago comparando los seis sellos del territorio. Es hard-fail 5.2 (boletín equivocado).

| ficha | sello actual | debería |
|---|---|---|
| `metal-bizkaia` | *"Verificado contra **el BOPV de la provincia**"* | BOB |
| `limpieza-bizkaia` | *"Verificado contra **el BOPV de la provincia**"* | BOB |
| `hosteleria-bizkaia` | *"Verificado contra **BOPV Núm. 4**"* | BOB |
| `construccion-bizkaia` | *"Verificado contra **el BOE** (BOE-A-2023-19330)"* | revisar: si se apoya en el convenio general estatal el BOE vale para esa parte, pero es una ficha provincial |

Sus dos hermanas lo hacen bien: `oficinas-bizkaia` cita "BOB nº 107 del 6 de junio de 2011" y
`comercio-metal-bizkaia` cita "el BOB". Y las de los otros territorios forales también: Gipuzkoa cita
BOG núm. 30 y Álava BOTHA núm. 18.

**"El BOPV de la provincia" es además incoherente en sí mismo:** el BOPV es el boletín autonómico del
País Vasco; los convenios provinciales de Bizkaia se publican en el Boletín Oficial de Bizkaia.

**Matiz importante — el BOPV en el CUERPO sí es correcto.** Las tres fichas lo citan bien para el
Acuerdo Interprofesional PRECO (BOPV de 4-abr-2000), que es una norma autonómica de verdad. El error
está solo en el sello, que es donde declaramos contra qué hemos verificado las tablas.

Ya lo detecta la capa 0: `scripts/audit/convenios-recolector.py` compara el sello con el boletín que
corresponde al territorio (BOB · BOG · BOTHA · BON · BOCM) y lo emite como hard-fail 5.2.

## 14 · `metal-gipuzkoa`: dos categorías bajo el SMI y la frase que lo esquiva
**Verificado:** 24-ago.

La tabla arranca en **16.597,44 €/año** (Aspirante 1.er año de economato): **496,56 € por debajo** del
SMI 2026. Otras dos categorías de aspirante quedan en 17.046,62 €, 47,38 € por debajo.

La ficha nunca lo dice. Lo que dice es: *"**Todas las categorías de oficio pleno** superan el SMI 2026
(17.094 € anuales)"*.

**No es falso —los aspirantes no son oficio pleno— pero esquiva el dato.** El lector que busca su
categoría de aspirante lee una frase tranquilizadora sobre un grupo al que no pertenece. En un sitio
cuyo gancho editorial es señalar quién cobra bajo el SMI, callarlo en la propia ficha es lo contrario
de lo que hacemos en Asturias o Zaragoza, donde se marca con ⚠.

Añádase que esta ficha tampoco menciona su régimen foral (punto 12): son los dos huecos de la misma página.


---

*Origen: `/sj-auditoria`, ejecución del 20-ago-2026.*

## 3 · `hosteleria-valencia` afirma una denuncia del convenio que no consta en ninguna fuente
**Verificado:** 20-ago contra `censo.json` y `data/convenios/hosteleria_vlc.json`. Ninguno de los dos
menciona denuncia ni fecha alguna. La ficha dice:

> "Lo que decae con la denuncia (los sindicatos **la presentó el octubre de 2025**) son las cláusulas obligacionales…"

La concordancia rota delata una plantilla mal rellenada; la fecha coincide con la denuncia real de
**Zaragoza** ("denunciado por CCOO el 2-oct-2025", censo). Es decir: un dato de otra provincia
colado en Valencia. Hard-fail **5.7** (afirmación sin correlato en la fuente) en la ficha con **más
tráfico del corpus** (163 clics/28d).

En la misma ficha, otro placeholder sin sustituir:

> "El convenio está en ultraactividad **desde tras el fin de la vigencia formal** del convenio"

## 4 · `limpieza-asturias` da dos códigos REGCON distintos para el mismo convenio
**Verificado:** 20-ago, ambos en la misma página.

- `33000735011979` — en la ficha técnica y en el bloque de fuentes oficiales
- `33000635011982` — en el bloque de sindicatos

Uno de los dos es falso. Hard-fail **4.5** (dos cifras distintas para lo mismo en la misma página).
Hay que cotejar cuál es el correcto en REGCON antes de tocar.

## 5 · Bloque «¿Cobras menos de lo que fija el convenio?» clonado en 29 fichas
**Verificado:** 20-ago con grep. 32 fichas contienen el bloque, **29** con la marca `bp-rotado`, y
**11** repiten literalmente el mismo "procedimiento de descuelgue (Art. 34)" en sectores y provincias
distintas — donde el artículo 34 no es el mismo artículo.

No es cromo: es doctrina jurídica clonada, y es el bloque que más lastra la singularidad del corpus.
`comercio-madrid` es el modelo: reescribió ese bloque con la vía real de su territorio (Instituto
Laboral de la CAM).
