# Hard-fails deterministas · 2026-08-20

Fichas analizadas: **55**
Hard-fails deterministas: **34** · avisos a verificar a mano: **136**

Un código con `*` es un aviso, no un bloqueo: la regla no puede distinguir sola el caso
legítimo del defecto, y la decisión es humana.

## Por código

| código | fichas |
|---|---|
| 11.1* | 54 |
| 7.4* | 37 |
| 7.2* | 32 |
| 2.2 | 10 |
| 12.2 | 9 |
| 12.2* | 8 |
| 5.1 | 7 |
| 7.1 | 6 |
| 4.5* | 4 |
| 5.2 | 1 |
| 2.6 | 1 |
| 5.4* | 1 |

## Por ficha

### convenio-hosteleria-alicante — 2 hard-fail(s), 4 aviso(s)
- **12.2** · presenta un SMI obsoleto COMO SI FUERA el de 2026 (real: 17.094 €) — rupo C queda por debajo del SMI (mínimo: 18.999,16 €/año para Nivel 6, muy por encima del SMI 2026 de 16.576 €/año). ¿Cómo se calcula mi antigüedad 
- **2.2** · sin bloque de responsable identificable ('Quién audita esto')
- *4.5** · 3 cifra(s) en el JSON-LD que no están en el texto visible (p. ej. 1.268,81 € en «¿Cuánto se cobra como mínimo en hostelería en Alicante en 20»)
- *11.1** · tablas no audibles: 5 sin scope, 5 sin caption (de 5)
- *7.2** · 97 celda(s) de tabla en verde (norma: salarios en tinta neutra) — clases: checklist, ejemplo-total, highlight, nota-editorial, num
- *7.4** · 3 bloque(s) de más de 100 palabras

### convenio-metal-barcelona — 2 hard-fail(s), 4 aviso(s)
- **2.2** · sin bloque de responsable identificable ('Quién audita esto')
- **7.1** · 2 tabla(s) sin contenedor con scroll y sin reflow a tarjetas → desborda en móvil
- *12.2** · cita cifras de SMI de años anteriores: 16.576, 1.184 (verificar si es referencia histórica legítima)
- *11.1** · tablas no audibles: 2 sin scope, 2 sin caption (de 2)
- *7.2** · 28 celda(s) de tabla en verde (norma: salarios en tinta neutra) — clases: checklist, ejemplo-total, nota-editorial, num, plus-cifra
- *7.4** · 4 bloque(s) de más de 100 palabras

### convenio-oficinas-madrid — 2 hard-fail(s), 4 aviso(s)
- **2.2** · sin bloque de responsable identificable ('Quién audita esto')
- **7.1** · 3 tabla(s) sin contenedor con scroll y sin reflow a tarjetas → desborda en móvil
- *12.2** · cita cifras de SMI de años anteriores: 16.576, 1.184 (verificar si es referencia histórica legítima)
- *11.1** · tablas no audibles: 3 sin scope, 3 sin caption (de 3)
- *7.2** · 42 celda(s) de tabla en verde (norma: salarios en tinta neutra) — clases: checklist, ejemplo-total, nota-editorial, num, plus-cifra
- *7.4** · 10 bloque(s) de más de 100 palabras

### convenio-hosteleria-gipuzkoa — 2 hard-fail(s), 3 aviso(s)
- **2.2** · sin bloque de responsable identificable ('Quién audita esto')
- **7.1** · 3 tabla(s) sin contenedor con scroll y sin reflow a tarjetas → desborda en móvil
- *11.1** · tablas no audibles: 3 sin scope, 3 sin caption (de 3)
- *7.2** · 30 celda(s) de tabla en verde (norma: salarios en tinta neutra) — clases: checklist, ejemplo-total, nota-editorial, num, plus-cifra
- *7.4** · 2 bloque(s) de más de 100 palabras

### convenio-hosteleria-laspalmas — 2 hard-fail(s), 3 aviso(s)
- **2.2** · sin bloque de responsable identificable ('Quién audita esto')
- **7.1** · 3 tabla(s) sin contenedor con scroll y sin reflow a tarjetas → desborda en móvil
- *11.1** · tablas no audibles: 3 sin scope, 3 sin caption (de 3)
- *7.2** · 75 celda(s) de tabla en verde (norma: salarios en tinta neutra) — clases: checklist, ejemplo-total, nota-editorial, num, plus-cifra
- *7.4** · 1 bloque(s) de más de 100 palabras

### convenio-hosteleria-malaga — 2 hard-fail(s), 2 aviso(s)
- **5.1** · 43% de las cifras están en secciones sin referencia a artículo/anexo/boletín (9 de 21)
- **2.6** · schema incompleto o inválido: {'Organization': 1, 'BreadcrumbList': 1}
- *11.1** · tablas no audibles: 24 sin scope, 24 sin caption (de 24)
- *7.2** · 1241 celda(s) de tabla en verde (norma: salarios en tinta neutra) — clases: callout-comp-tabla, nota-editorial, num

### convenio-oficinas-bizkaia — 2 hard-fail(s), 2 aviso(s)
- **2.2** · sin bloque de responsable identificable ('Quién audita esto')
- **7.1** · 2 tabla(s) sin contenedor con scroll y sin reflow a tarjetas → desborda en móvil
- *5.4** · 2 uso(s) de 'vigente' en ficha de convenio decaído — comprobar a qué convenio se refieren
- *11.1** · tablas no audibles: 2 sin scope, 2 sin caption (de 2)

### convenio-comercio-metal-bizkaia — 2 hard-fail(s), 2 aviso(s)
- **2.2** · sin bloque de responsable identificable ('Quién audita esto')
- **7.1** · 1 tabla(s) sin contenedor con scroll y sin reflow a tarjetas → desborda en móvil
- *12.2** · cita cifras de SMI de años anteriores: 1.184 (verificar si es referencia histórica legítima)
- *11.1** · tablas no audibles: 1 sin scope, 1 sin caption (de 1)

### convenio-hosteleria — 2 hard-fail(s), 1 aviso(s)
- **5.1** · 51% de las cifras están en secciones sin referencia a artículo/anexo/boletín (49 de 96)
- **2.2** · sin bloque de responsable identificable ('Quién audita esto')
- *11.1** · tablas no audibles: 2 sin scope, 2 sin caption (de 2)

### convenio-tecnicos-espectaculos — 2 hard-fail(s), 1 aviso(s)
- **5.2** · sin sello 'Verificado contra …'
- **2.2** · sin bloque de responsable identificable ('Quién audita esto')
- *7.4** · 2 bloque(s) de más de 100 palabras

### convenio-limpieza-zaragoza — 1 hard-fail(s), 4 aviso(s)
- **12.2** · presenta un SMI obsoleto COMO SI FUERA el de 2026 (real: 17.094 €) —  se publicó el 29-mar-2023 — unos 17 meses después. Solo 1 de 19 categorías queda bajo el SMI 2026 (16.576 €/año). La práctica totalidad del conve
- *4.5** · 1 cifra(s) en el JSON-LD que no están en el texto visible (p. ej. 167,05 € en «¿Cuál es el salario de una persona limpiadora en Zaragoza en»)
- *11.1** · tablas no audibles: 7 sin scope, 7 sin caption (de 7)
- *7.2** · 19 celda(s) de tabla en verde (norma: salarios en tinta neutra) — clases: callout-info, sal
- *7.4** · 16 bloque(s) de más de 100 palabras

### convenio-limpieza-asturias — 1 hard-fail(s), 3 aviso(s)
- **12.2** · presenta un SMI obsoleto COMO SI FUERA el de 2026 (real: 17.094 €) — ativo/a y Botones tienen un bruto anual de 16.576,05 € — apenas 5 céntimos por encima del SMI 2026 (16.576 €). Es una calibración deliberada del c
- *11.1** · tablas no audibles: 3 sin scope, 3 sin caption (de 3)
- *7.2** · 38 celda(s) de tabla en verde (norma: salarios en tinta neutra) — clases: callout-info, sal
- *7.4** · 8 bloque(s) de más de 100 palabras

### convenio-limpieza-bizkaia — 1 hard-fail(s), 3 aviso(s)
- **12.2** · presenta un SMI obsoleto COMO SI FUERA el de 2026 (real: 17.094 €) — más 3 pagas extras de 30 días cada una asciende a 18.140,40 € , claramente por encima del SMI 2026 (16.576 €). A esto se suman pluses como turnici
- *11.1** · tablas no audibles: 18 sin scope, 18 sin caption (de 18)
- *7.2** · 39 celda(s) de tabla en verde (norma: salarios en tinta neutra) — clases: callout-info, sal
- *7.4** · 5 bloque(s) de más de 100 palabras

### convenio-limpieza-catalunya — 1 hard-fail(s), 3 aviso(s)
- **5.1** · 89% de las cifras están en secciones sin referencia a artículo/anexo/boletín (64 de 72)
- *11.1** · tablas no audibles: 1 sin scope, 1 sin caption (de 1)
- *7.2** · 18 celda(s) de tabla en verde (norma: salarios en tinta neutra) — clases: callout-info, sal
- *7.4** · 1 bloque(s) de más de 100 palabras

### convenio-limpieza-laspalmas — 1 hard-fail(s), 3 aviso(s)
- **12.2** · presenta un SMI obsoleto COMO SI FUERA el de 2026 (real: 17.094 €) — nes de 223,28 € . Las filas marcadas en rojo son las categorías que quedan por debajo del SMI 2026 (16.576 €): el propio convenio reconoce que la 
- *11.1** · tablas no audibles: 14 sin scope, 14 sin caption (de 14)
- *7.2** · 24 celda(s) de tabla en verde (norma: salarios en tinta neutra) — clases: callout-info, sal
- *7.4** · 3 bloque(s) de más de 100 palabras

### convenio-limpieza-malaga — 1 hard-fail(s), 3 aviso(s)
- **12.2** · presenta un SMI obsoleto COMO SI FUERA el de 2026 (real: 17.094 €) —  3 pagas extras). Las filas marcadas en rojo son las categorías que quedan por debajo del SMI 2026 (16.576 €): la empresa está obligada a compleme
- *11.1** · tablas no audibles: 14 sin scope, 14 sin caption (de 14)
- *7.2** · 16 celda(s) de tabla en verde (norma: salarios en tinta neutra) — clases: callout-info, sal
- *7.4** · 2 bloque(s) de más de 100 palabras

### convenio-limpieza-murcia — 1 hard-fail(s), 3 aviso(s)
- **12.2** · presenta un SMI obsoleto COMO SI FUERA el de 2026 (real: 17.094 €) — +B: A) replicar la fórmula del propio convenio fila a fila, B) cruzar el resultado con el SMI 2026 (16.576 € anuales, art. 27.1 ET). Resultado par
- *11.1** · tablas no audibles: 3 sin scope, 3 sin caption (de 3)
- *7.2** · 19 celda(s) de tabla en verde (norma: salarios en tinta neutra) — clases: callout-info, sal
- *7.4** · 3 bloque(s) de más de 100 palabras

### convenio-limpieza-sevilla — 1 hard-fail(s), 3 aviso(s)
- **12.2** · presenta un SMI obsoleto COMO SI FUERA el de 2026 (real: 17.094 €) — sin plus especial 33,23 € 122,36 € — 16.588,02 € ⚠ Grupo IV Nivel I queda a solo 12 € del SMI 2026 (16.576 €). Cualquier descuento por asiduidad d
- *11.1** · tablas no audibles: 13 sin scope, 13 sin caption (de 13)
- *7.2** · 19 celda(s) de tabla en verde (norma: salarios en tinta neutra) — clases: callout-info, sal
- *7.4** · 2 bloque(s) de más de 100 palabras

### convenio-limpieza-valencia — 1 hard-fail(s), 3 aviso(s)
- **12.2** · presenta un SMI obsoleto COMO SI FUERA el de 2026 (real: 17.094 €) —  más consultada; se abre por defecto. Las categorías con retribución anual por debajo del SMI 2026 (16.576 €) tienen complemento obligatorio recon
- *11.1** · tablas no audibles: 13 sin scope, 13 sin caption (de 13)
- *7.2** · 12 celda(s) de tabla en verde (norma: salarios en tinta neutra) — clases: callout-info, sal
- *7.4** · 4 bloque(s) de más de 100 palabras

### convenio-hosteleria-barcelona — 1 hard-fail(s), 2 aviso(s)
- **5.1** · 38% de las cifras están en secciones sin referencia a artículo/anexo/boletín (61 de 159)
- *11.1** · tablas no audibles: 20 sin scope, 20 sin caption (de 20)
- *7.4** · 1 bloque(s) de más de 100 palabras

### convenio-hosteleria-madrid — 1 hard-fail(s), 2 aviso(s)
- **5.1** · 63% de las cifras están en secciones sin referencia a artículo/anexo/boletín (85 de 134)
- *12.2** · cita cifras de SMI de años anteriores: 1.184 (verificar si es referencia histórica legítima)
- *11.1** · tablas no audibles: 16 sin scope, 16 sin caption (de 16)

### convenio-hosteleria-valencia — 1 hard-fail(s), 2 aviso(s)
- **5.1** · 44% de las cifras están en secciones sin referencia a artículo/anexo/boletín (74 de 169)
- *11.1** · tablas no audibles: 20 sin scope, 20 sin caption (de 20)
- *7.4** · 2 bloque(s) de más de 100 palabras

### convenio-comercio-metal-barcelona — 1 hard-fail(s), 2 aviso(s)
- **2.2** · sin bloque de responsable identificable ('Quién audita esto')
- *11.1** · tablas no audibles: 3 sin scope, 3 sin caption (de 3)
- *7.4** · 6 bloque(s) de más de 100 palabras

### convenio-limpieza-edificios-locales — 1 hard-fail(s), 1 aviso(s)
- **5.1** · 73% de las cifras están en secciones sin referencia a artículo/anexo/boletín (108 de 148)
- *11.1** · tablas no audibles: 2 sin scope, 2 sin caption (de 2)

### convenio-hosteleria-cantabria — 0 hard-fail(s), 4 aviso(s)
- *12.2** · cita cifras de SMI de años anteriores: 16.576, 1.184 (verificar si es referencia histórica legítima)
- *11.1** · tablas no audibles: 10 sin scope, 10 sin caption (de 10)
- *7.2** · 93 celda(s) de tabla en verde (norma: salarios en tinta neutra) — clases: callout-comp-tabla, callout-info, highlight, nota-editorial, num
- *7.4** · 7 bloque(s) de más de 100 palabras

### convenio-hosteleria-girona — 0 hard-fail(s), 4 aviso(s)
- *12.2** · cita cifras de SMI de años anteriores: 1.184 (verificar si es referencia histórica legítima)
- *11.1** · tablas no audibles: 15 sin scope, 15 sin caption (de 15)
- *7.2** · 54 celda(s) de tabla en verde (norma: salarios en tinta neutra) — clases: callout-comp-tabla, callout-info, sal
- *7.4** · 1 bloque(s) de más de 100 palabras

### convenio-hosteleria-granada — 0 hard-fail(s), 4 aviso(s)
- *12.2** · cita cifras de SMI de años anteriores: 16.576 (verificar si es referencia histórica legítima)
- *11.1** · tablas no audibles: 8 sin scope, 8 sin caption (de 8)
- *7.2** · 71 celda(s) de tabla en verde (norma: salarios en tinta neutra) — clases: callout-comp-tabla, nota-editorial, num
- *7.4** · 6 bloque(s) de más de 100 palabras

### convenio-construccion-bizkaia — 0 hard-fail(s), 3 aviso(s)
- *11.1** · tablas no audibles: 8 sin scope, 8 sin caption (de 8)
- *7.2** · 136 celda(s) de tabla en verde (norma: salarios en tinta neutra) — clases: highlight, nota-editorial, num
- *7.4** · 1 bloque(s) de más de 100 palabras

### convenio-construccion-madrid — 0 hard-fail(s), 3 aviso(s)
- *4.5** · 1 cifra(s) en el JSON-LD que no están en el texto visible (p. ej. 28.446,14 € en «¿El convenio de Madrid paga más o menos que el de Bizkaia?»)
- *11.1** · tablas no audibles: 6 sin scope, 6 sin caption (de 6)
- *7.4** · 1 bloque(s) de más de 100 palabras

### convenio-hosteleria-baleares — 0 hard-fail(s), 3 aviso(s)
- *11.1** · tablas no audibles: 8 sin scope, 8 sin caption (de 8)
- *7.2** · 173 celda(s) de tabla en verde (norma: salarios en tinta neutra) — clases: callout-comp-tabla, checklist, nota-editorial, num, plus-cifra
- *7.4** · 2 bloque(s) de más de 100 palabras

### convenio-hosteleria-bizkaia — 0 hard-fail(s), 3 aviso(s)
- *11.1** · tablas no audibles: 6 sin scope, 6 sin caption (de 6)
- *7.2** · 82 celda(s) de tabla en verde (norma: salarios en tinta neutra) — clases: callout-comp-tabla, checklist, highlight, nota-editorial, num
- *7.4** · 1 bloque(s) de más de 100 palabras

### convenio-hosteleria-cadiz — 0 hard-fail(s), 3 aviso(s)
- *11.1** · tablas no audibles: 7 sin scope, 7 sin caption (de 7)
- *7.2** · 82 celda(s) de tabla en verde (norma: salarios en tinta neutra) — clases: callout-comp-tabla, highlight, nota-editorial, num
- *7.4** · 1 bloque(s) de más de 100 palabras

### convenio-hosteleria-maresme — 0 hard-fail(s), 3 aviso(s)
- *11.1** · tablas no audibles: 15 sin scope, 15 sin caption (de 15)
- *7.2** · 40 celda(s) de tabla en verde (norma: salarios en tinta neutra) — clases: callout-comp-tabla, callout-info, sal
- *7.4** · 2 bloque(s) de más de 100 palabras

### convenio-hosteleria-sevilla — 0 hard-fail(s), 3 aviso(s)
- *11.1** · tablas no audibles: 12 sin scope, 12 sin caption (de 12)
- *7.2** · 86 celda(s) de tabla en verde (norma: salarios en tinta neutra) — clases: callout-comp-tabla, callout-info, sal
- *7.4** · 1 bloque(s) de más de 100 palabras

### convenio-metal-bizkaia — 0 hard-fail(s), 3 aviso(s)
- *11.1** · tablas no audibles: 4 sin scope, 4 sin caption (de 4)
- *7.2** · 84 celda(s) de tabla en verde (norma: salarios en tinta neutra) — clases: highlight, nota-editorial, num
- *7.4** · 2 bloque(s) de más de 100 palabras

### convenio-seguridad-privada — 0 hard-fail(s), 2 aviso(s)
- *4.5** · 1 cifra(s) en el JSON-LD que no están en el texto visible (p. ej. 24.310,80 € en «¿Cuánto subirá mi salario en seguridad privada hasta 2030?»)
- *11.1** · tablas no audibles: 12 sin scope, 12 sin caption (de 12)

### convenio-contact-center — 0 hard-fail(s), 2 aviso(s)
- *11.1** · tablas no audibles: 5 sin scope, 5 sin caption (de 5)
- *7.4** · 1 bloque(s) de más de 100 palabras

### convenio-hosteleria-tarragona — 0 hard-fail(s), 2 aviso(s)
- *12.2** · cita cifras de SMI de años anteriores: 1.184 (verificar si es referencia histórica legítima)
- *11.1** · tablas no audibles: 11 sin scope, 11 sin caption (de 11)

### convenio-hosteleria-valladolid — 0 hard-fail(s), 2 aviso(s)
- *11.1** · tablas no audibles: 4 sin scope, 4 sin caption (de 4)
- *7.2** · 7 celda(s) de tabla en verde (norma: salarios en tinta neutra) — clases: callout-info, sal

### convenio-hosteleria-zaragoza — 0 hard-fail(s), 2 aviso(s)
- *11.1** · tablas no audibles: 13 sin scope, 13 sin caption (de 13)
- *7.2** · 25 celda(s) de tabla en verde (norma: salarios en tinta neutra) — clases: callout-comp-tabla, callout-info, sal

### convenio-limpieza-alicante — 0 hard-fail(s), 2 aviso(s)
- *11.1** · tablas no audibles: 11 sin scope, 11 sin caption (de 11)
- *7.2** · 30 celda(s) de tabla en verde (norma: salarios en tinta neutra) — clases: callout-info, sal

### convenio-limpieza-barcelona — 0 hard-fail(s), 2 aviso(s)
- *11.1** · tablas no audibles: 12 sin scope, 12 sin caption (de 12)
- *7.2** · 19 celda(s) de tabla en verde (norma: salarios en tinta neutra) — clases: callout-info, sal

### convenio-limpieza-tenerife — 0 hard-fail(s), 2 aviso(s)
- *11.1** · tablas no audibles: 4 sin scope, 4 sin caption (de 4)
- *7.4** · 2 bloque(s) de más de 100 palabras

### convenio-limpieza-madrid — 0 hard-fail(s), 2 aviso(s)
- *11.1** · tablas no audibles: 10 sin scope, 10 sin caption (de 10)
- *7.2** · 30 celda(s) de tabla en verde (norma: salarios en tinta neutra) — clases: callout-info, sal

### convenio-limpieza-pontevedra — 0 hard-fail(s), 2 aviso(s)
- *11.1** · tablas no audibles: 5 sin scope, 5 sin caption (de 5)
- *7.4** · 1 bloque(s) de más de 100 palabras

### convenio-metal-valencia — 0 hard-fail(s), 2 aviso(s)
- *11.1** · tablas no audibles: 7 sin scope, 7 sin caption (de 7)
- *7.2** · 17 celda(s) de tabla en verde (norma: salarios en tinta neutra) — clases: callout-info, sal

### convenio-metal-navarra — 0 hard-fail(s), 2 aviso(s)
- *11.1** · tablas no audibles: 4 sin scope, 4 sin caption (de 4)
- *7.4** · 1 bloque(s) de más de 100 palabras

### convenio-metal-asturias — 0 hard-fail(s), 2 aviso(s)
- *11.1** · tablas no audibles: 5 sin scope, 5 sin caption (de 5)
- *7.4** · 2 bloque(s) de más de 100 palabras

### convenio-metal-alava — 0 hard-fail(s), 2 aviso(s)
- *11.1** · tablas no audibles: 11 sin scope, 11 sin caption (de 11)
- *7.4** · 1 bloque(s) de más de 100 palabras

### convenio-metal-sevilla — 0 hard-fail(s), 2 aviso(s)
- *11.1** · tablas no audibles: 12 sin scope, 12 sin caption (de 12)
- *7.4** · 2 bloque(s) de más de 100 palabras

### convenio-oficinas-valencia — 0 hard-fail(s), 2 aviso(s)
- *11.1** · tablas no audibles: 4 sin scope, 4 sin caption (de 4)
- *7.2** · 9 celda(s) de tabla en verde (norma: salarios en tinta neutra) — clases: callout-info, sal

### convenio-comercio-madrid — 0 hard-fail(s), 2 aviso(s)
- *11.1** · tablas no audibles: 4 sin scope, 4 sin caption (de 4)
- *7.4** · 2 bloque(s) de más de 100 palabras

### convenio-metal-madrid — 0 hard-fail(s), 1 aviso(s)
- *11.1** · tablas no audibles: 5 sin scope, 5 sin caption (de 5)

### convenio-metal-gipuzkoa — 0 hard-fail(s), 1 aviso(s)
- *11.1** · tablas no audibles: 13 sin scope, 13 sin caption (de 13)

### convenio-metal-zaragoza — 0 hard-fail(s), 1 aviso(s)
- *11.1** · tablas no audibles: 9 sin scope, 9 sin caption (de 9)

## Sin hard-fails deterministas

convenio-seguridad-privada, convenio-contact-center, convenio-construccion-bizkaia, convenio-construccion-madrid, convenio-hosteleria-baleares, convenio-hosteleria-bizkaia, convenio-hosteleria-cadiz, convenio-hosteleria-cantabria, convenio-hosteleria-girona, convenio-hosteleria-granada, convenio-hosteleria-maresme, convenio-hosteleria-sevilla, convenio-hosteleria-tarragona, convenio-hosteleria-valladolid, convenio-hosteleria-zaragoza, convenio-limpieza-alicante, convenio-limpieza-barcelona, convenio-limpieza-tenerife, convenio-limpieza-madrid, convenio-limpieza-pontevedra, convenio-metal-bizkaia, convenio-metal-valencia, convenio-metal-madrid, convenio-metal-gipuzkoa, convenio-metal-navarra, convenio-metal-zaragoza, convenio-metal-asturias, convenio-metal-alava, convenio-metal-sevilla, convenio-oficinas-valencia, convenio-comercio-madrid
