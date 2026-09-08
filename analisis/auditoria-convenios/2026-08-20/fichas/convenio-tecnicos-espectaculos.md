# convenio-tecnicos-espectaculos

**Score: 63.5/100** (parcial: solo 74 de 100 puntos de peso evaluados) · hard-fails: **2**

Sector tecnicos · estado `marco` · 1785 palabras de prosa · boilerplate 0.0 · último cambio hace 21 días
GSC 28d: 4 clics · 151 impresiones · CTR 2.65% · posición 8.02

## Hard-fails — no se compensan con la nota

- **5.2** (determinista) · sin sello 'Verificado contra …'
- **2.2** (determinista) · sin bloque de responsable identificable ('Quién audita esto')

## Ejes

*E5 no aplica a esta ficha — ficha tipo «marco»: sin provincia ni fichas hermanas que enlazar. Su peso se reparte entre los demás.*
*E4 no aplica a esta ficha — noindex deliberado: no compite en el buscador. Su peso se reparte entre los demás.*

**Cuello de botella: E1 (50.0% de su peso).** Es por donde empieza el arreglo.

| eje | | puntos | peso |
|---|---|---|---|
| E1 | Verdad demostrada | 11.0 | 22 |
| E2 | Singularidad y ventaja | 19.9 | 22 |
| E3 | Respuesta al trabajador | 10.0 | 20 |
| E4 | Captación y citabilidad | — | 14 |
| E5 | Enlazado y clúster | — | 12 |
| E6 | Forma y lectura | 6.1 | 10 |

### E1 · Verdad demostrada

**🔴 5.10 — 0/3**

El JSON determinista da enlaces.externos_oficiales = [] y el HTML lo confirma: la sección 'Fuentes oficiales' nombra las normas y hasta el dominio del boletín, pero no hay un solo enlace clicable. El lector que desconfíe tiene que salir a buscar.

> `convenio-tecnicos-espectaculos.html:288` — <strong>Real Decreto 1435/1985, de 1 de agosto</strong> — relación laboral especial de las personas artistas en artes escénicas, audiovisuales y musicales, y del personal técnico y auxiliar vinculado. Texto consolidado en el Boletín Oficial del Estado (boe.es).

**Parche propuesto:** Convertir las dos entradas de 'Marco legal' en enlaces al texto consolidado del BOE: RD 1435/1985 → https://www.boe.es/buscar/act.php?id=BOE-A-1985-17303 y RDL 2/2015 (ET) → https://www.boe.es/buscar/act.php?id=BOE-A-2015-11430, añadiendo el ancla del artículo citado donde exista (art. 34.9 y art. 59.2). Enlazar también cada crónica de prensa a su URL, ya que la propia ficha las presenta como el sustento del conflicto.

**🔴 9.1 — 0/3** · *matizado por el verificador*

Es la única ficha del piloto sin sello de verificación (JSON determinista: sello.presente = false, hardfail determinista 5.2) y sin fecha de actualización visible (norma.fecha_actualizacion_visible = false). La página data sus fuentes pero nunca dice cuándo la revisó SalarioJusto.

> `convenio-tecnicos-espectaculos.html:285` — <h2>Fuentes oficiales</h2>
> `convenio-tecnicos-espectaculos.html:299` — Esta página es una guía informativa de divulgación laboral, no asesoramiento jurídico individualizado.

**Parche propuesto:** Insertar el bloque eeat-sello estándar justo tras <main>, adaptado a una ficha sin convenio: «✓ Verificado contra el RD 1435/1985 y el RDL 2/2015 (textos consolidados del BOE) y contra las crónicas de RTVE, EITB, Naiz y El Correo del 15-V-2026, por SalarioJusto · última revisión [fecha]». Añadir además el bloque 'Quién audita esto' que sí llevan las otras cinco fichas del piloto.

**🟠 9.2 — 1/3** · *matizado por el verificador*

Menciona la negociación abierta y su bloqueo, pero nunca traduce eso en caducidad para el lector: no dice que esta página deja de valer el día que se firme el primer convenio del sector, ni qué señal debería vigilar (REGCON, acuerdo con EUKI). La vigencia está contada como noticia, no como fecha de expiración.

> `convenio-tecnicos-espectaculos.html:238` — La negociación del primer Convenio Colectivo de Espectáculos y Eventos de la CAV arrancó en enero de 2024 y, más de dos años después, la patronal EUKI no ha movido ficha.

**Parche propuesto:** Añadir un callout de caducidad al final de 'Las reivindicaciones de la huelga': «Cuándo deja de valer esta página. Todo lo anterior describe un sector sin convenio propio. Si la mesa entre EUKI y los sindicatos cierra un acuerdo, el Convenio de Espectáculos y Eventos de la CAV se inscribirá en el REGCON y se publicará en el BOPV: desde ese día tus condiciones dejarán de regirse solo por el RD 1435/1985 y el Estatuto. Revisamos el registro cada trimestre; si ves publicado el convenio antes que nosotros, escríbenos.»

**🟢 5.11 — 2/3**

No hay tablas salariales; las cifras que sí son sensibles al año llevan su fecha (huelga 15-V-2026) y la única cuantía datable —el SMI— se delega deliberadamente a la página del SMI vigente en vez de fijarla en texto, que es la forma correcta de no envejecer. No llega a 3 porque no hay tablas vigentes/históricas que distinguir.

> `convenio-tecnicos-espectaculos.html:221` — Consulta el <a href="/salario-minimo-interprofesional-2026.html">SMI vigente</a> para conocer el suelo exacto.
> `convenio-tecnicos-espectaculos.html:191` — <strong>Primera huelga del sector en Euskadi — 15 de mayo de 2026.</strong>

**🔵 2.1 — 3/3**

No hay boletín que transcribir: toda la página es trabajo propio — encuadramiento jurídico del vacío (RD 1435/1985 vs relación común), cotejo declarado contra cuatro medios independientes con fecha, y un análisis de esquirolaje externo que ninguna fuente le da hecho.

> `convenio-tecnicos-espectaculos.html:191` — Confirmado por cuatro medios independientes (RTVE País Vasco, orain.eus/EITB, Naiz y El Correo), todos del 15-V-2026.
> `convenio-tecnicos-espectaculos.html:238` — La negociación del primer Convenio Colectivo de Espectáculos y Eventos de la CAV arrancó en enero de 2024 y, más de dos años después, la patronal EUKI no ha movido ficha.

**🔵 5.8 — 3/3**

Cada afirmación de derecho lleva su artículo del ET (34.9, 59.2) y el cierre advierte del caso límite que decide toda la página: si la relación es especial o común. No hay ningún 'tienes derecho a' suelto.

> `convenio-tecnicos-espectaculos.html:299` — El encuadramiento concreto de cada relación (especial del RD 1435/1985 o común del Estatuto) depende de las circunstancias reales del puesto.
> `convenio-tecnicos-espectaculos.html:221` — <strong>Salario Mínimo Interprofesional:</strong> actúa como retribución mínima irrenunciable. Consulta el <a href="/salario-minimo-interprofesional-2026.html">SMI vigente</a> para conocer el suelo exacto.

> Es la ficha con mejor relación entre lo que afirma y lo que puede demostrar en la parte narrativa —cotejo de cuatro medios con fecha, matiz jurídico en cada derecho— y la peor en la parte instrumental: cero enlaces oficiales y cero sello. Paradoja útil para el sintetizador: el único documento del piloto que no tiene boletín que copiar es también el único que se olvidó de firmar cuándo lo verificó. Fuera de mi eje: robots noindex,nofollow y ausencia del bloque de responsable (hardfail determinista 2.2), que pertenecen a otros ejes.

### E2 · Singularidad y ventaja

**🟢 8.4 — 2/3**

la particularidad del sector (no hay convenio y hay conflicto abierto) organiza la página entera, pero falta justo lo que trae al lector: no hay ni una cifra de retribución de referencia, y el JSON determinista cuenta solo 6 cifras en toda la ficha.

> `convenio-tecnicos-espectaculos.html:184` — <div class="stat-label">Suelo retributivo</div><div class="stat-value">Salario Mínimo Interprofesional vigente</div>
> `convenio-tecnicos-espectaculos.html:221` — <strong>Salario Mínimo Interprofesional:</strong> actúa como retribución mínima irrenunciable.

**Parche propuesto:** Investigar (no redactar de memoria) qué se cobra de hecho en el sector y publicarlo como bloque de referencia bajo 'Situación de un vistazo': (a) tablas del III Convenio estatal de Empresas de Artes Escénicas / Teatro si alcanzan a personal técnico; (b) convenios de empresa de teatros y auditorios públicos vascos (Arriaga, Euskalduna, Victoria Eugenia) inscritos en REGCON, que sí fijan categorías técnicas; (c) el importe del SMI 2026 en euros (1.221 €/mes, 17.094 €/año, RD 126/2026) escrito como cifra y no como remisión. Sin al menos una horquilla verificada, la página responde 'por qué no cobras bien' pero no 'cuánto'.

**🟢 10.2 — 2/3**

el agregador de nóminas no puede publicar esta página porque no hay cifra que scrapear, y el H1 declara el vacío sin rodeos; no llega a 3 porque la ventaja se percibe como reportaje, no como respuesta a la consulta salarial que trae al lector.

> `convenio-tecnicos-espectaculos.html:170` — Convenio de <em>Técnicos de Espectáculos</em>: el sector que trabaja sin regulación propia

**🔵 3.1 — 3/3**

boilerplate_ratio 0.0 y frases_compartidas_top vacía: es la única ficha del piloto que no arrastra ni el bloque eeat-firma ni el bloque 'cobras menos' plantillado; hasta el descargo legal está redactado para su caso concreto.

> `convenio-tecnicos-espectaculos.html:299` — El encuadramiento concreto de cada relación (especial del RD 1435/1985 o común del Estatuto) depende de las circunstancias reales del puesto.
> `convenio-tecnicos-espectaculos.html:317` — SalarioJusto · Herramienta gratuita para trabajadores y trabajadoras · Sin empresas detrás

**🔵 3.2/3.3 — 3/3**

ratio_tabla 0.0 y palabras_prosa 1785: no hay tabla que rodear porque el dato de esta página es una ausencia, y una ausencia solo existe explicada; sin la prosa no queda nada.

> `convenio-tecnicos-espectaculos.html:176` — A veces, lo que te corresponde saber es que <strong>tu sector no tiene convenio propio</strong> —y por qué eso no significa que no tengas derechos—.
> `convenio-tecnicos-espectaculos.html:208` — Ni el RD 1435/1985 ni el Estatuto desarrollan en detalle la <strong>jornada irregular, la disponibilidad, el trabajo nocturno/festivo y las horas extra</strong> propias de montar y desmontar eventos.

**🔵 3.4 — 3/3**

frases_exclusivas 76 de 76 frases_cuerpo, y la exclusividad no es de topónimo: son hechos que hubo que reportear (patronal EUKI, dos años de bloqueo, episodio de esquirolaje en el Euskalduna, cuatro medios cotejados).

> `convenio-tecnicos-espectaculos.html:241` — en el palacio de congresos Euskalduna, la empresa con la contrata técnica habría desconvocado a su plantilla habitual y, según el portavoz de Teknikariok, "apareció una horda de técnicos traídos de Cantabria para sustituirles"; el sindicato levantó acta.
> `convenio-tecnicos-espectaculos.html:238` — El sindicato asambleario Teknikariok —nacido en Bilbao en 2020— ha sido el motor que ha articulado por primera vez a un colectivo atomizado

**🔵 3.5 — 3/3**

faq_clonadas 0 de faq_total 4: ninguna pregunta se repite tras normalizar, y dos de ellas no tendrían sentido en ninguna otra ficha del corpus porque preguntan por un conflicto datado.

> `convenio-tecnicos-espectaculos.html:282` — ¿Qué reclama la huelga de técnicos de espectáculos de Euskadi de 2026?
> `convenio-tecnicos-espectaculos.html:276` — ¿Qué regula el Real Decreto 1435/1985 para el personal técnico?

**🔵 10.1 — 3/3**

no hay boletín que superar porque ningún boletín cubre a este colectivo: la ventaja es haber levantado el mapa normativo (relación especial vs común) que el BOE deja implícito y que ningún PDF ordena.

> `convenio-tecnicos-espectaculos.html:204` — Cuando esas funciones técnicas se prestan <strong>de forma estructural o permanente</strong> para la empresa, quedan <em>fuera</em> de la relación especial

> Es la ficha más singular del piloto por margen amplio (0 boilerplate, 76/76 frases exclusivas, 0 FAQ clonada) y a la vez la única marcada indexable:false en censo.json con nota 'noindex deliberado': el activo con mayor singularidad del corpus es el único que Google no puede ver. Esa decisión pertenece a otro eje (operación/indexación), pero desde E2 conviene decirlo: si el rechazo de AdSense por 'poco valor' se combate con páginas que nadie más tiene, esta es exactamente la página que debería estar indexada. Segunda observación: el modelo editorial de esta ficha —conflicto datado, fuentes de prensa cotejadas, hecho que exige reportear— es lo que le falta a las fichas de tabla, y es replicable sin tocar sus tablas.

### E3 · Respuesta al trabajador

**🔴 1.1 — 0/3** · *matizado por el verificador*

En toda la primera pantalla no hay un solo número de dinero: la fila de la tabla-resumen que debería dar el suelo lo deja en abstracto, y el determinista confirma cifra_en_primeros_bloques=false. El lector que teclea «cuánto cobra un técnico de espectáculos» no encuentra ninguna cantidad, ni haciendo scroll.

> `convenio-tecnicos-espectaculos.html:184` — Suelo retributivo Salario Mínimo Interprofesional vigente
> `convenio-tecnicos-espectaculos.html:221` — Salario Mínimo Interprofesional: actúa como retribución mínima irrenunciable. Consulta el SMI vigente para conocer el suelo exacto.

**Parche propuesto:** Sustituir la fila 184 por: «Suelo retributivo — SMI 2026: 1.221 €/mes en 14 pagas (17.094 € brutos/año), RD 126/2026» y reescribir la línea 221 como: «Salario Mínimo Interprofesional: 1.221 €/mes en 14 pagas — 17.094 € brutos al año (RD 126/2026). Es la retribución mínima irrenunciable: ninguna productora puede pagarte menos por una jornada completa, tengas o no convenio.»

**🟠 1.6 — 1/3**

La nómina se nombra una sola vez, y como reclamo del CTA a la calculadora; no se dice qué concepto debe figurar en ella, con qué nombre, ni si las cifras del marco legal son brutas o netas. Para un colectivo que cobra por bolos y con conceptos improvisados por cada productora, esa es justo la brecha.

> `convenio-tecnicos-espectaculos.html:267` — ¿Tu nómina y tu jornada reflejan lo que marca el suelo legal? Compruébalo.

**Parche propuesto:** Añadir tras la línea 262 un bloque «Cómo leer tu nómina de bolo»: «Todas las cifras del SMI y del convenio son BRUTAS: de ahí se te descuentan IRPF y Seguridad Social. En tu nómina busca (1) el salario base, que a jornada completa nunca puede bajar de 1.221 €/mes en 14 pagas o de 1.424,50 €/mes si te prorratean las extras en 12; (2) si te contratan por días o por bolos, el salario base debe ir prorrateado a los días efectivamente trabajados, con las pagas extras incluidas —comprueba que aparece una línea de prorrata de pagas extras—; (3) las horas de montaje y desmontaje por encima de tu jornada pactada deben figurar como horas extraordinarias, con su número y su importe, no diluidas en un «complemento» sin desglose; (4) los conceptos extrasalariales (dietas, kilometraje) van aparte y no cotizan igual: si tu empresa mete parte del sueldo ahí, te está bajando la base de cotización del paro y de la jubilación.»

**🟢 1.2 — 2/3**

Responde 5 de las 8 preguntas que teclearía un técnico (qué marco me aplica, si la jornada de 14 h es legal, si las horas extra se pagan, cómo reclamar y con qué plazo, y si le ampara siendo temporal o de productora). Quedan sin responder: (1) cuánto tengo que cobrar —no hay ninguna cifra—; (2) me tienen que pagar plus de nocturnidad y de festivo —solo dice que «es trabajo de naturaleza distinta», sin importe ni recargo—; (3) me avisan con 24 h, ¿tengo derecho a un calendario? —aparece solo como reivindicación de huelga, no como derecho exigible—.

> `convenio-tecnicos-espectaculos.html:217` — Jornada: máximo de 40 horas semanales de promedio en cómputo anual. Cualquier exceso es hora extraordinaria.
> `convenio-tecnicos-espectaculos.html:222` — Trabajo nocturno y festivo: el Estatuto reconoce su naturaleza específica; sin convenio que fije pluses, sigue siendo trabajo de naturaleza distinta que la empresa no puede tratar como ordinario sin más.
> `convenio-tecnicos-espectaculos.html:232` — Calendario laboral mínimo , frente a convocatorias con solo 24-48 horas de antelación.

**🟢 1.3 — 2/3**

Hay camino real y con plazo (registro de jornada como prueba, reclamación con el año del art. 59.2 ET, papeleta gratuita, Inspección, sindicación) y el determinista confirma dos enlaces al kit. No llega a 3 porque no hay cálculo posible —no existe cifra contra la que comparar— y la plantilla de atrasos solo aparece en el pie de página, fuera del bloque de acción.

> `convenio-tecnicos-espectaculos.html:250` — La empresa debe registrar tu jornada diaria (art. 34.9 ET). Pide copia. Sin registro, las horas extra impagadas son difíciles de reclamar; con él, son demostrables.
> `convenio-tecnicos-espectaculos.html:254` — Tienes 1 año por mensualidad de plazo (art. 59.2 ET). La papeleta de conciliación es gratuita e interrumpe el plazo.

**🟢 1.4 — 2/3**

Nombra oficios reales (montaje, sonido, iluminación, regiduría, maquinaria escénica) y plantea con claridad la frontera entre la relación especial del RD 1435/1985 y la común del Estatuto. Pero deja al lector sin conclusión: la propia ficha remata que el encuadramiento «depende de las circunstancias reales del puesto», de modo que quien llega preguntando «¿a mí cuál me aplica?» se va sin respuesta. No hay lista de indicios ni casos frontera resueltos.

> `convenio-tecnicos-espectaculos.html:204` — Cuando esas funciones técnicas se prestan de forma estructural o permanente para la empresa, quedan fuera de la relación especial: rige la relación común del Estatuto de los Trabajadores
> `convenio-tecnicos-espectaculos.html:299` — El encuadramiento concreto de cada relación (especial del RD 1435/1985 o común del Estatuto) depende de las circunstancias reales del puesto.

**🟢 1.9 — 2/3**

Es la ficha del hueco por definición y no lo disimula: lo declara desde el H1 y dedica una sección entera a explicar por qué no hay convenio y qué ampara mientras tanto. Se queda en 2 porque el suelo que ofrece no es real: dice «el SMI vigente» sin la cantidad ni la norma que lo fija, así que el lector sigue sin saber por debajo de qué cifra no le pueden pagar.

> `convenio-tecnicos-espectaculos.html:171` — No existe un convenio sectorial específico que regule la jornada, las horas extra o la disponibilidad del personal técnico de espectáculos.
> `convenio-tecnicos-espectaculos.html:215` — La ausencia de convenio sectorial no elimina tus derechos : el Estatuto de los Trabajadores funciona como suelo legal que ninguna empresa puede rebajar, exista o no convenio.
> `convenio-tecnicos-espectaculos.html:221` — Consulta el SMI vigente para conocer el suelo exacto.

> LAS 8 PREGUNTAS QUE TECLEARÍA UN TÉCNICO DE ESPECTÁCULOS ANTES DE LLEGAR AQUÍ: (1) «¿cuánto tengo que cobrar por montar un concierto / cuánto cobra un técnico de sonido?»; (2) «¿qué convenio me aplican si monto escenarios?»; (3) «me hacen jornadas de 14 horas seguidas, ¿es legal?»; (4) «¿me tienen que pagar las horas extra del montaje y el desmontaje?»; (5) «trabajo de noche y en festivos, ¿me corresponde algún plus?»; (6) «me avisan del bolo con 24 horas, ¿tengo derecho a saber mi calendario?»; (7) «no me pagan horas, ¿cómo reclamo y hasta cuándo puedo?»; (8) «soy temporal / me pagan como autónomo en una productora, ¿me ampara algo?». RECORRIDO: responde 2, 3, 4, 7 y 8 con respuesta accionable; falla en 1, 5 y 6. — La ficha está muy bien construida como explicación de un vacío regulatorio, pero olvida que quien la busca llega con una duda económica, no jurídica. Es la única de las seis en la que se puede leer entera sin encontrar un euro. Un solo dato —el SMI 2026 con su cifra— la convertiría de artículo a herramienta. Fuera de mi eje: el determinista marca 5.2 (sin sello «Verificado contra…») y 2.2 (sin bloque «Quién audita esto»), que las otras cinco fichas sí tienen; en una página cuyo argumento es «no te fíes de lo que te cuenten», la ausencia del sello es especialmente cara. La ventana de medición está cerrada (21 días desde el último commit), así que los parches son aplicables ya.

### E6 · Forma y lectura

**🟠 7.4 — 1/3**

parrafos.largos_100 viene vacío, pero el contador solo mira <p>: el bloque de apertura es un <div class="callout-red"> que funciona como ladrillo — una sola masa de texto que mete la huelga, el número de asistentes, la patronal, los dos años de bloqueo y cinco quejas distintas sin un solo respiro. La ficha no tiene nota editorial fragmentada; su sustituto (el card «Situación de un vistazo») sí está bien troceado, y por eso no es un 0.

> `convenio-tecnicos-espectaculos.html:190` — <div class="callout-red">
> `convenio-tecnicos-espectaculos.html:191` — El personal técnico de eventos y espectáculos protagonizó su <strong>primera huelga histórica</strong> en Álava, Bizkaia y Gipuzkoa, con concentración frente al Teatro Arriaga de Bilbao (más de 150 personas, según El Correo), dentro de una jornada convocada por Teknikariok, UGT, ESK, LAB, ELA y CCOO
> `convenio-tecnicos-espectaculos.html:179` — <div class="card-title">Situación de un vistazo</div>

**Parche propuesto:** Partir el callout-red en tres sub-párrafos con etiqueta en negrita, al modo de la nota editorial de metal-sevilla: «<strong>Qué pasó.</strong> El 15 de mayo de 2026 el personal técnico de eventos hizo la primera huelga del sector en Álava, Bizkaia y Gipuzkoa, con concentración ante el Teatro Arriaga de Bilbao (más de 150 personas, según El Correo).» / «<strong>Por qué.</strong> El paro llega tras dos años de bloqueo negociador con la patronal EUKI: la mesa del primer convenio del sector arrancó en enero de 2024 y no ha movido ficha.» / «<strong>Qué denuncian.</strong> Jornadas que exceden con mucho las ocho horas, descansos no respetados, trabajo nocturno y festivo sin reconocimiento y disponibilidad permanente. Confirmado por RTVE País Vasco, orain.eus/EITB, Naiz y El Correo, todos del 15-V-2026.»

**🟠 7.8 — 1/3** · *matizado por el verificador*

Es la ficha más lejos del canon de Madrid del piloto: no tiene sello «✓ Verificado contra …», no tiene bloque «Quién audita esto» y no tiene fecha de revisión visible (sello.presente = false, norma.quien_audita = false, norma.fecha_actualizacion_visible = false), mientras las otras cinco los llevan. No es 0 porque su contenido es 100% propio (corpus.boilerplate_ratio = 0.0, 76 de 76 frases exclusivas) y está bien estructurado. La ausencia de tablas sí está justificada: no hay convenio que tabular.

> `convenio-tecnicos-espectaculos.html:176` — En SalarioJusto documentamos lo que te corresponde según tu convenio. A veces, lo que te corresponde saber es que <strong>tu sector no tiene convenio propio</strong>
> `convenio-comercio-madrid.html:173` — <strong>✓ Verificado</strong> contra BOCM Núm. 183/2025 por SalarioJusto · última revisión 13 de agosto de 2026

**Parche propuesto:** Añadir, justo tras <main>, el bloque canónico de sello adaptado a una ficha sin boletín propio: «<div class="callout-info eeat-sello" style="margin:24px 0 0;border-left:4px solid var(--green);font-size:13.5px;"><strong>✓ Verificado</strong> contra el RD 1435/1985 y el RDL 2/2015 (textos consolidados del BOE) y la cobertura del conflicto del 15-V-2026 en RTVE País Vasco, EITB, Naiz y El Correo · última revisión 30 de julio de 2026</div>». Y clonar de convenio-hosteleria-valencia.html el bloque «Quién audita esto» antes del footer.

**🟠 12.3 — 1/3** · *matizado por el verificador*

El esqueleto se aleja del corpus por partida doble: sin sello, sin bloque de autoría y sin card «Datos clave del convenio» (usa «Situación de un vistazo», con otro rótulo y otra semántica). Parte de la desviación es inevitable —es un explicador de un sector sin convenio, noindex y fuera del sitemap—, pero el sello y la firma no dependen del tipo de página: son norma de casa para toda landing.

> `convenio-tecnicos-espectaculos.html:179` — <div class="card-title">Situación de un vistazo</div>
> `convenio-limpieza-zaragoza.html:242` — <div class="card-title">Datos clave del convenio</div>

**Parche propuesto:** Renombrar el card a «Datos clave del sector» manteniendo sus seis stat-items, y añadir los bloques eeat-sello y eeat-firma descritos en el parche de 7.8, para que el esqueleto sea reconocible como ficha del corpus aunque el contenido sea un explicador.

**🟢 7.2 — 2/3**

verde_total_pagina = 4 y todos los usos son de decoración (fondo de callout, negritas de callout, cuadraditos de la check-list): no hay ninguna cifra salarial en verde porque la ficha no tiene tablas. No llega a 3 porque el verde no está reservado al sello — de hecho no hay sello.

> `convenio-tecnicos-espectaculos.html:125` — .callout-info strong{color:var(--green);}
> `convenio-tecnicos-espectaculos.html:139` — .check-list li::before{content:'';position:absolute;left:4px;top:14px;width:12px;height:12px;background:var(--green);border-radius:2px;}

**🟢 7.5 — 2/3**

headings.h1 = 1, saltos_jerarquia = [] y los 12 encabezados son preguntas o promesas concretas, no etiquetas huecas. No es 3 porque los encabezados no llevan ninguna cifra ni dato que oriente por sí solo: leídos en fila cuentan el problema, no el contenido.

> `convenio-tecnicos-espectaculos.html:214` — <h2>Qué te ampara mientras no hay convenio</h2>
> `convenio-tecnicos-espectaculos.html:244` — <h2>Qué puedes hacer si trabajas en el sector</h2>

**🟢 8.1 — 2/3**

No sobra ningún bloque: las cinco secciones (por qué no hay convenio · qué te ampara · reivindicaciones · qué hacer · FAQ) responden a preguntas distintas y ninguna es relleno. No es 3 porque el segundo callout de esquirolaje, siendo cierto e interesante, se desvía del propósito de la página (qué cobro y qué me ampara) hacia crónica de conflicto.

> `convenio-tecnicos-espectaculos.html:241` — <strong>El esquirolaje externo es ilegal — incluso sin convenio.</strong> El Correo relató un episodio revelador: en el palacio de congresos Euskalduna

**🟢 8.2 — 2/3**

El orden es el correcto para una página cuya respuesta es «no existe convenio»: se dice en el h1, se resume en el card «Situación de un vistazo» y solo después se explica el porqué. respuesta_directa.cifra_en_primeros_bloques = false, pero aquí no hay cifra que dar salvo el SMI, y el card la señala como «Suelo retributivo».

> `convenio-tecnicos-espectaculos.html:184` — <div class="stat-label">Suelo retributivo</div><div class="stat-value">Salario Mínimo Interprofesional vigente</div>

**🟢 8.3 — 2/3**

Las FAQ repiten lo ya dicho en el cuerpo, pero es la redundancia esperada del formato (schema FAQPage) y ninguna sección del cuerpo duplica a otra sección del cuerpo. No llega a 3 porque el listado de sindicatos convocantes aparece tres veces casi idéntico.

> `convenio-tecnicos-espectaculos.html:186` — <div class="stat-value">UGT, Teknikariok, ESK, LAB, ELA y CCOO</div>
> `convenio-tecnicos-espectaculos.html:283` — Convocada por UGT, Teknikariok, ESK, LAB, ELA y CCOO, afectó a eventos culturales en Bilbao, Vitoria, San Sebastián y Leioa.

**🟢 8.6 — 2/3**

El diccionario jerga viene vacío (ningún término del listado aparece), pero la ficha introduce por su cuenta un tecnicismo —esquirolaje externo— y lo explica en la misma frase en que lo usa, con la consecuencia jurídica incluida. No es 3 porque no traduce nada a dinero: «relación laboral especial» vs «común» decide qué convenio te aplica y nunca se dice qué diferencia supone en la nómina.

> `convenio-tecnicos-espectaculos.html:241` — Sustituir preventivamente a personal en huelga por trabajadores externos —el llamado <strong>esquirolaje externo</strong>— vulnera el derecho fundamental de huelga

**🟢 12.6 — 2/3**

Un mismo concepto se llama siempre igual: «relación laboral especial» y «relación laboral común» se mantienen en los tres sitios donde aparecen (pill-cards, cuerpo y FAQ), y «personal técnico» no alterna con «técnicos» en masculino dentro del texto. norma.categorias_masc_total = 1 (un único «Oficial», y es cita del Estatuto, no categoría de tabla).

> `convenio-tecnicos-espectaculos.html:203` — <div class="pill-card-title">Relación laboral común</div>
> `convenio-tecnicos-espectaculos.html:277` — Queda fuera de esa relación especial el personal técnico cuyas funciones son estructurales o permanentes en la empresa: ahí rige la relación común del Estatuto de los Trabajadores.

**🔵 8.8 — 3/3**

norma.sindicatos reparte por igual (CCOO 4 · UGT 4 · ELA 4 · LAB 4) y el texto encabeza siempre por el sindicato asambleario del sector, Teknikariok, con ELA y LAB integrados sin nota a pie. Es lo que ninguna otra ficha del piloto hace: nombrar a los combativos del territorio como sujeto y no como apéndice.

> `convenio-tecnicos-espectaculos.html:191` — dentro de una jornada convocada por Teknikariok, UGT, ESK, LAB, ELA y CCOO
> `convenio-tecnicos-espectaculos.html:238` — El sindicato asambleario Teknikariok —nacido en Bilbao en 2020— ha sido el motor que ha articulado por primera vez a un colectivo atomizado

**🔴 11.1 — None/3**

no_evaluada


*No evaluadas:* `11.1` tablas.n = 0 — la ficha no tiene ninguna tabla, y la ausencia está justificada porque el sector no tiene tablas salariales de convenio que publicar

> Es la única ficha del piloto que no tiene sello ni firma, y los dos hard-fails deterministas (5.2 y 2.2) apuntan justo ahí. Merece decirse que el defecto es de plantilla, no de contenido: la pieza es la más original del piloto (boilerplate_ratio 0.0) y la mejor en tratamiento sindical. Fuera de mi eje: el título ocupa 95 caracteres y la meta 260, ambos por encima de lo que renderiza Google (eje SEO), y la ficha está en noindex + fuera del sitemap con 151 impresiones en 28 días, lo que sugiere revisar si el noindex sigue siendo deliberado.
