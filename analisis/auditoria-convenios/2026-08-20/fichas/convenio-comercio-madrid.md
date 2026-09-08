# convenio-comercio-madrid

**Score: 69.8/100** · hard-fails: **0**

Sector comercio · estado `vigente` · 2274 palabras de prosa · boilerplate 0.022 · último cambio hace 2 días · **ventana de medición abierta**

## Ejes

**Cuello de botella: E5 (40.0% de su peso).** Es por donde empieza el arreglo.

| eje | | puntos | peso |
|---|---|---|---|
| E1 | Verdad demostrada | 13.4 | 22 |
| E2 | Singularidad y ventaja | 17.8 | 22 |
| E3 | Respuesta al trabajador | 16.0 | 20 |
| E4 | Captación y citabilidad | 11.7 | 14 |
| E5 | Enlazado y clúster | 4.8 | 12 |
| E6 | Forma y lectura | 6.1 | 10 |

### E1 · Verdad demostrada

**🔴 5.10 — 0/3**

El JSON determinista da enlaces.externos_oficiales = [] y el HTML lo confirma: no hay un solo enlace externo en el cuerpo. La referencia escrita es de las mejores del piloto (número de BOCM, fecha, código REGCON, incluso la modificación posterior), pero el lector no puede pinchar en ninguna parte para llegar al documento.

> `convenio-comercio-madrid.html:420` — fue suscrito el <strong>18 de junio de 2025</strong> y publicado en el <strong>BOCM Núm. 183 del 2 de agosto de 2025</strong> con las tablas salariales de los cuatro años (2025-2028).

**Parche propuesto (APLAZADO: ventana de medición abierta):** Enlazar las dos publicaciones que la ficha ya cita por número y fecha, en 'Marco legal y contactos' y en el source-footer de Datos clave: BOCM nº 183 de 2-ago-2025 (texto íntegro y tablas 2025-2028) y BOCM nº 151 de 27-jun-2026 (modificación del art. 40), ambas al PDF/edicto concreto de la sede del BOCM, y el código 28000805011982 al registro REGCON (https://expinterweb.mites.gob.es/regcon/). Con eso pasa de 0 a 3 sin tocar una sola cifra.

**🟢 2.1 — 2/3**

Hay trabajo propio visible en varias secciones —la aclaración de que la tabla oficial usa una etiqueta heredada, el checklist de verificación de nómina, el ángulo del permiso climático— pero no hay ningún cálculo propio explicado ni histórico de negociación: el resto es transcripción ordenada del BOCM.

> `convenio-comercio-madrid.html:179` — La tabla oficial nombra esta categoría como «dependiente/a vendedor/a (mayor de 22)», una etiqueta heredada que la distingue del ayudante de vendedor del Grupo I.
> `convenio-comercio-madrid.html:370` — Si te corresponde, figuran los pluses de penosidad o peligrosidad (103 €/mes cada uno)

**🟢 5.8 — 2/3**

Las afirmaciones llevan su condición y su artículo (nocturnidad con su excepción, peligrosidad con su incompatibilidad), pero el bloque de reclamación afirma que ninguna cláusula depende de la voluntad de la empresa sin mencionar el descuelgue del art. 82.3 ET, que es precisamente el caso límite frecuente. Por eso no llega a 3.

> `convenio-comercio-madrid.html:332` — Recargo del 25% para el trabajo nocturno, salvo que el salario ya se establezca atendiendo a que el trabajo sea nocturno por su naturaleza (Art. 27).
> `convenio-comercio-madrid.html:383` — El convenio está plenamente vigente y eres titular de derechos exigibles: la tabla salarial, los pluses regulados, la jornada máxima, las pagas extras y las protecciones por incapacidad. Ninguna de esas cláusulas depende de la voluntad de la empresa.

**🟢 9.1 — 2/3**

Fecha de verificación concreta y posterior al último boletín que la propia ficha cita (13-ago-2026 > 27-jun-2026), y el bloque de autoría dice qué se cotejó. No llega a 3 porque tanto el sello como ese bloque certifican solo contra el BOCM 183/2025, mientras el contenido de jornada descansa en el BOCM 151 de 27-jun-2026 que aparece en el cuerpo: el sello no cubre todo lo que la página afirma.

> `convenio-comercio-madrid.html:174` — <strong>✓ Verificado</strong> contra BOCM Núm. 183/2025 por SalarioJusto · última revisión 13 de agosto de 2026
> `convenio-comercio-madrid.html:299` — La modificación del BOCM Núm. 151 (27-jun-2026) aclaró la redacción de este artículo.

**🟢 9.2 — 2/3**

Dice hasta cuándo valen estas tablas y ya publica las de 2027 y 2028, que es más que anunciar la caducidad. No llega a 3 porque no dice qué vigilar: la propia ficha demuestra en el cuerpo que el convenio se modifica a mitad de vigencia (BOCM 151/2026 sobre el art. 40) y nunca advierte al lector de que eso puede repetirse.

> `convenio-comercio-madrid.html:197` — <strong>Futuro.</strong> Subidas del IPC del año anterior con mínimo y máximo garantizado del 3% cada año hasta 2028.
> `convenio-comercio-madrid.html:420` — Vigencia: 1 de enero de 2025 a 31 de diciembre de 2028.

**🔵 5.11 — 3/3**

Es la única ficha del piloto que publica las cuatro tablas del convenio en pestañas y marca explícitamente cuál es la vigente, de modo que histórica, actual y futura quedan separadas sin ambigüedad; además el epígrafe de pluses fecha sus cuantías, así que las cifras que el determinista marca sin año heredan el año del encabezado padre.

> `convenio-comercio-madrid.html:218` — <button class="year-tab active" data-year="2026" role="tab" aria-selected="true">2026 (vigente)</button>
> `convenio-comercio-madrid.html:313` — <h2>Pluses y complementos (cuantías 2026)</h2>

> Ficha en ventana de medición abierta (operacion.ultimo_commit 2026-08-18, 1 día): el único parche propuesto —enlazar las fuentes— queda aplazado. Es el mejor ejemplo del piloto de la paradoja transversal: la traza escrita hacia el BOCM es impecable (número, fecha, código, incluso la modificación posterior) y la traza clicable es inexistente. Si se enlazan las dos publicaciones que ya cita, esta ficha se convierte en la referencia de E1 para el resto del corpus. No es SMI: menciona el SMI pero no lo cifra (JSON: smi.smi_obsoleto_citado = []), así que se libra del error de 16.576 € que sí arrastran las dos fichas de limpieza del piloto.

### E2 · Singularidad y ventaja

**🟢 3.2/3.3 — 2/3**

palabras_prosa 2274 con ratio_tabla 0.137: la prosa explica bien qué tabla te toca y desactiva una trampa de la tabla oficial, pero el grueso de las secciones (pluses, vacaciones, pagas, IT) describe articulado en vez de explicar las cuatro tablas por año.

> `convenio-comercio-madrid.html:179` — La tabla oficial nombra esta categoría como «dependiente/a vendedor/a (mayor de 22)», una etiqueta heredada que la distingue del ayudante de vendedor del Grupo I.
> `convenio-comercio-madrid.html:210` — Este convenio es el "cajón de sastre" del comercio madrileño para las actividades sin convenio específico.

**🟢 3.4 — 2/3**

frases_exclusivas 89 de 91: hay hechos propios reales (permiso climático, ascenso automático, compensación por jubilación anticipada), pero salen de leer el BOCM, no de investigar; nada dice cuán raros son esos hechos fuera de Madrid.

> `convenio-comercio-madrid.html:362` — el auxiliar de caja y el ayudante de vendedor pasan automáticamente a cajero/a y dependiente/a vendedor/a al cumplir <strong>2 años de antigüedad</strong>, con todos los efectos legales (Disposición Adicional Cuarta) — un ascenso de grupo garantizado sin depender de la voluntad de la empresa.
> `convenio-comercio-madrid.html:361` — <strong>5.200 €</strong> a los 60 años, 4.000 € a los 61, 3.400 € a los 62, 2.800 € a los 63 y 2.200 € a los 64.

**🟢 8.4 — 2/3**

la particularidad que el censo registra ('Permiso climático (art.95)') está recogida con h2 propio, mención en el hero y FAQ, pero no organiza la ficha ni se contextualiza: se afirma que es 'poco habitual' sin decir frente a qué ni de dónde viene.

> `convenio-comercio-madrid.html:302` — Permiso climático retribuido — Art. 95
> `convenio-comercio-madrid.html:197` — un <strong>permiso climático retribuido</strong> por alertas AEMET naranja o roja — poco habitual en la negociación colectiva.

**🟢 10.2 — 2/3**

hay una ventaja identificable sobre la cifra pelada del agregador —traza al edicto con fecha de revisión y una corrección de la nomenclatura oficial—, pero se percibe leyendo, no de un vistazo: el sello es idéntico en todo el corpus.

> `convenio-comercio-madrid.html:174` — <strong>✓ Verificado</strong> contra BOCM Núm. 183/2025 por SalarioJusto · última revisión 13 de agosto de 2026
> `convenio-comercio-madrid.html:299` — La modificación del BOCM Núm. 151 (27-jun-2026) aclaró la redacción de este artículo.

**🔵 3.1 — 3/3**

boilerplate_ratio 0.022 y solo 2 frases compartidas, ambas del bloque E-E-A-T (cromo legítimo); es la única de las seis fichas que no arrastra el bloque plantillado '¿Cobras menos?' —aquí está reescrito con la vía de conflicto propia de Madrid.

> `convenio-comercio-madrid.html:387` — presenta papeleta de conciliación ante el <strong>Instituto Laboral de la Comunidad de Madrid</strong> (al que el convenio somete expresamente sus conflictos, Disp. Transitoria Primera)
> `convenio-comercio-madrid.html:439` — No somos un bufete: somos una herramienta gratuita de transparencia salarial, sin empresas detrás.

**🔵 3.5 — 3/3**

faq_clonadas 0 de faq_total 4 (el determinista no cuenta la quinta pregunta del bloque) y dos preguntas solo tienen sentido en este convenio: nadie puede preguntar por el permiso climático o por la DA Cuarta en otra provincia.

> `convenio-comercio-madrid.html:415` — Soy Auxiliar de Caja / Ayudante de Vendedor, ¿asciendo?
> `convenio-comercio-madrid.html:410` — ¿Qué es el permiso climático?

**🔵 10.1 — 3/3** · *matizado por el verificador*

el BOCM 183/2025 publica las cuatro tablas en PDF corrido; aquí están en pestañas por año y con una columna €/año en 15 pagas que el boletín no da, más un checklist de seis puntos para cotejar la nómina.

> `convenio-comercio-madrid.html:368` — Tu salario base coincide con la tabla 2026 de tu grupo profesional (p. ej. dependiente/a = Grupo II-B = 1.198,87 €/mes)
> `convenio-comercio-madrid.html:253` — <td>II-B — Dependiente/a · Cajero/a · Oficial/a admin.</td><td class="num">1.198,87</td><td class="num">17.982,98</td>

> Ventana de medición abierta (ultimo_commit 2026-08-18, 1 día): todo parche queda marcado como aplazado. Dos apuntes para cuando cierre. Primero, el parche de 8.4 que más rendiría no es escribir más sino contar: el permiso climático del art. 95 se afirma 'poco habitual' sin apoyo — si al revisar el corpus resulta ser el único convenio provincial de comercio con permiso climático, esa frase deja de ser un adjetivo y pasa a ser el titular de la ficha (y una nota de prensa). Convendría además comprobar si la cláusula entra en el convenio firmado en junio de 2025 como reacción a la DANA de octubre de 2024; si es así, es una historia, no un artículo. Segundo, esta ficha es el modelo a copiar en el punto donde las otras cinco fallan: su sección '¿Cobras menos?' está escrita para un convenio vigente y con la vía de conciliación real de la comunidad, en vez del bloque plantillado marcado <!-- bp-rotado --> que llevan 29 fichas del corpus.

### E3 · Respuesta al trabajador

**🟢 1.2 — 2/3**

Responde 6 de las 8 preguntas de una dependienta madrileña (cuánto cobro, si me aplica este convenio y no el de textil o alimentación, cuántas pagas, qué jornada tengo desde 2026, si me toca antigüedad a los 6 años y qué hago si cobro menos). Quedan sin responder dos muy frecuentes en comercio: (1) «¿me tienen que pagar el domingo o el festivo trabajado?» — la ficha no menciona ni una sola vez las palabras festivo, domingo ni hora extraordinaria, en un sector con apertura dominical en Madrid; (2) «trabajo 20 horas a la semana, ¿cuánto me corresponde?» — la tabla es de jornada completa y en ningún sitio se dice que el salario base se prorratea a la jornada (solo se aclara para el plus de transporte).

> `convenio-comercio-madrid.html:317` — Se abona íntegro también a quienes trabajan a tiempo parcial (Art. 30).
> `convenio-comercio-madrid.html:214` — Las cifras son brutas y de mínimos: tu empresa puede pagar más, nunca menos.
> `convenio-comercio-madrid.html:351` — 31 días naturales ininterrumpidos al año, a disfrutar entre el 20 de junio y el 30 de septiembre (Art. 43)

**🟢 1.3 — 2/3**

Camino de tres pasos, con órgano nombrado a partir del propio convenio (Instituto Laboral de la CAM, Disp. Transitoria Primera), plazo del art. 59.2 ET, forma de envío con prueba y sindicatos con asistencia jurídica. No llega a 3 porque no entrega documento: el determinista solo registra un enlace al kit (la guía genérica) y no la plantilla de reclamación de atrasos, así que el lector sabe qué tiene que hacer pero no tiene con qué hacerlo.

> `convenio-comercio-madrid.html:386` — Reclama por escrito a tu empresa indicando los conceptos no abonados, el importe estimado y el período. Envíalo por burofax con acuse de recibo o email con confirmación de lectura.
> `convenio-comercio-madrid.html:387` — presenta papeleta de conciliación ante el Instituto Laboral de la Comunidad de Madrid (al que el convenio somete expresamente sus conflictos, Disp. Transitoria Primera). Es gratuita, interrumpe la prescripción y es paso previo a la demanda. Plazo legal: 1 año por mensualidad desde que debió pagarse 

**🟢 1.6 — 2/3**

Tiene una sección explícita de traducción a nómina, avisa de que las cifras son brutas, separa el neto (IRPF estatal + autonómico de Madrid) y recorre concepto a concepto qué debe aparecer y cómo (el plus de transporte «como concepto separado», las extras equivalentes a una mensualidad más antigüedad). Se queda en 2 porque no advierte de ningún error típico: el prorrateo se menciona como posibilidad neutra en tres sitios, nunca como trampa a verificar, y no aparece la compensación y absorción, que es exactamente el mecanismo por el que una empresa de comercio te sube el base y te come el plus.

> `convenio-comercio-madrid.html:366` — Las cifras del convenio son brutas . La Comunidad de Madrid aplica IRPF de régimen común, así que tu neto dependerá del IRPF estatal + autonómico, las cotizaciones y tus deducciones personales.
> `convenio-comercio-madrid.html:369` — El plus de transporte aparece como concepto separado (96,56 €/mes en 2026)
> `convenio-comercio-madrid.html:356` — 3 gratificaciones extraordinarias en marzo, julio y diciembre (Art. 34), prorrateables por acuerdo.

**🔵 1.1 — 3/3**

La cifra viaja dentro del propio H1, es la del puesto más buscado del sector (dependiente/a) y viene con año y boletín en la línea siguiente; el párrafo de respuesta directa la repite en mensual y en anual y nombra las categorías equivalentes. Es lo que ninguna otra de las seis hace: no se lee un preámbulo, se lee la cifra. El determinista confirma cifra+año+fuente en los primeros bloques.

> `convenio-comercio-madrid.html:165` — Convenio Comercio Madrid 2026: un/a dependiente cobra 1.198,87 €/mes en 15 pagas
> `convenio-comercio-madrid.html:179` — cobra en 2026 un salario base de 1.198,87 €/mes , es decir 17.982,98 € brutos al año en 15 pagas . La misma cifra corresponde a cajero/a, oficial/a administrativo/a, viajante y mozo/a especializado/a.
> `convenio-comercio-madrid.html:174` — ✓ Verificado contra BOCM Núm. 183/2025 por SalarioJusto · última revisión 13 de agosto de 2026

**🔵 1.4 — 3/3**

Resuelve la autoubicación en los dos ejes a la vez y en lenguaje llano: el ámbito funcional se traduce a comercios reconocibles (bazares, fotografía, estancos, merchandising), la frontera se declara explícitamente («si tu comercio es de alimentación, textil, del metal…»), y cada fila de la tabla lleva los puestos reales pegados al grupo, no el código del boletín. Encima cierra el caso frontera más doloroso del sector —el ascenso automático de auxiliar a cajero/a— con artículo. Es el nivel al que deberían subir las fichas de limpieza, que no tienen ni una línea de ámbito funcional.

> `convenio-comercio-madrid.html:210` — Si tu comercio es de alimentación , textil , del metal o de otra rama con convenio propio en Madrid, tu tabla puede ser distinta. Este convenio es el "cajón de sastre" del comercio madrileño para las actividades sin convenio específico.
> `convenio-comercio-madrid.html:253` — II-B — Dependiente/a · Cajero/a · Oficial/a admin. 1.198,87 17.982,98
> `convenio-comercio-madrid.html:362` — el auxiliar de caja y el ayudante de vendedor pasan automáticamente a cajero/a y dependiente/a vendedor/a al cumplir 2 años de antigüedad , con todos los efectos legales (Disposición Adicional Cuarta)

*No evaluadas:* `1.9` No aplica: el convenio está vigente hasta el 31-dic-2028 y la ficha publica las cuatro tablas anuales (2025, 2026, 2027 y 2028) del propio BOCM 183/2025, más la modificación del art. 40 del BOCM 151/2026. No hay dato ausente, año sin revisar ni convenio decaído sobre el que juzgar si la ficha disimula un hueco.

> LAS 8 PREGUNTAS QUE TECLEARÍA UNA DEPENDIENTA DE UN BAZAR O UNA TIENDA DE REGALOS EN MADRID: (1) «¿cuánto tengo que cobrar de dependienta en Madrid en 2026?»; (2) «trabajo en una tienda de regalos / de ropa, ¿me aplica este convenio?»; (3) «¿cuántas pagas me corresponden al año?»; (4) «¿cuántas horas tengo que hacer a la semana desde 2026?»; (5) «llevo 6 años en la tienda, ¿me toca antigüedad?»; (6) «trabajo los domingos, ¿me lo tienen que pagar aparte?»; (7) «hago 20 horas a la semana, ¿cuánto me corresponde de esa tabla?»; (8) «cobro menos que la tabla, ¿qué hago y hasta cuándo puedo reclamar?». RECORRIDO: responde 1, 2, 3, 4, 5 y 8; falla en 6 y 7. — Es la ficha mejor resuelta del piloto en respuesta directa y en autoubicación: la cifra del puesto más buscado está en el H1 y el ámbito funcional está escrito para alguien que no sabe qué es un ámbito funcional. Su agujero es específico y reparable: comercio es el sector con más apertura dominical y más contratación a tiempo parcial de los seis, y la ficha no dice nada de festivos, domingos ni horas extraordinarias (el determinista lo confirma en conceptos_ausentes: horas_extra), ni aclara que la tabla es de jornada completa. Dos bloques cortos la dejarían sin huecos. Fuera de mi eje: la ficha no compara ninguna categoría con el SMI 2026 (17.094 €); el Grupo I queda en 17.362,98 €/año, apenas 269 € por encima, y ese margen mínimo es información útil que aquí no se da. VENTANA ABIERTA: 1 día desde el último commit, así que todos los parches quedan aplazados.

### E4 · Captación y citabilidad

**🟢 2.5 — 2/3**

Cumple: trae la cifra con su puesto, su anual y su número de pagas, y deja dentro tres razones para entrar (10 grupos, jornada 37,5 h, permiso climático). No llega a 3 porque a 175 caracteres el cierre —que es justo donde está la traza, 'BOCM 183/2025'— cae fuera del recorte habitual del SERP, y la traza es precisamente lo que diferencia a esta ficha de los agregadores.

> `convenio-comercio-madrid.html:7` — <meta name="description" content="Tablas 2026 del convenio de Comercio Vario de Madrid: dependiente/a 1.198,87 €/mes (17.982,98 €/año) en 15 pagas. 10 grupos, jornada 37,5 h y permiso climático. BOCM 183/2025.">

**Parche propuesto (APLAZADO: ventana de medición abierta):** {'descripcion': 'Adelantar la traza por delante del recorte, sin perder la cifra. 152 caracteres.', 'texto_propuesto': 'Dependiente/a 1.198,87 €/mes (17.982,98 €/año) en 15 pagas — tablas 2026 del Comercio Vario de Madrid verificadas contra el BOCM 183. Jornada 37,5 h.'}

**🟢 4.2 — 2/3**

El dato es extraíble sin reconstruirlo: la unidad vive en el encabezado ('€/mes', '€/año') y los complementos exponen la cuantía dentro del propio h3, que es la forma más atómica del corpus. Se queda en 2 porque las celdas llevan el número desnudo, sin unidad ni periodo, y la tabla no se identifica a sí misma con ningún caption.

> `convenio-comercio-madrid.html:316` — <h3>Plus de transporte — <span class="plus-cifra">96,56 €/mes</span></h3>
> `convenio-comercio-madrid.html:243` — <thead><tr><th>Grupo · categorías</th><th style="text-align:right">€/mes</th><th style="text-align:right">€/año</th></tr></thead>

**🟢 4.3 — 2/3**

En el bloque de respuesta directa los tres —provincia, sector y año— están explícitos, y la ficha además distingue convenio de SMI y grupo profesional de etiqueta heredada del BOP. Pero en las tablas la cifra sí viaja sola: los cuatro años del convenio conviven en el DOM como cuatro tablas idénticas sin año dentro, separadas solo por un data-year en el div contenedor y por display:none. Un extractor que no ejecute el CSS ve cuatro cifras distintas para 'Dependiente/a' (1.163,95 / 1.198,87 / 1.234,83 / 1.271,88) sin nada en la tabla que le diga cuál rige hoy.

> `convenio-comercio-madrid.html:241` — <div class="year-panel active" data-year="2026">
> `convenio-comercio-madrid.html:289` — <tr><td>II-B — Dependiente/a · Cajero/a · Oficial/a admin.</td><td class="num">1.271,88</td><td class="num">19.078,14</td></tr>
> `convenio-comercio-madrid.html:133` — .year-panel{display:none;}

**Parche propuesto (APLAZADO: ventana de medición abierta):** {'descripcion': 'Dar identidad propia a cada tabla de año. No es un problema de verdad —las cuatro cifras son correctas y el convenio publica los cuatro años— sino de extracción: la desambiguación está en el CSS, no en el marcado. Añadir un caption por panel y marcar los inactivos con el atributo hidden.', 'linea_objetivo': '223, 241, 259, 277 (una por year-panel)', 'texto_propuesto': '<table class="tabla-salarios"><caption>Tabla salarial 2026 (vigente) — Comercio Vario de la Comunidad de Madrid, salario base en 15 pagas · BOCM 183/2025</caption>', 'nota_de_ejecucion': "Repetir el caption con el año que corresponda en los paneles 2025, 2027 y 2028, sustituyendo '(vigente)' por '(ya aplicada)' / '(futura)'. Añadir hidden a los tres paneles no activos para que ningún extractor los lea como vigentes."}

**🔵 2.4 — 3/3**

Ejemplar y el único del piloto que cumple la fórmula entera sin pagar peaje: 57 caracteres —cabe sin cortarse—, con sector, provincia, año y la cifra del puesto que efectivamente se busca en comercio (dependiente/a), y con la cifra en su unidad real de nómina, no un derivado. Lo que hace y las demás no: nombra el puesto junto al número, de modo que el número tiene dueño ya en el resultado de búsqueda.

> `convenio-comercio-madrid.html:6` — <title>Convenio Comercio Madrid 2026: Dependiente 1.198,87 €/mes</title>
> `convenio-comercio-madrid.html:253` — <tr><td>II-B — Dependiente/a · Cajero/a · Oficial/a admin.</td><td class="num">1.198,87</td><td class="num">17.982,98</td></tr>

**🔵 4.1 — 3/3**

Ejemplar, y es el patrón que las otras cinco fichas del piloto deberían copiar: hay un bloque de respuesta directa cuya primera frase se sostiene sola con sujeto, grupo, ámbito completo, año, cifra, unidad, anual y número de pagas, y el h1 repite la misma frase en forma de titular. Se puede arrancar de la página y sigue siendo verdadera y atribuible.

> `convenio-comercio-madrid.html:179` — Un/a dependiente/a del convenio de Comercio Vario de la Comunidad de Madrid (Grupo II, Nivel B) cobra en 2026 un salario base de <strong>1.198,87 €/mes</strong>, es decir <strong>17.982,98 € brutos al año</strong> en <strong>15 pagas</strong>.
> `convenio-comercio-madrid.html:165` — <h1>Convenio Comercio Madrid 2026: un/a dependiente cobra <em>1.198,87 €/mes</em> en 15 pagas</h1>

**🔵 4.4 — 3/3**

Ejemplar: hay pie de fuente inmediatamente debajo del bloque de respuesta directa y otro inmediatamente debajo de la tabla salarial, ambos con boletín, número y fecha, y además cada complemento cierra con su artículo dentro del mismo párrafo de la cuantía. La traza no está al final: está donde está el número.

> `convenio-comercio-madrid.html:193` — <p class="source-footer">Fuente: <strong>BOCM Núm. 183 (2-ago-2025)</strong> — texto íntegro del convenio 2025-2028 con las tablas de los cuatro años. <strong>BOCM Núm. 151 (27-jun-2026)</strong> — modificación aclaratoria del art. 40 (jornada).
> `convenio-comercio-madrid.html:294` — <p class="source-footer">Las tablas de los cuatro años están publicadas en el propio convenio (BOCM 183/2025). Subida anual = IPC definitivo del año anterior (INE), con mínimo y máximo garantizado del 3% (Art. 38), con efecto retroactivo al 1 de enero.</p>
> `convenio-comercio-madrid.html:317` — Se abona íntegro también a quienes trabajan a tiempo parcial (Art. 30).

> Ventana de medición recién abierta (ultimo_commit 2026-08-18, un día): todos los parches van aplazados y ninguno es urgente. Esta es la ficha de referencia del eje E4 en el piloto y conviene tratarla como plantilla: el bloque 'respuesta-directa' de la línea 178 —una sola frase con sujeto, ámbito, año, cifra, unidad, anual y pagas, seguida de su pie de fuente— es exactamente lo que a las otras cinco les falta, y es barato de replicar. La única grieta seria es de marcado, no de redacción: cuatro tablas de años distintos conviviendo sin caption ni atributo hidden. Como el convenio llega a 2028, esa grieta se agrava sola cada 1 de enero. No detecto 4.5: las cuatro cifras de dependiente son correctas para su año respectivo y la ficha nunca afirma dos cosas distintas; es un problema de extracción, no de contradicción, y por eso lo puntúo en 4.3 en vez de anular la nota.

### E5 · Enlazado y clúster

**🟠 6.2 — 1/3** · *matizado por el verificador*

entrantes_n=3 desde solo dos páginas: index.html y convenio-comercio-metal-bizkaia.html. Puesto 44 de 54. El hub convenios.html todavía no la enlaza (grep sin resultados) pese a que el breadcrumb la cuelga de Convenios: hoy la ficha vive del enlace de la home. Es 1 y no 0 porque al menos una ficha hermana ya la enlaza con ancla descriptiva ('→ Convenio de Comercio de Madrid 2026').

> `analisis/auditoria-convenios/2026-08-20/deterministas/convenio-comercio-madrid.json:315` — "entrantes_desde": [
> `convenio-comercio-madrid.html:161` — <div class="breadcrumb"><a href="/">SalarioJusto</a> › <a href="/convenios.html">Convenios</a> › Comercio Vario Madrid 2026</div>

**Parche propuesto (APLAZADO: ventana de medición abierta):** En convenios.html, abrir el sector Comercio y añadir la tarjeta: <a href="/convenio-comercio-madrid.html">Comercio Vario — Madrid (BOCM 183, vigente 2025-2028 · 15 pagas · 37,5 h)</a>. Va en el hub porque es la página que reparte autoridad a las 54 fichas y la única que un lector recorre buscando su sector.

**🟠 6.3 — 1/3**

internos_en_cuerpo=15, pero en la prosa solo hay un enlace de orientación — el de la guía de reclamación, ya cerrada la sección — y los tres enlaces de la misma provincia están apilados en el bloque final 'Otros convenios y guías'. Ningún párrafo del cuerpo abre una duda y la resuelve con un enlace.

> `convenio-comercio-madrid.html:389` — <p>Los sindicatos firmantes — <strong>UGT (FeSMC Madrid)</strong> y <strong>CCOO (Federación de Servicios de Madrid)</strong> — ofrecen asistencia jurídica gratuita a personas afiliadas. Código REGCON: <code style="font-family:monospace;font-size:13px;">28000805011982</code>. <a href="/reclamar-dife
> `convenio-comercio-madrid.html:447` — <li><a href="/convenio-oficinas-madrid.html">Convenio de Oficinas y Despachos de Madrid</a></li>

**Parche propuesto (APLAZADO: ventana de medición abierta):** Subir la desambiguación de sector al arranque: en la línea 161, tras el breadcrumb, añadir el párrafo «Este convenio cubre el comercio vario de Madrid; si tu tienda está dentro de un hotel te aplica <a href="/convenio-hosteleria-madrid.html">Hostelería de Madrid</a> y si tu puesto es administrativo puro, <a href="/convenio-oficinas-madrid.html">Oficinas y Despachos de Madrid</a>», y dejar en la lista final solo lo que no cabe en el cuerpo. Va ahí porque los tres enlaces de la línea 447 responden a una duda que el lector tiene al entrar, no al salir.

**🟠 6.4 — 1/3**

Cubre una sola dirección: a_otro_sector_misma_provincia trae Oficinas, Hostelería y Limpieza de Madrid — la dirección que casi nunca se cubre en el corpus — pero los tres están en la lista final sin decir cuándo el lector debería irse a ellos, y a_hermanas_mismo_sector=0: no devuelve el enlace a convenio-comercio-metal-bizkaia.html, que sí la enlaza a ella.

> `analisis/auditoria-convenios/2026-08-20/deterministas/convenio-comercio-madrid.json:298` — "a_otro_sector_misma_provincia": [
> `convenio-comercio-madrid.html:448` — <li><a href="/convenio-hosteleria-madrid.html">Convenio de Hostelería de Madrid</a></li>

**Parche propuesto (APLAZADO: ventana de medición abierta):** Convertir los tres enlaces de la lista en una frase de desambiguación al principio de la ficha, justo después del breadcrumb (línea 161): «Este convenio cubre el comercio vario de la Comunidad de Madrid. Si trabajas en una tienda dentro de un hotel o un bar, te aplica <a href="/convenio-hosteleria-madrid.html">Hostelería de Madrid</a>; si tu empresa es una contrata de limpieza, <a href="/convenio-limpieza-madrid.html">Limpieza de Edificios y Locales de Madrid</a>; si tu puesto es administrativo puro, <a href="/convenio-oficinas-madrid.html">Oficinas y Despachos de Madrid</a>.» Va ahí porque el error de sector se comete al entrar, no al final.

**🟠 6.6 — 1/3**

al_kit=1 y es la guía, no una plantilla. El paso 2 del procedimiento dice literalmente que reclames por escrito indicando conceptos, importe y período — que es exactamente lo que hace la plantilla de atrasos — y no la enlaza; el único puente aparece dos párrafos después, cuando el procedimiento ya ha terminado.

> `convenio-comercio-madrid.html:386` — <li><strong>Reclama por escrito a tu empresa</strong> indicando los conceptos no abonados, el importe estimado y el período. Envíalo por burofax con acuse de recibo o email con confirmación de lectura.</li>
> `convenio-comercio-madrid.html:389` — <p>Los sindicatos firmantes — <strong>UGT (FeSMC Madrid)</strong> y <strong>CCOO (Federación de Servicios de Madrid)</strong> — ofrecen asistencia jurídica gratuita a personas afiliadas. Código REGCON: <code style="font-family:monospace;font-size:13px;">28000805011982</code>. <a href="/reclamar-dife

**Parche propuesto (APLAZADO: ventana de medición abierta):** En la línea 386, cerrar el paso 2 con: «Usa la <a href="/plantilla-reclamar-atrasos-convenio-salarial.html">plantilla de reclamación de atrasos de convenio</a>: reclama la diferencia de los últimos 12 meses, mes a mes, porque cada mensualidad prescribe por separado al año.» Va en ese paso y no en la lista final porque es la única línea de la ficha en la que el lector tiene que escribir algo.

**🟢 6.5 — 2/3**

anchors_genericos=[]: todas las anclas nombran sector y provincia ('Convenio de Oficinas y Despachos de Madrid'). No es 3 porque están redactadas como entradas de catálogo, intercambiables con las de cualquier otra ficha de Madrid; ninguna dice para qué querría el lector ir allí.

> `convenio-comercio-madrid.html:447` — <li><a href="/convenio-oficinas-madrid.html">Convenio de Oficinas y Despachos de Madrid</a></li>
> `convenio-comercio-madrid.html:449` — <li><a href="/convenio-limpieza-madrid.html">Convenio de Limpieza de Edificios y Locales de Madrid</a></li>

> ventana_medicion_abierta=true (commit de ayer): los parches quedan aplazados, pero el enlace desde convenios.html es de otra página y no toca la ficha — se puede hacer sin contaminar la medición, y es el que más falta. Ojo también a la reciprocidad: convenio-comercio-metal-bizkaia.html es hoy la única ficha del corpus que la enlaza, y Madrid no le devuelve el enlace; el sector Comercio está abriéndose con dos fichas que no se conocen entre sí.

### E6 · Forma y lectura

**🟠 7.4 — 1/3**

La nota editorial tiene las cuatro etiquetas temáticas correctas (Qué es · Estructura · Novedades · Futuro) pero va en un único bloque de texto corrido: los <strong> están incrustados en la misma línea, no abren sub-párrafo. Comparada con la de metal-sevilla, que usa cuatro <p>, esta es exactamente el ladrillo que la norma de casa quiere evitar.

> `convenio-comercio-madrid.html:196` — <div class="nota-editorial">
> `convenio-comercio-madrid.html:197` — <strong>En 30 segundos. Qué es.</strong> El Convenio del Comercio Vario de la Comunidad de Madrid (código 28000805011982) regula el comercio mayorista y minorista de especialidades varias que no encajan en otro convenio del sector. <strong>Estructura.</strong> 10 grupos profesionales
> `convenio-metal-sevilla.html:254` — <p style="margin-bottom:10px;"><strong>En 30 segundos · Qué es.</strong>

**Parche propuesto (APLAZADO: ventana de medición abierta):** Envolver cada etiqueta en su propio párrafo, como en metal-sevilla, sin tocar el texto: <div class="nota-editorial"><p style="margin-bottom:10px;"><strong>En 30 segundos · Qué es.</strong> El Convenio del Comercio Vario de la Comunidad de Madrid (código 28000805011982) regula el comercio mayorista y minorista de especialidades varias que no encajan en otro convenio del sector.</p><p style="margin-bottom:10px;"><strong>Estructura.</strong> 10 grupos profesionales (del I al VI, con el III subdividido en niveles A-D), en 15 pagas; el/la dependiente/a queda en el Grupo II-B.</p><p style="margin-bottom:10px;"><strong>Novedades.</strong> Jornada reducida a 37,5 h/semana (1.711 h/año) desde el 1 de enero de 2026, y un <strong>permiso climático retribuido</strong> por alertas AEMET naranja o roja — poco habitual en la negociación colectiva.</p><p style="margin:0;"><strong>Futuro.</strong> Subidas del IPC del año anterior con mínimo y máximo garantizado del 3% cada año hasta 2028.</p></div>

**🟠 8.3 — 1/3** · *matizado por el verificador*

La primera FAQ reproduce casi palabra por palabra el párrafo de respuesta directa, incluida la enumeración de categorías equivalentes. Es la redundancia menos justificable porque las dos versiones están en la misma página y ninguna añade nada sobre la otra. El ascenso automático de la Disp. Ad. 4ª también se cuenta dos veces, en el cuerpo y en la FAQ.

> `convenio-comercio-madrid.html:179` — La misma cifra corresponde a cajero/a, oficial/a administrativo/a, viajante y mozo/a especializado/a.
> `convenio-comercio-madrid.html:396` — Un/a dependiente/a (Grupo II, Nivel B) cobra <strong>1.198,87 €/mes</strong> de salario base, es decir <strong>17.982,98 € brutos al año</strong> en 15 pagas. La misma cifra corresponde a cajero/a, oficial/a administrativo/a, viajante y mozo/a especializado/a.
> `convenio-comercio-madrid.html:362` — Además, el auxiliar de caja y el ayudante de vendedor pasan automáticamente a cajero/a y dependiente/a vendedor/a al cumplir <strong>2 años de antigüedad</strong>

**Parche propuesto (APLAZADO: ventana de medición abierta):** Dejar la FAQ como respuesta corta que no reproduzca el párrafo de arriba, y aprovecharla para lo que el cuerpo no dice: «Un/a dependiente/a está en el Grupo II, Nivel B: <strong>1.198,87 €/mes</strong> en 15 pagas (<strong>17.982,98 € brutos al año</strong>). Sobre esa base se suman el plus de transporte (96,56 €/mes, que se cobra 12 meses) y la antigüedad consolidada, si la tienes. → <a href="#tablas">Ver la escala completa por grupo</a>.»

**🟠 11.1 — 1/3**

tablas.sin_th = 0 (las cuatro tablas tienen encabezado) pero sin_scope = 4 y sin_caption = 4: un lector de pantalla anuncia las celdas sin saber a qué columna pertenecen y llega a la tabla sin saber de qué año es. En una ficha cuyas cuatro tablas son la misma escala repetida para 2025, 2026, 2027 y 2028, el caption no es un adorno: es lo único que las distingue al oído.

> `convenio-comercio-madrid.html:224` — <table
> `convenio-comercio-madrid.html:236` — <tr><td>I — Ayudante ventas · Aux. caja · Reponedor/a</td><td class="num">1.123,82</td><td class="num">16.857,26</td></tr>

**Parche propuesto (APLAZADO: ventana de medición abierta):** Añadir a cada una de las cuatro tablas un caption que la identifique y scope en los th: «<caption style="caption-side:top;text-align:left;font-size:13px;color:var(--ink-light);padding-bottom:8px;">Tabla salarial 2026 del Comercio Vario de Madrid: salario base mensual y bruto anual en 15 pagas, por grupo profesional (BOCM Núm. 183/2025).</caption>» y «<th scope="col">Grupo profesional</th><th scope="col">Salario base (€/mes)</th><th scope="col">Bruto anual 15 pagas (€)</th>», cambiando el año en cada una.

**🟠 12.6 — 1/3**

La misma categoría del Grupo I aparece con tres nombres distintos en tres sitios de la página —«ayudante de ventas» en la respuesta directa, «Ayudante ventas» en las cuatro tablas y «ayudante de vendedor» / «Ayudante de Vendedor» en el cuerpo y la FAQ—, y el último rompe además la norma de inclusivo que el resto de la ficha cumple escrupulosamente («dependiente/a vendedor/a», «cajero/a», «Reponedor/a»). Quien busque su categoría en la tabla no sabrá si es la misma que la de la FAQ.

> `convenio-comercio-madrid.html:179` — (Grupo I: ayudante de ventas, auxiliar de caja, reponedor/a) … una etiqueta heredada que la distingue del ayudante de vendedor del Grupo I.
> `convenio-comercio-madrid.html:236` — I — Ayudante ventas · Aux. caja · Reponedor/a
> `convenio-comercio-madrid.html:415` — <h3>Soy Auxiliar de Caja / Ayudante de Vendedor, ¿asciendo?</h3>

**Parche propuesto (APLAZADO: ventana de medición abierta):** Unificar en la forma inclusiva del boletín, «ayudante de vendedor/a», en los tres sitios: en la tabla «I — Ayudante de vendedor/a · Auxiliar de caja · Reponedor/a», en la respuesta directa «(Grupo I: ayudante de vendedor/a, auxiliar de caja, reponedor/a)» y en la FAQ «<h3>Soy auxiliar de caja o ayudante de vendedor/a, ¿asciendo?</h3>».

**🟢 7.2 — 2/3**

tablas.verde_en_tablas = 0 en las cuatro tablas salariales y la ficha ni siquiera define la regla td.sal en verde que arrastran limpieza-asturias y limpieza-zaragoza: las cifras van en tinta neutra. No es 3 porque el verde no queda reservado al sello — las etiquetas de la nota editorial también lo llevan.

> `convenio-comercio-madrid.html:94` — .nota-editorial strong{color:var(--green);}
> `convenio-comercio-madrid.html:173` — <strong>✓ Verificado</strong> contra BOCM Núm. 183/2025 por SalarioJusto · última revisión 13 de agosto de 2026

**🟢 7.8 — 2/3**

Sigue el canon de Madrid en lo esencial (sello, datos clave, ámbito, tabla, pluses, FAQ, marco legal, quién audita) y su contenido exclusivo —el permiso climático del Art. 95 y los ascensos automáticos de la Disp. Ad. 4ª— está integrado como sección propia en la primera mitad, no pegado al final. No llega a 3 porque le faltan dos piezas que el canon sí tiene: índice de navegación y bloque comparativo con otras provincias del sector.

> `convenio-comercio-madrid.html:302` — Permiso climático retribuido — Art. 95
> `convenio-hosteleria-valencia.html:813` — <h2>Valencia frente a otras provincias del sector</h2>

**🟢 8.1 — 2/3**

No hay bloque prescindible: las 10 secciones h2 responden a preguntas distintas y ninguna es relleno de contexto. No es 3 porque «Solución de conflictos» y «Comisión Paritaria» dicen casi lo mismo (a dónde acudir) en dos h3 consecutivos dentro de «Marco legal y contactos» y podrían fundirse en uno.

> `convenio-comercio-madrid.html:429` — Comisión Paritaria
> `convenio-comercio-madrid.html:432` — Solución de conflictos

**🟢 8.6 — 2/3**

jerga solo detecta «comisión paritaria», con explicacion_cerca = true, y en el HTML la explicación explica de verdad: dice quién la compone, dónde está y para qué sirve. No es 3 porque no traduce a bolsillo qué gano yo acudiendo a ella frente a ir al juzgado. La ficha tampoco necesita glosar ultraactividad ni subrogación: el convenio está vigente hasta 2028 y no las menciona.

> `convenio-comercio-madrid.html:430` — Composición: 6 representantes sindicales (3 CCOO + 3 UGT) y 6 empresariales.

**🟢 8.8 — 2/3**

norma.sindicatos da CCOO 5 · UGT 6 y norma.dice_los_sindicatos = 1: las menciones son de firmantes y de composición de la paritaria, es decir uso como fuente de un dato, que la norma admite. No es 3 porque cuando el texto habla de la representación en abstracto —a quién acudir— vuelve a nombrar solo esas dos siglas, sin abrir a la representación real del comercio madrileño.

> `convenio-comercio-madrid.html:193` — Suscrito el 18 de junio de 2025 por COPYME, UGT y CCOO.
> `convenio-comercio-madrid.html:430` — Composición: 6 representantes sindicales (3 CCOO + 3 UGT) y 6 empresariales.

**🟢 12.3 — 2/3**

El esqueleto es el del corpus: hero con badge, sello eeat, card de datos clave, nota editorial, ámbito, tabla, pluses, FAQ, marco legal, quién audita y bloque de enlaces. La única desviación estructural es que sus tablas no van en contenedor de scroll (tablas.sin_contenedor_scroll = 4), pero eso es coherente porque su estrategia móvil es reflow-a-tarjetas, igual que hosteleria-madrid.

> `convenio-comercio-madrid.html:437` — Quién audita esto
> `convenio-comercio-madrid.html:186` — <div class="card-title">Datos clave</div>

**🔵 7.5 — 3/3**

Un solo h1, saltos_jerarquia = [] y —esto es lo que ninguna otra ficha del piloto consigue— los encabezados llevan la cifra dentro: el h1 arranca con el salario y los siete h3 de pluses son literalmente el ejemplo que pide la norma («Plus de transporte — 96,56 €/mes»). Leídos en fila, los encabezados ya son un resumen del convenio.

> `convenio-comercio-madrid.html:165` — <h1>Convenio Comercio Madrid 2026: un/a dependiente cobra <em>1.198,87 €/mes</em> en 15 pagas</h1>
> `convenio-comercio-madrid.html:316` — Plus de transporte — 96,56 €/mes
> `convenio-comercio-madrid.html:336` — Antigüedad — 5% por cuatrienio

**🔵 8.2 — 3/3**

Es el mejor orden del piloto: la cifra está en el h1, se repite completa en el párrafo de respuesta directa antes de cualquier contexto, y la tabla salarial es el segundo h2 de la página (línea 213 de un documento que termina en la 444). Lo accesorio —marco legal, partes firmantes, paritaria— va al final. Ninguna sección de contexto se interpone entre el lector y su cifra.

> `convenio-comercio-madrid.html:179` — Un/a dependiente/a del convenio de Comercio Vario de la Comunidad de Madrid (Grupo II, Nivel B) cobra en 2026 un salario base de <strong>1.198,87 €/mes</strong>
> `convenio-comercio-madrid.html:213` — <h2 id="tablas">Tabla salarial — 10 grupos × 15 pagas</h2>

> Es la ficha mejor construida del piloto en lo formal: encabezados con cifra, respuesta directa arriba, cero verde en tablas. Su único defecto de forma serio es la nota editorial sin fragmentar, que llama la atención porque es la ficha más nueva del piloto (operacion.dias_desde_commit = 1) y porque metal-sevilla, del mismo mes, ya la trae troceada: el patrón bueno existe y no se ha aplicado aquí. Todos los parches quedan aplazados por ventana de medición abierta. Fuera de mi eje: la ficha publica cuatro tablas anuales (2025-2028) y solo la de 2026 se etiqueta en el h2, lo que puede confundir sobre qué año está vigente — es un asunto de verdad, no de forma.
