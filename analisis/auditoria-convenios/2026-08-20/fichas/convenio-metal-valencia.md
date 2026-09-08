# convenio-metal-valencia

**Score: 65.9/100** · hard-fails: **0**

> ⚠️ **Sin verificación adversarial.** Estas notas no han pasado por la capa 2. En el piloto
> el verificador refutó o matizó cerca de un tercio de los hallazgos, así que este score no
> es comparable con el de una ficha verificada. Trátalo como provisional.

Sector metal · estado `vigente` · 2677 palabras de prosa · boilerplate 0.07 · último cambio hace 21 días

## Ejes

**Cuello de botella: E6 (58.0% de su peso).** Es por donde empieza el arreglo.

| eje | | puntos | peso |
|---|---|---|---|
| E1 | Verdad demostrada | 13.4 | 22 |
| E2 | Singularidad y ventaja | 18.9 | 22 |
| E3 | Respuesta al trabajador | 12.2 | 20 |
| E4 | Captación y citabilidad | 8.4 | 14 |
| E5 | Enlazado y clúster | 7.2 | 12 |
| E6 | Forma y lectura | 5.8 | 10 |

### E1 · Verdad demostrada

**🟠 5.10 — 1/3**

La fuente de todas las cifras de la página —las tablas 2026— no tiene ningún localizador publicable: solo consta que fueron «registradas el 19-ene-2026», sin número de boletín, sin fecha de publicación y sin enlace, y el único acceso ofrecido es el buscador del BOP, que la propia ficha llama así. Los dos enlaces a documento exacto que sí tiene (convenio estatal y RD del SMI) son fuentes accesorias, no la que sostiene las tablas.

> `convenio-metal-valencia.html:543` — <strong>Tablas salariales 2026</strong> del convenio, aprobadas por la Comisión Paritaria el 19-ene-2026 (+2,5% sobre 2025, efectos 1-ene-2026). Fuente de todas las cifras salariales, dietas, quebranto de moneda y seguro de convenio de esta página.
> `convenio-metal-valencia.html:496` — Texto del convenio en el BOP nº 203 (20-oct-2023); tablas 2026 registradas el 19-ene-2026. Buscador: <a href="https://bop.dival.es/" target="_blank" rel="noopener">bop.dival.es</a>

**Parche propuesto:** En «Fuentes oficiales verificadas» (línea 543) y en la tarjeta «BOP Valencia — Convenio y tablas» (línea 496), sustituir la referencia sin localizador por la publicación exacta y enlazar al edicto, no al buscador. Texto propuesto: «<strong>Tablas salariales 2026</strong> del convenio, aprobadas por la Comisión Paritaria el 19-ene-2026 (+2,5% sobre 2025, efectos 1-ene-2026) y publicadas en el BOP de Valencia núm. ___ (___-___-2026), edicto ___ — <a href="[URL del PDF del edicto]">ver publicación</a>. Fuente de todas las cifras salariales, dietas, quebranto de moneda y seguro de convenio de esta página.» Los huecos ___ los rellena quien verifique, no se inventan. Si al comprobarlo resulta que las tablas solo constan inscritas en el registro y no publicadas en el BOP, escribirlo tal cual en lugar de callarlo: «Tablas 2026 inscritas en el REGCON (código 46000105011981) el 19-ene-2026; a fecha de esta revisión no consta su publicación en el BOP de Valencia, por lo que la comprobación se ha hecho contra el acta de la Comisión Paritaria», con enlace a la ficha del convenio en REGCON. Y en la tarjeta de recursos, cambiar «Buscador: bop.dival.es» por el enlace directo al edicto del convenio (BOP nº 203, 20-oct-2023), que sí es localizable.

**🟠 9.2 — 1/3**

La vigencia aparece una sola vez, como dato suelto en la parrilla de datos clave («2023-2026 (Art. 4)»), sin ninguna consecuencia para el lector: en toda la página no se dice hasta cuándo valen estas tablas, que 2026 es el último año pactado, si el convenio está denunciado ni qué hay que vigilar. Es la única de las tres fichas del metal auditadas hoy sin sección de caducidad; las palabras «2027», «denunciado» y «revisión por IPC» no aparecen en ninguna parte del cuerpo.

> `convenio-metal-valencia.html:229` — <div class="stat-item"><div class="stat-label">Vigencia</div><div class="stat-value">2023-2026 (Art. 4)</div></div>
> `convenio-metal-valencia.html:268` — Cuantías brutas oficiales de las <strong>tablas 2026</strong>, resultado de aplicar el <strong>+2,5%</strong> pactado (Art. 13) sobre las tablas de 2025, con efectos desde el 1 de enero de 2026.

**Parche propuesto:** Añadir un callout inmediatamente después de la nota al pie de las tablas (tras la línea 324), con este texto: «<strong>Hasta cuándo valen estas tablas.</strong> Las cuantías de esta página son las de 2026, último año del período pactado del convenio (2023-2026, Art. 4): rigen hasta el 31 de diciembre de 2026. Lo que venga después depende de la negociación del siguiente convenio, que no está cerrada; mientras no se publiquen tablas nuevas, siguen aplicándose estas. <strong>Qué vigilar:</strong> la publicación en el BOP de Valencia del acta de la Comisión Paritaria con las tablas 2027 y, si el convenio tiene cláusula de revisión por IPC, su liquidación, porque puede generar atrasos sobre lo ya cobrado en 2026.» Antes de publicarlo hay que comprobar en el Art. 4 y en la disposición de denuncia dos cosas que la ficha hoy no dice y que no deben inventarse: si el convenio está denunciado y si existe cláusula de revisión. Si la hay, sustituir la frase condicional por la redacción concreta con su artículo, al modo de la ficha de Zaragoza; si no la hay, decirlo («el convenio no prevé revisión por IPC: el +2,5% de 2026 es definitivo»). Y actualizar la celda de vigencia de la línea 229 a «2023-2026 · último año» o «2023-2026 · denunciado (último año)» según lo verificado.

**🟢 2.1 — 2/3**

Hay trabajo propio visible en varias secciones —el ejemplo aterrizado de Marcos con estimación de neto marcada como elaboración propia, la comparación de pagas contra Barcelona y Bizkaia y el juicio sobre el día 75 de la IT— pero no llega al nivel de Sevilla porque la cifra que más pesa, el «Salario anual 2026», nunca se explica: el lector ve 45,80 €/día y 22.462,18 €/año y no se le dice qué operación une ambas, ni si el anual está transcrito del anexo o compuesto por la casa.

> `convenio-metal-valencia.html:343` — Sobre ~24.000 € brutos, aplicando el IRPF de la Comunitat Valenciana, el neto ronda los <strong>19.700-20.200 € anuales</strong> sin pluses; los complementos de turno y penosidad lo suben notablemente.
> `convenio-metal-valencia.html:456` — El complemento en enfermedad común solo llega al día 75, más tarde que en otros convenios: durante los primeros días la persona percibe solo la prestación de la Seguridad Social.
> `convenio-metal-valencia.html:270` — el <strong>personal de operaciones</strong> (oficio) cobra el salario grupo <strong>por día</strong>; el personal técnico y de empleados/as lo cobra <strong>por mes</strong>. La columna "Salario anual 2026" es el bruto anual con las pagas del convenio incluidas.

**🟢 5.8 — 2/3**

Las afirmaciones de derecho llevan su artículo y su condición —el plus de formación solo si la empresa no acredita el plan, el recargo de festivo solo en empresas no habituales, la paga de marzo prorrateable— y avisa del caso límite de ámbito. No llega a 3 porque dedica un capítulo entero a los incentivos y aun así nunca advierte de lo contrario a lo que el lector supondrá: que la tabla es un mínimo y su nómina real puede diferir, matiz que las fichas hermanas de Zaragoza y Navarra sí hacen explícito.

> `convenio-metal-valencia.html:422` — La empresa que <strong>no acredite</strong> la participación de su plantilla en un plan de formación debe abonar <strong>30 €/mes</strong> de naturaleza salarial. O forma, o paga.
> `convenio-metal-valencia.html:264` — <strong>Ojo: en Valencia hay dos convenios de metal.</strong> El que estás leyendo es el de <strong>Industria</strong> (fabricación, instalación, reparación). Existe otro para el <strong>Comercio del Metal</strong> (venta y distribución de artículos metálicos), con tablas y condiciones distintas.
> `convenio-metal-valencia.html:438` — La <strong>línea de incentivos</strong> va del salario grupo (rendimiento normal) a 1,20 × salario grupo (rendimiento óptimo).

**🟢 5.11 — 2/3**

Las tres tablas de grupo llevan el año en su propio encabezado («Salario anual 2026») y las cuantías sueltas se agrupan bajo un «Otros conceptos 2026» explícito, incluido el quebranto de moneda con su «(tabla 2026)». Se queda en 2 porque no hay tablas históricas que distinguir y porque algunas cuantías de las tarjetas de pluses repiten el importe sin el año al lado, apoyándose en el epígrafe general.

> `convenio-metal-valencia.html:276` — <thead><tr><th>Categoría</th><th class="num">Grupo</th><th class="num">Salario grupo</th><th class="num">Salario anual 2026</th></tr></thead>
> `convenio-metal-valencia.html:324` — Cuantías brutas antes de IRPF y Seguridad Social. Otros conceptos 2026: media dieta <strong>11,99 €</strong> · dieta entera <strong>44,61 €</strong> · quebranto de moneda <strong>27,42 €</strong> · seguro de convenio <strong>30.837 €</strong>.
> `convenio-metal-valencia.html:426` — Media dieta <strong>11,99 €</strong> · dieta entera <strong>44,61 €</strong>. La empresa adelanta el 50% si se solicita.

**🔵 9.1 — 3/3**

Declara fecha concreta de verificación (26-jul-2026), posterior al hito más reciente que ella misma cita (tablas de 19-ene-2026), y dice exactamente qué se cotejó y contra qué, separando por escrito lo transcrito de lo que es elaboración propia. La única pega —que el documento de 2026 no es localizable— ya la penalizo en 5.10 y no la cuento dos veces.

> `convenio-metal-valencia.html:202` — <strong>✓ Verificado</strong> contra el texto del convenio (BOP Valencia nº 203, código REGCON 46000105011981) y las tablas salariales 2026 registradas el 19 de enero de 2026, por SalarioJusto · última revisión 26 de julio de 2026
> `convenio-metal-valencia.html:551` — Las cuantías están transcritas de la publicación oficial; los ejemplos y el cálculo de neto son elaboración propia y se identifican como tales.

> El SMI está bien citado y bien usado en las tres comparaciones (17.094 € anuales y 1.221 €/mes con enlace al RD 126/2026, líneas 286, 516, 523, 545): no hay hard-fail 5.7 por ahí. El problema de esta ficha es el otro extremo de la cadena. Es la única de las tres cuyo censo llega sin boletín ni fin de vigencia —censo.fuenteEstado es «convenio 2026 · +2,5% · paga de marzo» y vigenciaFin es null, frente al detalle de Navarra y Zaragoza—, y esa laguna del registro se corresponde exactamente con las dos notas bajas que le pongo: nadie escribió dónde se publicaron las tablas 2026 ni hasta cuándo valen. Arreglar el censo y arreglar la ficha es aquí la misma tarea, y conviene hacerlo en el mismo pase. Ventana de medición cerrada (último commit 30-jul-2026, 21 días), así que los dos parches son aplicables ya. Fuera de mi eje, para quien audite forma: el determinista marca 17 celdas de tabla en verde, que es el patrón que la norma interna del sitio señala como outlier precisamente en esta ficha.

### E2 · Singularidad y ventaja

**🟢 3.1 — 2/3**

boilerplate_ratio 0,070 con 8 frases compartidas: cuatro son cromo inevitable y una es la declaración de metodología, correcta. Pero dos de las ocho son sustancia clonada palabra por palabra con la ficha de Madrid —el aviso de los dos convenios de metal y la regla para elegir—, y ese párrafo es contenido, no cromo: debería estar escrito con la patronal y el código de cada provincia.

> `convenio-metal-valencia.html:264` — Si en tu empresa se fabrica, instala o repara, es este; si solo se vende, es el otro.
> `convenio-metal-valencia.html:551` — Las cuantías están transcritas de la publicación oficial; los ejemplos y el cálculo de neto son elaboración propia y se identifican como tales.

**🟢 3.4 — 2/3**

106 frases exclusivas y 1.969 palabras exclusivas con hechos propios de verdad: la paga de marzo, el plus de formación de 30 €/mes cuando la empresa no forma, la opción de cobrar menos penosidad a cambio de dos horas menos de jornada. Pero todos son lectura atenta del articulado, no cruce de fuentes; la única pieza que exigió trabajo de corpus es la comparación de pagas con Barcelona y Bizkaia. Hechos propios sí, investigación aún no.

> `convenio-metal-valencia.html:422` — La empresa que no acredite la participación de su plantilla en un plan de formación debe abonar 30 €/mes de naturaleza salarial. O forma, o paga.
> `convenio-metal-valencia.html:410` — Alternativa: cobrar menos porcentaje con reducción de 2 horas semanales de jornada.

**🟢 10.1 — 2/3**

Frente al BOP hay ordenación buena, ejemplo trabajado y traducción a nómina, pero todo lo que dice está en el boletín: no resuelve ningún conflicto de publicaciones, no reconstruye ninguna aritmética que el texto deje implícita ni aporta actualidad de negociación. El rescate de la paga de marzo es mérito editorial —elegir qué destacar— más que ventaja informativa sobre el PDF.

> `convenio-metal-valencia.html:359` — La paga de marzo se prorratea sobre los 12 meses anteriores a su devengo.

**🔵 3.2/3.3 — 3/3**

2.677 palabras de prosa contra ratio_tabla 0,141, y la prosa resuelve una trampa que la tabla esconde: en el mismo cuadro conviven salarios por día (personal de oficio) y por mes (técnicos y empleados), y la columna anual ya incorpora la tercera paga. Sin el párrafo de lectura y sin el ejemplo de Marcos, el lector compararía peras con manzanas dentro de la misma tabla.

> `convenio-metal-valencia.html:270` — el personal de operaciones (oficio) cobra el salario grupo por día; el personal técnico y de empleados/as lo cobra por mes
> `convenio-metal-valencia.html:338` — Paga de marzo (17 días de salario grupo, Art. 16) incluida en el cómputo anual

**🔵 3.5 — 3/3**

3 clonadas de 6, y las tres propias no son transferibles: qué es la paga de marzo, qué es el plus de formación de 30 euros y desde cuándo complementa la empresa la baja (día 6 en accidente, día 75 en enfermedad común). Son preguntas que solo tienen sentido leyendo este convenio, no un formulario con el topónimo cambiado.

> `convenio-metal-valencia.html:531` — ¿Qué es el plus de formación de 30 euros?
> `convenio-metal-valencia.html:535` — En enfermedad común, el 100% a partir del día 75 de la baja (Art. 68).

**🔵 8.4 — 3/3**

La particularidad organiza la ficha entera: el H1 no es «tablas salariales de Valencia», es la paga de marzo, y de ahí cuelgan el primer H2, el ejemplo, una FAQ, el listado de particularidades y la comparación con las hermanas. Es la única de las nueve donde el título vende un derecho concreto en vez de un rango de cifras, y encima uno que el propio sector desconoce. Ninguna otra ficha del cluster hace eso.

> `convenio-metal-valencia.html:194` — Convenio del Metal de Valencia: la paga de marzo que casi nadie conoce
> `convenio-metal-valencia.html:248` — Valencia añade la paga de marzo de 17 días, lo que en la práctica supone algo más de media paga extra adicional al año respecto a esas provincias.

**🔵 10.2 — 3/3**

El agregador da la cifra pelada, y en Valencia la cifra pelada se deja fuera 17 días de salario al año. Que la página abra con eso y lo cuantifique frente a otras provincias es una ventaja que el lector percibe en la primera línea, sin que nadie se la explique: sabe inmediatamente que aquí hay algo que en su nómina puede faltar.

> `convenio-metal-valencia.html:241` — Es la particularidad más tangible del convenio del metal de Valencia, y mucha gente del sector ni la conoce
> `convenio-metal-valencia.html:485` — Recuerda sumar la paga de marzo, los pluses de turno/nocturnidad/penosidad si te corresponden y el plus de formación si tu empresa no forma.

> Ventana cerrada (último commit 2026-07-30, 21 días): los parches se pueden aplicar. Es el mejor ejemplo del sector de que la singularidad no se consigue añadiendo palabras: con 2.677 palabras de prosa —menos que Álava, Asturias o Barcelona— consigue la ficha más reconocible del cluster porque eligió un hecho y lo puso en el título. El escalón que le falta es de investigación: Valencia es la provincia del metal español más dependiente de una única factoría de automoción y de su corona de proveedores, y la ficha no dice si el convenio provincial les aplica. Parche concreto: comprobar en REGCON el convenio de empresa de la gran planta de vehículos de la Ribera Baixa y decir en dos frases, dentro de «¿Este convenio te cubre?», que la factoría se rige por su propio convenio pero que las auxiliares de su cadena —donde está la mayoría de esas 85.000 personas— se rigen por este. Ese dato, más el dato del párrafo de la línea 343 (la horquilla de neto 19.700-20.200 €), convertiría la ventaja frente al agregador en ventaja frente a cualquiera. Detalle menor para otro eje: la ficha comparte con Madrid dos párrafos literales sobre los dos convenios del metal de la provincia.

### E3 · Respuesta al trabajador

**🟠 1.2 — 1/3**

Solo responde 4 de las 8 preguntas del listado (ver observacion_libre): la cifra del oficial en €/día y su anual, la frontera con el Comercio del Metal, el pago del festivo y el complemento de baja. Quedan sin respuesta cuatro, y tres de ellas son de las que traen a la gente aquí: (a) «¿y eso cuánto es al mes?» — el personal de operaciones tiene el salario en €/día y un anual, y no hay ni una sola cifra mensual para esos grupos ni el número de pagas por el que dividir; (b) «llevo 6 años, ¿me toca antigüedad?» — la ficha solo nombra una «antigüedad consolidada» no absorbible, sin decir si hoy se genera antigüedad nueva ni cuánto vale un tramo, así que el lector no puede responderse; (c) «soy soldador, ¿en qué grupo estoy?» — la lista de oficios está referida al bloque entero de operaciones, no a cada grupo, y no distingue quién es Oficial de 1ª, quién Especialista y quién Peón; (d) jornada parcial, ausente.

> `convenio-metal-valencia.html:270` — Cómo leer la tabla: el personal de operaciones (oficio) cobra el salario grupo por día ; el personal técnico y de empleados/as lo cobra por mes. La columna "Salario anual 2026" es el bruto anual con las pagas del convenio incluidas.
> `convenio-metal-valencia.html:280` — Oficial/a de 1ª y 2ª (profesional de oficio) 5 49,55 €/día 24.029,98 €
> `convenio-metal-valencia.html:359` — La antigüedad consolidada (Art. 16) no es absorbible ni compensable y se revaloriza con el convenio.

**Parche propuesto:** Tres piezas. (1) EL MES. Añadir a la tabla de personal de operaciones una columna «≈ mensual» y, en «Cómo leer la tabla» (línea 270), esta nota: «El convenio fija el salario del personal de oficio por día trabajado, pero la nómina llega mensual. La columna ≈ mensual es una equivalencia orientativa que calculamos repartiendo el bruto anual entre las mensualidades del convenio; ojo, aquí el anual no se divide entre 14 limpiamente, porque además de las dos extras está la paga de marzo de 17 días. No es una cuantía del boletín: es nuestra estimación, y la marcamos como tal.» —el cálculo lo hace la redacción con la fórmula de devengo del convenio, no se transcribe de ninguna tabla—. (2) LA ANTIGÜEDAD. Sustituir la mención suelta de la línea 359 por un bloque propio que diga, con el artículo delante, si el convenio genera tramos nuevos o no. Si no los genera, escribirlo en la FAQ igual que hace la ficha de Zaragoza: «¿Qué antigüedad reconoce? Ninguna activa: el convenio solo mantiene la antigüedad consolidada a [fecha] para quienes ya la tenían (Art. 16), que no es absorbible ni compensable y sube cada año como el convenio. Quien entra hoy no genera tramos nuevos.» (3) LA JORNADA PARCIAL. Frase fija al pie de las tres tablas: «Las cuantías son de jornada completa. A tiempo parcial te corresponde el salario grupo en la proporción de tu jornada; el porcentaje está en tu contrato.»

**🟢 1.1 — 2/3**

Es el 2 más justo de las cuatro fichas del metal auditadas. Cifra, año y fuente están arriba —el sumario trae el rango 2026 con el +2,5% y el sello con el BOP va debajo—, pero el H1, que es el texto grande y lo que se lee primero, gasta su sitio en un gancho editorial («la paga de marzo que casi nadie conoce») y el primer H2 del cuerpo repite ese mismo tema: la cifra llega subordinada, en la segunda frase del sumario, y en forma de rango. Quien entra tecleando «cuánto cobra un oficial del metal en Valencia» lee primero una curiosidad y luego, si sigue, su número.

> `convenio-metal-valencia.html:194` — Convenio del Metal de Valencia : la paga de marzo que casi nadie conoce
> `convenio-metal-valencia.html:195` — Además de las dos pagas extra de junio y diciembre, el metal de Valencia abona 17 días de salario el 15 de marzo . Tablas 2026 (+2,5%) de 22.462 € (Peón) a 36.615 € (Ingeniería), jornada de 1.752 h, plus de formación de 30 €/mes y cobertura para 85.000 personas.
> `convenio-metal-valencia.html:240` — La paga de marzo: una tercera gratificación de 17 días

**🟢 1.3 — 2/3**

El camino existe y es el más completo del corpus en cuanto a qué sumar antes de comparar: recuerda la paga de marzo, los pluses de turno, nocturnidad y penosidad, y el plus de formación de 30 € si la empresa no forma —conceptos que de otro modo el lector olvidaría al calcular su diferencia—. Nombra la vía valenciana (ASAC-CV, SMAC), dice que la papeleta es gratuita e interrumpe la prescripción y da el plazo. No es 3 porque el único documento es el enlace genérico al kit que registra el determinista: no hay plantilla ni un cálculo con cifras de esta provincia.

> `convenio-metal-valencia.html:485` — Compara tu bruto anual con la tabla 2026 de tu grupo. Recuerda sumar la paga de marzo, los pluses de turno/nocturnidad/penosidad si te corresponden y el plus de formación si tu empresa no forma.
> `convenio-metal-valencia.html:487` — Acude a la Comisión Paritaria o a la vía extrajudicial. El convenio se adhiere al VII Acuerdo de Solución Autónoma de Conflictos Laborales de la Comunitat Valenciana (ASAC-CV). La papeleta de conciliación ante el SMAC es gratuita e interrumpe la prescripción.
> `convenio-metal-valencia.html:488` — Plazo: un año por cada mensualidad para reclamar diferencias (art. 59.2 ET).

**🟢 1.4 — 2/3**

El ámbito está bien resuelto —seis bloques de actividades reconocibles y la frontera con el Comercio del Metal repetida en un aviso destacado— y la partición de la tabla en tres desplegables, con el de oficio abierto por defecto, es un acierto de autoubicación que no tienen las otras tres fichas. Lo que no está resuelto es el último paso: la lista de oficios reales (soldador, chapista, montador) cuelga del bloque entero de operaciones, que abarca cinco grupos distintos, y las filas usan la denominación del boletín. Saber que eres «personal de operaciones» no te da tu cifra; saber si eres Oficial de 1ª, Especialista o Peón, sí.

> `convenio-metal-valencia.html:264` — Ojo: en Valencia hay dos convenios de metal. El que estás leyendo es el de Industria (fabricación, instalación, reparación). Existe otro para el Comercio del Metal (venta y distribución de artículos metálicos), con tablas y condiciones distintas. Si en tu empresa se fabrica, instala o repara, es est
> `convenio-metal-valencia.html:270` — Despliega tu grupo — el personal de oficio se abre por defecto.
> `convenio-metal-valencia.html:273` — Personal de operaciones (oficio: Peón, Especialista, Oficial, Encargado/a)

**🟢 1.6 — 2/3**

Explica la correspondencia hasta donde llega: dice qué grupos cobran por día y cuáles por mes, que las cuantías son brutas antes de IRPF y Seguridad Social, desglosa un caso por conceptos de nómina y hasta introduce la absorción al describir el complemento «ex categoría profesional» como garantía personal no absorbible. Se queda en 2 por el fallo estructural del eje en esta ficha: la persona tiene delante una nómina mensual y aquí su salario está en euros por día, sin ninguna equivalencia; además, «salario grupo» es el nombre del convenio y en el papel puede figurar como salario base o salario convenio, y eso no se aclara.

> `convenio-metal-valencia.html:324` — Cuantías brutas antes de IRPF y Seguridad Social.
> `convenio-metal-valencia.html:321` — Existe un complemento "ex categoría profesional" para quienes a 31-12-2000 cobraban un salario superior al del grupo al que quedaron adscritos: es una garantía personal no absorbible, que sube cada año como el convenio.
> `convenio-metal-valencia.html:333` — Marcos es Oficial/a de 1ª de oficio (Grupo 5). Su salario grupo es de 49,55 €/día, que en cómputo anual con las pagas del convenio suma 24.029,98 € brutos .

**🟢 1.9 — 2/3**

Dice de dónde sale su tabla 2026 sin adornarlo: no de una publicación en el BOP sino de un acuerdo de la comisión paritaria del 19 de enero de 2026, y lo repite en el bloque de fuentes. Y da el suelo con su fuente correcta (SMI 2026, RD 126/2026, referencia BOE). No llega a 3 por lo contrario del hueco declarado: donde el dato no existe —el neto— la ficha lo rellena con una horquilla propia («ronda los 19.700-20.200 €») presentada en el punto de uso como si fuera un dato, y la advertencia de que los netos son elaboración propia vive 200 líneas más abajo, en «Quién audita esto». La marca tiene que estar donde está la cifra.

> `convenio-metal-valencia.html:543` — Tablas salariales 2026 del convenio, aprobadas por la Comisión Paritaria el 19-ene-2026 (+2,5% sobre 2025, efectos 1-ene-2026).
> `convenio-metal-valencia.html:516` — 1.221 €/mes y 17.094 € anuales (RD 126/2026). Consulta el SMI 2026
> `convenio-metal-valencia.html:343` — Sobre ~24.000 € brutos, aplicando el IRPF de la Comunitat Valenciana, el neto ronda los 19.700-20.200 € anuales sin pluses; los complementos de turno y penosidad lo suben notablemente.

> LAS 8 PREGUNTAS QUE TECLEARÍA UN TRABAJADOR DEL METAL DE VALENCIA ANTES DE LLEGAR AQUÍ: (1) «¿cuánto cobra un oficial de 1ª del metal en Valencia en 2026?»; (2) «¿y eso cuánto es al mes?»; (3) «soy soldador / chapista, ¿en qué grupo estoy?»; (4) «en mi taller se vende y se repara, ¿me cubre este convenio o el del Comercio del Metal?»; (5) «llevo 6 años, ¿me toca antigüedad y cuánto?»; (6) «estoy de baja, ¿me complementa la empresa?»; (7) «me han hecho trabajar un festivo, ¿me lo tienen que pagar más?»; (8) «trabajo media jornada, ¿cuánto me corresponde?». RECORRIDO, UNA A UNA: (1) sí, línea 280 y FAQ 523, pero en €/día; (2) NO —y es el hueco que el encargo pedía comprobar: los grupos 7, 6 y 5, que son los del oficio, tienen su salario en euros por día trabajado y un bruto anual, y no hay una sola cifra mensual para ellos; encima el «Datos clave» resume las pagas como «2 extras + paga de marzo (17 días)», así que el lector ni siquiera tiene un divisor claro—; (3) NO; (4) sí, líneas 260 y 264; (5) NO; (6) sí, líneas 449-451 y el aviso 456 de que en enfermedad común el complemento no entra hasta el día 75; (7) SÍ, línea 374, +75% más descanso compensatorio: es la única de las cuatro fichas del metal auditadas que responde la pregunta del festivo trabajado; (8) NO. — SOBRE 1.1, POR SI SE ITERA EL TITULAR: la paga de marzo es un buen diferencial editorial, pero cabe en el sumario. Un H1 del tipo «Convenio del Metal de Valencia: tablas 2026 de 22.462 € a 36.615 € (y una tercera paga en marzo)» conserva el gancho y devuelve la cifra al primer renglón. FUERA DE MI EJE, PARA VERIFICACIÓN: (a) el Art. 16 se cita en la línea 244 como el que fija la paga de marzo y en la línea 359 como el de la antigüedad consolidada; o el artículo cubre las dos cosas o una de las dos citas está mal, y conviene comprobarlo contra el BOP nº 203; (b) la línea 286 afirma que «todas las categorías quedan muy por encima del SMI 2026» mientras la fila del Grupo 8 de la tercera tabla (línea 317) dice literalmente «SMI»; se entiende que la frase se refiere solo al bloque de operaciones, pero está a un palmo de leerse como una contradicción interna; (c) la horquilla de neto de la línea 343 es elaboración propia y solo se identifica como tal al final de la página. VENTANA: cerrada (21 días desde el último commit), los parches son aplicables ya.

### E4 · Captación y citabilidad

**🟠 2.5 — 1/3**

Es la meta que peor coloca su cifra de las nueve: con 303 caracteres, el primer importe salarial aparece pasado el carácter 168, o sea fuera de lo que se muestra. Lo que llega al lector son la paga de marzo, la jornada de 1.752 h y el plus de formación de 30 €/mes: hay gancho, pero no hay salario, que es lo que se está buscando. Motivo sin cifra es exactamente el 1 de esta métrica.

> `convenio-metal-valencia.html:7` — El convenio de la Industria del Metal de Valencia 2026 (+2,5%) tiene una paga de marzo de 17 días además de las dos extras, jornada de 1.752 h, plus de formación de 30 €/mes y salarios de 22.462 € (Peón) a 36.615 € (Ingeniería). Cubre a 85.000 personas. Fuente: BOP Valencia 203 · REGCON 460001050119

**Parche propuesto:** {'descripcion': 'Mismo contenido, otro orden: el salario delante y la paga de marzo como remate diferencial, todo dentro de lo que se muestra. 178 caracteres, todavía largo pero con lo esencial en los primeros 155.', 'texto_propuesto': 'Peón 45,80 €/día (22.462 € al año) y hasta 36.615 €: tablas 2026 del metal de Valencia, +2,5%. Y una tercera paga de 17 días cada 15 de marzo que casi nadie reclama. BOP Valencia 203.', 'nota': 'Si se prefiere no tocar el title, este cambio basta por sí solo: la meta puede llevar la cifra que al title le falta al principio.'}

**🟢 2.4 — 2/3**

Cumple los cuatro elementos y por eso no baja, pero es el 2 más flojo del sector. Con 91 caracteres es el title más largo de las nueve fichas, y lo que el buscador enseña antes de recortar es el gancho editorial ('la paga de marzo'), no el salario: la cifra va en cuarta posición y se juega el corte. A eso se suma que el h1 es el único del cluster sin ninguna cifra, así que ni el resultado de búsqueda ni el titular de la página ofrecen un número que reconocer. La paga de marzo es un hallazgo real y merece estar; el problema es el orden.

> `convenio-metal-valencia.html:6` — <title>Convenio Metal Valencia 2026: la paga de marzo y tablas de 22.462 a 36.615 € | SalarioJusto</title>
> `convenio-metal-valencia.html:194` — <h1>Convenio del <em>Metal de Valencia</em>: la paga de marzo que casi nadie conoce</h1>
> `convenio-metal-valencia.html:278` — <tr class="highlight"><td class="cat">Peón/a</td><td class="num">7</td><td class="num">45,80 €/día</td><td class="sal">22.462,18 €</td></tr>

**🟢 4.1 — 2/3**

La entradilla es autocontenida de manual —dice quién paga, cuánto, cuándo y con qué tablas— y la FAQ del peón encadena categoría, grupo, cuantía diaria, cómputo anual y comparación con el SMI del año. Se queda en 2 y no sube porque el h1 no lleva cifra y porque la frase de la FAQ no repite provincia ni sector: 'El Peón/a (Grupo 7) tiene un salario grupo de 45,80 € al día' es igual de válida en Sevilla, donde el peón cobra 54,69 €/día. En una página que compara convenios por provincia, esa es la frase que más fácil se atribuye mal.

> `convenio-metal-valencia.html:195` — Además de las dos pagas extra de junio y diciembre, el metal de Valencia abona <strong>17 días de salario el 15 de marzo</strong>. Tablas 2026 (+2,5%) de 22.462 € (Peón) a 36.615 € (Ingeniería)
> `convenio-metal-valencia.html:523` — El <strong>Peón/a</strong> (Grupo 7) tiene un salario grupo de <strong>45,80 € al día</strong>, que en cómputo anual con las pagas del convenio suma <strong>22.462,18 € brutos</strong>.
> `convenio-metal-valencia.html:194` — <h1>Convenio del <em>Metal de Valencia</em>: la paga de marzo que casi nadie conoce</h1>

**🟢 4.2 — 2/3**

Resuelve bien un caso difícil: este convenio paga por día al personal de oficio y por mes al técnico, y la ficha mete la unidad dentro de cada celda ('45,80 €/día' junto a '1.712,48 €/mes') en lugar de homogeneizar y perder la información. El encabezado del anual lleva año. No sube a 3 porque las siete tablas van sin caption, porque la columna 'Salario grupo' mezcla dos unidades sin decirlo en el encabezado, y porque la advertencia de que existe otro convenio del Comercio del Metal en Valencia —el riesgo real de confusión— queda lejos de las cifras.

> `convenio-metal-valencia.html:276` — <thead><tr><th>Categoría</th><th class="num">Grupo</th><th class="num">Salario grupo</th><th class="num">Salario anual 2026</th></tr></thead>
> `convenio-metal-valencia.html:270` — <strong>Cómo leer la tabla:</strong> el <strong>personal de operaciones</strong> (oficio) cobra el salario grupo <strong>por día</strong>; el personal técnico y de empleados/as lo cobra <strong>por mes</strong>.
> `convenio-metal-valencia.html:264` — <strong>Ojo: en Valencia hay dos convenios de metal.</strong>

**🟢 4.4 — 2/3**

El ancla da 2 (pct_huerfanas 0,024, 3 de 123) y lo respeto, pero con una reserva que conviene leer: es la única de las nueve cuya tabla salarial no tiene ningún boletín al lado. El párrafo que la abre cita el artículo del incremento y nada más; el BOP aparece en el sello de arriba y en el bloque de fuentes del final, es decir, lejos. Que el determinista no la penalice se explica porque la referencia a artículo cuenta como fuente, pero para citar una cuantía el artículo del convenio no sustituye a la publicación. Además, las tablas 2026 están 'registradas', no publicadas en ese BOP nº 203, que es de 2023: quien quiera comprobarlas no sabe dónde mirar.

> `convenio-metal-valencia.html:268` — Cuantías brutas oficiales de las <strong>tablas 2026</strong>, resultado de aplicar el <strong>+2,5%</strong> pactado (Art. 13) sobre las tablas de 2025, con efectos desde el 1 de enero de 2026.
> `convenio-metal-valencia.html:202` — <strong>✓ Verificado</strong> contra el texto del convenio (BOP Valencia nº 203, código REGCON 46000105011981) y las tablas salariales 2026 registradas el 19 de enero de 2026
> `convenio-metal-valencia.html:496` — Texto del convenio en el BOP nº 203 (20-oct-2023); tablas 2026 registradas el 19-ene-2026.

> Ventana cerrada (21 días): parches ejecutables. Valencia es el caso más claro del cluster de una buena ficha mal expuesta: tiene el mejor hallazgo editorial del sector —una tercera paga de 17 días que ni Barcelona ni Bizkaia tienen— y lo ha puesto en los tres sitios donde compite por el clic (title, h1 y meta), desplazando al salario de todos ellos. No hay que elegir entre las dos cosas: la cifra capta y la paga de marzo retiene, en ese orden. Aparte, y esto es traza más que captación, la ficha debería resolver dónde se publican las tablas 2026: 'registradas el 19 de enero de 2026' no es una referencia que un lector pueda seguir.

### E5 · Enlazado y clúster

**🟠 6.6 — 1/3**

El puente está en la sección correcta pero no en el punto de la necesidad: el enlace cierra la sección colgado del párrafo de código REGCON y firmantes, no del paso que lo pide. El paso que manda pedir la nómina detallada por escrito no enlaza plantilla-solicitar-nominas.html y el que fija el plazo de un año por mensualidad no enlaza plantilla-reclamar-atrasos-convenio-salarial.html. Es el mismo patrón que este eje puntuó 1 en convenio-metal-sevilla, con el mismo bloque y el mismo anchor.

> `convenio-metal-valencia.html:482` — <h2 id="reclamar">¿Cobras menos de lo que fija tu grupo?</h2>
> `convenio-metal-valencia.html:490` — Firmantes: <strong>FEMEVAL, CCOO Industria PV y UGT-FICA PV</strong>, con asesoría en la provincia. <a href="/reclamar-diferencias-salariales-convenio.html">Guía completa para reclamar diferencias →</a>

**Parche propuesto:** Dos enlaces, cada uno en su paso. En la línea 486, donde se pide la nómina detallada: '…si los conceptos no aparecen separados (art. 29.1 del Estatuto de los Trabajadores). <a href="/plantilla-solicitar-nominas.html">Usa esta plantilla para pedírselas a tu empresa por escrito</a>.' En el paso del plazo, antes de la línea 490: 'Plazo: un año por cada mensualidad (art. 59.2 ET), así que <a href="/plantilla-reclamar-atrasos-convenio-salarial.html">reclama por escrito la diferencia de las últimas 12 mensualidades</a> antes de que prescriban.' Ahí y no al cerrar la sección porque cada plantilla resuelve exactamente la acción que el paso acaba de exigir; el enlace genérico a la guía puede quedarse donde está.

**🟢 6.2 — 2/3**

17 entrantes desde 10 páginas, por encima de la mediana del corpus (10): seis hermanas, la ficha marco de seguridad privada, hub, home y mapa. No es 3 porque la variedad real es pequeña —fichas del propio sector y directorios— y varios de esos enlaces caen en el bloque clonado de relacionados de las hermanas, no en su prosa.

> `analisis/auditoria-convenios/2026-08-20/deterministas/convenio-metal-valencia.json:None` — "entrantes_n": 17, "entrantes_desde": ["convenio-metal-asturias.html","convenio-metal-gipuzkoa.html","convenio-metal-madrid.html","convenio-metal-navarra.html","convenio-metal-sevilla.html","convenio-metal-zaragoza.html","convenio-seguridad-privada.html","convenios.html","index.html","mapa-del-sitio
> `convenio-metal-sevilla.html:643` — <a href="/convenio-metal-valencia.html">Convenio del Metal — Valencia</a>

**🟢 6.3 — 2/3**

El enlace sale justo donde nace la duda: en el párrafo que explica la paga de marzo de 17 días, comparándola con las provincias que sólo tienen 14 pagas. No es 3 porque es la única salida contextual del cuerpo y porque enlaza a dos hermanas cuando el clúster tiene nueve.

> `convenio-metal-valencia.html:244` — 17 días extra el 15 de marzo. La paga de marzo se calcula sobre el salario grupo
> `convenio-metal-valencia.html:248` — el <a href="/convenio-metal-barcelona.html">metal de Barcelona</a> y el <a href="/convenio-metal-bizkaia.html">metal de Bizkaia</a> tienen <strong>dos pagas extra (14 pagas)</strong>. Valencia añade la paga de marzo de 17 días

**🟢 6.4 — 2/3**

Es la que mejor cubre la dirección difícil: enlaza a las tres fichas valencianas de otros sectores (oficinas, hostelería, limpieza), algo que sólo Bizkaia iguala. Se queda en 2 porque en la dirección de hermanas se conforma con dos de nueve y porque los tres cruces de sector están en la lista final, sin decir cuándo conviene irse allí.

> `analisis/auditoria-convenios/2026-08-20/deterministas/convenio-metal-valencia.json:None` — "a_hermanas_mismo_sector": 2, "a_otro_sector_misma_provincia": ["/convenio-hosteleria-valencia.html","/convenio-limpieza-valencia.html","/convenio-oficinas-valencia.html"]
> `convenio-metal-valencia.html:561` — <a href="/convenio-oficinas-valencia.html">Convenio de Oficinas y Despachos — Valencia</a>

**🟢 6.5 — 2/3**

Sin anchors genéricos y los dos de prosa dicen sector y provincia. No es 3 porque los cinco del bloque final son el rótulo clonado del clúster ('Convenio del Metal — X', 'Convenio de Limpieza — Valencia') y ninguno está redactado para esta ficha.

> `analisis/auditoria-convenios/2026-08-20/deterministas/convenio-metal-valencia.json:None` — "anchors_genericos": []
> `convenio-metal-valencia.html:248` — el <a href="/convenio-metal-bizkaia.html">metal de Bizkaia</a>
> `convenio-metal-valencia.html:563` — <a href="/convenio-limpieza-valencia.html">Convenio de Limpieza — Valencia</a>

> Valencia y Bizkaia son las dos únicas fichas del metal que agotan la dirección 'otro sector, misma provincia'. Valencia es además la única que la combina con enlaces a hermanas: sirve de patrón para Zaragoza y Madrid, que tienen fichas vecinas publicadas y no las usan. Calibración de 6.3 en esta tanda: el párrafo 'Comparación con otras provincias del sector' lo llevan 8 de las 9 fichas del metal (11 en todo el corpus), así que dentro de este sector es la norma y vale 2; el 3 se reserva a las que reparten los enlaces por varios momentos del cuerpo (Asturias, Zaragoza). Si el sintetizador compara con el 3 que se dio a convenio-metal-sevilla por ese mismo párrafo, conviene normalizar en una dirección u otra.

### E6 · Forma y lectura

**🟠 8.1 — 1/3**

Sobra «Particularidades del convenio del metal de Valencia» (471-479): seis de sus siete viñetas rehacen lo ya desarrollado arriba -paga de marzo (240-248), plus de formación (421-422 y FAQ 531), sistema de incentivos (434-441), plus de tóxicos con opción de reducir jornada (410), jornada flexible de 135 h (366) y marco estatal supletorio, que además ya está en Recursos (511) y en Fuentes (544)-. La única viñeta con información propia es la de la Comisión Paritaria, y su sitio natural es el paso de reclamación, no un cajón al final.

> `convenio-metal-valencia.html:474` — Plus compensatorio de formación de 30 €/mes si la empresa no acredita plan formativo (Art. 71).
> `convenio-metal-valencia.html:422` — La empresa que no acredite la participación de su plantilla en un plan de formación debe abonar 30 €/mes de naturaleza salarial. O forma, o paga.
> `convenio-metal-valencia.html:479` — Comisión Paritaria con sede en FEMEVAL (Avda. Blasco Ibáñez 127, Valencia · cpmetalindustria@femeval.es)

**Parche propuesto:** Suprimir el h2 «Particularidades» y su lista (471-480) tras reescribir el paso 4 de la línea 487 así: «Acude a la Comisión Paritaria o a la vía extrajudicial. La Comisión Paritaria del convenio tiene su sede en FEMEVAL (Avda. Blasco Ibáñez 127, Valencia · cpmetalindustria@femeval.es), se reúne mensualmente y sus acuerdos se adoptan por unanimidad (Arts. 77-83). El convenio se adhiere además al VII Acuerdo de Solución Autónoma de Conflictos Laborales de la Comunitat Valenciana (ASAC-CV). La papeleta de conciliación ante el SMAC es gratuita e interrumpe la prescripción.» Actualizar el índice de la línea 219.

**🟠 8.3 — 1/3**

Duplicación de cuerpo a cuerpo dentro de la misma sección: la advertencia de que el convenio no cubre a las empresas que solo venden se da como última viñeta de la lista y se repite completa cuatro líneas después en un callout. Además, la paga de marzo se narra entera en la sección de apertura y se vuelve a narrar en la viñeta del cajón (473) y en la FAQ (526), siempre con el mismo artículo y los mismos 17 días.

> `convenio-metal-valencia.html:260` — NO te cubre si tu empresa se dedica solo a la venta de artículos metálicos: eso es el Comercio del Metal, que tiene convenio provincial propio y distinto.
> `convenio-metal-valencia.html:264` — Ojo: en Valencia hay dos convenios de metal. El que estás leyendo es el de Industria (fabricación, instalación, reparación). Existe otro para el Comercio del Metal (venta y distribución de artículos metálicos), con tablas y condiciones distintas.
> `convenio-metal-valencia.html:473` — Paga de marzo de 17 días (Art. 16), además de las dos extras: la condición más singular.

**Parche propuesto:** Eliminar la viñeta de la línea 260 y dejar solo el callout de la 264, que dice lo mismo y añade la regla práctica («si se fabrica, instala o repara, es este; si solo se vende, es el otro»). La lista queda con seis viñetas de actividades cubiertas, sin la excepción intercalada.

**🟢 7.8 — 2/3**

Sigue el canon entero y su contenido exclusivo -la paga de marzo de 17 días- está integrado en el cuerpo de la mejor manera posible: da título a la ficha, abre el cuerpo con sección propia, aparece en la tabla de pagas, se compara con otras provincias y se convierte en euros dentro del ejemplo aterrizado. No llega a 3 por dos rasgos propios mal colocados: el complemento «ex categoría profesional», que es una singularidad valenciana con efecto directo en la nómina de quien lleva años en la empresa, sobrevive como coletilla suelta al pie de la tabla y no tiene tarjeta en Pluses; y el único dato de contacto de la Comisión Paritaria (sede, dirección y correo) vive en el cajón final, a treinta líneas del paso de reclamación donde se le dice al lector que acuda a ella.

> `convenio-metal-valencia.html:240` — La paga de marzo: una tercera gratificación de 17 días
> `convenio-metal-valencia.html:321` — Existe un complemento "ex categoría profesional" para quienes a 31-12-2000 cobraban un salario superior al del grupo al que quedaron adscritos: es una garantía personal no absorbible, que sube cada año como el convenio.
> `convenio-metal-valencia.html:479` — Comisión Paritaria con sede en FEMEVAL (Avda. Blasco Ibáñez 127, Valencia · cpmetalindustria@femeval.es), reuniones mensuales y acuerdos por unanimidad (Arts. 77-83).

**Parche propuesto:** Dos movimientos. (1) Convertir el «ex categoría» en tarjeta dentro de «Pluses y complementos» (junto a la tarjeta de turnicidad de las líneas 417-418): «Complemento ex categoría profesional — Si a 31-12-2000 cobrabas más que el salario grupo al que te adscribieron, la diferencia se conserva como complemento personal: no es absorbible ni compensable y sube cada año como el convenio. Comprueba que sigue apareciendo como concepto propio en tu nómina.» (2) Llevar la sede y el correo de la Comisión Paritaria al paso 4 de «¿Cobras menos de lo que fija tu grupo?» (línea 487), que es donde se usan.

**🟢 8.2 — 2/3**

Orden razonable pero con una decisión discutible: es la única ficha del cluster cuyo h1 no lleva la cifra -apuesta por el gancho editorial, «la paga de marzo que casi nadie conoce»-, de modo que la horquilla 22.462-36.615 € queda relegada al subtítulo. El card de datos clave y el índice compensan (respuesta_directa.cifra_en_primeros_bloques viene en true) y la tabla es el tercer h2, como en las hermanas. No baja de 2 porque nadie queda atrapado en el contexto, pero tampoco sube: quien llega buscando «cuánto cobra un peón del metal en Valencia» no ve la cifra en el titular.

> `convenio-metal-valencia.html:194` — Convenio del Metal de Valencia: la paga de marzo que casi nadie conoce
> `convenio-metal-valencia.html:195` — Tablas 2026 (+2,5%) de 22.462 € (Peón) a 36.615 € (Ingeniería), jornada de 1.752 h

**🟢 8.6 — 2/3**

Los términos que mueven la nómina se explican al primer uso y se traducen a dinero: el plus de formación se resume en «o forma, o paga» con sus 30 €/mes, la paga de marzo se explica con su base de cálculo y su prorrateo, y el ejemplo de Marcos convierte turnicidad y penosidad en porcentajes sobre un bruto concreto. No es 3 porque el bloque de incentivos suelta «sistema centesimal» y «Bedaux» sin explicar qué son ni qué suponen en euros -y son justo los sistemas que deciden cuánto cobra de prima el personal de oficio-, y porque «plus convenio» aparece una única vez, como componente de la paga de vacaciones, sin figurar en la lista de pluses ni definirse en ningún sitio.

> `convenio-metal-valencia.html:437` — El rendimiento normal se fija en 100 (sistema centesimal) o 60 (Bedaux); el óptimo teórico en 133 (centesimal) u 80 (Bedaux).
> `convenio-metal-valencia.html:383` — Se retribuyen conforme a la media de las 14 últimas semanas (salario, primas, antigüedad, tóxicos/penosos/peligrosos y plus convenio).
> `convenio-metal-valencia.html:422` — O forma, o paga.

**Parche propuesto:** Añadir una frase al final del bloque de incentivos (tras la línea 440): «Qué significa en euros: el rendimiento normal se paga con tu salario grupo y el óptimo llega a multiplicarlo por 1,20. Para un Oficial/a de 1.ª de oficio (49,55 €/día), trabajar al óptimo supone unos 9,91 € más por día trabajado. Centesimal y Bedaux son solo dos formas de medir esa actividad: en el primero el rendimiento normal es 100 y en el segundo, 60.» Y en la línea 383, sustituir «plus convenio» por el nombre que el propio convenio use en el Art. 51, o suprimirlo si es el mismo salario grupo ya citado al inicio de la enumeración.

**🟢 8.8 — 2/3**

norma.sindicatos da CCOO 4 · UGT 4 y todos los usos son legítimos: firmantes del convenio en el card de datos clave, en el cierre del bloque de reclamar y en fuentes, más la tarjeta de asesoría. En ningún punto se le atribuye a las dos siglas la representación del conjunto. No es 3 porque la tarjeta de recursos sindicales solo ofrece salida a quien está afiliado a una de las dos firmantes.

> `convenio-metal-valencia.html:236` — FirmantesFEMEVAL · CCOO Industria · UGT-FICA
> `convenio-metal-valencia.html:490` — Firmantes: FEMEVAL, CCOO Industria PV y UGT-FICA PV, con asesoría en la provincia.

**🟢 12.3 — 2/3**

El esqueleto coincide con el de su hermana más parecida, convenio-metal-madrid (25 encabezados, 1 h1, 18 h2, 6 h3 de FAQ, saltos_jerarquia vacío en ambas), con la misma secuencia sello → índice → datos clave → gancho → ámbito → tablas → ejemplo aterrizado → pagas → jornada → vacaciones → licencias → pluses → incentivos → baja → subrogación → cajón → reclamar → recursos → FAQ → fuentes → quién audita. No se aleja del corpus. Como las otras cuatro de esta tanda, no lleva el bloque «En 30 segundos» de alava/asturias/barcelona/sevilla: son dos sub-plantillas conviviendo en el mismo sector.

> `convenio-metal-valencia.html:434` — Sistema de productividad e incentivos
> `convenio-metal-madrid.html:403` — Sistema de rendimiento e incentivos

**🟢 12.6 — 2/3**

Es la ficha más disciplinada del cluster en el nombre de la magnitud principal: «salario grupo» aparece igual en la tabla, en el ejemplo, en las tres tarjetas de pluses, en el bloque de incentivos y en la FAQ, sin variantes tipo «salario base» o «salario de convenio» que sí contaminan a metal-madrid. No es 3 por dos grietas: el «plus convenio» de la línea 383, que es un nombre que no vuelve a aparecer en toda la página, y la atribución del Art. 16 a dos conceptos distintos -la paga de marzo y la antigüedad consolidada- a pocas líneas de distancia.

> `convenio-metal-valencia.html:354` — Paga de marzo15 de marzo17 días de salario grupo (Art. 16)
> `convenio-metal-valencia.html:359` — La antigüedad consolidada (Art. 16) no es absorbible ni compensable y se revaloriza con el convenio.
> `convenio-metal-valencia.html:383` — tóxicos/penosos/peligrosos y plus convenio

> Capa 0, no puntuado aquí pero relevante para quien mantenga la plantilla: es la ficha con 17 celdas de tabla en verde (aviso 7.2*), el outlier del corpus frente a las ocho hermanas del metal, que tienen verde_en_tablas = 0; la norma de casa reserva el verde para el sello de verificado y aquí pinta cifras salariales. También 7 tablas sin scope ni caption (11.1*). Para otros ejes: el Art. 16 se cita como fuente de la paga de marzo (líneas 241, 354, 526) y también de la antigüedad consolidada (línea 359); una de las dos atribuciones tiene que estar mal y conviene que lo revise quien audita fuentes. La ventana de medición está cerrada (último commit 30-jul, 21 días), así que los parches son aplicables ya.
