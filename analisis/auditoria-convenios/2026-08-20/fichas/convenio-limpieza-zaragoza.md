# convenio-limpieza-zaragoza

**Score: 71.0/100** · hard-fails: **2**

Sector limpieza · estado `ultraactividad` · 6572 palabras de prosa · boilerplate 0.067 · último cambio hace 21 días
GSC 28d: 124 clics · 2817 impresiones · CTR 4.4% · posición 6.4

## Hard-fails — no se compensan con la nota

- **4.5** (E4) · Dos cifras distintas para el mismo concepto en la misma página, y la discrepante está en la capa que leen las máquinas. El JSON-LD del FAQPage afirma que el plus festivo de jornada corta es de 15,47 €, mientras el cuerpo visible lo fija en 16,49 € en tres sitios independientes (tarjeta de pluses, tabla de complementos y la respuesta visible de esa misma pregunta). El schema quedó sin actualizar cuando se corrigió el cuerpo: un asistente que cite esta ficha devolverá 15,47 €, que la propia página desmiente. Corrección: sustituir en el JSON-LD 'plus festivo (27,50 € si más de 4 horas, 15,47 € si menos)' por 'plus festivo (27,50 € si 4 horas o más, 16,49 € si menos de 4 horas)', igualándolo al texto de la línea 687. Conviene además revisar la misma respuesta del schema, que fecha la antigüedad consolidada 'antes del 31 de diciembre de 1994' mientras el cuerpo dice 'antes del 1 de enero de 1995': el efecto es idéntico, pero la divergencia literal sugiere que el bloque JSON-LD se quedó congelado en una versión anterior de la ficha y merece cotejarse entero, no solo en la cifra.
- **12.2** (determinista) · SMI mal calculado o mal citado — un solo defecto raíz con 5 superficie(s): 12.2 (determinista); 5.7 (E1); 5.7 (E1); 12.1 (E2); 5.7 (E3)

## Ejes

**Cuello de botella: E6 (42.0% de su peso).** Es por donde empieza el arreglo.

| eje | | puntos | peso |
|---|---|---|---|
| E1 | Verdad demostrada | 17.1 | 22 |
| E2 | Singularidad y ventaja | 20.8 | 22 |
| E3 | Respuesta al trabajador | 14.7 | 20 |
| E4 | Captación y citabilidad | 7.8 | 14 |
| E5 | Enlazado y clúster | 6.4 | 12 |
| E6 | Forma y lectura | 4.2 | 10 |

### E1 · Verdad demostrada

**🔴 5.10 — 0/3**

El JSON determinista da enlaces.externos_oficiales = [] y el HTML lo confirma: la sección 'Fuentes oficiales' identifica boletín, número, fecha, edicto y artículo, pero no hay ni un enlace clicable; incluso el dominio del BOPZ aparece como texto plano seguido de la promesa de 'verificación independiente' que el lector no puede ejecutar con un clic.

> `convenio-limpieza-zaragoza.html:657` — <strong>Boletín Oficial de la Provincia de Zaragoza (BOPZ)</strong> — bop.dpz.es — para consulta y verificación independiente.
> `convenio-limpieza-zaragoza.html:648` — <strong>BOPZ Núm. 71, miércoles 29 de marzo de 2023</strong> — Resolución del Director General de Trabajo del Gobierno de Aragón que dispone el registro, depósito y publicación del Convenio Colectivo del Sector de Limpieza de Edificios y Locales de Zaragoza para los años 2022-2025. Edicto 806228.

**Parche propuesto:** Enlazar lo que ya está escrito: BOPZ nº 71 de 29-III-2023, edicto 806228, al PDF del edicto en bop.dpz.es, y el código 50000755011981 a https://expinterweb.mites.gob.es/regcon/ — este segundo es especialmente necesario porque toda la sección 'Histórico de renovaciones' se presenta como resultado de consultar el REGCON y hoy el lector no puede repetir esa consulta.

**🟢 9.1 — 2/3**

Fecha concreta y coherente: 3-jun-2026 es posterior al único boletín que la ficha cita (BOPZ 71 de 29-III-2023) y a la denuncia de 2-oct-2025 que determina su estado. No llega a 3 porque el bloque de autoría no dice qué se cotejó: repite el boilerplate genérico sin nombrar el BOPZ ni el edicto, a diferencia de Metal Sevilla.

> `convenio-limpieza-zaragoza.html:215` — <strong>✓ Verificado</strong> contra BOPZ Núm. 71/2023 por SalarioJusto · última revisión 3 de junio de 2026
> `convenio-limpieza-zaragoza.html:721` — Esta ficha de convenio ha sido cruzada manualmente contra el texto íntegro del boletín oficial por el equipo de SalarioJusto.

**🔵 2.1 — 3/3**

Construye desde el REGCON un histórico de renovaciones que no está en ningún boletín y lo usa para pronosticar cuándo llegará el convenio siguiente, y separa cláusulas normativas de obligacionales para explicar qué sobrevive exactamente a la ultraactividad. Es análisis propio, con su método a la vista y su fuente declarada.

> `convenio-limpieza-zaragoza.html:592` — El convenio de Limpieza de Zaragoza tiene un patrón de renovación muy útil para anticipar cuándo aparecerá el próximo texto. Mirando el REGCON (código 50000755011981):
> `convenio-limpieza-zaragoza.html:708` — El Art. 39 del convenio provincial lista las divisiones funcionales <em>a título enunciativo</em> (Especialista, Peón Especializado Conductor/Limpiador, Limpiador/a), pero <strong>la Cláusula Adicional 5.ª remite la clasificación profesional al I Convenio Estatal de Limpieza de Edificios y Locales</

**🔵 5.8 — 3/3**

No solo condiciona sus afirmaciones con artículo: dedica una sección entera al caso límite que más aparece en la práctica —el descuelgue del Art. 34, es decir cuándo una empresa puede legalmente no aplicar el convenio— y explica qué lo hace nulo. Es la advertencia que falta en el resto del piloto.

> `convenio-limpieza-zaragoza.html:573` — Si tu empresa intenta aplicarte un descuelgue sin haber pasado este procedimiento completo, la inaplicación es <strong>nula</strong> y puedes exigir las diferencias retroactivas mediante reclamación.
> `convenio-limpieza-zaragoza.html:702` — Si tu empresa pretende inaplicar alguna cláusula, debe seguir el procedimiento del Art. 34 (descuelgue) con periodo de consultas y autoridad laboral; cualquier rebaja unilateral es nula y reclamable.

**🔵 5.11 — 3/3**

Distingue sin ambigüedad tres capas temporales: la tabla 2025 como vigente en 2026, las dos mejoras con efecto diferido a 2026 y el histórico de convenios anteriores con sus fechas. Además fecha también los pluses, que es donde las fichas hermanas de limpieza dejan las cuantías flotando.

> `convenio-limpieza-zaragoza.html:336` — <h2 id="pluses">Pluses y complementos extrasalariales (tabla 2025)</h2>
> `convenio-limpieza-zaragoza.html:313` — <h2 id="cláusulas-diferidas">Cláusulas diferidas que entran en vigor en 2026</h2>

**🔵 9.2 — 3/3**

Es la única ficha del piloto que convierte la caducidad en un pronóstico comprobable: dice qué pasará (nuevo convenio), cuándo es razonable esperarlo, con qué base histórica, y qué NO va a pasar mientras tanto (las tablas no se actualizan solas). El lector sabe cuándo debe volver a mirar.

> `convenio-limpieza-zaragoza.html:603` — <td class="cat">Convenio 2026+ (en negociación)</td><td>Probable Q1-Q2 2027</td><td>A determinar</td><td>—</td><td>Si se repite el patrón: publicación entre <strong>febrero y abril de 2027</strong></td>
> `convenio-limpieza-zaragoza.html:609` — Mientras tanto, las tablas salariales <strong>NO se actualizan automáticamente</strong> en ultraactividad: la tabla 2025 (Anexo I del convenio actual) sigue siendo la vigente hasta que se publique el nuevo convenio o se acuerden actualizaciones provisionales en la mesa de negociación.

> Sin ventana de medición abierta (ultimo_commit 2026-07-30, 21 días): los parches son aplicables ya. Ficha con la mejor arquitectura de verdad del piloto en todo lo que no toca al SMI —histórico predictivo, normativas vs obligacionales, descuelgue, pluses fechados— y con el error de SMI incrustado justamente en su afirmación más vendida, la del hero. Corregir 16.576 → 17.094 obliga a rehacer el recuento del titular (pasa de '1 de 19' a al menos '2 de 19'), a reescribir el callout de la línea 260 y la nota de la 311, y a revisar la comparación con Bizkaia (0/24) que se apoya en el mismo umbral. Fuera de mi eje: la afirmación 'Junto con Bizkaia, Zaragoza tiene uno de los mejores ratios cumplimiento-SMI' entra en riesgo de 12.1 (contradicción entre fichas) si Bizkaia se calculó con el SMI correcto.

### E2 · Singularidad y ventaja

**🟢 10.2 — 2/3**

hay ventaja identificable sobre la cifra pelada —el ratio de cumplimiento del mínimo legal y la previsión honesta de cuándo llegará el nuevo texto—, pero lo mejor de la ficha (aeropuerto, histórico) queda muy por debajo del pliegue; el hero solo promete tabla y estado.

> `convenio-limpieza-zaragoza.html:705` — No hay fecha cierta. Lo que sabemos es que la mesa negociadora está abierta desde la denuncia del 2-oct-2025 y que <strong>el patrón histórico apunta a entre 12 y 24 meses</strong>.
> `convenio-limpieza-zaragoza.html:207` — Subrogación robusta Art. 29 con cláusula especial para limpieza de aviones del Aeropuerto. Solo 1 de 19 categorías queda bajo SMI 2026.

**🔵 3.2/3.3 — 3/3**

palabras_prosa 6567, la mayor del piloto, con ratio_tabla 0.094: la prosa no rodea la tabla sino que explica por qué la tabla de 2025 sigue siendo la de 2026, cómo conviven 19 categorías con las 3 del articulado y qué cifras se mueven en enero; sin ella la tabla se leería como caducada.

> `convenio-limpieza-zaragoza.html:708` — El Art. 39 del convenio provincial lista las divisiones funcionales <em>a título enunciativo</em> (Especialista, Peón Especializado Conductor/Limpiador, Limpiador/a), pero <strong>la Cláusula Adicional 5.ª remite la clasificación profesional al I Convenio Estatal</strong>
> `convenio-limpieza-zaragoza.html:609` — las tablas salariales <strong>NO se actualizan automáticamente</strong> en ultraactividad: la tabla 2025 (Anexo I del convenio actual) sigue siendo la vigente

**🔵 3.4 — 3/3**

frases_exclusivas 236 de 253 y hay hechos que costaron trabajo: los coeficientes de ponderación de aviones, el ejemplo trabajado de subrogación parcial y el histórico de denuncias con los meses transcurridos no se obtienen cambiando el topónimo, se obtienen leyendo el Art. 29 completo y el REGCON del convenio anterior.

> `convenio-limpieza-zaragoza.html:472` — Los aviones se ponderan por tamaño con una tabla de coeficientes (un avión clase 4A pesa 0,32; uno clase 91 pesa 2,65) para que un Boeing 747 no cuente lo mismo que una avioneta pequeña.
> `convenio-limpieza-zaragoza.html:602` — <td>29 marzo 2023</td><td>1-I-2022 → 31-XII-2025</td><td>2 octubre 2025 (CCOO)</td><td><strong>17 meses</strong> tras la denuncia del anterior</td>

**🔵 3.5 — 3/3**

faq_clonadas 4 de faq_total 7: tres preguntas son propias y una de ellas no puede existir en ninguna otra ficha porque nace de una contradicción interna del texto zaragozano entre el Anexo I y el Art. 39.

> `convenio-limpieza-zaragoza.html:707` — ¿Por qué hay 19 categorías en tabla y solo 3 en el Art. 39?
> `convenio-limpieza-zaragoza.html:704` — ¿Cuándo se publicará el nuevo convenio de Limpieza de Zaragoza?

**🔵 8.4 — 3/3**

la particularidad provincial (el Aeropuerto de Zaragoza y la rotación de contratas de limpieza de aviones) no se menciona: se explica con la fórmula del convenio, se ilustra con un caso resuelto y se declara excepcional en el sector, ocupando una sección propia.

> `convenio-limpieza-zaragoza.html:472` — <strong>Cláusula especial — Limpieza de aviones en el Aeropuerto de Zaragoza:</strong> dado el carácter rotatorio de las contratas con compañías aéreas y operadores de handling en el aeropuerto, el Art. 29 establece una fórmula específica de subrogación basada en el porcentaje de actividad perdida
> `convenio-limpieza-zaragoza.html:479` — Aproximadamente <strong>8 de los 20 limpiadores/as pasan a empresa B</strong> con todas sus condiciones intactas (antigüedad, categoría, horario, vacaciones devengadas).

**🔵 10.1 — 3/3**

el BOPZ 71/2023 no dice qué pasa hoy con ese texto; la ficha añade dos cosas que ningún boletín tiene: qué cláusulas sobreviven a la ultraactividad y una previsión de calendario del próximo convenio construida sobre el historial de denuncias.

> `convenio-limpieza-zaragoza.html:603` — Si se repite el patrón: publicación entre <strong>febrero y abril de 2027</strong>
> `convenio-limpieza-zaragoza.html:314` — estas dos mejoras eran cláusulas normativas con efecto diferido pactado en el propio texto del convenio. Por tanto se aplican plenamente en 2026 pese a la denuncia

*Descartadas por el verificador:* `3.1` (El hallazgo afirma que «las 8 frases_compartidas_top … no son cromo: son el bloque ¿Cobras menos?». Falso por dos vías. (1) Tres de esas ocho frases no pertenecen a ese bloque sino a la firma E-E-A-T («no somos un bufete…», «verificamos cifra a cifra…», «esta ficha ha sido cruzada manualmente…»), que es exactamente la metodología que la rúbrica llama cromo legítimo. (2) La propia rúbrica de E2 clasifica «cómo reclamar» como cromo inevitable y advierte de no penalizarlo. Además el ratio es 0,067, de los más bajos del piloto, y el párrafo plantillado va localizado (CCOO 2-oct-2025, SAMA, Art. 34). Lo único real que queda —que ese bloque repite lo que la ficha ya explica mejor en §ultraactividad— ya lo cubre E6 en 8.3 como redundancia interna, no como boilerplate.)

> Ventana cerrada (ultimo_commit 2026-07-30, 21 días): los parches son aplicables. Dos apuntes. El primero, de contenido: la ficha explota el aeropuerto y deja fuera la otra particularidad económica de la provincia, la plataforma logística PLAZA —el mayor recinto logístico del sur de Europa, con naves de gran superficie cuya limpieza se contrata y recontrata con la misma rotación que las aéreas—. Si el Art. 29 no la contempla expresamente, decirlo también vale: el lector que limpia en PLAZA necesita saber si su caso cae en la regla general de los 4 meses o en la fórmula proporcional. El segundo, para otro eje: la respuesta de la FAQ '¿Está vigente el convenio de Zaragoza en 2026?' (línea 690) termina truncada a mitad de frase, '...el nuevo convenio se publicó el 2', y esa FAQ está en el schema.

### E3 · Respuesta al trabajador

**🟠 1.1 — 1/3** · *matizado por el verificador*

Lo primero que ve el lector es un preámbulo jurídico: quién denunció el convenio, en qué fecha, qué número de registro tiene y cuántas horas de jornada quedan. Hay cifras arriba —el determinista las detecta con año y fuente— pero ninguna es un salario. La primera cantidad de dinero aparece muy por debajo, y la cifra del puesto que trae al 90% del tráfico (Limpiador/a) exige bajar hasta la tabla. Es exactamente el defecto que la métrica castiga: la ficha antepone su propia complejidad a la pregunta del lector.

> `convenio-limpieza-zaragoza.html:206` — Convenio de Limpieza de Edificios y Locales — Zaragoza
> `convenio-limpieza-zaragoza.html:207` — Convenio 2022-2025 denunciado por CCOO el 2-oct-2025 (REGCON 50000755011981); desde el 1 de enero de 2026 está en ultraactividad .
> `convenio-limpieza-zaragoza.html:301` — Limpiador/a 37,20 €/día 16.926,95 € 1,49 €/día

**Parche propuesto:** Reescribir la entradilla (línea 207) anteponiendo la cifra al estado jurídico: «Una limpiadora en Zaragoza cobra 37,20 €/día de salario base — 16.926,95 € brutos al año, unos 1.410 €/mes si se prorratean las pagas extras (tabla 2025, Anexo I del convenio, BOPZ núm. 71 de 29-III-2023). Esa tabla sigue siendo la vigente en 2026: el convenio 2022-2025 fue denunciado por CCOO el 2-oct-2025 y está en ultraactividad, lo que significa que tu empresa no puede pagarte menos mientras no se firme uno nuevo.» El detalle registral (REGCON, cláusulas diferidas, comparativa) baja al bloque de datos clave, donde ya está.

**🟢 1.2 — 2/3**

Responde 6 de las 8 preguntas de una limpiadora zaragozana: si el convenio sigue vigente y si le pueden bajar el sueldo, cuánto se paga el festivo (27,50 € / 16,49 €), si le toca antigüedad a los 6 años —y la respuesta dura y bien dada es que no, si entró después de 1995—, si la subrogan al cambiar la contrata, si está bajo el SMI y qué hacer si cobra de menos. Dos sin responder: (1) «¿cuánto es al mes?» — el Grupo IV va en €/día y en bruto anual, y no hay ninguna cifra mensual para la categoría más buscada, al contrario que en la ficha hermana de Asturias, que sí publica la columna de 12 pagas prorrateadas; (2) «trabajo 4 horas al día, ¿cuánto me corresponde?» — la tabla es de jornada completa y lo único que se prorratea explícitamente es el plus de transporte. Aviso: la respuesta sobre el SMI está dada pero contra una cifra equivocada (ver hardfails).

> `convenio-limpieza-zaragoza.html:344` — Más de 4 horas trabajadas: 27,50 €/día . Menos de 4 horas: 16,49 €/día .
> `convenio-limpieza-zaragoza.html:696` — Personal contratado a partir de esa fecha no devenga ningún tipo de antigüedad: el complemento fue desactivado para nuevos contratos.
> `convenio-limpieza-zaragoza.html:340` — Jornada completa: 6,09 €/día efectivo trabajado. Jornada parcial: 2,96 €/día con cuantía mínima.

**🟢 1.9 — 2/3**

Gestiona el hueco con más ambición que nadie: explica qué es la ultraactividad, separa cláusulas normativas de obligacionales, dice qué se cobra mientras dura, publica el histórico de renovaciones del convenio y hasta se moja con una ventana de publicación probable para el nuevo texto. Todo eso es camino de salida de primera. No llega a 3 por el mismo motivo que Asturias: el suelo que ofrece no es el real. Presenta 16.576 €/año como SMI 2026 cuando el vigente es 17.094 € (1.221 €/mes en 14 pagas), y sobre esa cifra construye la conclusión tranquilizadora de que solo una categoría queda por debajo.

> `convenio-limpieza-zaragoza.html:589` — Lo que esto significa en tu nómina hoy: mientras dure la ultraactividad, tu salario, jornada, vacaciones, pluses y subrogación se rigen por las cláusulas del convenio 2022-2025 como si éste siguiera vigente.
> `convenio-limpieza-zaragoza.html:705` — No hay fecha cierta. Lo que sabemos es que la mesa negociadora está abierta desde la denuncia del 2-oct-2025 y que el patrón histórico apunta a entre 12 y 24 meses .
> `convenio-limpieza-zaragoza.html:311` — La categoría de Aprendiz queda bajo el SMI 2026 (16.576 €/año).

**🔵 1.3 — 3/3**

Es el mejor camino de salida del piloto y por un motivo concreto: además de los pasos habituales (verificar la tabla, exigir la nómina desglosada por el art. 29.1 ET, papeleta ante el SAMA, un año por mensualidad, paritaria, Inspección y sindicatos), dedica una sección entera al descuelgue del Art. 34 —que aquí sí es el artículo real del convenio de Zaragoza— y le da al lector el criterio para saber si el intento de su empresa es válido o nulo: qué materias se pueden inaplicar, los 15 días de consultas, los 7 días de la paritaria, el arbitraje del SAMA y la conclusión de que sin ese procedimiento la rebaja es nula y las diferencias son reclamables con retroactividad. Ninguna otra ficha convierte la amenaza real —que la empresa te baje el sueldo alegando la crisis— en una lista de comprobación. Le falta solo la plantilla: el determinista registra un único enlace al kit.

> `convenio-limpieza-zaragoza.html:573` — Si tu empresa intenta aplicarte un descuelgue sin haber pasado este procedimiento completo, la inaplicación es nula y puedes exigir las diferencias retroactivas mediante reclamación.
> `convenio-limpieza-zaragoza.html:567` — Periodo de consultas con la representación durante un máximo de 15 días , con entrega de la documentación que justifica las causas.
> `convenio-limpieza-zaragoza.html:625` — Tienes 1 año por mensualidad de plazo desde que debió pagarse (art. 59.2 ET). Presentar papeleta de conciliación interrumpe el plazo y es gratuito.

**🔵 1.4 — 3/3**

Resuelve la autoubicación mejor que ninguna otra ficha del corpus en el eje que más cuesta: no se limita a listar los grupos, sino que explica para qué sirve saber el tuyo, señala que Limpiador/a y Peón comparten fila salarial pero no clasificación, y —esto es lo que no hace nadie más— pone precio a la reclasificación: si haces funciones de Especialista y te pagan de Limpiador/a, son 2,20 €/día, 1.007,29 € al año. Convierte una duda administrativa en una cantidad reclamable. Se queda sin ámbito funcional escrito (no dice qué actividades cubre), pero lo compensa remitiendo la definición jurídica de cada categoría al convenio estatal por la Cláusula Adicional 5.ª.

> `convenio-limpieza-zaragoza.html:432` — Si tu nómina pone una categoría inferior a las funciones que realmente desempeñas, puedes reclamar la diferencia y la reclasificación.
> `convenio-limpieza-zaragoza.html:453` — Si te contratan como Limpiador/a pero llevas funciones de Especialista (manejo de equipos de mayor potencia, peligrosidad, conducción), puedes reclamar la subida a Especialista (+ 2,20 €/día = + 1.007,29 €/año).
> `convenio-limpieza-zaragoza.html:449` — 8 categorías en €/día con 3 niveles funcionales: Nivel I (Limpiador/a, Peón, Ayudante — tareas básicas), Nivel II (Especialista, Peón Especialista, Conductor/Limpiador — especialización o peligrosidad)

*Descartadas por el verificador:* `1.6` (El hallazgo dice que la nómina «se nombra mucho pero nunca se explica la correspondencia» y que «no se ofrece la cifra en el formato en el que la nómina llega». Está en otra sección: las líneas 418-428 hacen exactamente esa traducción para el puesto principal (bruto anual ÷ 15 pagas = 1.128,46 € por paga, con el desglose de las 12 mensualidades y las 3 extras y el aviso de prorrateo). La línea 385 explica además qué conceptos van separados en el recibo y cuáles no cotizan, y la 432 avisa del error de categoría en nómina. Eso es al menos el ancla 2 de la rúbrica («se explica la correspondencia»), con el aviso de prorrateo del ancla 3. Agravante: el parche propuesto es incorrecto y metería un dato falso en la ficha — propone una columna «€/mes = bruto anual ÷ 12 = 1.410,58 €» cuando el bruto anual de este convenio se compone de 15 pagas (Art. 17, tres extras), de modo que la nómina mensual real es 1.128,46 €. Es justo el fallo contra el que existe la norma de casa de contar las pagas antes de dividir.)

> LAS 8 PREGUNTAS QUE TECLEARÍA UNA LIMPIADORA ZARAGOZANA ANTES DE LLEGAR AQUÍ (mismo juego que en Asturias, para que las dos fichas del sector sean comparables): (1) «¿cuánto cobra una limpiadora en Zaragoza al mes en 2026?»; (2) «el convenio está caducado, ¿me pueden bajar el sueldo?»; (3) «he trabajado el festivo, ¿cuánto me tienen que pagar?»; (4) «llevo 6 años, ¿me toca antigüedad?»; (5) «cambia la empresa de la contrata, ¿me quedo sin trabajo?»; (6) «trabajo 4 horas al día, ¿cuánto me corresponde?»; (7) «¿estoy cobrando por debajo del SMI?»; (8) «cobro menos que la tabla, ¿qué hago y hasta cuándo puedo reclamar?». RECORRIDO: responde 2, 3, 4, 5, 7 y 8; falla en 1 y 6. — Zaragoza es la ficha más desequilibrada del piloto: tiene los dos mejores bloques del corpus en su eje (el descuelgue del Art. 34 y la clasificación con el precio de la reclasificación puesto en euros) y a la vez es la única en la que la limpiadora no encuentra su sueldo mensual en ninguna parte. Todo el trabajo está hecho para un lector que ya sabe leer un convenio; para el que llega con la nómina, la puerta de entrada es un párrafo sobre quién presentó la denuncia y con qué número de registro. Anoto un detalle ajeno a mi eje: en la línea 453 hay un anglicismo colado en el texto publicado («lo cual matters cuando reclamas»). VENTANA CERRADA: 21 días desde el último commit, así que los dos parches (entradilla con la cifra y columna €/mes + bloque de nómina) son aplicables ya, igual que la corrección del SMI.

### E4 · Captación y citabilidad

**🟠 2.4 — 1/3** · *matizado por el verificador*

Tiene sector, provincia y año, pero ninguna cifra de salario (el determinista confirma seo.title_tiene_euro=false: las cifras que lleva son horas de jornada) y a 106 caracteres se corta muy por debajo de la mitad. En el SERP el usuario ve aproximadamente 'Convenio Limpieza Zaragoza 2026 (denunciado · ultraactividad): tab…', es decir, dos tecnicismos jurídicos entre paréntesis en lugar de lo que ha venido a buscar. El h1 tampoco compensa: no lleva año ni cifra.

> `convenio-limpieza-zaragoza.html:6` — <title>Convenio Limpieza Zaragoza 2026 (denunciado · ultraactividad): tabla 2025 + jornada 1.766 h | SalarioJusto</title>
> `convenio-limpieza-zaragoza.html:206` — <h1>Convenio de <em>Limpieza de Edificios y Locales</em> — Zaragoza</h1>

**Parche propuesto:** {'descripcion': 'Meter la cifra y sacar la jerga del recorte. Todas las cifras propuestas están publicadas en la ficha (líneas 301 y 687): Limpiador/a 37,20 €/día · 16.926,95 €/año · jornada 1.766 h.', 'alternativas': [{'id': 'A', 'title': 'Limpieza Zaragoza 2026: limpiadora 16.926,95 €/año (tabla 2025)', 'longitud': 62, 'por_que': "Cifra + puesto + provincia + año dentro del recorte, y el paréntesis explica la rareza (por qué la tabla es de 2025) sin usar la palabra 'ultraactividad', que en el SERP asusta más que informa."}, {'id': 'B', 'title': 'Limpiadora Zaragoza 2026: 37,20 €/día — tablas del convenio', 'longitud': 58, 'por_que': 'Usa la unidad literal del convenio, que es la que aparece en la nómina de la persona operaria. Máxima coincidencia con quien va a comprobar su recibo.'}, {'id': 'C', 'title': 'Convenio Limpieza Zaragoza 2026: tabla, 1.766 h y 23 días', 'longitud': 57, 'por_que': 'Conserva la apuesta actual (jornada y vacaciones como gancho) pero cabe entera y añade el segundo dato diferencial. Es la variante conservadora si no se quiere tocar el ángulo.'}], 'nota_de_ejecucion': 'AVISO IMPORTANTE: con 4,4% de CTR a posición 6,40 esta ficha es la de mejor rendimiento del piloto — casi tres veces el CTR de Asturias con posición equivalente. La nota 1 es de forma (title cortado y sin cifra), no de resultado. NO aplicar el rewrite a ciegas: probar una variante y estar dispuesto a revertir. Merece más la pena entender por qué funciona el actual que sustituirlo.'}

**🟠 2.5 — 1/3**

377 caracteres, la más larga del piloto: se corta a menos de la mitad y lo que sobrevive al recorte es 'denunciado por CCOO el 2-oct-2025 (REGCON 50000755011981)', un código de registro donde debería ir el motivo para entrar. La cifra de salario no aparece en ningún punto de la meta, y los datos que sí engancharían —jornada que baja a 1.766 h, vacaciones a 23 días, solo 1 de 19 categorías bajo SMI— quedan todos fuera.

> `convenio-limpieza-zaragoza.html:7` — <meta name="description" content="Convenio de Limpieza de Edificios y Locales de Zaragoza: denunciado por CCOO el 2-oct-2025 (REGCON 50000755011981); en ultraactividad desde 1-ene-2026 con tabla salarial 2025 vigente (+3,5% sobre 2024), jornada que baja a 1.766 h y vacaciones a 23 días laborales por

**Parche propuesto:** {'descripcion': 'Cifra delante, jerga fuera, traza dentro del recorte. 157 caracteres.', 'texto_propuesto': 'Limpiador/a 37,20 €/día — 16.926,95 € brutos al año. La tabla 2025 sigue vigente en 2026, con jornada de 1.766 h y 23 días de vacaciones. BOPZ 71/2023.'}

**🟢 4.1 — 2/3**

La frase de la FAQ es de las mejores del corpus: sujeto, cifra, unidad, anual, año de la tabla, año de aplicación, causa de la prórroga y contraste con el SMI, todo en una unidad. Le falta lo mismo que a Asturias para el 3: la palabra 'Zaragoza' vive en el h3, no en la frase, así que arrancada de la página deja de estar territorializada.

> `convenio-limpieza-zaragoza.html:687` — Según la tabla salarial 2025 del convenio (vigente en 2026 en ultraactividad tras la denuncia de CCOO el 2-oct-2025), la categoría de Limpiador/a percibe 37,20 €/día de salario base, equivalente a <strong>16.926,95 € de bruto anual</strong> conforme al cálculo del propio convenio. Está apenas 350,95
> `convenio-limpieza-zaragoza.html:686` — <h3>¿Cuál es el salario de una persona limpiadora en Zaragoza en 2026?</h3>

**🟢 4.2 — 2/3**

El dato es extraíble sin reconstruirlo: la tabla da salario base y bruto anual en la misma fila, con la unidad dentro de la celda ('37,20 €/día'), y las tarjetas de pluses exponen cada cuantía con su unidad. Se queda en 2 porque falta el periodo en los encabezados y, sobre todo, porque el €/mes —la unidad en que la gente piensa su sueldo— no existe en ninguna parte de la ficha para las categorías operarias: quien quiera saber lo que cobra al mes tiene que dividir 16.926,95 entre lo que suponga. Asturias resuelve exactamente ese hueco con una columna dedicada.

> `convenio-limpieza-zaragoza.html:272` — <th class="num">SB 2025</th>
> `convenio-limpieza-zaragoza.html:301` — <tr class="highlight"><td class="cat">Limpiador/a</td><td class="num">37,20 €/día</td><td class="sal">16.926,95 €</td><td class="num">1,49 €/día</td></tr>

**🟢 4.3 — 2/3**

Los tres aparecen donde importa —el h3 de la FAQ pone provincia y año, la frase pone el año de la tabla y el año de aplicación— y además la ficha separa con cuidado el ámbito provincial del estatal al explicar por qué hay 19 categorías en tabla y 3 en el articulado. No llega a 3 porque la tabla, que es la unidad más citada, no lleva ni provincia ni sector en ningún encabezado.

> `convenio-limpieza-zaragoza.html:708` — El Art. 39 del convenio provincial lista las divisiones funcionales <em>a título enunciativo</em> (Especialista, Peón Especializado Conductor/Limpiador, Limpiador/a), pero <strong>la Cláusula Adicional 5.ª remite la clasificación profesional al I Convenio Estatal de Limpieza de Edificios y Locales</
> `convenio-limpieza-zaragoza.html:269` — <thead>
        <tr>
          <th>Categoría</th>
          <th class="num">SB 2025</th>
          <th class="num">Bruto anual 2025</th>

**🟢 4.4 — 2/3**

La traza acompaña a la tabla —el párrafo inmediatamente anterior cita anexo, boletín, número y fecha— y las secciones largas llevan su artículo en el h2. Pero no baja al nivel de cada cuantía: las tarjetas de pluses, que concentran las cifras más consultadas después de la tabla, no llevan artículo en el título, a diferencia de Asturias, que sí lo hace en la misma sección.

> `convenio-limpieza-zaragoza.html:264` — Cuantías vigentes desde el 1 de enero de 2025, publicadas como Anexo I del convenio en el BOPZ Núm. 71 del 29 de marzo de 2023.
> `convenio-limpieza-zaragoza.html:343` — <div class="pill-card-title">Plus festivo</div>
> `convenio-limpieza-zaragoza.html:339` — <div class="pill-card-title">Plus de transporte</div>

> Ventana cerrada (ultimo_commit 2026-07-30, 21 días): los parches se pueden ejecutar. El hard-fail 4.5 es el hallazgo importante de esta ficha y es de mi eje por dónde vive: no es un error de contenido —el cuerpo está bien tres veces— sino un desfase entre el HTML visible y el JSON-LD, es decir, exactamente en el canal por el que un motor de IA cita. Recomiendo comprobar si el mismo desfase existe en las demás fichas del corpus: la coincidencia palabra a palabra entre el schema y el cuerpo en Asturias sugiere que allí se actualizaron a la vez, pero conviene una pasada automática que compare las cifras del FAQPage con las del cuerpo en las 50+ fichas. Paradoja que el sintetizador debería tener en cuenta al ponderar E4: Zaragoza saca las peores notas de forma en title y meta del piloto y a la vez el mejor CTR real (4,4% a posición 6,40, contra 1,73% a 6,33 de Asturias). Mi lectura es que aquí manda la composición de la demanda, no la redacción: si el bloque de consultas de Zaragoza es más específico y de menor competencia, un title feo bien posicionado gana clics igual. Fuera de mi eje: el determinista declara un hard-fail 12.2 por el SMI 2026 (16.576 € frente a 17.094 €), que afecta al '350,95 € por encima del SMI' de la línea 687 y al '1 de 19 categorías bajo SMI' del title y la meta — si esa cifra cambia, el recuento de categorías bajo SMI cambia con ella y hay que rehacer el parche de meta antes de publicarlo.

### E5 · Enlazado y clúster

**🟠 6.3 — 1/3** · *matizado por el verificador*

Las ocho hermanas están apiladas en el bloque final; en las 765 líneas del archivo el único enlace de orientación dentro de la prosa es el de la guía de reclamación, y aparece cuando el procedimiento ya ha terminado. La ficha recibe contexto de fuera pero no lo reparte desde dentro.

> `convenio-limpieza-zaragoza.html:729` — <li><a href="/convenio-limpieza-edificios-locales.html">← Pilar estatal: Convenio de Limpieza de Edificios y Locales</a></li>
> `convenio-limpieza-zaragoza.html:717` — <p>Los sindicatos firmantes — CCOO Hábitat, UGT-FeSMC y OSTA — siguen siendo válidos para asesoría durante la ultraactividad. Código REGCON: <code style="font-family:monospace;font-size:13px;">50000755011981</code>. <a href="/reclamar-diferencias-salariales-convenio.html">Guía completa para reclamar

**Parche propuesto:** Llevar dos de esos ocho enlaces al cuerpo: en la línea 311, donde se explica el complemento a cuenta del SMI, contrastar con «en <a href="/convenio-limpieza-bizkaia.html">Bizkaia</a> ninguna categoría queda por debajo porque la jornada es de 35 h»; y en la línea 385, al hablar de combinabilidad de pluses, contrastar con la provincia que los regula de otro modo. Van ahí porque son los dos puntos en que el texto ya está comparando y el lector no tiene adónde ir.

**🟠 6.4 — 1/3**

a_hermanas_mismo_sector=8 (novena del corpus) pero a_otro_sector_misma_provincia=[] teniendo dos vecinas provinciales en el corpus: convenio-hosteleria-zaragoza.html — que sí la enlaza a ella — y convenio-metal-zaragoza.html. Una sola dirección, y la que falta es la del lector que se ha equivocado de sector.

> `analisis/auditoria-convenios/2026-08-20/deterministas/convenio-limpieza-zaragoza.json:270` — "a_otro_sector_misma_provincia": [],
> `analisis/auditoria-convenios/2026-08-20/deterministas/convenio-limpieza-zaragoza.json:284` — "entrantes_desde": [

**Parche propuesto:** Añadir en el bloque de la línea 737, con contexto: <li>¿Limpias en un hotel, un bar o una fábrica de Zaragoza? Comprueba antes si te aplica el <a href="/convenio-hosteleria-zaragoza.html">convenio de Hostelería de Zaragoza</a> o el del <a href="/convenio-metal-zaragoza.html">Metal de Zaragoza</a>: la limpieza de un centro solo se rige por este convenio cuando la hace una contrata especializada.</li>. Va ahí por proximidad al resto de convenios, aunque su sitio natural sería el arranque de la ficha.

**🟠 6.6 — 1/3**

al_kit=1 y es la guía, al cierre de la sección. Y la ficha desaprovecha el mejor momento del piloto: la línea que dice que Aprendiz queda bajo el SMI y que la empresa debe abonar la diferencia mediante complemento no enlaza plantilla-reclamar-absorcion-complementos-smi.html, que existe en la raíz y solo se enlaza desde 1 de las 54 fichas.

> `convenio-limpieza-zaragoza.html:311` — <p style="font-size:12.5px;color:var(--ink-lighter);">⚠ La categoría de <strong>Aprendiz</strong> queda bajo el SMI 2026 (16.576 €/año). El Art. 27.1 del Estatuto de los Trabajadores impone el SMI como suelo absoluto, por lo que en la práctica la empresa debe abonar la diferencia mediante un complem
> `convenio-limpieza-zaragoza.html:717` — <p>Los sindicatos firmantes — CCOO Hábitat, UGT-FeSMC y OSTA — siguen siendo válidos para asesoría durante la ultraactividad. Código REGCON: <code style="font-family:monospace;font-size:13px;">50000755011981</code>. <a href="/reclamar-diferencias-salariales-convenio.html">Guía completa para reclamar

**Parche propuesto:** En la línea 311, tras «la empresa debe abonar la diferencia mediante un complemento a cuenta del SMI», añadir: «Si tu nómina no lo refleja, reclámalo con la <a href="/plantilla-reclamar-absorcion-complementos-smi.html">plantilla de absorción de complementos por el SMI</a>: pide la diferencia de los últimos 12 meses, mes a mes.» Va exactamente en esa frase porque es donde el lector descubre que le falta dinero; en la lista final ya se ha ido.

**🟢 6.5 — 2/3**

anchors_genericos=[] y las anclas llevan el rasgo que distingue cada destino. No es 3 porque es el mismo bloque literal de Asturias, Murcia, Las Palmas y Bizkaia — cinco fichas con la misma lista en el mismo orden — y porque el ancla que le falta es de contexto, no de catálogo.

> `convenio-limpieza-zaragoza.html:730` — <li><a href="/convenio-limpieza-madrid.html">Convenio Limpieza Madrid (en ultraactividad)</a></li>
> `convenio-limpieza-zaragoza.html:736` — <li><a href="/convenio-limpieza-bizkaia.html">Convenio Limpieza Bizkaia (jornada 35 h)</a></li>

**🔵 6.2 — 3/3**

entrantes_n=12 con la mayor variedad de tipos de origen del piloto: hub, mapa, home, salarios, el pilar estatal, dos hermanas, guias.html — solo 6 de las 54 fichas reciben enlace de guias.html — y convenio-hosteleria-zaragoza.html, es decir otro sector de su misma provincia. Y las anclas entrantes son descriptivas y distintas entre sí ('Convenio Limpieza Zaragoza (prorrogado 2026)', 'Zaragoza Tabla 2025 · prorrogado 2026 (Art. 5) · jornada 1.766 h').

> `analisis/auditoria-convenios/2026-08-20/deterministas/convenio-limpieza-zaragoza.json:284` — "entrantes_desde": [

> Zaragoza es la mejor receptora del piloto y una de las peores emisoras contextuales: 12 entrantes variados frente a cero enlaces a hermanas dentro de la prosa. Es la prueba de que el clúster de limpieza está tejido a nivel de listas y no de argumento. Fuera de mi eje: el determinista ya marca 12.2 por el SMI de 16.576 € presentado como el de 2026; el parche de 6.6 depende de que esa cifra se corrija a 17.094 €, porque cambia qué categorías quedan bajo el mínimo.

### E6 · Forma y lectura

**🔴 7.2 — 0/3** · *matizado por el verificador*

La hoja de estilo pinta en verde la columna «Bruto anual 2025», que es la cifra salarial principal de la ficha, en las diecinueve filas de la tabla. Es la misma regla que arrastra limpieza-asturias y la contraria a la de metal-sevilla, metal-barcelona y metal-bizkaia. tablas.verde_en_tablas viene en 0 porque el recolector busca el color en el atributo style de la celda y aquí va en la clase, pero el resultado en pantalla es el mismo: el verde señala dinero en vez de señalar verificación.

> `convenio-limpieza-zaragoza.html:157` — td.sal{font-weight:700;color:var(--green);text-align:right;white-space:nowrap;}
> `convenio-limpieza-zaragoza.html:301` — <tr class="highlight"><td class="cat">Limpiador/a</td><td class="num">37,20 €/día</td><td class="sal">16.926,95 €</td>
> `convenio-metal-sevilla.html:150` — td.sal{font-weight:700;color:var(--ink);text-align:right;white-space:nowrap;}

**Parche propuesto:** Cambiar la regla de la línea 157 a «td.sal{font-weight:700;color:var(--ink);text-align:right;white-space:nowrap;}», idéntica a la de metal-sevilla. La fila destacada (tr.highlight) ya distingue a Limpiador/a sin necesidad de color, y el sello de la línea 214 se queda como único verde con significado.

**🔴 7.4 — 0/3**

Es la ficha más densa del piloto: parrafos.largos_100 lista once párrafos de más de cien palabras, incluido uno de 189 en las FAQ, y ese recuento ni siquiera incluye el bloque de apertura, que es un <div> y por tanto escapa al contador. Ese callout inicial mete en una sola masa la denuncia, el Art. 5, la distinción normativas/obligacionales, las dos mejoras diferidas, por qué no hay subida y el histórico de la negociación anterior. No hay nota editorial fragmentada ni ninguna otra puerta de entrada troceada.

> `convenio-limpieza-zaragoza.html:256` — <strong>Convenio denunciado por CCOO el 2-oct-2025; en ultraactividad desde el 1 de enero de 2026.</strong> El periodo formal 2022-2025 finalizó el 31 de diciembre de 2025. El Art. 5 establecía prórroga anual automática si ninguna parte lo denunciaba en la última semana de septiembre
> `convenio-limpieza-zaragoza.html:690` — El convenio firmado el 15 de febrero de 2023 entre ASPEL, ASOAL, CCOO, UGT y OSTA tenía periodo formal del 1 de enero de 2022 al 31 de diciembre de 2025.

**Parche propuesto:** Sustituir el callout de las líneas 255-257 por una nota editorial fragmentada al modo de metal-sevilla, dejando el desarrollo largo en la sección de ultraactividad que ya existe: «<div class="nota-editorial"><p style="margin-bottom:10px;"><strong>En 30 segundos · Qué es.</strong> El convenio de Limpieza de Edificios y Locales de la provincia de Zaragoza (REGCON 50000755011981), firmado el 15 de febrero de 2023 por ASPEL y ASOAL con CCOO, UGT y OSTA.</p><p style="margin-bottom:10px;"><strong>Estructura.</strong> 19 categorías, tres pagas extras al año (Art. 17) y jornada que baja a 1.766 h en 2026 por una mejora pactada con efecto diferido.</p><p style="margin-bottom:10px;"><strong>Vigencia.</strong> CCOO denunció el convenio el 2 de octubre de 2025, así que la prórroga automática del Art. 5 no operó: desde el 1 de enero de 2026 está en ultraactividad y la tabla 2025 sigue siendo la que te tienen que pagar. → <a href="#ultraactividad">Qué significa eso en tu nómina ↓</a></p><p style="margin:0;"><strong>Futuro.</strong> La mesa está abierta. El convenio anterior tardó unos 17 meses desde la denuncia hasta publicarse el nuevo.</p></div>». Y recortar la FAQ de la línea 690 a tres frases, remitiendo a esa sección.

**🔴 8.3 — 0/3**

La misma explicación —denuncia de CCOO, Art. 5 que no opera, cláusulas normativas que siguen y obligacionales que decaen, mejoras diferidas de 1.766 h y 23 días— se cuenta entera tres veces en la misma página: en el callout de apertura, en la sección dedicada a la ultraactividad y en la FAQ. Y una cuarta, resumida, en la lista de particularidades. Ninguna de las cuatro añade nada a la anterior.

> `convenio-limpieza-zaragoza.html:256` — Desde el 1 de enero de 2026 el convenio está en ultraactividad: las cláusulas normativas siguen vigentes (tabla salarial 2025, pluses, subrogación, jornada y vacaciones por cláusulas diferidas normativas), mientras que las cláusulas obligacionales (paz social, comisión paritaria, la propia prórroga 
> `convenio-limpieza-zaragoza.html:690` — Desde el 1 de enero de 2026 el convenio está en <strong>ultraactividad</strong>: siguen plenamente vigentes las cláusulas normativas — tabla salarial 2025, jornada 1.774 h que baja a 1.766 h por cláusula diferida del Art. 18 … mientras que las cláusulas obligacionales (paz social, comisión paritaria
> `convenio-limpieza-zaragoza.html:613` — <li><strong>Prórroga anual automática (Art. 5) — activada en sentido inverso:</strong> el convenio se prorrogaba anualmente mientras ninguna parte lo denunciase en la última semana de septiembre. CCOO presentó denuncia formal el 2-oct-2025

**Parche propuesto:** Dejar el desarrollo completo solo en la sección «Qué es exactamente la ultraactividad» (línea 575), que es la mejor escrita de las tres. El callout de apertura pasa a la nota editorial fragmentada descrita en el parche de 7.4, con enlace a esa sección. Y la FAQ se recorta a: «Sí, pero en ultraactividad. El convenio 2022-2025 fue denunciado por CCOO el 2 de octubre de 2025, así que la prórroga automática del Art. 5 no llegó a operar. Desde el 1 de enero de 2026 te siguen aplicando la tabla salarial 2025 y el resto de condiciones de trabajo; lo que decae son los pactos entre las partes firmantes. → <a href="#ultraactividad">Qué sobrevive y qué decae, en detalle</a>.»

**🔴 12.6 — 0/3** · *matizado por el verificador*

Dentro de una misma tabla, la misma familia de categorías se escribe de dos maneras: «Limpiador/a» y «Conductor/a-Limpiador/a» en inclusivo y, cuatro filas más abajo, «Peón», «Oficial», «Ayudante» y «Aprendiz» copiados en masculino literal del boletín — con el agravante de que «Peón» y «Limpiador/a» comparten exactamente la misma fila salarial, de modo que el lector ve dos escrituras distintas para dos categorías que cobran igual. En el grupo administrativo pasa lo mismo: «Jefe/a Administrativo/a 1.ª» convive con «Oficial de 1.ª». Es incoherencia terminológica y, a la vez, incumplimiento de la norma de inclusivo en categorías.

> `convenio-limpieza-zaragoza.html:301` — <tr class="highlight"><td class="cat">Limpiador/a</td><td class="num">37,20 €/día</td><td class="sal">16.926,95 €</td>
> `convenio-limpieza-zaragoza.html:304` — <tr><td class="cat">Peón</td><td class="num">37,20 €/día</td><td class="sal">16.926,95 €</td>
> `convenio-limpieza-zaragoza.html:285` — <tr><td class="cat">Oficial de 1.ª</td><td class="num">1.404,05 €/mes</td>

**Parche propuesto:** Desdoblar las seis categorías que quedan en masculino, dejando la tabla coherente consigo misma: «Oficial/a de 1.ª» y «Oficial/a de 2.ª» (líneas 285-286), «Peón/a Especialista» (300), «Oficial/a» (302), «Peón/a» (304) y «Aprendiz» se queda como está por ser epiceno. Con eso, las diecinueve filas siguen el mismo criterio que «Limpiador/a», «Jefe/a Administrativo/a» y «Encargado/a», que ya lo cumplen.

**🟠 8.1 — 1/3** · *matizado por el verificador*

Sobra «Particularidades del convenio»: sus nueve viñetas son un tercer resumen de cosas ya contadas —la denuncia y el Art. 5, las mejoras diferidas, el plus de transporte, la subrogación, la cláusula del aeropuerto, la antigüedad y el Aprendiz bajo SMI—, todas con su sección propia más arriba. Es el cajón de sastre que la ficha no necesita porque ya tiene índice de navegación.

> `convenio-limpieza-zaragoza.html:611` — <h2 id="particularidades">Particularidades del convenio</h2>
> `convenio-limpieza-zaragoza.html:618` — <li><strong>Cláusula especial Aeropuerto:</strong> uno de los pocos convenios provinciales que regulan expresamente la subrogación en limpieza de aviones

**Parche propuesto:** Suprimir el h2 y su lista y la entrada correspondiente del índice. Lo único que no está desarrollado arriba —que el plus de transporte está indexado y escalado año a año desde los 5,60 € de 2022— cabe como una frase al pie de la tabla de pluses de la línea 369: «El plus de transporte está indexado y ha escalado año a año: 5,60 €/día en 2022 y 6,09 €/día en 2025.»

**🟠 11.1 — 1/3**

tablas.sin_th = 0 en las siete tablas, pero sin_scope = 7 y sin_caption = 7. La tabla salarial usa además filas de grupo con colspan («Grupo I · Personal Directivo») que un lector de pantalla anuncia como una celda suelta sin relación con lo que viene debajo: sin scope ni caption, la estructura de grupos profesionales —que es lo que da sentido a la tabla— desaparece al oído.

> `convenio-limpieza-zaragoza.html:271` — <th>Categoría</th>
> `convenio-limpieza-zaragoza.html:279` — <tr class="group-header"><td colspan="4">Grupo I · Personal Directivo</td></tr>

**Parche propuesto:** Poner scope="col" en los cuatro th (líneas 271-274), convertir las celdas de categoría en th scope="row", marcar las filas de grupo como th scope="rowgroup" colspan="4", y abrir la tabla con caption: «<caption style="caption-side:top;text-align:left;font-size:13px;color:var(--ink-light);padding-bottom:8px;">Tabla salarial 2025 del convenio de Limpieza de Zaragoza, vigente en 2026 por ultraactividad: salario base, bruto anual y trienio, agrupados por grupo profesional (Anexo I, BOPZ Núm. 71 de 29-III-2023).</caption>». Repetir el patrón en las seis tablas restantes.

**🟢 7.5 — 2/3**

headings.h1 = 1 y saltos_jerarquia = [], y la mayoría de encabezados dicen algo concreto: «Tres pagas extras al año: el detalle del Art. 17», «Subrogación robusta — Artículo 29», «Descuelgue del convenio: la cláusula de inaplicación (Art. 34)». No llega a 3 porque el h2 de la línea 611 es el rótulo vacío que la norma señala —«Particularidades del convenio» no orienta a nadie— y porque ningún encabezado lleva una cifra en euros, que es lo que se busca.

> `convenio-limpieza-zaragoza.html:400` — <h2 id="pagas-extras">Tres pagas extras al año: el detalle del Art. 17</h2>
> `convenio-limpieza-zaragoza.html:611` — <h2 id="particularidades">Particularidades del convenio</h2>
> `convenio-comercio-madrid.html:316` — Plus de transporte — 96,56 €/mes

**🟢 7.8 — 2/3**

Sigue el canon (sello, índice, datos clave, tabla, pluses, subrogación, comparativa provincial, FAQ, quién audita) y tiene contenido exclusivo de verdad: la cláusula de limpieza de aviones del Aeropuerto de Zaragoza y el histórico de renovaciones como método para anticipar el próximo convenio. No llega a 3 porque ese contenido exclusivo está en la segunda mitad —el histórico en la línea 591 y la cláusula del aeropuerto sepultada dentro de la sección de subrogación—, es decir, después de todo el desarrollo genérico del sector.

> `convenio-limpieza-zaragoza.html:591` — <h2 id="historico">Histórico de renovaciones del convenio (1.ª pista del calendario)</h2>
> `convenio-limpieza-zaragoza.html:472` — Cláusula especial — Limpieza de aviones en el Aeropuerto de Zaragoza: dado el carácter rotatorio de las contratas

**🟢 8.2 — 2/3**

La tabla salarial es el primer h2 de la página y el hero da el estado del convenio antes que nada. No es 3 porque entre el sello y la tabla se interponen dos callouts largos de vigencia y de cumplimiento del SMI, y porque el hero no da ninguna cifra salarial: quien entra buscando cuánto cobra una limpiadora tiene que llegar a la fila destacada de la tabla para encontrarla.

> `convenio-limpieza-zaragoza.html:207` — <p class="hero-sub">Convenio 2022-2025 <strong>denunciado por CCOO el 2-oct-2025</strong> (REGCON 50000755011981); desde el 1 de enero de 2026 está en <strong>ultraactividad</strong>.
> `convenio-limpieza-zaragoza.html:263` — <h2 id="tabla-salarial">Tabla salarial 2025 — categoría a categoría</h2>

**🟢 8.8 — 2/3**

norma.sindicatos da CCOO 20 · UGT 7, un desequilibrio llamativo, pero al leerlo en el HTML se ve que casi todas las menciones de CCOO son del hecho de que fue quien denunció el convenio: uso como fuente del dato, que la norma admite. El plural está bien construido cuando toca —se nombra siempre a los tres firmantes, incluido OSTA, que es el sindicato aragonesista y el que otras fichas se saltarían—. No es 3 porque no se dice qué representación tiene cada uno en el sector en Zaragoza, como sí hace limpieza-asturias.

> `convenio-limpieza-zaragoza.html:256` — La negociación de un nuevo convenio entre patronal (ASPEL, ASOAL) y sindicatos (CCOO, UGT, OSTA) está abierta
> `convenio-limpieza-zaragoza.html:251` — <div class="stat-value" style="font-size:13px;">Patronal: ASPEL + ASOAL · Sindical: CCOO + UGT + OSTA</div>

**🟢 12.3 — 2/3**

El esqueleto es el mismo que el de limpieza-asturias, la ficha hermana de sector, y el del canon: sello, índice, datos clave, tabla, pluses, pagas, subrogación, comparativa provincial, recursos, FAQ y firma. La única pieza que no tiene ninguna otra ficha del piloto es el histórico de renovaciones, y no es una desviación del esqueleto sino una sección añadida en su sitio.

> `convenio-limpieza-zaragoza.html:660` — <h2 id="comparativa">Comparativa con otros convenios provinciales de Limpieza</h2>
> `convenio-limpieza-asturias.html:464` — <h2>Comparativa con otros convenios provinciales de Limpieza</h2>

**🔵 8.6 — 3/3**

Es la mejor explicación de jerga del piloto y la única que dedica una sección entera a un término: distingue prórroga de ultraactividad, separa cláusulas normativas de obligacionales en dos tarjetas enfrentadas y remata con un párrafo titulado «Lo que esto significa en tu nómina hoy», que es exactamente traducir el tecnicismo a bolsillo. jerga da explicacion_cerca = true en los cinco términos detectados.

> `convenio-limpieza-zaragoza.html:576` — La <strong>ultraactividad</strong> es la situación jurídica en la que entra un convenio colectivo cuando termina su vigencia formal sin que se haya firmado uno nuevo. … No es lo mismo que la <em>prórroga</em>: en la prórroga el convenio entero sigue vigente; en la ultraactividad <strong>solo sobrevi
> `convenio-limpieza-zaragoza.html:589` — <p><strong>Lo que esto significa en tu nómina hoy:</strong> mientras dure la ultraactividad, tu salario, jornada, vacaciones, pluses y subrogación se rigen por las cláusulas del convenio 2022-2025 como si éste siguiera vigente.

> Zaragoza es la ficha más lejos del canon del piloto, y no por lo que le falta sino por lo que le sobra: es la que más veces repite lo mismo (la ultraactividad, cuatro veces), la que más párrafos-ladrillo acumula (once por encima de cien palabras) y la única que pinta en verde las diecinueve cifras de bruto anual. Tiene, a la vez, la mejor explicación de jerga del corpus. Si se recorta la repetición y se despinta la tabla, la ficha sube sin escribir una línea nueva. Fuera de mi eje: el recolector marca hard-fail 12.2 por usar 16.576 € como SMI 2026 (el real es 17.094 €), lo que afecta al callout de apertura, a la fila del Aprendiz y a la FAQ; y la comparativa de limpieza-asturias describe a Zaragoza como «Prorrogado Art. 5» con «~14» pagas, en contradicción directa con lo que esta ficha afirma. Lo he declarado como hard-fail 12.1 en el juicio de Asturias, donde está la afirmación errónea.
