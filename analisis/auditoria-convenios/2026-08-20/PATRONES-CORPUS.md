# Patrones transversales del corpus · 2026-08-20

Los agentes de juicio encontraron defectos que resultaron ser **sistémicos**. Aquí están
medidos sobre las **55 fichas** del censo.

**Regla de lectura:** un defecto que afecta a más de la mitad del corpus no se arregla ficha
a ficha. Se arregla en la plantilla, o en el proceso que las produce.

## Defectos por alcance

| patrón | alcance | dónde se arregla |
|---|---|---|
| Tablas sin `scope` ni `caption` (no audibles) | **54 de 55 (98%)** | plantilla |
| Bloques de más de 100 palabras | **37 de 55 (67%)** | plantilla |
| Salarios en verde en tablas | **32 de 55 (58%)** | plantilla |
| Con ficha hermana en su MISMA provincia y sin enlazarla | **28 de 55 (51%)** | proceso |
| Registro pobre en censo.json (1 o 0 de 4 campos útiles) | **22 de 55 (40%)** | registro |
| Islas: 3 o menos páginas las enlazan | **12 de 55 (22%)** | proceso |
| Fuentes citadas pero NO clicables (0 enlaces oficiales) | **11 de 55 (20%)** | arreglo barato |
| Sin bloque de responsable identificable («Quién audita esto») | **10 de 55 (18%)** | plantilla |
| Citan un SMI obsoleto como si fuera el de 2026 | **9 de 55 (16%)** | urgente |
| Sin fecha de actualización visible | **8 de 55 (15%)** | plantilla |
| No mencionan el SMI en ninguna parte | **8 de 55 (15%)** | revisar |
| Más de un tercio de sus cifras en secciones sin fuente | **7 de 55 (13%)** | ficha a ficha |
| Sin ningún enlace al kit de plantillas | **5 de 55 (9%)** | ficha a ficha |
| Cifras que solo existen en el JSON-LD, no en el texto visible | **4 de 55 (7%)** | ficha a ficha |

## Detalle

### Tablas sin `scope` ni `caption` (no audibles) — 54 de 55 (98%)

Un lector de pantalla recorre la escala salarial sin saber a qué columna pertenece cada cifra.

`comercio-madrid` · `comercio-metal-barcelona` · `comercio-metal-bizkaia` · `construccion-bizkaia` · `construccion-madrid` · `contact-center` · `hosteleria-alicante` · `hosteleria-baleares` · `hosteleria-barcelona` · `hosteleria-bizkaia` · `hosteleria-cadiz` · `hosteleria-cantabria` … y 42 más

### Bloques de más de 100 palabras — 37 de 55 (67%)

`comercio-madrid` · `comercio-metal-barcelona` · `construccion-bizkaia` · `construccion-madrid` · `contact-center` · `hosteleria-alicante` · `hosteleria-baleares` · `hosteleria-barcelona` · `hosteleria-bizkaia` · `hosteleria-cadiz` · `hosteleria-cantabria` · `hosteleria-gipuzkoa` … y 25 más

### Salarios en verde en tablas — 32 de 55 (58%)

El color entra por css (.num/.sal), no inline: se arregla en el canon, no ficha a ficha.

`construccion-bizkaia` · `hosteleria-alicante` · `hosteleria-baleares` · `hosteleria-bizkaia` · `hosteleria-cadiz` · `hosteleria-cantabria` · `hosteleria-gipuzkoa` · `hosteleria-girona` · `hosteleria-granada` · `hosteleria-laspalmas` · `hosteleria-malaga` · `hosteleria-maresme` … y 20 más

### Con ficha hermana en su MISMA provincia y sin enlazarla — 28 de 55 (51%)

Quien busca «convenio <provincia>» y cae en el sector equivocado no tiene salida; son 61 enlaces que faltan entre fichas que ya existen.

`comercio-madrid` · `comercio-metal-bizkaia` · `construccion-bizkaia` · `construccion-madrid` · `hosteleria-alicante` · `hosteleria-barcelona` · `hosteleria-bizkaia` · `hosteleria-gipuzkoa` · `hosteleria-madrid` · `hosteleria-sevilla` · `hosteleria-valencia` · `hosteleria-zaragoza` … y 16 más

### Registro pobre en censo.json (1 o 0 de 4 campos útiles) — 22 de 55 (40%)

Sin boletín citado, sin fecha de fin de vigencia, sin particularidad anotada y sin ratificar: el estado de esa ficha no se puede comprobar sin abrir el html, que es justo lo que el censo evita.

`hosteleria` · `hosteleria-barcelona` · `hosteleria-girona` · `hosteleria-laspalmas` · `hosteleria-maresme` · `hosteleria-tarragona` · `hosteleria-valencia` · `limpieza-asturias` · `limpieza-barcelona` · `limpieza-edificios-locales` · `limpieza-laspalmas` · `limpieza-madrid` … y 10 más

### Islas: 3 o menos páginas las enlazan — 12 de 55 (22%)

Normalmente solo hub + home + mapa: ninguna hermana las enlaza.

`comercio-metal-barcelona` · `comercio-metal-bizkaia` · `construccion-madrid` · `contact-center` · `hosteleria-laspalmas` · `limpieza-catalunya` · `limpieza-pontevedra` · `metal-alava` · `metal-asturias` · `metal-sevilla` · `seguridad-privada` · `tecnicos-espectaculos`

### Fuentes citadas pero NO clicables (0 enlaces oficiales) — 11 de 55 (20%)

Citan boletín, fecha y artículo, pero el lector no puede pinchar en nada.

`comercio-madrid` · `hosteleria-baleares` · `hosteleria-bizkaia` · `hosteleria-cantabria` · `hosteleria-madrid` · `limpieza-asturias` · `limpieza-bizkaia` · `limpieza-laspalmas` · `limpieza-murcia` · `limpieza-zaragoza` · `tecnicos-espectaculos`

### Sin bloque de responsable identificable («Quién audita esto») — 10 de 55 (18%)

E-e-a-t: hard-fail 2.2.

`comercio-metal-barcelona` · `comercio-metal-bizkaia` · `hosteleria-alicante` · `hosteleria-gipuzkoa` · `hosteleria-laspalmas` · `hosteleria` · `metal-barcelona` · `oficinas-bizkaia` · `oficinas-madrid` · `tecnicos-espectaculos`

### Citan un SMI obsoleto como si fuera el de 2026 — 9 de 55 (16%)

El smi 2026 es 17.094 €.

`hosteleria-alicante` · `limpieza-asturias` · `limpieza-bizkaia` · `limpieza-laspalmas` · `limpieza-malaga` · `limpieza-murcia` · `limpieza-sevilla` · `limpieza-valencia` · `limpieza-zaragoza`

### Sin fecha de actualización visible — 8 de 55 (15%)

`comercio-metal-barcelona` · `comercio-metal-bizkaia` · `hosteleria-alicante` · `hosteleria-gipuzkoa` · `hosteleria` · `oficinas-bizkaia` · `oficinas-madrid` · `tecnicos-espectaculos`

### No mencionan el SMI en ninguna parte — 8 de 55 (15%)

Si alguna categoría queda por debajo, el lector no se entera.

`construccion-bizkaia` · `construccion-madrid` · `hosteleria-baleares` · `hosteleria-bizkaia` · `hosteleria-cadiz` · `hosteleria-laspalmas` · `hosteleria-malaga` · `metal-bizkaia`

### Más de un tercio de sus cifras en secciones sin fuente — 7 de 55 (13%)

`hosteleria-barcelona` · `hosteleria-madrid` · `hosteleria-malaga` · `hosteleria-valencia` · `hosteleria` · `limpieza-catalunya` · `limpieza-edificios-locales`

### Sin ningún enlace al kit de plantillas — 5 de 55 (9%)

`hosteleria-alicante` · `hosteleria-laspalmas` · `metal-barcelona` · `oficinas-bizkaia` · `oficinas-madrid`

### Cifras que solo existen en el JSON-LD, no en el texto visible — 4 de 55 (7%)

La cifra obsoleta vive en la capa que leen los motores.

`construccion-madrid` · `hosteleria-alicante` · `limpieza-zaragoza` · `seguridad-privada`

## Bloques de texto clonados

Repeticiones literales entre fichas. No todo lo repetido es un defecto —el aviso legal o la
metodología pueden repetirse— pero la doctrina jurídica no: el «Art. 34» de una provincia no
es el «Art. 34» de otra.

| bloque | fichas |
|---|---|
| bloque «¿Cobras menos…?» | **32 de 55 (58%)** |
| marca bp-rotado | **29 de 55 (53%)** |
| «procedimiento de descuelgue (Art. 34)» | **11 de 55 (20%)** |
| firma «no somos un bufete» | **0 de 55 (0%)** |
| «verificamos cifra a cifra» | **0 de 55 (0%)** |
