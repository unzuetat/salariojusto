# convenio-metal-bizkaia

**Score: 66.5/100** · hard-fails: **4**

> ⚠️ **Sin verificación adversarial.** Estas notas no han pasado por la capa 2. En el piloto
> el verificador refutó o matizó cerca de un tercio de los hallazgos, así que este score no
> es comparable con el de una ficha verificada. Trátalo como provisional.

Sector metal · estado `ultraactividad` · 2339 palabras de prosa · boilerplate 0.182 · último cambio hace 21 días
GSC 28d: 58 clics · 1238 impresiones · CTR 4.68% · posición 8.34

## Hard-fails — no se compensan con la nota

- **4.5** (E1) · Dos códigos REGCON distintos para el mismo convenio en la misma página. La ficha da 48001985011981 en los datos clave, en el bloque de fuentes, en la meta description, en el og:description y en el JSON-LD, y coincide con data/convenios/censo.json; pero en el paso final de la sección de reclamación da 48004245011982. Un lector que use ese segundo código en el registro no encuentra este convenio: la cadena se rompe justo en el punto donde se le pide que actúe.
- **4.5** (E2) · La página da dos códigos de convenio distintos para el mismo convenio. En Datos clave (línea 200), en la meta description, en el JSON-LD y en Fuentes oficiales (línea 615) el código es 48001985011981; en el bloque de reclamación (línea 607) es 48004245011982. Quien siga la instrucción de la ficha y busque ese segundo código en REGCON no encontrará el convenio del que trata la página. Es el mismo bloque pegado sin adaptar que provoca el fallo de 3.1, y la contradicción cae justo donde se le pide al lector que actúe.
- **4.5** (E3) · Dos códigos REGCON distintos para el mismo convenio en la misma página. El título, los datos clave, el schema y el bloque de fuentes dan 48001985011981; el cierre de la sección de reclamación da 48004245011982, un código que no aparece en ninguna otra ficha ni en el censo del sitio y cuyo único rastro está en scripts/audit/aplicar-boilerplate.py, es decir, es un valor inyectado por plantilla. Es el número que el lector copia para localizar su convenio en REGCON y para citarlo en una reclamación.
- **4.5** (E6) · Dos códigos REGCON distintos para el mismo convenio en la misma página. El card de datos clave, el JSON-LD y el bloque de fuentes dan 48001985011981; el pie del bloque de reclamar da 48004245011982. Quien copie el código del bloque de reclamar —que es justamente el punto donde la ficha le pide que lo use para reclamar— busca en REGCON un convenio distinto del que acaba de leer.

## Ejes

**Cuello de botella: E6 (50.0% de su peso).** Es por donde empieza el arreglo.

| eje | | puntos | peso |
|---|---|---|---|
| E1 | Verdad demostrada | 15.9 | 22 |
| E2 | Singularidad y ventaja | 17.8 | 22 |
| E3 | Respuesta al trabajador | 12.2 | 20 |
| E4 | Captación y citabilidad | 8.4 | 14 |
| E5 | Enlazado y clúster | 7.2 | 12 |
| E6 | Forma y lectura | 5.0 | 10 |

### E1 · Verdad demostrada

**🟠 9.1 — 1/3**

Hay fecha, pero el sello no dice contra qué se cotejó: nombra «el BOPV de la provincia», que ni es el boletín donde se publica este convenio (es el BOB) ni lleva número ni fecha de edicto. Y el determinista sitúa el último commit el 30-jul-2026, dos meses después de la revisión declarada, de modo que el lector no puede saber qué se comprobó ni cuándo.

> `convenio-metal-bizkaia.html:194` — <strong>✓ Verificado</strong> contra el BOPV de la provincia por SalarioJusto · última revisión 28 de mayo de 2026
> `convenio-metal-bizkaia.html:625` — Esta ficha de convenio ha sido cruzada manualmente contra el texto íntegro del boletín oficial por el equipo de SalarioJusto.

**Parche propuesto:** Reescribir el sello (línea 194) con el boletín correcto y el documento exacto: «✓ Verificado contra el texto del convenio 2022-2025 de la Industria Siderometalúrgica de Bizkaia (BOB núm. 90, 11-may-2023, cve BOB-2023a090-(III-99), código REGCON 48001985011981) y contra el acta de la Comisión Mixta de enero de 2026 que mantuvo las tablas de 2025 sin actualizar, por SalarioJusto · última revisión [fecha del último cotejo real, no la del último commit].» Y en el bloque «Quién audita esto» (línea 625) sustituir «el texto íntegro del boletín oficial» por «el BOB núm. 90 de 11-may-2023» y declarar que la columna de bruto anual es cálculo propio con la fórmula del pie de tabla.

**🟢 5.8 — 2/3**

Lo que afirma sobre la aplicación del convenio va anclado al artículo y a la norma (Art. 2 del convenio y art. 86.3 ET) e incluso cita el texto literal; no sube a 3 porque las cuantías se presentan como lo que cobra la categoría sin decir que son a jornada completa y sin advertir de que el complemento de salario mínimo garantizado es lo que sostiene a las cinco categorías más bajas hasta que se toca el suelo legal.

> `convenio-metal-bizkaia.html:218` — Conforme al mismo artículo (literalmente: <em>"en tanto no se logre acuerdo expreso, se mantendrá en vigor todo su contenido normativo"</em>) y al Art. 86.3 del Estatuto de los Trabajadores, todo el clausulado normativo sigue aplicándose sin discontinuidad.
> `convenio-metal-bizkaia.html:284` — Las cinco categorías más bajas … alcanzan el suelo de 22.034,57 €/año mediante el Complemento de Salario Mínimo Garantizado (Art. 3.3).

**🟢 5.10 — 2/3**

Lleva al documento exacto —PDF del edicto del BOB con su cve escrito al lado— y añade la nota sindical fechada que sostiene la sección de negociación; no llega a 3 porque no señala dentro del PDF el anexo de tablas del que salen las cuantías y no enlaza el registro REGCON ni el RD del SMI.

> `convenio-metal-bizkaia.html:614` — <strong>Convenio íntegro 2022-2025</strong>: <a href="https://www.bizkaia.eus/lehendakaritza/Bao_bob/2023/05/11/III-99_cas.pdf" target="_blank" rel="noopener">BOB Núm. 90 del 11 de mayo de 2023</a> (cve BOB-2023a090-(III-99)).
> `convenio-metal-bizkaia.html:214` — Publicado en el Boletín Oficial de Bizkaia Núm. 90 del 11 de mayo de 2023 (cve BOB-2023a090-(III-99)) por resolución de la Delegada Territorial de Trabajo y Seguridad Social de Bizkaia.

**🟢 5.11 — 2/3**

Rotula cada tabla y cada tarjeta como «2025-2026» y explica en la nota editorial por qué las cifras de 2025 son las que rigen en 2026 —el caso más difícil de fechar del sector, y lo resuelve—; pero pierde el 3 porque la sección de reclamación manda comparar la nómina con «la tabla 2026 del Anexo I», una tabla que la propia ficha dice que no existe.

> `convenio-metal-bizkaia.html:225` — <div class="card-title">Personal obrero 2025-2026 · €/año brutos</div>
> `convenio-metal-bizkaia.html:218` — <strong>Convenio en ultraactividad — tablas 2025 vigentes en 2026 sin actualización.</strong>
> `convenio-metal-bizkaia.html:603` — Compara tres meses consecutivos de nómina con la tabla 2026 del Anexo I para tu categoría.

**🔵 2.1 — 3/3**

Aporta tres cosas que no están en ningún boletín y las justifica: la aritmética de por qué la cláusula del IPC no se activó, la comparación de la póliza con el convenio de Construcción de la misma provincia, y un seguimiento de la negociación abierta con la plataforma sindical citada y fechada. Además publica la fórmula de su bruto anual.

> `convenio-metal-bizkaia.html:284` — Cálculo del bruto anual: salario base × 425 días (365 año + 60 pagas extras) + Carencia de Incentivo y Plus de Convenio × 299 días (365 - 52 domingos - 14 festivos) + complemento garantizado si procede.
> `convenio-metal-bizkaia.html:578` — La cobertura de Metal Bizkaia (28.000 € única para todos los supuestos) es entre 2 y 3 veces inferior. Es una asimetría notable entre dos sectores con riesgos físicos comparables
> `convenio-metal-bizkaia.html:609` — la primera reunión efectiva tuvo lugar el <strong>15 de enero de 2026</strong>, según informó <a href="https://ugteuskadi.net/empieza-la-negociacion-del-convenio-del-metal-de-bizkaia/" target="_blank" rel="noopener">UGT-Euskadi</a>

**🔵 9.2 — 3/3**

Es la única ficha del sector con una sección dedicada al después: dice que el convenio está denunciado, quién negocia, qué pide cada parte, desde cuándo, y qué debe hacer el lector hoy por si hay efectos retroactivos. Convierte la caducidad en una instrucción concreta.

> `convenio-metal-bizkaia.html:608` — <h2>Estado de la negociación del nuevo convenio 2026-202X</h2>
> `convenio-metal-bizkaia.html:610` — Si el nuevo convenio incluye incrementos con efectos retroactivos al 1 de enero de 2026, se generarán atrasos liquidables. Es recomendable conservar todas las nóminas de 2026 sin destruir hasta que el nuevo convenio se publique.

> Ficha de análisis excelente y de trazabilidad descuidada: es la que más trabajo propio enseña (fórmula del anual, comparación con Construcción Bizkaia, dossier de negociación) y a la vez la única cuyo sello nombra mal el boletín. El contraste importa porque el lector desconfiado empieza por el sello. Dos apuntes que no puntúo: (a) el pie de la tabla de dietas dice «Los valores mostrados son las cuantías base pactadas en 2023» bajo un encabezado «Cuantía 2025-2026» — es honesto y está explicado por la suspensión de la Comisión Mixta, pero roza la ambigüedad de fechado; (b) el determinista marca boilerplate_ratio 0,182, el más alto del sector, cosa del eje de originalidad, no de este.

### E2 · Singularidad y ventaja

**🟠 3.1 — 1/3**

boilerplate_ratio 0,182, entre tres y doce veces el de sus ocho hermanas (Barcelona 0,015, Asturias 0,032, Zaragoza 0,041), y 16 frases compartidas concentradas en el bloque de reclamación. El problema no es que ese bloque sea cromo —lo es—, sino que está pegado sin adaptar: manda comprobar en la nómina un «plus de transporte» que este convenio no tiene, cuando sus pluses son el tóxico/penoso/peligroso, la nocturnidad, el sábado, el domingo y el retén. El cromo que contradice la propia tabla deja de ser cromo.

> `convenio-metal-bizkaia.html:603` — Anota diferencias por concepto (salario base, plus de transporte, plus festivo, nocturnidad, antigüedad si aplica) y guarda copias de las nóminas.
> `convenio-metal-bizkaia.html:598` — comprueba el plus de nocturnidad de 9,08 €/día o 1,17 €/hora

**Parche propuesto:** Sustituir la enumeración genérica de la línea 603 por los conceptos que este convenio sí regula, que además ya están tabulados más arriba en la propia ficha: «Anota diferencias por concepto —salario base, Carencia de Incentivo, Plus de Convenio, Complemento de Salario Mínimo Garantizado, nocturnidad (9,08 €/día), plus tóxico/penoso/peligroso, complemento de sábado (44,04 €) o de domingo y festivo (55,09 €), complemento de retén (27,56 €) y quinquenios de antigüedad si aplican— y guarda copias de las nóminas.» El mismo bloque, con los pluses de Bizkaia en vez de los de otra provincia.

**🟢 3.5 — 2/3**

Por contenido sería la mejor FAQ del sector: 1 clonada de 7, y preguntas que no caben en ninguna otra provincia («¿Por qué no se activó la cláusula de actualización de tablas para 2026?»). Pero no puedo puntuarla de ejemplar porque esas siete preguntas viven solo en el JSON-LD: la página no tiene sección de preguntas frecuentes visible, así que como singularidad ofrecida al lector no llega. La invisibilidad en sí la dejo para el eje de estructura.

> `convenio-metal-bizkaia.html:66` — ¿Por qué no se activó la cláusula de actualización de tablas para 2026?
> `convenio-metal-bizkaia.html:69` — Como el IPC sumatorio (14,5%) no superó el incremento pactado (15%), la cláusula no se activó y la Comisión Mixta del Convenio decidió en enero de 2026 mantener las tablas 2025 sin modificación durante la ultraactividad.

**🟢 8.4 — 2/3**

Recoge la particularidad principal y la recoge bien —el conflicto de negociación abierto, con fecha de constitución de la mesa, plataforma sindical y silencio patronal, más el régimen foral—, pero se deja el rastro industrial que su propia tabla enseña: buzos, hombres y mujeres rana, capitanes de más de 400 toneladas y jefaturas de diques y muelles son el legado de la ría y los astilleros, y la ficha los menciona como categorías sueltas sin decir qué provincia los explica.

> `convenio-metal-bizkaia.html:415` — Las categorías de Buzo/Buza (Personal Técnico de Diques y Muelles) y Capitán/Capitana de más de 400 toneladas son específicas del trabajo portuario regulado por el Art. 1 del convenio.
> `convenio-metal-bizkaia.html:609` — la primera reunión efectiva tuvo lugar el 15 de enero de 2026, según informó UGT-Euskadi

**🔵 3.2/3.3 — 3/3**

2.339 palabras de prosa —la cifra más baja del sector— con ratio_tabla 0,189, y aun así la prosa es imprescindible: la tabla muestra cinco salarios base distintos que dan todos el mismo bruto anual de 22.034,57 €, y eso solo se entiende con el párrafo del Complemento de Salario Mínimo Garantizado y con la fórmula de 425 y 299 días. Sin esa prosa la tabla parece un error de transcripción.

> `convenio-metal-bizkaia.html:284` — Cálculo del bruto anual: salario base × 425 días (365 año + 60 pagas extras) + Carencia de Incentivo y Plus de Convenio × 299 días (365 - 52 domingos - 14 festivos) + complemento garantizado si procede.
> `convenio-metal-bizkaia.html:222` — las categorías cuyo salario base teórico no llega a esa cifra reciben automáticamente el "Complemento de Salario Mínimo Garantizado" en 12 mensualidades para alcanzarla

**🔵 3.4 — 3/3**

Solo 72 frases exclusivas y 1.712 palabras exclusivas —los mínimos del sector—, pero la masa exclusiva es de la buena: comparar la indemnización por accidente con la del convenio de Construcción de la misma provincia y ligar esa asimetría a una demanda concreta de la plataforma sindical de enero de 2026 exige cruzar dos convenios y un comunicado, no reescribir el articulado. Poca cantidad, alta sustancia.

> `convenio-metal-bizkaia.html:578` — La cobertura de Metal Bizkaia (28.000 € única para todos los supuestos) es entre 2 y 3 veces inferior. Es una asimetría notable entre dos sectores con riesgos físicos comparables y un punto de tensión potencial en la negociación del nuevo convenio iniciada en enero de 2026
> `convenio-metal-bizkaia.html:609` — La plataforma sindical conjunta plantea como demandas prioritarias: incremento del IPC más 3% anual hasta 2028, aumento sustancial de los pluses de peligrosidad

**🔵 10.1 — 3/3**

El BOB de 2023 publica un convenio 2022-2025; por sí solo no dice nada sobre 2026. La página responde la pregunta que el boletín no puede responder —qué tablas rigen hoy y por qué no se movieron— con la aritmética del art. 3.1, y añade el estado de la negociación en curso. Eso es actualidad y cálculo, no HTML del PDF.

> `convenio-metal-bizkaia.html:218` — La cláusula del Art. 3.1 que habría actualizado las tablas con efectos 1-ene-2026 (si la suma del IPC estatal 2022-2025 hubiera superado el 15% pactado) no se activó: el IPC sumatorio fue ~14,5%, por debajo del umbral.

**🔵 10.2 — 3/3**

Ninguna calculadora de nóminas le dice a nadie que guarde las nóminas de 2026 porque puede haber atrasos retroactivos si el convenio se firma con efectos de enero. Esa es una ventaja que el lector percibe sin que se la expliquen y que solo puede dar quien sigue la negociación, no quien copia una tabla.

> `convenio-metal-bizkaia.html:610` — Si el nuevo convenio incluye incrementos con efectos retroactivos al 1 de enero de 2026, se generarán atrasos liquidables. Es recomendable conservar todas las nóminas de 2026 sin destruir hasta que el nuevo convenio se publique.

> Ventana cerrada (último commit 2026-07-30, 21 días) y es la única de las nueve con datos GSC en el determinista (58 clics, 1.238 impresiones, CTR 4,68 %, posición 8,34): tiene tracción, así que los parches deberían priorizarse aquí. Diagnóstico de eje: esta ficha tiene la mejor materia prima singular del cluster —negociación viva, asimetría con Construcción, complemento de mínimo garantizado— y el peor acabado de corpus: boilerplate 0,182, un código de convenio equivocado y siete preguntas frecuentes que solo existen para las máquinas. La singularidad no se le arregla añadiendo texto, se le arregla quitando el bloque prestado de otra provincia. Dos avisos para otros ejes: (1) el sello de la línea 194 dice «Verificado contra el BOPV de la provincia» cuando la fuente real es el BOB (Boletín Oficial de Bizkaia), que es lo que cita correctamente el resto de la página; (2) el bloque de negociación está fechado «a fecha de mayo de 2026» y el sello dice «última revisión 28 de mayo de 2026»: en agosto ese estado de la negociación necesita recomprobación, y si la mesa ha avanzado, la ventaja de actualidad que ahora vale un 3 en 10.2 se convierte en un pasivo.

### E3 · Respuesta al trabajador

**🔴 1.4 — 0/3**

No hay forma de saber si el convenio te cubre sin leer el convenio. La ficha no tiene ámbito funcional: no enumera ni una actividad, no nombra ningún CNAE y no declara ninguna frontera; el determinista lo confirma en conceptos_ausentes. Lo único territorial es una línea de la tabla de datos clave. Y en la segunda mitad, la del grupo profesional, las categorías son las del boletín (Profesional Siderúrgico/a de 2.ª, Capataz/a Especialista, Práctico/a Fotógrafo/a) sin ningún puente desde el oficio real. Es tanto más grave cuanto que el sitio publica la ficha hermana del Comercio del Metal de Bizkaia y esta página no la menciona: quien trabaja en un almacén de suministro industrial no tiene manera de saber que está en la ficha equivocada.

> `convenio-metal-bizkaia.html:201` — Ámbito territorial Territorio Histórico de Bizkaia
> `convenio-metal-bizkaia.html:415` — Las categorías de Buzo/Buza (Personal Técnico de Diques y Muelles) y Capitán/Capitana de más de 400 toneladas son específicas del trabajo portuario regulado por el Art. 1 del convenio.

**Parche propuesto:** Añadir una sección «¿Este convenio te cubre?» entre el bloque de ultraactividad (línea 218) y la primera tabla, con el ámbito funcional del Art. 1 en lenguaje llano y una lista de puestos reales por grupo: «Personal obrero: quien trabaja en planta y taller — soldadores/as, chapistas, calderos/as, torneros/as y fresadores/as (Oficial de 1.ª, 2.ª o 3.ª según la cualificación y la autonomía del puesto), personal de línea siderúrgica (Profesional Siderúrgico/a de 1.ª a 3.ª), peones/as ordinarios/as y especialistas. Personal subalterno: vigilantes, ordenanzas, conserjes, porteros/as. Personal técnico de diques y muelles: buzos/as y personal de astillero, específico del trabajo portuario de la ría.» Y cerrar con la frontera: «Es un convenio de industria, no de comercio. Si tu empresa se dedica a la venta y distribución de artículos metálicos, te aplica el convenio del Comercio del Metal de Bizkaia, con tablas distintas», enlazando a /convenio-comercio-metal-bizkaia.html.

**🟠 1.2 — 1/3**

Solo responde 4 de las 8. Bien: la cifra del oficial de 1.ª y del suelo garantizado, las 14 pagas y sus fechas, los pluses de noche, sábado y domingo/festivo con importe diario, y qué hacer si cobras de menos. Sin responder, cuatro: (1) «¿me cubre este convenio?» —no hay ámbito funcional en toda la página; el determinista lo confirma y ni siquiera se nombra la frontera con el Comercio del Metal de Bizkaia, que tiene ficha propia en el sitio—; (2) «soy soldador, ¿qué categoría soy?» —solo denominaciones del boletín—; (3) «llevo 6 años, ¿cuánto de antigüedad?» —se explica el 5% ilimitado y hasta que se calcula sobre el salario base de 1993, pero el importe se remite a una columna de las tablas anexas que la ficha no transcribe, así que no hay cifra ni forma de obtenerla—; (4) «trabajo media jornada, ¿cuánto me corresponde?» —cero menciones, pese a que la tabla incluye una fila «Personal de Limpieza (jornada completa)» que abre justamente esa duda—.

> `convenio-metal-bizkaia.html:528` — Las cuantías concretas figuran en la columna "Valor Quinquenio Antigüedad" de las tablas anexas al convenio.
> `convenio-metal-bizkaia.html:277` — Personal de Limpieza (jornada completa)
> `convenio-metal-bizkaia.html:222` — El convenio organiza al personal en cinco grandes grupos profesionales: personal obrero (mayoría de la plantilla en planta y taller), personal subalterno (vigilantes, ordenanzas, conserjes), personal administrativo, personal técnico [...] y personal titulado.

**Parche propuesto:** Transcribir el valor del quinquenio para las categorías más consultadas, sustituyendo la remisión de la línea 528 por: «Valor del quinquenio 2025-2026 según la columna "Valor Quinquenio Antigüedad" de las tablas anexas al BOB: [importe] € para Peón/Peona Ordinario/a, [importe] € para Oficial de 3.ª, [importe] € para Oficial de 2.ª y [importe] € para Oficial de 1.ª. Con 6 años en la empresa te corresponde un quinquenio; con 11 años, dos.» —los importes deben leerse del anexo del BOB antes de publicarlos, no estimarse—. Y añadir antes de las tablas una sección «¿Este convenio te cubre?» con las actividades del ámbito funcional del Art. 1 en lenguaje llano (siderurgia y fundición, fabricación de productos metálicos y maquinaria, talleres de mecanizado, calderería y soldadura, montaje y mantenimiento industrial, astilleros y trabajo portuario de diques y muelles) y la frontera explícita: «Es un convenio de industria, no de comercio: si tu empresa solo vende artículos metálicos, te aplica el convenio del Comercio del Metal de Bizkaia, que es distinto y tiene sus propias tablas», con enlace a /convenio-comercio-metal-bizkaia.html.

**🟢 1.6 — 2/3**

Tiene la mejor sección de correspondencia del cluster —«Coge tu nómina mensual y suma los conceptos salariales fijos…»— y hace lo que casi nadie: nombra un concepto por su nombre de nómina y dice cómo debe figurar, en 12 mensualidades de igual cuantía y como línea separada. También avisa de que los complementos no son consolidables y de que las extras no incluyen Carencia de Incentivo ni Plus de Convenio. No llega a 3 por dos motivos concretos: el personal obrero, que es la mayoría de la plantilla, solo tiene salario base diario y bruto anual, nunca una cifra mensual con la que comparar; y la lista de comprobación de la reclamación manda buscar en la nómina un «plus de transporte» y un «plus festivo» que este convenio no tiene —el complemento de domingo o festivo solo existe en sistema de turnos—, lo que envía al lector a buscar conceptos inexistentes.

> `convenio-metal-bizkaia.html:596` — Coge tu nómina mensual y suma los conceptos salariales fijos (salario base, Carencia de Incentivo y Plus de Convenio en los días efectivamente trabajados, antigüedad por quinquenios si aplica). El "Complemento de Salario Mínimo Garantizado" debe aparecer como concepto separado en 12 mensualidades de
> `convenio-metal-bizkaia.html:603` — Anota diferencias por concepto (salario base, plus de transporte, plus festivo, nocturnidad, antigüedad si aplica)
> `convenio-metal-bizkaia.html:419` — Los complementos del convenio se devengan únicamente cuando se realizan los trabajos que los originan y no tienen carácter consolidable: si desaparece la causa, dejan de abonarse.

**🟢 1.9 — 2/3**

Declara el hueco con una claridad que no tiene ninguna otra: dice que las tablas de 2026 no existen, que se cobra con las de 2025, y explica por qué —la cláusula del Art. 3.1 no se activó porque el IPC sumatorio (14,5%) no superó el 15% pactado—, con los IPC año a año. Añade el estado de la negociación y el consejo de guardar las nóminas por si hay atrasos retroactivos. No llega a 3 porque no da el suelo: es la única ficha del metal que no menciona el SMI 2026 en ninguna parte, según confirma el determinista (menciona_smi: false). En un convenio congelado desde 2025, el SMI es exactamente la referencia que el lector necesita para saber si su cifra sigue siendo legal.

> `convenio-metal-bizkaia.html:218` — La cláusula del Art. 3.1 que habría actualizado las tablas con efectos 1-ene-2026 [...] no se activó : el IPC sumatorio fue ~14,5%, por debajo del umbral. Por tanto, las cifras 2025 son las cifras de referencia para nóminas de 2026
> `convenio-metal-bizkaia.html:521` — La Comisión Mixta del Convenio se reunía cada enero para actualizarlas — esta función queda suspendida en la ultraactividad hasta que se firme un nuevo convenio. Los valores mostrados son las cuantías base pactadas en 2023.

**🔵 1.1 — 3/3**

Es la única ficha del metal cuyo H1 lleva la cifra de un puesto concreto y no un rango: «Oficial 1ª 23.509 €/año», junto al mínimo garantizado, con el año en el propio título y la publicación oficial (BOB 90, 11-may-2023) en los datos clave del primer bloque. Quien busca «cuánto cobra un oficial de 1ª del metal en Bizkaia» tiene su respuesta antes de hacer scroll, sin pasar por la tabla. Ninguna otra del cluster lo hace: las demás abren con el rango de todas las categorías.

> `convenio-metal-bizkaia.html:185` — Convenio Metal Bizkaia 2026: salario mínimo garantizado 22.034 €/año, Oficial 1ª 23.509 €/año
> `convenio-metal-bizkaia.html:212` — Publicación oficial BOB 90, 11 may 2023
> `convenio-metal-bizkaia.html:186` — Tablas 2025 vigentes en 2026 por ultraactividad del Art. 86.3 ET tras la denuncia automática del 1 de noviembre de 2025.

**🔵 1.3 — 3/3**

Es el mejor camino de salida del corpus del metal y el único que llega a documento. Tres pasos ordenados por lógica de prescripción, no por burocracia: documentar comparando tres meses consecutivos de nómina, comunicar por escrito con prueba (burofax o email con acuse) citando los artículos, y PRECO con papeleta gratuita que interrumpe el plazo. Da el plazo del art. 59.2 con la consecuencia práctica —«actúa por las más antiguas primero para no perderlas»— y el determinista registra dos enlaces al kit, incluidas las plantillas, no solo la guía genérica.

> `convenio-metal-bizkaia.html:601` — La clave es documentar bien y actuar antes del año de prescripción que marca el art. 59.2 ET — cada mes que pasa sin reclamar es un mes que pierdes.
> `convenio-metal-bizkaia.html:605` — ve a PRECO (Servicio Vasco de Resolución de Conflictos) a presentar papeleta de conciliación. Interrumpe el plazo, es gratuita y abre la vía al juzgado de lo social [...] Tienes 1 año por mensualidad desde que debió pagarse: actúa por las más antiguas primero para no perderlas.
> `convenio-metal-bizkaia.html:610` — Si el nuevo convenio incluye incrementos con efectos retroactivos al 1 de enero de 2026, se generarán atrasos liquidables. Es recomendable conservar todas las nóminas de 2026 sin destruir hasta que el nuevo convenio se publique.

> LAS 8 PREGUNTAS QUE TECLEARÍA ALGUIEN DEL METAL EN BIZKAIA ANTES DE LLEGAR AQUÍ: (1) «¿cuánto cobra un oficial de 1ª del metal en Bizkaia en 2026?»; (2) «¿y eso cuánto es al mes?»; (3) «trabajo en un taller de la margen izquierda, ¿me cubre este convenio o el del comercio del metal?»; (4) «soy soldador / chapista, ¿en qué categoría estoy?»; (5) «¿cuántas pagas tengo y cuándo se cobran?»; (6) «llevo 6 años, ¿cuánto me toca de antigüedad?»; (7) «trabajo a turnos y me toca domingo, ¿cuánto me tienen que pagar?»; (8) «trabajo media jornada, ¿cuánto me corresponde?». RECORRIDO: (1) sí, en el propio H1 (185); (2) NO para el personal obrero —solo salario base diario y bruto anual; el mensual solo existe para administrativos y técnicos (297)—; (3) NO, no hay ámbito funcional; (4) NO; (5) sí (208, 474-476); (6) NO, el importe se remite a una columna no transcrita (528); (7) sí, 55,09 €/día (459-461); (8) NO. Cuatro de ocho. — Esta ficha es un contraste extremo: el mejor titular del cluster (la cifra del puesto, no el rango) y el mejor camino de reclamación del corpus, sobre una base que no dice a quién se aplica el convenio. La persona que llega sabe cuánto debería cobrar un oficial de 1.ª y sabe cómo reclamar, pero no puede saber si ella es esa oficial de 1.ª ni si su empresa está dentro. — El hard-fail 4.5 (dos códigos REGCON) no lo he penalizado además en las métricas, conforme al protocolo. — FUERA DE MI EJE, pero conviene que E2 lo mire: el sello dice «Verificado contra el BOPV de la provincia» (línea 194) cuando la fuente citada en todo el cuerpo es el BOB, el boletín foral de Bizkaia, y el BOPV es el del País Vasco; y la fecha de revisión visible es de 28-mayo-2026, coherente con frases del cuerpo que dicen «a fecha de mayo de 2026». — VENTANA CERRADA: 21 días desde el último commit, así que los dos parches (1.2 y 1.4) no van aplazados.

### E4 · Captación y citabilidad

**🟠 2.5 — 1/3**

La cifra llega tarde y se corta a mitad. Con 322 caracteres, lo que el buscador muestra se lo comen el código REGCON de quince dígitos y la referencia al artículo 86.3 del ET —dos cosas que no busca nadie— y el euro de la primera cuantía cae fuera: el lector ve '...Salario bruto anual mínimo 22.034,' con el número partido. Motivo para entrar sí hay (la ultraactividad), pero llega antes la jerga que la cuantía. Es la peor colocación de cifra del sector junto con Valencia.

> `convenio-metal-bizkaia.html:7` — Tablas salariales del convenio Siderometalúrgica Bizkaia (REGCON 48001985011981) vigentes en 2026 por ultraactividad ET 86.3. Salario bruto anual mínimo 22.034,57 €/año garantizado, Oficial 1ª 23.509,51 €, Ingeniero/a 38.246 €.

**Parche propuesto:** {'descripcion': 'Cifra delante, jerga fuera y el código REGCON al cuerpo, que es donde sirve. 158 caracteres.', 'texto_propuesto': '22.034,57 €/año es el salario mínimo garantizado del metal de Bizkaia en 2026; el Oficial 1ª, 23.509,51 €. Las tablas de 2025 siguen vigentes: el IPC no las subió.'}

**🟢 2.4 — 2/3**

Tiene la mejor procedencia de cifra de las nueve: los 22.034,57 €/año no son un derivado nuestro sino el salario mínimo garantizado que fija literalmente el Art. 3.2 del convenio, y encima añade el puesto más buscado (Oficial 1ª). Lleva unidad explícita ('€/año'), que evita el malentendido del piloto. Se queda en 2 porque a 77 caracteres el recorte cae justo sobre la segunda cifra —la del oficial, que es la que atrae la consulta— y porque no arranca por el número. El dato de operación respalda que la fórmula funciona: 4,68% de CTR en posición media 8,34 (gsc_28d), la única de las nueve con medición.

> `convenio-metal-bizkaia.html:6` — <title>Convenio Metal Bizkaia 2026: salario mínimo 22.034 €/año, Oficial 1ª 23.509 €</title>
> `convenio-metal-bizkaia.html:222` — El salario bruto anual mínimo garantizado de 22.034,57 €/año (Art. 3.2) actúa como suelo
> `convenio-metal-bizkaia.html:185` — <h1>Convenio Metal Bizkaia 2026: <em>salario mínimo garantizado 22.034 €/año, Oficial 1ª 23.509 €/año</em></h1>

**🟢 4.1 — 2/3**

La prosa visible sostiene la cifra principal: la frase del suelo garantizado lleva cuantía, unidad y artículo, y el callout de ultraactividad explica sin depender del párrafo anterior por qué unas tablas de 2025 rigen en 2026. No sube a 3 por una asimetría llamativa: las frases realmente autocontenidas de esta ficha —las que llevan a la vez convenio, código REGCON, provincia, cuantía, año de la tabla y año de aplicación— solo existen dentro del JSON-LD, porque la ficha no tiene FAQ visible. Las siete preguntas están en el schema y ninguna en el cuerpo.

> `convenio-metal-bizkaia.html:53` — El Art. 3.2 del Convenio Colectivo Sectorial de la Industria Siderometalúrgica de Bizkaia (REGCON 48001985011981) establece un salario bruto anual mínimo garantizado de 22.034,57 €/año para 2025, cuantía que sigue vigente en 2026 por ultraactividad del Art. 86.3 del Estatuto de los Trabajadores.
> `convenio-metal-bizkaia.html:222` — El salario bruto anual mínimo garantizado de 22.034,57 €/año (Art. 3.2) actúa como suelo: las categorías cuyo salario base teórico no llega a esa cifra reciben automáticamente el "Complemento de Salario Mínimo Garantizado"
> `convenio-metal-bizkaia.html:218` — <strong>Convenio en ultraactividad — tablas 2025 vigentes en 2026 sin actualización.</strong>

**🟢 4.2 — 2/3**

El título de la tarjeta funciona como caption de verdad: dice a quién se aplica, en qué periodo y en qué unidad ('Personal obrero 2025-2026 · €/año brutos'), así que la fila extraída no viaja desnuda; y el pie declara la fórmula del bruto anual, cosa que casi nadie hace. Roza el 3 y no lo alcanza porque el encabezado de columna, que es lo que un extractor de tablas lee, dice solo 'Bruto anual' sin año, y porque las cuatro tablas siguen sin caption; el peso de la desambiguación recae en un div de título que un parser puede no asociar.

> `convenio-metal-bizkaia.html:225` — <div class="card-title">Personal obrero 2025-2026 · €/año brutos</div>
> `convenio-metal-bizkaia.html:231` — <th style="text-align:right;">Salario base diario</th>
> `convenio-metal-bizkaia.html:284` — Cálculo del bruto anual: salario base × 425 días (365 año + 60 pagas extras) + Carencia de Incentivo y Plus de Convenio × 299 días (365 - 52 domingos - 14 festivos) + complemento garantizado si procede.

**🟢 4.4 — 2/3**

pct_huerfanas 0,075 es el más alto de los nueve, pero sigue en el tramo de 2, y el HTML sostiene la nota: seis pies de fuente colgados de sus respectivas tablas, con artículos, cálculo declarado y una columna entera de 'Artículo' dentro de dos de ellas. No sube porque las dos secciones huérfanas son las de mayor tráfico potencial ('Cómo verificar si tu nómina cumple el convenio' y el estado de la negociación) y porque de los tres enlaces externos, dos son a un comunicado sindical y solo uno al PDF del BOB.

> `convenio-metal-bizkaia.html:284` — <p class="source-footer">Cuantías brutas anuales antes de IRPF y Seguridad Social.
> `convenio-metal-bizkaia.html:427` — <th>Concepto</th>
> `convenio-metal-bizkaia.html:596` — El "Complemento de Salario Mínimo Garantizado" debe aparecer como concepto separado en 12 mensualidades de igual cuantía si tu categoría está entre las que no alcanzan por sí solas los 22.034,57 €/año.

> Ventana cerrada (21 días): parches ejecutables. Lo más relevante que he visto aquí desborda mi eje y lo dejo anotado para quien lleve estructura y datos estructurados: la ficha declara un FAQPage con siete preguntas y no tiene ni una sola pregunta visible en el HTML. Para mi eje el efecto es doble y contradictorio: por un lado son las respuestas mejor desambiguadas de todo el sector metal (convenio, código, provincia, cuantía, año de tabla y año de aplicación en la misma frase); por otro, ningún humano las lee y las directrices de datos estructurados piden que el contenido esté visible. Volcar esas siete respuestas al cuerpo es, probablemente, el cambio de citabilidad más rentable de las nueve fichas: el texto ya existe y está bien escrito. Nota de contexto: es la única ficha con GSC en el determinista y su CTR (4,68% en posición 8,34) está muy por encima de la media del sitio, lo que refuerza que la fórmula con cifra al frente funciona.

### E5 · Enlazado y clúster

**🟠 6.3 — 1/3**

Todos los enlaces a otros convenios están agrupados en la lista final 'Otros convenios y guías' (línea 631 de 664). El cuerpo, que sí abre comparaciones explícitas ('un sistema único en el corpus de convenios provinciales del sector'), no enlaza a ninguna de ellas. Salva el 0 el puente al kit, que sí está en su sección.

> `analisis/auditoria-convenios/2026-08-20/deterministas/convenio-metal-bizkaia.json:None` — "internos_en_cuerpo": 16, "a_convenios": 3
> `convenio-metal-bizkaia.html:525` — El Art. 12 establece un sistema único en el corpus de convenios provinciales del sector: aumentos periódicos por años de servicio en quinquenios del 5%
> `convenio-metal-bizkaia.html:631` — <h2 style="font-size:18px;">Otros convenios y guías</h2>

**Parche propuesto:** Enlazar donde la frase ya está comparando. En la línea 525, donde se afirma que la antigüedad sin tope es única en el corpus, cerrar así: '…a diferencia del <a href="/convenio-metal-zaragoza.html">metal de Zaragoza</a> y del <a href="/convenio-metal-barcelona.html">de Barcelona</a>, que congelaron la antigüedad en un complemento ad personam y no reconocen tramos nuevos.' Y en la sección de régimen IRPF foral (línea 586) añadir: 'Los otros dos convenios forales del metal, el <a href="/convenio-metal-gipuzkoa.html">de Gipuzkoa</a> y el <a href="/convenio-metal-alava.html">de Álava</a>, tributan igual pero fijan el salario de otra forma.' Ahí porque el lector vasco que compara ofertas entre las tres provincias está leyendo exactamente ese párrafo.

**🟠 6.4 — 1/3**

El determinista marca 0 hermanas del mismo sector: la ficha más enlazada del clúster no enlaza a ninguna de las nueve provincias del metal. No es un 0 porque cubre entera y con criterio la dirección que casi nadie cubre —construcción, hostelería y limpieza de Bizkaia—, que es la de más valor; pero el clúster sectorial está roto desde su nodo central. Tampoco enlaza a su gemela confundible, el comercio del metal de Bizkaia, que sí la enlaza a ella.

> `analisis/auditoria-convenios/2026-08-20/deterministas/convenio-metal-bizkaia.json:None` — "a_hermanas_mismo_sector": 0, "a_otro_sector_misma_provincia": ["/convenio-construccion-bizkaia.html","/convenio-hosteleria-bizkaia.html","/convenio-limpieza-bizkaia.html"]
> `convenio-metal-bizkaia.html:634` — <li><a href="/convenio-construccion-bizkaia.html">Convenio Construcción en Bizkaia (sector hermano · 2025-2027 vigente)</a></li>

**Parche propuesto:** Añadir a la lista de la línea 634, antes de los sectores vecinos, las tres hermanas forales y la referencia estatal, cada una con su motivo: '<li><a href="/convenio-metal-gipuzkoa.html">Convenio del Metal de Gipuzkoa (misma industria, salario por valor hora sobre 1.695 h)</a></li>' y '<li><a href="/convenio-metal-alava.html">Convenio del Metal de Álava (el tercer convenio foral, por salario bruto anual)</a></li>'. Ahí porque es la única salida hacia otros convenios que hoy tiene la ficha; el enlace en prosa va en la línea 525 según el parche de 6.3. Falta además su gemela confundible: convenio-comercio-metal-bizkaia.html existe y enlaza a esta ficha, y esta no le devuelve nada ni advierte de la diferencia. Añadir en la sección 'Cómo verificar si tu nómina cumple el convenio' (línea 595): '<p>Antes de comparar, confirma que tu empresa <strong>fabrica, monta o repara</strong> metal. Si sólo lo <strong>vende</strong> —ferretería, recambios, electrodomésticos— te aplica el <a href="/convenio-comercio-metal-bizkaia.html">convenio del comercio del metal de Bizkaia</a>, con tablas distintas.</p>' Ahí porque es el punto donde el lector va a cotejar cifras y donde una comparación contra la tabla equivocada le costaría el caso.

**🟠 6.6 — 1/3**

Es el mejor 1 del clúster —dos destinos del kit y un procedimiento por pasos— pero el puente sigue sin estar en el punto de la necesidad: el paso que manda documentar tres nóminas no enlaza plantilla-solicitar-nominas.html, el que fija el plazo no enlaza plantilla-reclamar-atrasos-convenio-salarial.html, y el enlace real cuelga del párrafo de siglas sindicales que cierra la sección. El segundo destino del kit, las plantillas, está en la lista final. Mismo criterio aplicado a convenio-metal-sevilla en este eje.

> `analisis/auditoria-convenios/2026-08-20/deterministas/convenio-metal-bizkaia.json:None` — "al_kit": ["/plantillas-transparencia-retributiva-2026.html","/reclamar-diferencias-salariales-convenio.html"]
> `convenio-metal-bizkaia.html:605` — Tienes 1 año por mensualidad desde que debió pagarse: actúa por las más antiguas primero para no perderlas.
> `convenio-metal-bizkaia.html:607` — Código REGCON del convenio: <code>48004245011982</code>. <a href="/reclamar-diferencias-salariales-convenio.html">Guía completa para reclamar diferencias →</a>

**Parche propuesto:** Dos enlaces, cada uno en su paso. En la línea 603, donde se pide la nómina detallada: '…si los conceptos no aparecen separados (art. 29.1 del Estatuto de los Trabajadores). <a href="/plantilla-solicitar-nominas.html">Usa esta plantilla para pedírselas a tu empresa por escrito</a>.' En el paso del plazo, antes de la línea 607: 'Plazo: un año por cada mensualidad (art. 59.2 ET), así que <a href="/plantilla-reclamar-atrasos-convenio-salarial.html">reclama por escrito la diferencia de las últimas 12 mensualidades</a> antes de que prescriban.' Ahí y no al cerrar la sección porque cada plantilla resuelve exactamente la acción que el paso acaba de exigir; el enlace genérico a la guía puede quedarse donde está.

**🔵 6.2 — 3/3**

El nodo mejor irrigado del clúster: 25 entrantes desde 14 páginas (mediana del corpus 10), y no sólo de hermanas: la enlaza salarios.html dos veces desde el cuerpo, convenio-hosteleria-gipuzkoa.html y convenio-comercio-metal-bizkaia.html. Ocho hermanas la citan, seis de ellas desde la prosa y con anclas descriptivas.

> `analisis/auditoria-convenios/2026-08-20/deterministas/convenio-metal-bizkaia.json:None` — "entrantes_n": 25, "entrantes_desde": ["convenio-comercio-metal-bizkaia.html","convenio-hosteleria-gipuzkoa.html","convenio-metal-alava.html","convenio-metal-asturias.html","convenio-metal-barcelona.html","convenio-metal-gipuzkoa.html","convenio-metal-madrid.html","convenio-metal-navarra.html","conv
> `salarios.html:573` — <a href="/convenio-metal-bizkaia.html">Metal22.034 – 23.509 €/año</a>
> `convenio-metal-asturias.html:528` — <a href="/convenio-metal-bizkaia.html">Metal de Bizkaia</a>

**🔵 6.5 — 3/3**

Es la única ficha del corpus cuyos anchors llevan dentro la relación y el estado de vigencia del destino, en vez del rótulo clonado 'Convenio del Metal — X' que repiten las otras ocho: '(sector hermano · 2025-2027 vigente)' está escrito para este lector concreto y no aparece en ninguna otra ficha.

> `analisis/auditoria-convenios/2026-08-20/deterministas/convenio-metal-bizkaia.json:None` — "anchors_genericos": []
> `convenio-metal-bizkaia.html:634` — <a href="/convenio-construccion-bizkaia.html">Convenio Construcción en Bizkaia (sector hermano · 2025-2027 vigente)</a>
> `convenio-metal-bizkaia.html:636` — <a href="/convenio-limpieza-bizkaia.html">Convenio Limpieza de Edificios y Locales en Bizkaia</a>

> Bizkaia es el centro de gravedad del clúster por entrada (25 enlaces, 14 fuentes) y su punto ciego por salida (0 hermanas). El grafo del metal es una estrella que apunta a Bizkaia y Barcelona y no vuelve: las dos fichas más citadas son justo las dos que no citan al sector.

### E6 · Forma y lectura

**🟠 7.8 — 1/3**

Contenido exclusivo tiene de sobra y bien colocado —los quinquenios del 5% sin tope con su comparación contra Construcción Bizkaia, el régimen foral del IRPF con lo que implica para el neto, el estado real de la negociación del nuevo convenio—, pero no sigue el canon: es la única ficha del cluster sin índice de navegación, sin sección de ámbito («¿Este convenio te cubre?»), sin nota editorial fragmentada en sub-párrafos etiquetados y sin FAQ visible. Es el 1 de manual: aporta lo suyo a costa de no seguir el patrón, y el lector paga el precio en navegación.

> `convenio-metal-bizkaia.html:524` — Antigüedad sin tope — quinquenios del 5% ilimitados
> `convenio-metal-bizkaia.html:578` — Cobertura significativamente inferior a Construcción Bizkaia. El convenio de Construcción Bizkaia 2025-2027 establece indemnizaciones de 90.000 € por muerte/IPA/Gran Invalidez y 65.000 € por IPT.
> `convenio-metal-alava.html:219` — Índice del convenio

**Parche propuesto:** Añadir las tres piezas del canon que faltan, clonando metal-alava: (1) el <nav> «Índice del convenio» tras el sello, con las entradas Datos clave · Ultraactividad · Tablas personal obrero · Tablas técnico y administrativo · Pluses · Antigüedad · IT e indemnizaciones · Jornada · IRPF foral · Verificar nómina · Reclamar · Negociación 2026 · Fuentes; (2) un h2 «¿Este convenio te cubre?» delante de la primera tabla, con las actividades del Art. 1 del convenio (siderurgia y metalurgia, fabricación de productos metálicos, talleres y mantenimiento industrial, trabajo portuario de diques y muelles) y la frase de deslinde «Es un convenio de industria, no de comercio»; y (3) un h2 «Preguntas frecuentes» al final, sacando a la superficie las siete preguntas que ya existen en el JSON-LD (ver observación libre).

**🟠 8.3 — 1/3**

Dos duplicaciones de cuerpo a cuerpo. La primera: el subtítulo del hero y el callout de ultraactividad cuentan la misma cláusula del IPC con el mismo número y casi las mismas palabras, a treinta líneas de distancia. La segunda, más costosa para el lector: «Cómo verificar si tu nómina cumple el convenio» y el primer paso de «¿Tu nómina no encaja con el convenio?» son dos versiones consecutivas de la misma instrucción —coger la nómina, sumar los conceptos fijos, compararlos con la tabla—, y la segunda además menciona conceptos que este convenio no tiene.

> `convenio-metal-bizkaia.html:186` — La cláusula de actualización por IPC no se activó (sumatorio 2022-2025 ~14,5% no supera el 15% pactado).
> `convenio-metal-bizkaia.html:218` — La cláusula del Art. 3.1 que habría actualizado las tablas con efectos 1-ene-2026 (si la suma del IPC estatal 2022-2025 hubiera superado el 15% pactado) no se activó : el IPC sumatorio fue ~14,5%, por debajo del umbral.
> `convenio-metal-bizkaia.html:596` — Coge tu nómina mensual y suma los conceptos salariales fijos (salario base, Carencia de Incentivo y Plus de Convenio en los días efectivamente trabajados, antigüedad por quinquenios si aplica).

**Parche propuesto:** Fundir las dos secciones en una sola bajo el h2 «¿Tu nómina no encaja con el convenio?», dejando la comprobación como paso 1 y eliminando el h2 «Cómo verificar si tu nómina cumple el convenio». El paso 1 pasa a ser: «<strong>Documenta la diferencia.</strong> Coge tres nóminas consecutivas y suma los conceptos salariales fijos: salario base, Carencia de Incentivo y Plus de Convenio por los días efectivamente trabajados, y la antigüedad por quinquenios si te corresponde. Compáralos con la tabla 2025-2026 de tu categoría. Si tu categoría es de las cinco más bajas, el "Complemento de Salario Mínimo Garantizado" debe aparecer como concepto separado en 12 mensualidades de igual cuantía.» Ese texto corrige de paso la enumeración de conceptos ajenos al convenio (ver observación libre). Y recortar el subtítulo del hero a: «Tablas 2025 vigentes en 2026 por ultraactividad del Art. 86.3 ET. Antigüedad por quinquenios del 5% ilimitados, jornada 1.708 h partida o 1.688 h continuada, 14 pagas, IRPF foral.»

**🟠 8.6 — 1/3**

«Ultraactividad», el término que sostiene toda la ficha, sí está explicado y con su consecuencia práctica encadenada. Pero «Carencia de Incentivo» y «Plus de Convenio» aparecen cuatro veces cada uno como componentes del bruto anual de la tabla y como conceptos que el lector debe buscar en su nómina, y en ninguna de las cuatro se dice qué son, quién los cobra ni cuánto valen — y tampoco figuran en la tabla de pluses, que sí detalla los doce restantes. La ficha manda comprobar en la nómina dos conceptos que no ha definido ni cuantificado: eso es jerga sin explicar en el punto exacto donde más cuesta.

> `convenio-metal-bizkaia.html:218` — Conforme al mismo artículo (literalmente: "en tanto no se logre acuerdo expreso, se mantendrá en vigor todo su contenido normativo" ) y al Art. 86.3 del Estatuto de los Trabajadores, todo el clausulado normativo sigue aplicándose sin discontinuidad.
> `convenio-metal-bizkaia.html:415` — Las cifras mensuales reflejan únicamente el salario base; el bruto anual incluye además Carencia de Incentivo, Plus de Convenio, antigüedad por quinquenios si aplica y, en su caso, el Complemento de Salario Mínimo Garantizado.
> `convenio-metal-bizkaia.html:596` — suma los conceptos salariales fijos (salario base, Carencia de Incentivo y Plus de Convenio en los días efectivamente trabajados

**Parche propuesto:** Añadir dos tarjetas al principio de la tabla «Pluses, complementos y conceptos extrasalariales», antes de la de tóxico/penoso/peligroso, con la cuantía verificada en el BOB: «<strong>Plus de Convenio</strong> — cantidad diaria que el convenio suma al salario base y que se devenga por los 299 días laborables del año (365 menos 52 domingos y 14 festivos). Es fijo por categoría y ya está incluido en la columna de bruto anual de las tablas.» y «<strong>Carencia de Incentivo</strong> — cantidad diaria que cobra quien trabaja en una empresa sin sistema de primas o incentivos implantado; sustituye a lo que en otras empresas se percibe como prima de producción. Se devenga también por los 299 días laborables y ya está incluido en el bruto anual.» Si las cuantías 2025-2026 de ambos conceptos no están verificadas contra el BOB, dejar la explicación sin cifra antes que estimarla.

**🟠 12.3 — 1/3**

Es, con metal-barcelona, el esqueleto más alejado del cluster, pero por defecto en vez de por exceso: 14 encabezados y 0 h3, frente a los 23-25 encabezados y 6 h3 de FAQ que comparten convenio-metal-sevilla, alava, gipuzkoa, navarra, madrid, valencia, zaragoza y asturias. No tiene índice, no tiene sección de ámbito, no tiene nota editorial en sub-párrafos etiquetados y —lo más llamativo— no tiene FAQ visible pese a llevar un FAQPage con siete preguntas en el JSON-LD: las respuestas existen para los buscadores y no para quien abre la página. Tampoco lleva el callout «Comparación con otras provincias del sector» que sí tienen 7 de las 9 fichas de metal, aunque en la práctica lo suple comparándose con Construcción Bizkaia.

> `convenio-metal-bizkaia.html:185` — Convenio Metal Bizkaia 2026: salario mínimo garantizado 22.034 €/año, Oficial 1ª 23.509 €/año
> `convenio-metal-bizkaia.html:53` — "text": "El Art. 3.2 del Convenio Colectivo Sectorial de la Industria Siderometalúrgica de Bizkaia (REGCON 48001985011981) establece un salario bruto anual mínimo garantizado de 22.034,57 €/año
> `convenio-metal-sevilla.html:603` — Preguntas frecuentes

**Parche propuesto:** Sacar a la superficie el FAQPage que ya existe: crear un h2 «Preguntas frecuentes» antes de «Fuentes oficiales», con las siete preguntas del JSON-LD como h3 y sus respuestas recortadas a 2-4 líneas cada una (las del schema tienen entre 400 y 970 caracteres y no están escritas para leerse en pantalla). Es el cambio con mejor relación coste/efecto de esta ficha: el contenido está escrito, solo hay que darle cuerpo visible y así dejar de exponer un schema sin correlato en la página.

**🟠 12.6 — 1/3**

El sello de verificación dice que la ficha está cruzada contra «el BOPV de la provincia», y las fuentes dicen que la publicación oficial es el BOB. No son dos nombres del mismo boletín: el BOPV es el Boletín Oficial del País Vasco y el BOB el Boletín Oficial de Bizkaia, que es donde efectivamente se publicó el convenio, como confirman el card de datos clave y el enlace de fuentes. La norma de casa es precisamente esa —forales BOB/BOG, provinciales BOP— y aquí la línea más visible de la ficha la incumple. Además el sello dice «de la provincia» donde el resto del cluster nombra el boletín y su número.

> `convenio-metal-bizkaia.html:194` — ✓ Verificado contra el BOPV de la provincia por SalarioJusto · última revisión 28 de mayo de 2026
> `convenio-metal-bizkaia.html:212` — Publicación oficial BOB 90, 11 may 2023
> `convenio-metal-bizkaia.html:614` — Convenio íntegro 2022-2025 : BOB Núm. 90 del 11 de mayo de 2023 (cve BOB-2023a090-(III-99))

**Parche propuesto:** Sustituir la línea del sello por: «<strong>✓ Verificado</strong> contra el texto del convenio (BOB núm. 90, 11-may-2023, cve BOB-2023a090-(III-99), código REGCON 48001985011981) por SalarioJusto · última revisión 28 de mayo de 2026». Y revisar el resto de la página para que «BOPV» solo aparezca donde de verdad se cita el Boletín Oficial del País Vasco (el acuerdo PRECO del 4-abr-2000, línea 618).

**🟢 8.1 — 2/3**

No hay bloque prescindible: es la única ficha del cluster sin el cajón final de «Particularidades» que reasume lo ya contado, y las trece secciones responden a preguntas distintas —incluida «Régimen IRPF foral de Bizkaia», que a primera vista parece contexto pero es lo que convierte el bruto de la tabla en el neto de la nómina. No es 3 porque «Cómo verificar si tu nómina cumple el convenio» y «¿Tu nómina no encaja con el convenio?» son dos secciones consecutivas sobre lo mismo que deberían ser una; lo penalizo en 8.3, no aquí.

> `convenio-metal-bizkaia.html:586` — Régimen IRPF foral de Bizkaia (no estatal)
> `convenio-metal-bizkaia.html:588` — Una persona con el mismo bruto anual en Bilbao y en Santander (ambas ciudades del norte peninsular) percibirá distinta cantidad neta por la diferencia entre la escala foral vasca y la escala común con tramo autonómico cántabro.
> `convenio-metal-sevilla.html:552` — Particularidades del convenio del metal de Sevilla

**🟢 8.8 — 2/3**

Plural correcto y bien repartido: la tarjeta de asesoría nombra a las cinco organizaciones del sector incluyendo a ELA y LAB, que son las combativas del territorio, y las menciones de UGT-Euskadi son de fuente («según informó», «según la plataforma sindical publicada»), que es el uso legítimo. No es 3 porque la ficha nunca dice quién firmó realmente el convenio —lo despacha con «la representación sindical del sector»—, de modo que el lector no puede saber qué siglas lo suscribieron ni cuáles quedaron fuera, y esa es justamente la información que da sentido al plural.

> `convenio-metal-bizkaia.html:607` — Si necesitas apoyo, FVEM, CCOO Industria, ELA, LAB y UGT-FICA prestan asesoría gratuita a personas afiliadas.
> `convenio-metal-bizkaia.html:214` — Firmado el 23 de marzo de 2023 entre la representación patronal ( FVEM · Federación Vizcaína de Empresas del Metal) y la representación sindical del sector.
> `convenio-metal-bizkaia.html:609` — la primera reunión efectiva tuvo lugar el 15 de enero de 2026 , según informó UGT-Euskadi .

**🔵 8.2 — 3/3**

Es la ficha del cluster que mejor ordena por lo que se busca: el h1 lleva dos cifras concretas (el mínimo garantizado y el Oficial 1ª), el card de datos clave está inmediatamente debajo y la primera tabla salarial —la del personal obrero, que es la mayoría de la plantilla— es el primer h2 de la página, sin ninguna sección de contexto por delante. Además, el párrafo que precede a la tabla explica en cinco líneas los cinco grupos y el mecanismo del complemento de mínimo garantizado, de modo que la tabla se puede leer sin saltar a ninguna otra parte. Lo accesorio (IRPF, verificación, negociación en curso) queda detrás.

> `convenio-metal-bizkaia.html:185` — Convenio Metal Bizkaia 2026: salario mínimo garantizado 22.034 €/año, Oficial 1ª 23.509 €/año
> `convenio-metal-bizkaia.html:221` — Tabla salarial 2025-2026 — Personal obrero
> `convenio-metal-bizkaia.html:222` — El convenio organiza al personal en cinco grandes grupos profesionales: personal obrero (mayoría de la plantilla en planta y taller), personal subalterno (vigilantes, ordenanzas, conserjes), personal administrativo, personal técnico

> Capa 0 (no puntuado aquí): 84 celdas de tabla en verde —es la ficha del corpus que más incumple la norma de cifras en tinta neutra, junto con metal-barcelona—, 4 tablas sin scope ni caption y 2 bloques de más de 100 palabras (líneas 217 y 584). Fuera de mi eje, dos avisos para quien audite verdad y cifras: (1) el paso 1 del bloque de reclamar (línea 603) manda comparar «plus de transporte, plus festivo» y remite a «la tabla 2026 del Anexo I», y ninguna de las tres cosas existe en este convenio —ni hay plus de transporte ni plus festivo en la tabla de pluses, ni la ficha titula sus tablas como «2026» sino como «2025-2026»—: parece texto arrastrado de la plantilla de otro sector, y el parche de 8.3 lo corrige de paso; (2) el sello es también el más pobre del cluster en trazabilidad (sin número de boletín ni fecha de publicación). La ficha no está en ventana de medición (último commit del 30-jul), así que sus parches son aplicables ya.
