# convenio-metal-barcelona

**Score: 70.1/100** · hard-fails: **2**

> ⚠️ **Sin verificación adversarial.** Estas notas no han pasado por la capa 2. En el piloto
> el verificador refutó o matizó cerca de un tercio de los hallazgos, así que este score no
> es comparable con el de una ficha verificada. Trátalo como provisional.

Sector metal · estado `vigente` · 4511 palabras de prosa · boilerplate 0.015 · último cambio hace 21 días

## Hard-fails — no se compensan con la nota

- **2.2** (determinista) · sin bloque de responsable identificable ('Quién audita esto')
- **7.1** (determinista) · 2 tabla(s) sin contenedor con scroll y sin reflow a tarjetas → desborda en móvil

## Ejes

**Cuello de botella: E6 (46.0% de su peso).** Es por donde empieza el arreglo.

| eje | | puntos | peso |
|---|---|---|---|
| E1 | Verdad demostrada | 19.6 | 22 |
| E2 | Singularidad y ventaja | 18.9 | 22 |
| E3 | Respuesta al trabajador | 11.1 | 20 |
| E4 | Captación y citabilidad | 10.3 | 14 |
| E5 | Enlazado y clúster | 5.6 | 12 |
| E6 | Forma y lectura | 4.6 | 10 |

### E1 · Verdad demostrada

**🟢 5.8 — 2/3**

Las obligaciones que enuncia llevan artículo y condición, incluida la del contrato a tiempo parcial; no llega a 3 porque el bloque de tabla invita a «cruzar tu puesto con el grupo» sin advertir del caso límite más frecuente en este convenio: que el salario de tabla es de grupo y no incorpora antigüedad (que el convenio no reconoce) ni complementos ad personam.

> `convenio-metal-barcelona.html:422` — <strong>Libre disposición:</strong> <strong>12 horas anuales</strong> preaviso 7 días naturales, por horas o jornada completa (Art. 65.i). Empresa debe motivar denegación en 2 días laborables.
> `convenio-metal-barcelona.html:512` — Horas complementarias máximo <strong>40%</strong> de las horas ordinarias. Formalizables por escrito. Personas a tiempo parcial tienen <strong>preferencia para cubrir vacantes a jornada completa</strong> y viceversa.

**🟢 9.1 — 2/3**

La fecha de verificación es concreta (11-jul-2026) y posterior al BOPB del 13-feb-2026, y se repite en el pie; se queda en 2 porque el cuerpo contiene una frase que contradice esa frescura: da por no publicado el SMI de 2026 cuando el RD 126/2026 ya estaba en vigor meses antes de la revisión declarada.

> `convenio-metal-barcelona.html:176` — <strong>✓ Verificado</strong> contra BOPB del 13 de febrero de 2026 (Resolución de 11 de febrero de 2026, Directora Territorial Barcelona Lídia Frias Forcada) por SalarioJusto · última revisión 11 de julio de 2026
> `convenio-metal-barcelona.html:507` — Para 2026 y 2027 se ajustará por la Comisión Paritaria cuando el BOE publique el SMI vigente.

**Parche propuesto:** Reescribir la línea 507 para que refleje el estado real a la fecha del sello: «Personas contratadas para formación y aprendizaje o formación en alternancia (1.º, 2.º y 3.º año) percibían en 2025 1.184,00 €/mes en 14 pagas = 16.576,00 €/año, importe idéntico al SMI de 2025. Para 2026 el suelo aplicable es el SMI vigente (RD 126/2026: 1.221 €/mes, 17.094 €/año en 14 pagas); a la fecha de esta revisión la Comisión Paritaria no ha publicado tabla propia de formación para 2026, de modo que rige el SMI.» Añadir en la lista de fuentes el enlace https://www.boe.es/buscar/act.php?id=BOE-A-2026-3815.

**🔵 2.1 — 3/3**

Publica la aritmética de su columna anual, localiza la tabla en las páginas concretas del texto oficial, monta un caso trabajado con nombre y desglose, y aporta un dato de contexto que no está en el boletín: que la tabla de 2025 se aplicó con retroactividad porque el convenio se publicó en febrero de 2026.

> `convenio-metal-barcelona.html:253` — Fuente: Anexo 1 del BOPB del 13-feb-2026 (páginas 79 y 82 del texto oficial). … Total anual = Salario Convenio × 14.
> `convenio-metal-barcelona.html:272` — Fuente: Anexo 1 del BOPB del 13-feb-2026, tablas 2025. Se aplicó a las nóminas desde enero de 2025 con carácter retroactivo tras la publicación del convenio en febrero de 2026.
> `convenio-metal-barcelona.html:291` — <p class="ejemplo-total">Bruto anual 2026: 28.887,46 €</p>

**🔵 5.10 — 3/3**

Es la única ficha del sector que lleva al documento exacto y además al anexo y a la página: enlaza el texto íntegro del BOPB con su CVE escrito al lado y, aparte, el PDF de las tablas 2026. El lector no repite ninguna búsqueda.

> `convenio-metal-barcelona.html:644` — <strong>BOPB · 13-feb-2026 · CVE 202610028848</strong></a> — Resolución de 11 de febrero de 2026 por la que se dispone la inscripción y la publicación del XX Convenio Colectivo … (177 páginas · castellano + catalán)
> `convenio-metal-barcelona.html:253` — Fuente: Anexo 1 del BOPB del 13-feb-2026 (páginas 79 y 82 del texto oficial).
> `convenio-metal-barcelona.html:645` — <strong>CCOO Indústria Catalunya · dic-2025</strong></a> — Tablas salariales 2026 publicadas por la representación sindical firmante para difusión sectorial.

**🔵 5.11 — 3/3**

Fecha la tabla vigente en el h2 y en su pie de fuente, guarda la de 2025 en un desplegable rotulado como tal, y en los complementos da las dos cuantías emparejadas —2026 y 2025— para que el lector sepa cuál le toca. Ninguna otra ficha del sector, salvo Asturias, separa así vigente e histórico.

> `convenio-metal-barcelona.html:256` — <summary>Ver tabla vigente en 2025 (Anexo 1 BOPB, aplicada +4% sobre 2024)</summary>
> `convenio-metal-barcelona.html:302` — Jornada que supere media jornada: <span class="plus-cifra">7,91 €/día</span> (2026) — 7,68 €/día en 2025.
> `convenio-metal-barcelona.html:313` — <h3>Uso de coche particular — Art. 53</h3>

**🔵 9.2 — 3/3**

No solo dice hasta cuándo dura el convenio: publica el calendario de la subida pendiente de 2027 con efectos, la jornada pactada para ese año y el mecanismo, el umbral y la fecha de la cláusula de garantía (revisión sobre tablas 2027, aplicable el 1-ene-2028, sin retroactividad). El lector sabe qué vigilar y cuándo.

> `convenio-metal-barcelona.html:345` — <strong>2027</strong>: +3% sobre las tablas de 2026 · efectos 1 de enero de 2027
> `convenio-metal-barcelona.html:350` — Si el Instituto Nacional de Estadística (INE) constata oficialmente que, al 31 de diciembre de 2027, <strong>la suma de las inflaciones de los años 2025, 2026 y 2027 fuese superior al 10,00%</strong>, se efectuará una revisión técnica sobre las tablas de 2027, <strong>sin efectos retroactivos y apli

> Es la mejor ficha del sector en trazabilidad: enlaza documento, anexo y página. Dos reservas que no bajan la nota pero convienen al sintetizador. (1) Los dos enlaces al «texto íntegro» y a las tablas 2026 están alojados en webs sindicales (ugtficabcn.cat y ccoo.cat), no en la sede del BOPB; la ficha lo rotula honestamente como «Espejo oficial», pero si el sindicato rota el archivo la cadena se rompe entera, así que debería añadirse la URL del CVE en la sede. (2) El determinista marca como hardfail 2.2 la ausencia del bloque «Quién audita esto»: no lo puntúo aquí para no penalizarlo dos veces, pero es justo el bloque donde el resto del sector separa por escrito lo transcrito de lo calculado, y esta ficha calcula (×14, ejemplo Carla) sin esa declaración. El SMI de 16.576 €/1.184 € que detecta el determinista es referencia legítima a 2025, no una cifra de 2026 mal puesta: no hay 5.7.

### E2 · Singularidad y ventaja

**🟢 8.4 — 2/3**

Recoge la particularidad principal —es el mayor convenio provincial del metal de España y lo dice con su cifra— y aterriza el ejemplo en el Baix Llobregat, pero nunca dice de qué vive el metal de Barcelona. La provincia donde la automoción y su industria auxiliar han vivido la mayor reconversión de la última década resuelve el ámbito con la lista de CNAE del convenio estatal, sin una línea sobre qué significa esa lista aquí.

> `convenio-metal-barcelona.html:217` — Es el mayor convenio provincial de metal por número de personas cubiertas: ≈200.000 trabajadoras/es
> `convenio-metal-barcelona.html:590` — Aplica a las empresas cuyo CNAE se corresponda con los establecidos en el IV Convenio Colectivo Estatal del Metal (BOE 12-ene-2022), listados en el Anexo 16 del texto.

**🟢 10.1 — 2/3**

Ventaja clara y sostenida sobre el BOPB —177 páginas bilingües convertidas en catorce secciones navegables, tabla mensual traducida a bruto anual y un ejemplo con nombre y comarca— pero es ordenación y traducción, no resolución: no hay ninguna pieza que el boletín no contenga ya, ni conflicto de publicaciones que deshacer, ni actualidad de negociación. Cumple lo que se espera, y muy bien; no da el salto que sí dan Madrid, Álava o Zaragoza.

> `convenio-metal-barcelona.html:291` — Bruto anual 2026: 28.887,46 €
> `convenio-metal-barcelona.html:213` — Espejo oficial: texto íntegro BOPB en la web de UGT FICA Barcelona (177 páginas, castellano + catalán).

**🟢 10.2 — 2/3**

Frente al agregador la ventaja existe y es identificable: traza al CVE y a la resolución con nombre de la firmante, y un ejemplo que enseña a leer la propia nómina. Pero falta lo que sí tienen las hermanas —comparación provincial y declaración explícita de qué es transcripción y qué cálculo propio—, y el sello de cierre es más pobre que el del resto del cluster.

> `convenio-metal-barcelona.html:176` — ✓ Verificado contra BOPB del 13 de febrero de 2026 (Resolución de 11 de febrero de 2026, Directora Territorial Barcelona Lídia Frias Forcada)

**🔵 3.1 — 3/3**

boilerplate_ratio 0,015, el más bajo de las nueve fichas del metal y de casi todo el corpus, con solo 3 frases compartidas que además no son cromo nuestro sino coincidencias del articulado (la definición legal de trabajo nocturno, los 15 días de matrimonio, el rango de la excedencia voluntaria). Ni siquiera comparte el bloque de metodología que llevan las otras ocho: aquí el cierre está redactado a medida.

> `convenio-metal-barcelona.html:663` — Convenio verificado por Telmo · última revisión 11-jul-2026 contra BOPB del 13-feb-2026
> `convenio-metal-barcelona.html:379` — Se considera trabajo nocturno el realizado entre las 22:00 y las 6:00 de la mañana.

**🔵 3.2/3.3 — 3/3**

4.511 palabras de prosa —la cifra más alta del sector— contra ratio_tabla 0,03, la más baja: literalmente no es una tabla con envoltorio, es un cuerpo de texto con una tabla de siete filas dentro. Y la prosa hace el trabajo que la tabla no puede: explicar por qué la nómina de mucha gente no coincide con esas siete cifras, porque arrastra complementos «ex» que el convenio respeta a título personal.

> `convenio-metal-barcelona.html:293` — A Carla NO se le aplica antigüedad (el convenio no la reconoce; solo se respetan como "condición ad personam" los complementos "ex vinculación" y "ex categoría profesional" para quienes ya los cobraban antes de 1995-1999).
> `convenio-metal-barcelona.html:231` — la retribución es idéntica para las tres divisiones funcionales dentro del mismo grupo

**🔵 3.4 — 3/3**

195 frases exclusivas y 3.448 palabras exclusivas, ambas las más altas de las nueve, y con sustancia detrás: la distinción entre retén y guardia, la obligación de bilingüismo en los avisos internos o el complemento de teletrabajo por día efectivo son hechos que solo salen de leer un convenio de 177 páginas en dos lenguas, no de cambiar el topónimo de una plantilla.

> `convenio-metal-barcelona.html:625` — El Art. 84 del Capítulo XI establece que todos los anuncios o avisos en las empresas deberán redactarse en castellano y en catalán
> `convenio-metal-barcelona.html:429` — El convenio regula por primera vez este servicio con distinción entre dos figuras

**🔵 3.5 — 3/3**

La FAQ que ve el lector tiene ocho preguntas y ninguna es intercambiable: retén frente a guardia, quién cobra los complementos «ex», bilingüismo de los avisos, aplicación vía ETT. El determinista cuenta 3 clonadas sobre 6 porque mide el bloque JSON-LD, que es otro juego de preguntas distinto del visible (lo anoto abajo, es defecto de otro eje).

> `convenio-metal-barcelona.html:604` — ¿Qué diferencia hay entre servicio de retén y servicio de guardia?
> `convenio-metal-barcelona.html:624` — ¿Hay bilingüismo en las comunicaciones de la empresa?

> Ventana cerrada (último commit 2026-07-30, 21 días): los parches se pueden aplicar. Es la ficha más singular del sector por masa —195 frases exclusivas, boilerplate 0,015— y a la vez la más aislada: es la única de las nueve sin párrafo «Comparación con otras provincias del sector», y sus «Convenios relacionados» apuntan a Construcción Bizkaia y Hostelería Barcelona en vez de a las ocho hermanas del metal. Ahí pierde gratis la ventaja de corpus que las demás sí explotan. Dos avisos para otros ejes: (1) el bloque FAQPage de JSON-LD (líneas 48-53) contiene seis preguntas que NO son las ocho visibles en la página (líneas 589-624) — marcado estructurado sin correlato visible; (2) la línea 507 fija el salario de los contratos formativos en 1.184 €/mes «importe idéntico al SMI 2025», correcto para 2025 pero conviene vigilar que no se lea como cifra de 2026. Parche de investigación para 8.4, no de relleno: el metal de Barcelona es el del cinturón de la automoción; comprobar en REGCON qué convenios de empresa rigen en las grandes plantas de vehículos de la provincia y decir en dos frases si el provincial les aplica y si aplica a sus proveedoras de primer nivel, que es donde está la mayoría de esas 200.000 personas.

### E3 · Respuesta al trabajador

**🔴 1.3 — 0/3**

No hay salida. Es la única ficha del metal sin sección de reclamación: el determinista lo confirma por dos vías (conceptos_ausentes incluye «que_hacer» y enlaces.al_kit está vacío). No se menciona el plazo de prescripción del art. 59.2 ET en ninguna parte, no se dice cómo documentar la diferencia, y lo único parecido a una vía es una línea informativa sobre el Tribunal Laboral de Catalunya dentro del apartado de comisiones paritarias, redactada como dato del convenio y no como instrucción para el lector. Con 200.000 personas cubiertas, es el hueco más caro del corpus del metal.

> `convenio-metal-barcelona.html:553` — Sometimiento expreso a los procedimientos de Conciliación y Mediación del TLC como trámite previo obligatorio a la vía judicial, para conflictos colectivos, plurales e individuales no excluidos.
> `convenio-metal-barcelona.html:581` — Calcula tu salario neto en la industria metalúrgica de Barcelona con retenciones IRPF 2026 y escala autonómica de Cataluña

**Parche propuesto:** Insertar antes de «Convenios relacionados» (línea 630) una sección «¿Cobras menos de lo que fija tu grupo?» con cinco pasos: «1. Identifica tu grupo profesional (1 a 7) por tus funciones reales, no por el nombre del puesto: la descripción y los puestos típicos de cada grupo están en el Anexo 14 del convenio y resumidos más arriba. 2. Compara tu nómina con la tabla 2026: el salario convenio de tu grupo se cobra en 12 mensualidades más dos pagas de la misma cuantía el 30 de junio y el 22 de diciembre (Art. 49). Multiplica el salario mensual de tu grupo por 14 y compáralo con tu bruto anual; añade nocturnidad (1,23 €/hora entre las 22:00 y las 6:00), plus de penosos/tóxicos/peligrosos (7,91 € o 3,97 €/día) y teletrabajo (1,69 €/día) si te corresponden. 3. Pide la nómina detallada por escrito si los conceptos no aparecen separados (art. 29.1 del Estatuto de los Trabajadores). Comprueba que ningún complemento «ex vinculación», «ex jefe de equipo» o «ex categoría profesional» se te ha absorbido: el Art. 38 prohíbe compensarlos o absorberlos. 4. Reclama primero a la empresa por escrito con acuse (burofax o correo con confirmación), citando el artículo del convenio y el importe. Si no hay respuesta, acude a la Comisión Paritaria del convenio (Via Laietana 32, 4.ª — UPM; Via Laietana 16, 3.º — CCOO Indústria; Plaza Vázquez Montalbán 6, 2.ª — UGT-FICA) y al Tribunal Laboral de Catalunya, cuya conciliación es trámite previo obligatorio antes del juzgado de lo social (Art. 87). 5. Plazo: un año por cada mensualidad para reclamar diferencias (art. 59.2 ET). Cada mes que pasa sin reclamar es un mes que prescribe: empieza por las mensualidades más antiguas.» Cerrar con el enlace a /reclamar-diferencias-salariales-convenio.html, que hoy no existe en esta ficha.

**🔴 1.9 — 0/3**

Es la única ficha del metal sin SMI 2026. El determinista lo confirma: cita_17094 es falso y registra como SMI los importes obsoletos 1.184 € y 16.576 €. Peor que la ausencia es el marco: la ficha dice que el salario del contrato formativo se ajustará «cuando el BOE publique el SMI vigente», cuando el SMI 2026 ya estaba publicado (RD 126/2026) meses antes de la última revisión de esta página, del 11-jul-2026. Quien llega aquí buscando el suelo por debajo del cual no puede cobrar se lleva la cifra de 2025.

> `convenio-metal-barcelona.html:507` — perciben en 2025: 1.184,00 €/mes en 14 pagas = 16.576,00 €/año (importe idéntico al SMI 2025). Para 2026 y 2027 se ajustará por la Comisión Paritaria cuando el BOE publique el SMI vigente.
> `convenio-metal-barcelona.html:663` — Convenio verificado por Telmo · última revisión 11-jul-2026 contra BOPB del 13-feb-2026

**Parche propuesto:** Sustituir la última frase de la línea 507 por: «Para 2026, el Real Decreto 126/2026 fijó el SMI en 1.221 €/mes y 17.094 € anuales en 14 pagas (BOE-A-2026-3815): ninguna persona contratada en formación o en alternancia puede cobrar por debajo de esa cifra, aunque la Comisión Paritaria no haya publicado todavía la tabla específica de contratos formativos de 2026.» Y añadir en el bloque de fuentes (línea 644 y siguientes) la línea «Real Decreto 126/2026, SMI 2026 (1.221 €/mes, 17.094 € anuales), referencia para la comparación. BOE-A-2026-3815», con el enlace, como ya hacen las otras ocho fichas del metal.

**🟢 1.1 — 2/3**

Es la mejor apertura del cluster en unidad: el H1 da el rango en €/mes, que es la unidad en la que la persona piensa, con el año y el BOPB del 13-feb-2026 en el subtítulo y en el sello. No llega a 3 porque sigue siendo un rango de grupos: la cifra del puesto más buscado —Oficial de 1ª mecánico o electricista, 2.063,39 €/mes— existe y está muy bien redactada, pero vive a la altura de la tabla, no arriba.

> `convenio-metal-barcelona.html:168` — Convenio Metal Barcelona 2026: de 1.980 € a 2.578 € al mes con +3% aplicado enero y garantía IPC
> `convenio-metal-barcelona.html:176` — ✓ Verificado contra BOPB del 13 de febrero de 2026 (Resolución de 11 de febrero de 2026, Directora Territorial Barcelona Lídia Frias Forcada) por SalarioJusto
> `convenio-metal-barcelona.html:277` — Salarios más buscados (2026): Oficial de 1ª mecánico/a o electricista = Grupo 5 = 2.063,39 €/mes .

**🟢 1.2 — 2/3**

Responde 6 de las 8, y las cinco primeras con nota alta: la cifra por puesto real, el mes y las 14 pagas, el encuadre por grupo, el ámbito por CNAE, la antigüedad (respuesta clara: no se reconoce para quien entra hoy) y la nocturnidad con importe por hora. Fallan dos, y una de ellas es la más importante que existe: «cobro menos que mi grupo, ¿qué hago?» no tiene respuesta en toda la página; y «trabajo media jornada, ¿cuánto me corresponde?» tampoco —el Art. 29.a solo habla de horas complementarias y de preferencia para vacantes, nunca de cuánto se cobra—.

> `convenio-metal-barcelona.html:595` — El convenio NO reconoce antigüedad para personas contratadas hoy.
> `convenio-metal-barcelona.html:512` — Horas complementarias máximo 40% de las horas ordinarias. Formalizables por escrito. Personas a tiempo parcial tienen preferencia para cubrir vacantes a jornada completa y viceversa.
> `convenio-metal-barcelona.html:382` — 1,19 €/hora nocturna en 2025 · 1,23 €/hora nocturna en 2026 · idéntico para todos los grupos profesionales del 1 al 7.

**🔵 1.4 — 3/3**

Es la ficha que mejor resuelve la autoubicación de todo el cluster, y lo hace por tres vías que las demás no combinan: la tabla salarial lleva los puestos típicos dentro de la propia fila del grupo; hay una sección con los 7 grupos descritos por titulación, autonomía y puestos reales (soldadores/as y electricistas nombrados en el Grupo 5, peón/a y vigilante en el 7); y un bloque «Salarios más buscados» que hace explícito el cruce oficio real → grupo → cifra. Además da la instrucción en voz activa y declara la frontera funcional por CNAE con el único supuesto excluido.

> `convenio-metal-barcelona.html:231` — Cruza tu puesto de trabajo con el grupo profesional que te corresponda para obtener tu salario mensual bruto de convenio.
> `convenio-metal-barcelona.html:484` — Puestos típicos: Delineante 2ª, Oficiales Administrativos/as, Oficiales de Laboratorio, Oficiales de Organización, Viajante, Chofer de camión, Profesionales de Oficio 1ª y 2ª (electricistas, mecánicos/as, soldadores/as, siderúrgicos/as, etc.).
> `convenio-metal-barcelona.html:590` — Solo quedan fuera las empresas dedicadas exclusivamente a la venta de artículos en proceso de comercialización. Territorialmente: todos los centros de trabajo situados en la provincia de Barcelona , aunque el domicilio social esté fuera.

**🔵 1.6 — 3/3**

Es la única del metal que traduce a nómina de verdad y además avisa de los errores típicos. Traduce: da el mensual, dice cuántas mensualidades se cobran y en qué fechas, y desglosa un caso real paso a paso (12 × 2.063,39 € + dos pagas = 28.887,46 € brutos). Avisa: precisa que unos complementos se pagan en 12 mensualidades y otros en 14 —el error de cálculo más común del sector— y dice expresamente que los complementos ad personam no son absorbibles ni compensables, que es la trampa clásica de una nómina del metal. Ninguna otra ficha del corpus metal nombra la absorción.

> `convenio-metal-barcelona.html:253` — El "Salario Convenio/mes" se paga durante 12 mensualidades. Las 2 pagas extras (junio y Navidad, Art. 49) son de la misma cuantía que el salario mensual. Total anual = Salario Convenio × 14.
> `convenio-metal-barcelona.html:595` — Complemento "ex vinculación" [...] Se paga en 12 mensualidades. [...] Complemento "ex categoría profesional" [...] Se paga en 14 mensualidades. Ninguno es absorbible ni compensable.
> `convenio-metal-barcelona.html:288` — × 12 mensualidades: 24.760,68 €

> LAS 8 PREGUNTAS QUE TECLEARÍA ALGUIEN DEL METAL EN BARCELONA ANTES DE LLEGAR AQUÍ: (1) «¿cuánto cobra un oficial de 1ª del metal en Barcelona en 2026?»; (2) «¿y eso cuánto es al mes, con cuántas pagas?»; (3) «soy soldador en un taller del Baix Llobregat, ¿en qué grupo estoy?»; (4) «mi empresa monta ascensores / hace ITV, ¿me cubre este convenio?»; (5) «llevo 6 años, ¿me toca antigüedad?»; (6) «hago noches, ¿cuánto me tienen que pagar de más?»; (7) «cobro menos que mi grupo, ¿qué hago y hasta cuándo puedo reclamar?»; (8) «trabajo media jornada, ¿cuánto me corresponde?». RECORRIDO: (1) sí, y con nombre de oficio (277); (2) sí, mensual y 14 pagas (208, 253); (3) sí (484, 231); (4) sí, por CNAE (590); (5) sí, respuesta clara y negativa (595); (6) sí, 1,23 €/hora (382); (7) NO, no existe; (8) NO. Seis de ocho. — Diagnóstico: esta ficha es la mejor del cluster resolviendo «¿cuál es mi cifra?» y la peor resolviendo «¿y ahora qué hago?». Tiene la traducción a nómina más fina del corpus (12 vs 14 mensualidades, absorción, ejemplo desglosado) y no tiene ni una línea sobre cómo reclamar ni sobre el año de prescripción. Es un embudo que se corta justo antes de la acción. — Sobre media jornada: la ficha es de las pocas que menciona el contrato a tiempo parcial (Art. 29.a, línea 511-512), pero solo para hablar de horas complementarias y preferencia de vacantes; nunca dice que el salario del grupo se percibe en proporción a la jornada. — FUERA DE MI EJE: el determinista trae dos hard-fails propios (2.2, sin bloque «Quién audita esto», y 7.1, dos tablas que desbordan en móvil) y marca el SMI obsoleto; los dejo a E2 y E5, salvo por lo que afecta a 1.9. — VENTANA CERRADA: 21 días desde el último commit, así que los dos parches (1.3 y 1.9) no van aplazados.

### E4 · Captación y citabilidad

**🟢 2.4 — 2/3**

Es el mejor construido del sector y aun así se queda en 2. Arranca por la cifra, y es la única del cluster que usa la unidad que el lector ve en su nómina: el salario mensual del Anexo 1 del BOPB, no un anual derivado. Tiene sector, provincia y año. Lo que le impide el 3 es medible: 82 caracteres, el title más largo del sector después de Valencia, así que el buscador recorta por el final y se lleva la marca y parte del año; y la cifra elegida es la horquilla, no la del puesto más buscado —el Oficial de 1ª, 2.063,39 €/mes, que la ficha tiene identificado en su propio bloque de salarios más buscados.

> `convenio-metal-barcelona.html:6` — <title>1.980–2.578 €/mes — Tablas salariales Convenio Metal Barcelona 2026 | SalarioJusto</title>
> `convenio-metal-barcelona.html:253` — <p class="source-footer">Fuente: Anexo 1 del BOPB del 13-feb-2026 (páginas 79 y 82 del texto oficial). El "Salario Convenio/mes" se paga durante 12 mensualidades.
> `convenio-metal-barcelona.html:277` — <strong>Salarios más buscados (2026):</strong> Oficial de 1ª mecánico/a o electricista = Grupo 5 = <strong>2.063,39 €/mes</strong>.

**🟢 2.5 — 2/3**

Cifra y motivo: horquilla mensual con el número de pagas —que es lo que evita el malentendido clásico— más el porcentaje aplicado, la cláusula de garantía IPC y el tamaño del convenio. Es la meta más corta del sector (261 caracteres) y aun así se pasa: la cifra entra justo en el límite de lo que se muestra, precedida por 'XX Convenio Colectivo Industria Siderometalúrgica de la provincia de Barcelona', un nombre largo que consume casi todo el espacio útil. Con la cifra delante sería un 3.

> `convenio-metal-barcelona.html:7` — Tablas 2026 del XX Convenio Colectivo Industria Siderometalúrgica de la provincia de Barcelona: 7 grupos profesionales de 1.979,76 a 2.578,30 €/mes en 14 pagas. +3% aplicado enero 2026. Cláusula garantía IPC 10%. 200.000 personas trabajadoras. BOPB 13-feb-2026.

**🟢 4.1 — 2/3**

El h1 se vale solo con cifra, unidad, ámbito, año y hasta el mecanismo de subida, y el bloque de salarios más buscados empareja puesto, grupo y cuantía mensual con el año en la etiqueta: eso es lo mejor de la ficha para un extractor. No llega a 3 porque en ese mismo bloque ninguna frase repite la provincia —'Oficial de 1ª mecánico/a o electricista = Grupo 5 = 2.063,39 €/mes' viaja sin territorio— y porque la FAQ, que es donde vive la respuesta corta, no contiene ni una sola pregunta de cuantía: cuatro de sus seis respuestas no llevan cifra, según el determinista, y ninguna pregunta es '¿cuánto cobra un oficial de 1ª del metal en Barcelona?'.

> `convenio-metal-barcelona.html:168` — <h1>Convenio Metal Barcelona 2026: <em>de 1.980 € a 2.578 € al mes</em> con +3% aplicado enero y garantía IPC</h1>
> `convenio-metal-barcelona.html:277` — <strong>Salarios más buscados (2026):</strong> Oficial de 1ª mecánico/a o electricista = Grupo 5 = <strong>2.063,39 €/mes</strong>. Encargado/a de taller = Grupo 4 = <strong>2.141,52 €/mes</strong>.
> `convenio-metal-barcelona.html:589` — <summary>¿A qué empresas y personas trabajadoras aplica el convenio?</summary>

**🟢 4.4 — 2/3**

pct_huerfanas 0,017 es el mejor del sector (3 cifras de 181) y el HTML acompaña: cuatro pies 'Fuente:' colgados de la tabla que documentan, con anexo, boletín, fecha y hasta página, y 79 referencias a artículo repartidas por el cuerpo. Aun así no la subo a 3 por una razón concreta: la traza no es pinchable en la fuente. El único enlace externo de la ficha es un espejo del PDF alojado en la web de un sindicato, no el BOPB, así que quien quiera comprobarlo tiene que rehacer la búsqueda o fiarse de un tercero.

> `convenio-metal-barcelona.html:253` — <p class="source-footer">Fuente: Anexo 1 del BOPB del 13-feb-2026 (páginas 79 y 82 del texto oficial).
> `convenio-metal-barcelona.html:272` — <p class="source-footer">Fuente: Anexo 1 del BOPB del 13-feb-2026, tablas 2025.
> `convenio-metal-barcelona.html:213` — Espejo oficial: <a href="https://ugtficabcn.cat/calaix/conveni/Conveni_col-lectiu_de_treball_del_sector_de_la_industria_siderometal-lurgica_de_la_provincia_de_Barcelona_per_als_anys_2025_2027_BOPB.pdf" target="_blank" rel="noopener">texto íntegro BOPB en la web de UGT FICA Barcelona</a>

**🔵 4.2 — 3/3**

Es la única de las nueve que expone el dato como dato y no obliga a ninguna operación mental. La tabla da a la vez el mensual y el anual, y el pie declara la relación entre ambos ('Total anual = Salario Convenio × 14') y aclara que las extras son de la misma cuantía que la mensualidad: así, cualquiera de las dos celdas extraída sola llega con unidad, periodo y régimen de pagas. Y hace lo que ninguna otra hace con el riesgo de confusión que aquí es real: la tabla de 2025 no se mezcla ni se borra, se aísla en un desplegable rotulado como vigente en 2025 y con el año dentro del propio encabezado de columna, con su pie de fuente separado. Un motor no puede confundir la tabla histórica con la vigente porque están etiquetadas una a una.

> `convenio-metal-barcelona.html:240` — <th style="text-align:right;">Total Anual (14 pagas)</th>
> `convenio-metal-barcelona.html:253` — Total anual = Salario Convenio × 14.
> `convenio-metal-barcelona.html:256` — <summary>Ver tabla vigente en 2025 (Anexo 1 BOPB, aplicada +4% sobre 2024)</summary>

> Ventana cerrada (21 días desde el último commit), así que los parches son ejecutables. Dos cosas para el sintetizador. Primera: hay una microdiscrepancia real —el bruto anual del Grupo 5 aparece como 28.887,38 € en la tabla (línea 248) y como 28.887,46 € en el ejemplo de Carla (línea 291), ocho céntimos de diferencia entre la cifra del anexo y el resultado de multiplicar por 14—. No la elevo a hard-fail 4.5 porque anular una ficha entera por ocho céntimos sería desproporcionado, pero conviene cuadrarla: son dos respuestas distintas a la misma pregunta y quien cite la ficha elegirá una. Segunda: esta es la ficha del convenio con más personas cubiertas del sector (200.000) y no tiene ni una pregunta de cuantía en la FAQ. Es el hueco de captación más caro del cluster y se arregla añadiendo dos preguntas con el texto que ya existe en el bloque de salarios más buscados.

### E5 · Enlazado y clúster

**🔴 6.6 — 0/3**

No hay puente: al_kit está vacío, el único del clúster del metal, y en toda la ficha no aparece la palabra reclamar ni una sección de qué hacer si tu nómina no llega. Las otras ocho fichas del metal tienen sección '¿Cobras menos…?' con enlace a la guía de diferencias.

> `analisis/auditoria-convenios/2026-08-20/deterministas/convenio-metal-barcelona.json:None` — "al_kit": []
> `convenio-metal-barcelona.html:344` — <strong>2026</strong>: +3% sobre las tablas de 2025 · efectos 1 de enero de 2026

**Parche propuesto:** Añadir tras la línea 345, dentro del cronograma de subidas, el puente en el punto exacto de la necesidad —el párrafo acaba de decir que el +3% tiene efectos desde el 1 de enero de 2026 aunque el convenio se publicó en febrero, que es cuando nacen los atrasos—: '<p>Las tablas de 2025 se publicaron en febrero de 2026 con efectos retroactivos a enero de 2025: si tus nóminas de ese periodo se pagaron con las tablas viejas, la diferencia es tuya. Compara mes a mes y <a href="/reclamar-diferencias-salariales-convenio.html">reclama la diferencia de las mensualidades no prescritas</a> — el art. 59.2 ET te da un año por cada mensualidad.</p>'

**🟠 6.3 — 1/3**

Es el caso del 1: hay enlaces, pero todos agrupados al final, en la lista 'Convenios relacionados' que abre en la línea 630 de 669, después de la FAQ. En el cuerpo —tablas, complementos, cláusula de garantía, grupos profesionales— no hay ni un enlace interno a otra ficha, y sus 12 internos en cuerpo son el mínimo de las nueve del metal (mediana del corpus 21).

> `analisis/auditoria-convenios/2026-08-20/deterministas/convenio-metal-barcelona.json:None` — "internos_en_cuerpo": 12, "a_hermanas_mismo_sector": 1
> `convenio-metal-barcelona.html:630` — <h2>Convenios relacionados</h2>
> `convenio-metal-barcelona.html:632` — <li><a href="/convenio-metal-bizkaia.html">→ Convenio Metal Bizkaia 2026</a> (otro polo industrial con antigüedad activa y IRPF foral)</li>

**Parche propuesto:** Insertar tras la línea 280 (final del bloque de tablas, justo antes del ejemplo de Carla) el párrafo comparativo que ya llevan las otras ocho fichas del metal, ahí porque es el punto donde el lector acaba de ver su cifra y quiere saber si es alta o baja: '<p><strong>Comparación con otras provincias del sector.</strong> El metal de Barcelona publica salario de grupo mensual, como el <a href="/convenio-metal-madrid.html">metal de Madrid</a>; el <a href="/convenio-metal-gipuzkoa.html">de Gipuzkoa</a> lo fija por valor hora y el <a href="/convenio-metal-valencia.html">de Valencia</a> añade una tercera paga en marzo, de 17 días, que no existe aquí.</p>'. Segundo enlace, en la línea 449 del bloque de complementos ad personam (Art. 38): '…el mismo modelo de antigüedad congelada que el <a href="/convenio-metal-zaragoza.html">metal de Zaragoza</a>, frente al <a href="/convenio-metal-bizkaia.html">de Bizkaia</a>, que mantiene quinquenios sin tope.'

**🟠 6.4 — 1/3**

Enlaza a una sola hermana (Bizkaia) de las nueve disponibles, y la dirección de misma provincia deja fuera a su gemela confundible: convenio-comercio-metal-barcelona.html existe, la enlaza a ella cuatro veces desde el cuerpo, y no recibe nada a cambio. Además cuela como 'relacionado' un convenio de otra provincia (Construcción Bizkaia) desde una ficha de Barcelona. Madrid, Zaragoza y Navarra sí advierten en prosa de esa confusión aunque no tengan a quién enlazar; Barcelona, que sí lo tiene, ni advierte ni enlaza.

> `analisis/auditoria-convenios/2026-08-20/deterministas/convenio-metal-barcelona.json:None` — "a_hermanas_mismo_sector": 1, "a_otro_sector_misma_provincia": ["/convenio-construccion-bizkaia.html","/convenio-hosteleria-barcelona.html","/convenio-limpieza-barcelona.html"]
> `convenio-metal-barcelona.html:633` — <li><a href="/convenio-construccion-bizkaia.html">→ Convenio Construcción Bizkaia 2026</a> (sector industrial vasco)</li>

**Parche propuesto:** Añadir en la sección de ámbito, y no en la lista final, la desambiguación que hoy falta —ahí porque es donde el lector que se ha equivocado de convenio todavía está leyendo—: '<p>Si tu empresa <strong>vende</strong> material metálico al público (ferretería, tienda de recambios, joyería) y no lo fabrica ni lo repara, no te aplica este convenio sino el <a href="/convenio-comercio-metal-barcelona.html">convenio del comercio del metal de Barcelona</a>.</p>'. Y en la lista de la línea 636 sustituir el enlace a Construcción Bizkaia por hermanas reales del sector: '<li><a href="/convenio-metal-valencia.html">→ Convenio Metal Valencia 2026</a> (misma estructura de grupos, con paga de marzo)</li>'.

**🟢 6.5 — 2/3**

Sin anchors genéricos: los seis dicen sector, provincia y año ('→ Convenio Metal Bizkaia 2026') y el paréntesis que los sigue explica la relación. No es 3 porque la explicación queda fuera del anchor y porque el propio anchor no está redactado para ningún contexto: es el rótulo de una lista.

> `analisis/auditoria-convenios/2026-08-20/deterministas/convenio-metal-barcelona.json:None` — "anchors_genericos": []
> `convenio-metal-barcelona.html:635` — <li><a href="/convenio-hosteleria-barcelona.html">→ Convenio Hostelería Barcelona 2026</a> (misma provincia, otro sector)</li>

**🔵 6.2 — 3/3**

22 entrantes desde 12 páginas, cuarto valor del corpus (mediana 10): la enlazan ocho hermanas del metal, el hub, la home, el mapa y —esto es lo que la distingue— cuatro veces desde el cuerpo de convenio-comercio-metal-barcelona.html, con anclas que dicen sector y provincia.

> `analisis/auditoria-convenios/2026-08-20/deterministas/convenio-metal-barcelona.json:None` — "entrantes_n": 22, "entrantes_desde": ["convenio-comercio-metal-barcelona.html","convenio-metal-alava.html","convenio-metal-asturias.html","convenio-metal-gipuzkoa.html","convenio-metal-madrid.html","convenio-metal-navarra.html","convenio-metal-sevilla.html","convenio-metal-valencia.html","convenio-
> `convenio-comercio-metal-barcelona.html:369` — <a href="/convenio-metal-barcelona.html">Metal industrial de Barcelona</a>

> Barcelona es el nodo más citado del clúster y a la vez el que menos devuelve: recibe 22 enlaces y reparte 12 internos en cuerpo, todos desde una lista final. Es la ficha del metal que más se aleja del patrón del sector (le faltan el párrafo comparativo y la sección de reclamación que llevan las otras ocho), probablemente porque se redactó con otra plantilla.

### E6 · Forma y lectura

**🔴 8.3 — 0/3**

Tres ideas distintas contadas dos y tres veces cada una, siempre de cuerpo a cuerpo, no de cuerpo a FAQ. La cláusula de garantía IPC del Art. 43 se narra completa en la nota editorial, otra vez completa en su propia sección y una tercera en el cajón final. El servicio de retén y guardia tiene sección propia con la distinción entre las dos figuras y esa misma distinción reaparece entera en la FAQ. Y los complementos «ad personam» se explican en el pie del ejemplo de Carla, se vuelven a explicar en una pregunta de la FAQ sobre antigüedad y se explican por tercera vez en otra pregunta dedicada al Art. 38. Es el caso extremo del cluster: 4.511 palabras de prosa, la cifra más alta de las nueve fichas, sostenidas en buena parte por repetición.

> `convenio-metal-barcelona.html:221` — Cláusula de garantía IPC : si al 31-dic-2027 el INE constata inflaciones acumuladas > 10%, revisión técnica sobre tablas 2027 aplicable el 1-ene-2028 por la diferencia — sin efectos retroactivos.
> `convenio-metal-barcelona.html:350` — Cláusula de garantía salarial (Art. 43). Si el Instituto Nacional de Estadística (INE) constata oficialmente que, al 31 de diciembre de 2027, la suma de las inflaciones de los años 2025, 2026 y 2027 fuese superior al 10,00% , se efectuará una revisión técnica sobre las tablas de 2027
> `convenio-metal-barcelona.html:434` — Este tiempo NO se considera trabajo efectivo — solo lo es el tiempo dedicado a la prestación requerida. Pero la adscripción tiene compensación económica denominada "servicio retén" .

**Parche propuesto:** Tres cortes concretos. (1) Garantía IPC: dejar el desarrollo solo en su sección (línea 350) y reducir la línea 221 de la nota editorial a «<strong>Subida 2025-2027.</strong> +10% acumulado en tres años: +4% en 2025, +3% en 2026 y +3% en 2027, con <a href="#historia">cláusula de garantía IPC</a> al cierre de 2027.»; el cajón de novedades desaparece con el parche de 8.1. (2) Retén y guardia: borrar la pregunta «¿Qué diferencia hay entre servicio de retén y servicio de guardia?» de la FAQ visible y del JSON-LD, o dejarla en dos líneas que remitan a la sección. (3) Ad personam: fundir las preguntas «¿Se aplica antigüedad? ¿Y quién cobra los complementos "ex"?» y «¿Qué son los "complementos ad personam" del Art. 38?» en una sola, que empiece por la definición y siga con los tres complementos concretos.

**🟠 7.8 — 1/3**

Contenido propio le sobra —retén y guardia, bilingüismo castellano-catalán del Art. 84, 20 h/año de acompañamiento oncológico, sometimiento al Tribunal Laboral de Catalunya—, pero no sigue el canon: le faltan tres piezas que las ocho hermanas del cluster sí tienen y que el lector usa (el bloque «¿Cobras menos de lo que fija tu grupo?» con los pasos para reclamar, la tarjeta de «Recursos oficiales y sindicales» y el callout «Comparación con otras provincias del sector», presente en 7 de las 9 fichas de metal). Es el caso exacto del 1: aporta lo suyo a costa de no seguir el patrón. Y su rasgo más singular, el bilingüismo obligatorio en los avisos de empresa, está enterrado en la última pregunta de la FAQ. No penalizo aquí la ausencia del bloque «Quién audita esto»: ya bloquea como hard-fail determinista 2.2.

> `convenio-metal-barcelona.html:624` — ¿Hay bilingüismo en las comunicaciones de la empresa?
> `convenio-metal-barcelona.html:625` — El Art. 84 del Capítulo XI establece que todos los anuncios o avisos en las empresas deberán redactarse en castellano y en catalán . Es una obligación específica del convenio siderometalúrgico de Barcelona.
> `convenio-metal-asturias.html:504` — Recursos oficiales y sindicales

**Parche propuesto:** Añadir antes de la FAQ los dos bloques canónicos que faltan, clonando la estructura de metal-asturias: (1) «<h2>¿Cobras menos de lo que fija tu grupo?</h2>» con los cinco pasos adaptados a Cataluña (identificar grupo del Anexo 14 → comparar con la tabla 2026 → pedir nómina detallada por escrito, art. 29.1 ET → Comisión Paritaria o conciliación previa obligatoria ante el Tribunal Laboral de Catalunya, Art. 87 → plazo de un año por mensualidad, art. 59.2 ET); y (2) «<h2>Recursos oficiales y sindicales</h2>» con las tarjetas de BOPB, REGCON 08002545011994, UPM, CCOO Indústria + UGT-FICA, SMI 2026 y convenios del metal comparables. Y subir el bilingüismo del Art. 84 de la FAQ al cuerpo, como sub-bloque de «Novedades destacables sobre el ET».

**🟠 8.1 — 1/3**

Sobra «Novedades destacables sobre el ET»: el rótulo promete un contraste con el Estatuto y lo que entrega es un resumen de la propia ficha. Comprobado viñeta a viñeta, once de sus doce líneas ya están desarrolladas más arriba en la misma página —garantía IPC (350), complemento de AT desde el día 1 (397), bolsa de 80 h (372), 20 h de acompañamiento oncológico y 12 h de libre disposición (421-422), retén y guardia (428-440), reincorporación tras excedencia (535), TLC (553), 0,19 €/km (314), teletrabajo a 1,69 €/día (326) y los complementos ad personam (293)—. En una ficha que ya es la más larga del cluster en prosa, es el bloque que un lector no echaría de menos.

> `convenio-metal-barcelona.html:563` — Novedades destacables sobre el ET
> `convenio-metal-barcelona.html:566` — Cláusula garantía IPC única para todo el cuatrienio: si suma inflaciones 2025-2027 > 10%, revisión aplicable enero 2028 (Art. 43).
> `convenio-metal-barcelona.html:350` — Cláusula de garantía salarial (Art. 43). Si el Instituto Nacional de Estadística (INE) constata oficialmente que, al 31 de diciembre de 2027, la suma de las inflaciones de los años 2025, 2026 y 2027 fuese superior al 10,00%

**Parche propuesto:** Eliminar el <h2 id="novedades"> y su lista completa, y su entrada «Novedades sobre el ET ·» del índice. La única viñeta sin desarrollo previo —«Suplencias por causas internas o sobrevenidas reguladas: hasta 90 días laborables por persona trabajadora/año (Art. 55)»— pasa a la sección «Contratación, formación y ceses» como sub-bloque: «<h3>Suplencias (Art. 55)</h3><p>El convenio limita las suplencias por causas internas o sobrevenidas a 90 días laborables por persona trabajadora y año.</p>». El hueco del índice lo ocupa el nuevo bloque «Cómo reclamar ·» propuesto en 7.8.

**🟠 12.3 — 1/3**

Es el esqueleto que más se aleja del cluster. Comparada con convenio-metal-sevilla (23 encabezados, 16 h2, 6 h3) y con las siete hermanas que comparten plantilla, esta ficha tiene 41 encabezados y 23 h3, y su secuencia no es la del corpus: no hay h2 de ámbito («¿Este convenio te cubre?» vive como pregunta de la FAQ), no hay bloque de reclamar, no hay tarjeta de recursos oficiales y sindicales, no hay callout comparativo con otras provincias —que sí tienen 7 de las 9 fichas de metal— y en su lugar aparecen cuatro secciones que ninguna hermana tiene (excedencias, contratación y ceses, comisiones y protocolos, novedades sobre el ET). El resultado es una ficha que parece un resumen del articulado más que una ficha de tablas. No penalizo aquí la ausencia del bloque de autoría: ya bloquea como hard-fail determinista 2.2.

> `convenio-metal-barcelona.html:504` — Contratación, formación y ceses
> `convenio-metal-barcelona.html:526` — Excedencias — Art. 68
> `convenio-metal-barcelona.html:544` — Comisiones paritarias y protocolos

**Parche propuesto:** Reordenar sin reescribir: mover «Contratación, formación y ceses» y «Excedencias» detrás de la FAQ, como bloque «Contratación, excedencias y ceses» de segundo nivel de interés; fundir «Comisiones paritarias y protocolos» en el nuevo bloque de reclamar propuesto en 7.8; y suprimir «Novedades destacables sobre el ET» (parche de 8.1). Con eso la ficha baja de 17 a 13 h2 y recupera la secuencia del cluster: tabla → complementos → subida → jornada → bajas → licencias → grupos → reclamar → recursos → FAQ → fuentes → quién audita.

**🟠 12.6 — 1/3**

La ficha llama «cuatrienio» a un periodo de tres años, y lo hace en el rótulo de una sección y en el cuerpo de la cláusula, mientras el card de datos clave y la propia nota editorial dicen «3 años» y «tres años» para lo mismo. Un lector que vea «Subida cuatrienal +10%» cuenta cuatro anualidades y busca la cuarta subida, que no existe. A eso se suma que la magnitud de la tabla se rotula «Salario Conv./mes» en la cabecera, «Salario Convenio/mes» en el pie de fuente y «salario mensual bruto de convenio» en el texto que la introduce.

> `convenio-metal-barcelona.html:206` — <dt>Vigencia</dt><dd>2025-2027 (3 años)</dd>
> `convenio-metal-barcelona.html:338` — Subida cuatrienal +10% y cláusula de garantía IPC
> `convenio-metal-barcelona.html:350` — Esta cláusula es de naturaleza transitoria para el cuatrienio 2025-2027.

**Parche propuesto:** Sustituir «cuatrienio» por «trienio» en sus tres apariciones: el h2 pasa a «<h2 id="historia">Subida trienal +10% y cláusula de garantía IPC</h2>», la línea 350 termina «Esta cláusula es de naturaleza transitoria para el trienio 2025-2027.» y la nota editorial abre «<strong>Subida trienal 2025-2027.</strong>». Actualizar también la entrada del índice «Subida cuatrienal +10% ·». En la tabla, unificar la cabecera y el pie en «Salario convenio/mes».

**🟢 8.2 — 2/3**

El arranque es el mejor del cluster: el h1 lleva la horquilla mensual y la tabla salarial es el primer h2 de la ficha, sin ninguna sección de contexto por delante — cosa que ninguna de las ocho hermanas hace. No llega a 3 porque la pieza que hace legible esa tabla, la descripción de los 7 grupos profesionales con su titulación y sus puestos típicos, está en el puesto 12 de los 17 h2, unas 200 líneas más abajo: quien no sepa en qué grupo está tiene que atravesar complementos, jornada, bajas, licencias, retén y guardia para averiguarlo, y volver.

> `convenio-metal-barcelona.html:168` — Convenio Metal Barcelona 2026: de 1.980 € a 2.578 € al mes con +3% aplicado enero y garantía IPC
> `convenio-metal-barcelona.html:227` — Tabla salarial 2026 · +3% sobre 2025 (Anexo 1 del BOPB)
> `convenio-metal-barcelona.html:444` — Los 7 grupos profesionales (Anexo 14)

**🟢 8.8 — 2/3**

Plural correcto en el uso: las seis menciones de CCOO y las seis de UGT son de firmantes del convenio, de composición de la Comisión Paritaria o de fuente de las tablas —los tres usos legítimos—, y cuando el texto habla de representación en abstracto usa «RLT» o «Representación Legal de las personas trabajadoras», no las siglas. No es 3 porque la ficha no da ningún dato que sitúe la representatividad en el metal barcelonés, y porque, al no tener tarjeta de recursos sindicales, tampoco ofrece al lector a dónde acudir.

> `convenio-metal-barcelona.html:217` — firmado el 22 de diciembre de 2025 entre la Unió Patronal Metal·lúrgica (UPM) y los sindicatos CCOO Indústria + UGT-FICA
> `convenio-metal-barcelona.html:547` — Composición: 4 personas UPM + 2 CCOO Indústria + 2 UGT-FICA .
> `convenio-metal-barcelona.html:615` — la Dirección de la empresa usuaria debe facilitar a la Representación Legal de las personas trabajadoras (RLT) información sobre cada contrato de puesta a disposición

**🔵 8.6 — 3/3**

Es la ficha del cluster que mejor traduce el tecnicismo a dinero. La cláusula de garantía IPC no solo se define: se resuelve con un caso numérico («si la inflación acumulada resulta ser 12%, la revisión será del 2%»), que es exactamente lo que la métrica pide. Los complementos «ad personam» se explican por lo que implican (no absorbibles, no compensables, revalorizados con el convenio) y no repitiendo el latinajo. Y la distinción retén/guardia —jerga interna del sector que decide si tu tiempo de espera se paga— se explica por sus consecuencias retributivas, no por su definición legal. Ninguna otra ficha de metal cierra un tecnicismo con una cuenta hecha.

> `convenio-metal-barcelona.html:600` — Ejemplo: si la inflación acumulada resulta ser 12%, la revisión aplicable en enero 2028 será del 2%. La revisión NO tiene efectos retroactivos
> `convenio-metal-barcelona.html:620` — NO pueden ser compensadas ni absorbidas, siempre que respondan a una retribución por transacción de derechos, condiciones más beneficiosas, o retribuyan con un plus un concepto concreto y específico
> `convenio-metal-barcelona.html:440` — Este tiempo SÍ se considera trabajo efectivo a efectos de retribución. Se garantiza descanso entre jornadas de 12 horas.

> Capa 0 (no puntuado aquí, ya lo emite el determinista): 28 celdas de tabla en verde —esta ficha y metal-bizkaia son las dos del cluster que incumplen la norma de casa de cifras en tinta neutra—, 4 bloques de más de 100 palabras, 2 tablas sin scope ni caption, y dos hard-fails deterministas ya declarados (2.2 sin bloque de autoría, 7.1 tablas que desbordan en móvil). Fuera de mi eje, para el eje de verdad y frescura: la línea 507 sigue dando el salario del contrato formativo en «1.184,00 €/mes en 14 pagas = 16.576,00 €/año (importe idéntico al SMI 2025)» y añade que para 2026 «se ajustará por la Comisión Paritaria cuando el BOE publique el SMI vigente», cuando el RD 126/2026 ya está publicado y las otras ocho fichas del cluster lo citan; además, es la única de las nueve sin tarjeta de referencia al SMI 2026 y sin el RD entre sus fuentes. La ficha no está en ventana de medición (último commit del 30-jul), así que sus parches son aplicables ya.
