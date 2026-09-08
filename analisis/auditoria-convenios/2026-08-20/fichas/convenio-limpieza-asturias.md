# convenio-limpieza-asturias

**Score: 62.2/100** · hard-fails: **5**

Sector limpieza · estado `ultraactividad` · 4120 palabras de prosa · boilerplate 0.099 · último cambio hace 16 días · **ventana de medición abierta**
GSC 28d: 130 clics · 7511 impresiones · CTR 1.73% · posición 6.33

## Hard-fails — no se compensan con la nota

- **5.7** (E1) · Segunda aparición de la misma invención, esta vez presentando el importe como el resultado de un protocolo de verificación propio, lo que agrava el daño reputacional: la página exhibe su método y el método arroja un número que no está en la fuente.
- **4.5** (E2) · Dos códigos REGCON distintos para el mismo convenio en la misma página: 33000735011979 en los datos clave y en fuentes, y 33000635011982 en el bloque de reclamación.
- **4.5** (E3) · Dos códigos REGCON distintos para el mismo convenio en la misma página: 33000735011979 en la tabla de datos clave y en la lista de fuentes oficiales, y 33000635011982 en el bloque de reclamación. Un lector que use el código equivocado para buscar el convenio en el registro del Ministerio no lo encuentra, justo en el momento en que va a reclamar.
- **12.1** (E6) · La tabla comparativa de esta ficha describe a Zaragoza como «Prorrogado Art. 5 + cláusulas diferidas» con «~14*» pagas, y el párrafo de cierre afirma que Asturias y Bizkaia son «los únicos convenios provinciales analizados» con 15 pagas. La ficha de Zaragoza del propio corpus dice lo contrario en las dos cosas: que la prórroga del Art. 5 NO operó porque CCOO denunció el convenio el 2-oct-2025 y está en ultraactividad, y que tiene tres pagas extras al año, es decir 15 pagas. Un lector que siga el enlace entre las dos fichas encuentra dos verdades incompatibles sobre la misma provincia.
- **12.2** (determinista) · SMI mal calculado o mal citado — un solo defecto raíz con 4 superficie(s): 12.2 (determinista); 5.7 (E1); 12.1 (E2); 5.7 (E3)

## Ejes

**Cuello de botella: E6 (42.0% de su peso).** Es por donde empieza el arreglo.

| eje | | puntos | peso |
|---|---|---|---|
| E1 | Verdad demostrada | 9.8 | 22 |
| E2 | Singularidad y ventaja | 18.9 | 22 |
| E3 | Respuesta al trabajador | 14.4 | 20 |
| E4 | Captación y citabilidad | 9.3 | 14 |
| E5 | Enlazado y clúster | 5.6 | 12 |
| E6 | Forma y lectura | 4.2 | 10 |

### E1 · Verdad demostrada

**🔴 5.10 — 0/3**

El JSON determinista da enlaces.externos_oficiales = [] y el HTML lo confirma. La sección 'Fuentes oficiales' es de las más detalladas del corpus —número de BOPA, fecha, número de disposición, artículo y cita literal— pero ni una sola de esas referencias es clicable: hasta el dominio del boletín aparece como texto plano.

> `convenio-limpieza-asturias.html:461` — <strong>Boletín Oficial del Principado de Asturias (BOPA)</strong> — sede.asturias.es/bopa — para consulta y verificación independiente.

**Parche propuesto (APLAZADO: ventana de medición abierta):** Convertir en enlaces las tres referencias que ya están escritas: BOPA nº 146 de 30-VII-2025 (disp. 2025-06251) y BOPA nº 200 de 17-X-2025 (disp. 2025-08297) al PDF de cada disposición en sede.asturias.es/bopa, y el código 33000735011979 a https://expinterweb.mites.gob.es/regcon/. Prioridad alta en la segunda: la ficha declara que el BOPA 200 es 'la tabla salarial vigente' y hoy el lector no tiene forma de llegar a ella con un clic.

**🟠 9.1 — 1/3** · *matizado por el verificador*

La fecha existe y es concreta, pero el sello no cumple su función: certifica contra el BOPA 146/2025, que la propia ficha declara superado por la corrección de errores del BOPA 200. Quien siga el sello aterriza en la tabla equivocada. Y el bloque de autoría es boilerplate: dice 'el boletín oficial' sin nombrarlo, a diferencia de Comercio Madrid y Metal Sevilla.

> `convenio-limpieza-asturias.html:207` — <strong>✓ Verificado</strong> contra BOPA Núm. 146/2025 por SalarioJusto · última revisión 28 de mayo de 2026
> `convenio-limpieza-asturias.html:526` — Esta ficha de convenio ha sido cruzada manualmente contra el texto íntegro del boletín oficial por el equipo de SalarioJusto.

**Parche propuesto (APLAZADO: ventana de medición abierta):** Reescribir el sello para que apunte a la publicación que realmente sostiene la tabla: «✓ Verificado contra el BOPA nº 146 de 30-VII-2025 (texto íntegro, disp. 2025-06251) y la corrección de errores del BOPA nº 200 de 17-X-2025 (disp. 2025-08297, tabla salarial vigente), por SalarioJusto · última revisión [fecha]». Y sustituir el boilerplate de 'Quién audita esto' por la misma mención explícita a las dos disposiciones.

**🟠 9.2 — 1/3** · *matizado por el verificador*

Menciona la vigencia y hasta apunta una fecha de negociación, pero la pista está caducada: anuncia como futuro un hito de febrero de 2026 en una ficha revisada el 28 de mayo de 2026 y nunca dice qué pasó ni qué debe vigilar el lector. La caducidad está mencionada, no anunciada.

> `convenio-limpieza-asturias.html:236` — La negociación del nuevo convenio está prevista para iniciarse la primera semana de febrero de 2026.
> `convenio-limpieza-asturias.html:495` — La negociación del nuevo convenio está prevista para iniciarse la primera semana de febrero de 2026.

**Parche propuesto (APLAZADO: ventana de medición abierta):** Sustituir las dos apariciones por un estado en presente con consecuencia: «La mesa negociadora del convenio 2026 se abrió en febrero de 2026 y a fecha de esta revisión no ha publicado acuerdo. Mientras tanto, la ultraactividad indefinida del Art. 4 mantiene íntegra la tabla 2025 — no hay subida automática. Cuando el nuevo convenio se inscriba en el REGCON (código 33000735011979) y se publique en el BOPA, estas tablas dejarán de ser las vigentes: es la señal a vigilar.»

**🟢 2.1 — 2/3**

Hay trabajo propio visible en varias secciones —el rastreo de la corrección de errores del BOPA 200 sobre el BOPA 146, la columna de prorrateo a 12 pagas y el desmontaje de las búsquedas «35 horas» y «12 pagas»—, pero no llega a 3 porque su análisis estrella, el protocolo A+B, produce un resultado falso (ver hardfail 5.7): lo que el boletín no contiene resulta ser justamente lo que no se sostiene.

> `convenio-limpieza-asturias.html:454` — <strong>BOPA Núm. 200, viernes 17 de octubre de 2025</strong> — Resolución de 3 de octubre de 2025 que rectifica el error material del convenio publicado el 30 de julio, corrigiendo los importes mensuales del Grupo IV de la tabla salarial. Disposición 2025-08297. <strong>Esta es la tabla salarial vi
> `convenio-limpieza-asturias.html:215` — <strong>Tabla 2025 vigente en 2026</strong> por ultraactividad indefinida (Art. 4): de <strong>1.105 €/mes</strong> (categorías ancladas al SMI) a <strong>1.730 €/mes</strong> en 15 pagas

**🟢 5.8 — 2/3**

Las afirmaciones de derecho van ancladas a su artículo y citan literalmente el convenio (Art. 21, Art. 27, Art. 4), y el callout de apertura advierte de las dos confusiones más frecuentes del sector. No llega a 3 porque la advertencia que más importaría —que la garantía del Art. 21 se activa hoy en más categorías de las que la ficha admite— no está, y esa parte va como hardfail.

> `convenio-limpieza-asturias.html:313` — La cláusula expresa de garantía SMI del Art. 21 protege estas categorías frente a cualquier desfase: <em>"Si en algún momento los importes reflejados en las referidas tablas salariales para determinadas categorías profesionales quedasen por debajo de SMI, las empresas quedan obligadas a abonar como 
> `convenio-limpieza-asturias.html:214` — <strong>«12 pagas»:</strong> en realidad son <strong>15</strong> — 12 mensualidades + 3 pagas extras (Verano, Navidad y Beneficios, Art. 27; el Art. 29 habla literalmente de "15 nóminas anuales").

**🟢 5.11 — 2/3**

Cada tabla dice su año y la ficha aclara desde el primer bloque que la tabla 2025 es la que rige en 2026 por ultraactividad, lo que resuelve la ambigüedad principal. No llega a 3 porque el epígrafe de pluses y complementos no lleva año (JSON: 'Pluses y complementos (Arts. 23-26)' entre las secciones_sin_anio) y sus cuantías se leen como atemporales.

> `convenio-limpieza-asturias.html:243` — <h2 id="tabla-salarial">Tabla salarial 2025 — categoría a categoría</h2>
> `convenio-limpieza-asturias.html:224` — <div class="stat-label">Tabla salarial vigente en 2026</div><div class="stat-value">Tabla 2025 prorrogada por ultraactividad (corregida 17-X-2025)</div>

> Ficha en ventana de medición abierta (ultimo_commit 2026-08-04, 16 días), por lo que los parches de forma quedan aplazados — pero el hardfail 5.7 no debería acogerse a ese freno: una cifra falsa de SMI no es una prueba de tracción, y aquí no está en una nota al pie sino en el titular de una sección entera y en la respuesta de una FAQ indexada (línea 492: «Está 789,50 € por encima del SMI 2026 (16.576 €)»), además de en el schema FAQPage. Corregir 16.576 → 17.094 obliga a recalcular los cuatro diferenciales de la tabla de verificación, a cambiar el titular por uno veraz («Tres de cuatro grupos superan el SMI 2026; Aspirante y Botones quedan por debajo y activan la garantía del Art. 21») y a mover el estilo verde de esa columna, porque dejaría de ser un cumplimiento holgado. Al margen de mi eje: el error convierte además la comparativa con otras provincias en no comparable.

### E2 · Singularidad y ventaja

**🟠 3.1 — 1/3** · *matizado por el verificador*

boilerplate_ratio 0.099 es bajo, pero lo compartido no es cromo: de las 8 frases de frases_compartidas_top, seis son la sección '¿Cobras menos?' marcada en el propio HTML como <!-- bp-rotado -->, con doctrina jurídica y un número de artículo de descuelgue plantillados provincia a provincia.

> `convenio-limpieza-asturias.html:516` — Las cláusulas normativas — la tabla salarial, los complementos de puesto, las pagas extras, la subrogación, la jornada, las vacaciones, las protecciones por IT e invalidez — siguen plenamente vigentes y son de obligado cumplimiento.
> `convenio-limpieza-asturias.html:520` — <strong>Si la empresa pretende inaplicar el convenio</strong>, debe seguir el procedimiento de descuelgue (Art. 34) con periodo de consultas y comunicación a SASEC

**Parche propuesto (APLAZADO: ventana de medición abierta):** Sustituir el bloque plantillado (líneas 515-522) por el descuelgue tal como lo regula ESTE convenio, que la propia ficha ya cita en otro sitio: 'Si tu empresa quiere dejar de aplicar la tabla, no puede hacerlo por su cuenta. El convenio asturiano se somete al SASEC (Servicio Asturiano de Solución Extrajudicial de Conflictos, Oviedo), donde se firmó el 14 de julio de 2025, y además la Disposición Adicional 2.ª considera incumplimiento del convenio ofertar por debajo de los costes mínimos que fija cada año la Comisión Paritaria: si la rebaja viene de una contrata ganada a la baja, hay dos vías, la tuya y la de la denuncia a la Paritaria.' Antes de publicarlo, verificar en el BOPA 146/2025 el número real del artículo de inaplicación en Asturias: el '(Art. 34)' actual está copiado del molde y aparece idéntico en 11 fichas de sectores y provincias distintos.

**🟢 3.5 — 2/3**

faq_clonadas 6 de faq_total 6: el molde de preguntas es íntegramente compartido, pero ninguna respuesta es intercambiable —la de antigüedad enumera las categorías de los tres niveles asturianos y la de subrogación cita el telegrama o acta notarial del Art. 18.

> `convenio-limpieza-asturias.html:513` — La empresa saliente debe notificar a la entrante mediante telegrama o acta notarial, con relación nominal y condiciones laborales del personal transferido.
> `convenio-limpieza-asturias.html:510` — Como las pagas anuales son 15, un trienio del Nivel 3 supone <strong>163,50 € anuales</strong> (10,90 × 15)

**🔵 3.2/3.3 — 3/3**

palabras_prosa 4120 con ratio_tabla 0.121: la prosa no rodea la tabla, la hace legible —explica que el bruto sale de ×15 pagas y no de ×14, de dónde sale la columna prorrateada y qué filas cambió la corrección de errores del Grupo IV—; sin ella un salario de 38,59 €/día no se puede comparar con nada.

> `convenio-limpieza-asturias.html:244` — Para categorías con salario diario, se prorratea como SB diario × 30 × 15 = SB diario × 450. La columna <strong>«12 pagas (€/mes prorrateado)»</strong> es el bruto anual ÷ 12
> `convenio-limpieza-asturias.html:214` — Si cobras con las extras <strong>prorrateadas en 12 mensualidades</strong>, una <strong>Limpiador/a percibe 1.447 €/mes</strong> (mismo bruto anual: 17.365,50 €).

**🔵 3.4 — 3/3**

frases_exclusivas 137 de 152 y la exclusividad tiene sustancia: la equiparación con SESPA, los dividendos del cese anticipado y los porcentajes exactos de representación sindical exigieron leer el articulado y el acta de otorgamiento, no cambiar el topónimo.

> `convenio-limpieza-asturias.html:372` — Es una cláusula única del convenio asturiano: limpiar un hospital del SESPA bajo este convenio equivale económicamente a estar en plantilla pública.
> `convenio-limpieza-asturias.html:385` — CCOO Hábitat de Asturias (40,00% de representación social), UGT-FeSMC (43,22%) y <strong>USO Federación de Servicios (14,19%)</strong>

**🔵 8.4 — 3/3**

la particularidad no está mencionada sino que organiza el centro de la ficha: hay un h2 'Particularidades únicas del convenio asturiano' y la equiparación con SESPA se usa además para desmontar el malentendido de las '35 horas' en la primera pantalla.

> `convenio-limpieza-asturias.html:213` — el personal de limpieza de centros sanitarios está equiparado a <strong>SESPA en salario</strong>, y en el sector público asturiano se trabajan 35 h/semana — de ahí la confusión.
> `convenio-limpieza-asturias.html:391` — las ofertas comerciales realizadas por empresas <strong>por debajo de los costes mínimos del convenio</strong> se consideran incumplimiento del propio convenio.

**🔵 10.1 — 3/3**

el BOPA publica una tabla y una corrección de errores en dos edictos distintos: aquí están fusionadas, traducidas a bruto anual y a mensualidad prorrateada, con la verificación A+B contra el mínimo legal que ningún boletín hace.

> `convenio-limpieza-asturias.html:291` — Grupo IV — Personal Subalterno (corregido 17-X-2025)
> `convenio-limpieza-asturias.html:326` — Aspirante Administrativo/a · Botones</td><td class="num">16.576,05 €</td><td class="num" style="color:var(--amber);font-weight:700;">+0,05 € (al límite)

**🔵 10.2 — 3/3**

la ventaja se percibe sin explicarla: antes de cualquier tabla, un bloque nombra la consulta con la que llega el lector desde el agregador ('35 horas', '12 pagas') y le dice por qué esa cifra que ha leído fuera está mal.

> `convenio-limpieza-asturias.html:211` — <strong>¿Buscabas «35 horas» o «12 pagas»? Esto es lo que dice el convenio realmente vigente — y por qué hay confusión.</strong>

> Ventana de medición abierta (ultimo_commit 2026-08-04, 16 días): los parches quedan aplazados salvo los hard-fails, que no son cuestión de nota. El de SMI es el más grave del piloto en esta ficha porque no es un dato suelto: es el eje sobre el que gira la sección 'Verificación A+B' entera y el h2 que afirma que ninguna categoría queda bajo el mínimo. Fuera de mi eje pero anotado: el bloque plantillado de la línea 516 atribuye la denuncia a CCOO 'el octubre de 2025' mientras el resto de la ficha dice que la denuncia fue automática el 30-IX-2025 conforme al Art. 4 — dos relatos del mismo hecho en la misma página, para el eje de veracidad.

### E3 · Respuesta al trabajador

**🟢 1.1 — 2/3**

Hay cifra, año y fuente arriba (el determinista lo confirma) y el sello del BOPA está a la vista. No llega a 3 porque lo que encabeza es el estado jurídico y un rango de 1.105 a 1.730 €/mes, no la cifra del puesto que busca el 90% del tráfico: los 1.447 €/mes de Limpiador/a aparecen de refilón, dentro de un aparte titulado «¿Buscabas 35 horas o 12 pagas?», no como respuesta principal.

> `convenio-limpieza-asturias.html:198` — Convenio de Limpieza de Edificios y Locales 2026 — Principado de Asturias
> `convenio-limpieza-asturias.html:214` — Si cobras con las extras prorrateadas en 12 mensualidades , una Limpiador/a percibe 1.447 €/mes (mismo bruto anual: 17.365,50 €).
> `convenio-limpieza-asturias.html:215` — de 1.105 €/mes (categorías ancladas al SMI) a 1.730 €/mes en 15 pagas

**🟢 1.3 — 2/3**

El camino existe, es local y tiene plazo: verificar la tabla multiplicando, pedir la nómina detallada invocando el art. 29.1 ET, papeleta ante el SASEC, un año por mensualidad, y cuatro vías nombradas (mediación, paritaria, Inspección, sindicatos). No llega a 3 porque falta el documento —el determinista solo registra un enlace al kit, la guía genérica, sin plantilla de reclamación— y porque el bloque final es una plantilla rotada que se contradice con el resto de la ficha: dice que la denuncia la presentó CCOO en octubre de 2025 cuando el cuerpo sostiene que la denuncia fue automática el 30-IX-2025, y remite a un «Art. 34 (descuelgue)» que no consta en el articulado citado del convenio asturiano.

> `convenio-limpieza-asturias.html:430` — Tienes 1 año por mensualidad de plazo desde que debió pagarse (art. 59.2 ET). Presentar papeleta de conciliación interrumpe el plazo y es gratuito.
> `convenio-limpieza-asturias.html:519` — Pide nómina detallada por escrito si los conceptos no aparecen separados. Tu empresa está obligada a entregarla por imperativo del art. 29.1 del Estatuto de los Trabajadores.
> `convenio-limpieza-asturias.html:520` — Si la empresa pretende inaplicar el convenio , debe seguir el procedimiento de descuelgue (Art. 34) con periodo de consultas y comunicación a SASEC

**🟢 1.4 — 2/3**

El lector puede localizar su categoría porque la tabla va agrupada por grupos y con los nombres reconocibles (Limpiador/a, Peón/a, Conductor/a-Limpiador/a), pero no puede saber si el convenio le cubre: la ficha no tiene una sola línea de ámbito funcional. No dice qué actividades entran (limpieza de oficinas, colegios, hospitales, comunidades, industrias) ni qué queda fuera. Lo único parecido a autoubicación es la desambiguación de «35 horas / 12 pagas», que resuelve una confusión de búsqueda, no el encaje del lector.

> `convenio-limpieza-asturias.html:222` — Ámbito territorial Comunidad Autónoma del Principado de Asturias
> `convenio-limpieza-asturias.html:213` — «35 horas»: el personal de limpieza de centros sanitarios está equiparado a SESPA en salario , y en el sector público asturiano se trabajan 35 h/semana — de ahí la confusión.
> `convenio-limpieza-asturias.html:301` — Limpiador/a 38,59 €/día 17.365,50 € 1.447,13 €/mes 10,90 €

**🟢 1.6 — 2/3**

Hace bien la traducción que casi todas fallan: convierte las 15 pagas del convenio a la cifra mensual que el lector tiene delante si se las prorratean, con una columna propia en la tabla, y avisa de que la cifra es bruta y de que el neto sale de la calculadora. No llega a 3 porque no advierte de ningún error típico —el prorrateo se presenta como una forma de cobrar, nunca como algo a comprobar— y no aparece la compensación y absorción, que en limpieza es el mecanismo habitual para tragarse los pluses cuando sube la tabla.

> `convenio-limpieza-asturias.html:244` — La columna «12 pagas (€/mes prorrateado)» es el bruto anual ÷ 12: lo que cobra quien tiene las pagas extras repartidas en 12 mensualidades iguales (mismo bruto anual, distinta forma de cobrarlo) — la cifra que mucha gente busca como "sueldo al mes".
> `convenio-limpieza-asturias.html:313` — Para convertir el bruto anual en salario neto en Asturias , usa la calculadora de SalarioJusto con escala IRPF nacional 2026 .

**🟢 1.9 — 2/3**

Declara el hueco sin disimulo y desde el H1: el convenio venció el 31-XII-2025, la tabla vigente es la de 2025 y explica por qué sigue aplicándose (ultraactividad indefinida pactada del Art. 4, citada en literal). Incluso da la fecha prevista de la nueva negociación. No llega a 3 porque el suelo que ofrece no es el real: presenta 16.576 € como SMI 2026 cuando el vigente es de 17.094 € (1.221 €/mes en 14 pagas), de modo que la red de seguridad que la ficha describe está mal calibrada.

> `convenio-limpieza-asturias.html:236` — una vez denunciado el convenio, y en tanto no se llegue a un acuerdo sobre el nuevo, se entenderá que el contenido íntegro normativo del presente convenio mantiene su vigencia hasta la fecha de la firma del nuevo convenio colectivo
> `convenio-limpieza-asturias.html:316` — B) cruzar el resultado con el SMI 2026 (16.576 € anuales, art. 27.1 ET)

**🔵 1.2 — 3/3**

Responde 7 de las 8 preguntas de una limpiadora asturiana, y varias con cifra: cuánto cobra al mes (1.447 € prorrateado), si el convenio sigue vigente en 2026, cuánto se paga el festivo trabajado (23,28 €/día), cuánta antigüedad le toca a los 6 años (trienios de 10,90 €/paga, con el cálculo anual hecho), qué pasa si cambia la contrata, si cobra por debajo del SMI y qué hacer si cobra de menos. La única que no responde: «trabajo 4 horas al día, ¿cuánto me corresponde?» — la tabla es de jornada completa y en ningún punto se dice que se prorratea; la única mención al tiempo parcial es sobre el derecho de preferencia para ampliar jornada. En un sector donde la parcialidad es la norma, es el hueco más caro. Aviso: la respuesta a «¿estoy bajo el SMI?» está dada, pero con un SMI equivocado (ver hardfails).

> `convenio-limpieza-asturias.html:349` — 23,28 €/día festivo trabajado para jornada completa (≥6h30m hasta el límite legal). Si la jornada es inferior, parte proporcional.
> `convenio-limpieza-asturias.html:510` — Como las pagas anuales son 15, un trienio del Nivel 3 supone 163,50 € anuales (10,90 × 15)
> `convenio-limpieza-asturias.html:425` — Jornada limitada / tiempo parcial: regulación detallada del derecho de preferencia para ampliar jornada antes de contratar nuevo personal (Art. 20).

> LAS 8 PREGUNTAS QUE TECLEARÍA UNA LIMPIADORA ASTURIANA ANTES DE LLEGAR AQUÍ: (1) «¿cuánto cobra una limpiadora en Asturias al mes en 2026?»; (2) «el convenio está caducado, ¿me pueden bajar el sueldo?»; (3) «he trabajado el festivo, ¿cuánto me tienen que pagar?»; (4) «llevo 6 años, ¿me toca antigüedad y cuánto?»; (5) «cambia la empresa de la contrata, ¿me quedo sin trabajo?»; (6) «trabajo 4 horas al día, ¿cuánto me corresponde de esa tabla?»; (7) «¿estoy cobrando por debajo del SMI?»; (8) «cobro menos que la tabla, ¿qué hago y hasta cuándo puedo reclamar?». RECORRIDO: responde 1, 2, 3, 4, 5, 7 y 8; falla en 6. — Es, con Valencia, la ficha con mejor cobertura de las seis, y la única que resuelve de oficio la traducción de 15 pagas a la cifra mensual que la persona tiene en la nómina: esa columna «12 pagas (€/mes prorrateado)» es el hallazgo replicable del piloto y debería copiarse a Zaragoza, que no la tiene. Su fallo es de otro orden: responde la pregunta 7 con seguridad y la responde al revés (ver hardfail 5.7). Otras dos incoherencias internas menores, que no puntúo aquí pero conviene anotar: el bloque de reclamación dice que los sindicatos firmantes son «CCOO y UGT-FeSMC» cuando la ficha insiste tres veces en que son tres, con USO, y atribuye la denuncia a CCOO en octubre de 2025 cuando el cuerpo dice que fue automática el 30-IX-2025. Ambas vienen del mismo bloque rotado que en Valencia y Zaragoza. VENTANA ABIERTA: 16 días desde el último commit; ningún parche redactado en este eje, pero las correcciones del SMI y del código REGCON son de verdad, no de forma, y no deberían esperar a que cierre la ventana.

### E4 · Captación y citabilidad

**🟠 2.4 — 1/3** · *matizado por el verificador*

El title tiene los cuatro ingredientes de la fórmula (cifra + sector + provincia + año) y cabe sin cortarse, pero no cumple su función: la cifra viaja huérfana de puesto —desde el rewrite del 4-ago se eliminó 'Limpiador/a', que llevaban las tres versiones anteriores— y además es un prorrateo en 12 pagas de un convenio que paga en 15, de modo que la persona que busca no reconoce ese número en su nómina (su base es 38,59 €/día). Con 7.511 impresiones y CTR 1,73% a posición media 6,33, y un histórico de 1,23% a posición 6,16 en el corte de junio, es el peor rendimiento del piloto con la mejor posición: presencia sin función.

> `convenio-limpieza-asturias.html:6` — <title>1.447 €/mes: tablas salariales Limpieza Asturias 2026</title>
> `convenio-limpieza-asturias.html:244` — La columna <strong>«12 pagas (€/mes prorrateado)»</strong> es el bruto anual ÷ 12: lo que cobra quien tiene las pagas extras repartidas en 12 mensualidades iguales (mismo bruto anual, distinta forma de cobrarlo) — la cifra que mucha gente busca como "sueldo al mes".
> `convenio-limpieza-asturias.html:197` — <div class="hero-badge">Vigente en 2026 · Tabla 2025 prorrogada por ultraactividad · 15 pagas</div>

**Parche propuesto (APLAZADO: ventana de medición abierta):** {'descripcion': 'Devolver el puesto al title y desactivar la trampa del prorrateo. Todas las cifras propuestas están publicadas en la propia ficha (línea 244 y tabla salarial: Limpiador/a 38,59 €/día · 17.365,50 €/año · 1.447,13 €/mes prorrateado en 12). Tres alternativas, en orden de recomendación:', 'alternativas': [{'id': 'A', 'title': 'Limpiadora Asturias 2026: 1.447 €/mes (extras prorrateadas)', 'longitud': 59, 'por_que': "Restaura el sujeto —'limpiadora' es el término de búsqueda real del sector, no 'Limpieza'— y desarma en el propio title la objeción que hoy mata el clic: quien cobra 1.157 €/mes al mes entiende de dónde sale el 1.447 antes de entrar. Mantiene la cifra al frente, que es la parte del title actual que sí funciona."}, {'id': 'B', 'title': 'Limpieza Asturias 2026: limpiadora 17.365 €/año en 15 pagas', 'longitud': 59, 'por_que': 'Ancla en la única cifra que no admite discusión en un convenio de 15 pagas: el bruto anual. Elimina de raíz el desajuste con la nómina y captura la consulta de quien compara con el SMI. Es la variante más segura si se quiere dejar de apostar por el €/mes.'}, {'id': 'C', 'title': 'Limpieza Asturias 2026: 15 pagas y 1.447 €/mes — tablas', 'longitud': 55, 'por_que': 'Pone delante la singularidad que la ficha posee y ninguna competidora tiene (tres pagas extras, 15 anuales; solo Bizkaia comparte estructura según la comparativa de la línea 464). Es la variante de mayor techo y mayor riesgo: gana clic por curiosidad, no por coincidencia literal con la consulta.'}], 'meta_propuesta': 'Limpiador/a: 17.365,50 € brutos al año en 15 pagas — 1.447 €/mes si te prorratean las extras. Tabla 2025 vigente en 2026. Ojo: 38,5 h/sem, no 35. BOPA 146/2025.', 'nota_de_ejecucion': 'Probar una sola variante por vez y esperar recrawl completo antes de juzgar. El rewrite del 4-ago (PR #78) ya movió el CTR de 1,23% a 1,73%: la dirección es correcta, el problema es que se soltó el puesto por el camino.'}

**🟠 2.5 — 1/3**

Tiene cifra, pero no da motivo para entrar y encima exporta la ambigüedad: dice 'Limpiador/a 1.447 €/mes (17.365 €/año)' sin el matiz 'con las pagas prorrateadas en 12' que sí llevaban las versiones de junio y julio, en una ficha cuyo propio badge anuncia 15 pagas. Las dos cosas que la página tiene y la competencia no —tres pagas extras y el desmontaje del bulo de las 35 horas— quedaron fuera del recorte del 4-ago.

> `convenio-limpieza-asturias.html:7` — <meta name="description" content="Limpiador/a 1.447 €/mes (17.365 €/año) según el convenio de Limpieza de Asturias. Tablas 2025 vigentes en 2026 por ultraactividad. Jornada 38,5 h/sem.">
> `convenio-limpieza-asturias.html:211` — <strong>¿Buscabas «35 horas» o «12 pagas»? Esto es lo que dice el convenio realmente vigente — y por qué hay confusión.</strong>

**Parche propuesto (APLAZADO: ventana de medición abierta):** {'descripcion': 'Recuperar el gancho que la propia página desarrolla en su primer callout y devolver el matiz del prorrateo. 158 caracteres.', 'texto_propuesto': 'Limpiador/a: 17.365,50 € brutos al año en 15 pagas — 1.447 €/mes si te prorratean las extras. Tabla 2025 vigente en 2026. Ojo: 38,5 h/sem, no 35. BOPA 146/2025.'}

**🟢 4.1 — 2/3**

La frase principal de la FAQ es extraíble y trae sujeto, cifra, año, fórmula y contraste con el SMI, aunque la palabra 'Asturias' vive en el h3 y no en la frase; y la frase del callout donde la cifra del title aparece por primera vez sí nombra al puesto pero no al territorio ni al año.

> `convenio-limpieza-asturias.html:492` — Según la tabla salarial 2025 del convenio (vigente en 2026 por ultraactividad pactada de duración indefinida del Art. 4), la categoría de Limpiador/a percibe <strong>38,59 €/día de salario base</strong>. El bruto anual asciende a <strong>17.365,50 €</strong>
> `convenio-limpieza-asturias.html:214` — Si cobras con las extras <strong>prorrateadas en 12 mensualidades</strong>, una <strong>Limpiador/a percibe 1.447 €/mes</strong> (mismo bruto anual: 17.365,50 €).

**🟢 4.3 — 2/3**

Dentro del cuerpo la desambiguación es de las mejores del corpus —separa convenio de SMI, salario de jornada y equiparación SESPA de convenio general—, pero la capa que un motor lee primero contradice ese trabajo: la meta saca '1.447 €/mes' del sitio sin el 'prorrateado en 12', y la ficha anuncia 15 pagas. Un extractor puede concluir 'un limpiador en Asturias cobra 1.447 €/mes en 15 pagas', que es falso.

> `convenio-limpieza-asturias.html:215` — <strong>Tabla 2025 vigente en 2026</strong> por ultraactividad indefinida (Art. 4): de <strong>1.105 €/mes</strong> (categorías ancladas al SMI) a <strong>1.730 €/mes</strong> en 15 pagas — equivalente a <strong>1.381 €/mes a 2.163 €/mes</strong> si se prorratea en 12.
> `convenio-limpieza-asturias.html:213` — el personal de limpieza de centros sanitarios está equiparado a <strong>SESPA en salario</strong>, y en el sector público asturiano se trabajan 35 h/semana — de ahí la confusión. Pero la <strong>jornada del convenio de Limpieza es 38,5 h/semana · 1.758 h/año</strong> para toda la plantilla (la equip
> `convenio-limpieza-asturias.html:7` — content="Limpiador/a 1.447 €/mes (17.365 €/año) según el convenio de Limpieza de Asturias.

**Parche propuesto (APLAZADO: ventana de medición abierta):** {'descripcion': "Se resuelve con el mismo cambio de meta propuesto en 2.5: basta con que el '€/mes' nunca salga de la página sin el calificador 'prorrateado' al lado. Aplica también al og:description, que hoy hereda el mismo texto."}

**🔵 4.2 — 3/3**

Ejemplar: es la única ficha del piloto cuyos encabezados de tabla llevan la fórmula de conversión y el periodo dentro del propio th ('×15 pagas', '€/mes prorrateado', '€/trienio/paga'), de modo que una fila extraída sola sigue siendo interpretable sin leer el párrafo de arriba. Las demás fichas dejan columnas con números desnudos (Sevilla: 'A · base') o sin periodo (Zaragoza: 'SB 2025').

> `convenio-limpieza-asturias.html:254` — <th class="num">12 pagas (€/mes prorrateado)</th>
> `convenio-limpieza-asturias.html:253` — <th class="num">Bruto anual 2025 (×15 pagas)</th>
> `convenio-limpieza-asturias.html:301` — <tr class="highlight"><td class="cat">Limpiador/a</td><td class="num">38,59 €/día</td><td class="sal">17.365,50 €</td><td class="num">1.447,13 €/mes</td><td class="num">10,90 €</td></tr>

**🔵 4.4 — 3/3**

Ejemplar: la traza no está en un bloque final sino pegada a cada cuantía. El párrafo que precede a la tabla cita la corrección de errores con boletín, número y fecha; cada tarjeta de plus lleva su artículo en el título; y el pie de tabla reproduce literalmente el texto del Art. 21 junto a las dos categorías en riesgo. Ninguna otra ficha del piloto lleva el artículo dentro del título de cada complemento.

> `convenio-limpieza-asturias.html:244` — publicada en el BOPA Núm. 200 del 17 de octubre de 2025 (corrige los importes mensuales del Grupo IV de la publicación original del 30-VII-2025)
> `convenio-limpieza-asturias.html:336` — <div class="pill-card-title">Plus de transporte (Art. 23)</div>
> `convenio-limpieza-asturias.html:313` — La cláusula expresa de garantía SMI del Art. 21 protege estas categorías frente a cualquier desfase: <em>"Si en algún momento los importes reflejados en las referidas tablas salariales para determinadas categorías profesionales quedasen por debajo de SMI, las empresas quedan obligadas a abonar como 

> Ficha con ventana de medición abierta (operacion.ultimo_commit 2026-08-04, ventana_medicion_abierta=true): todos los parches quedan aplazados, pero el diagnóstico es firme y conviene tenerlo listo para cuando la ventana cierre. Mi lectura del bajo CTR: no es un problema de posición ni de contenido, es que el title vende una cifra que la persona no puede reconocer. Un convenio de 15 pagas con salario diario produce tres números legítimos para 'lo que cobra una limpiadora' —38,59 €/día, 1.157,70 €/mes de nómina y 1.447 €/mes prorrateado— y el title eligió el tercero, el único que no aparece en ninguna nómina, y encima le quitó el nombre del puesto en el rewrite del 4-ago. Contraste útil dentro del propio piloto: Zaragoza, misma provincia-tipo, mismo sector, posición casi idéntica (6,40) y un title de 106 caracteres SIN cifra en euros, rinde 4,4% de CTR. Es decir, la fórmula 'cifra primero' no es lo que separa a estas dos fichas; lo que las separa es que el número de Asturias no le pertenece a nadie. Fuera de mi eje: el determinista declara un hard-fail 12.2 (presenta 16.576 € como SMI 2026 cuando el real sería 17.094 €); afecta a toda la aritmética de la sección 'Verificación A+B' y al pie de tabla, y si se corrige puede cambiar el marco editorial de la ficha ('todas cumplen el SMI' podría dejar de ser cierto). Lo señalo porque un cambio de ese calado debería resolverse ANTES de tocar el title, no después.

### E5 · Enlazado y clúster

**🟠 6.3 — 1/3**

Las nueve hermanas están agrupadas en el bloque final 'Convenios de limpieza en otras provincias'; en toda la prosa solo hay un enlace de orientación, el de la guía de reclamación, y llega cuando la sección ya ha terminado. Es el patrón 'lista al final' puro.

> `convenio-limpieza-asturias.html:534` — <li><a href="/convenio-limpieza-edificios-locales.html">← Pilar estatal: Convenio de Limpieza de Edificios y Locales</a></li>
> `convenio-limpieza-asturias.html:522` — <p>Los sindicatos firmantes — CCOO y UGT-FeSMC — siguen siendo válidos para asesoría durante la ultraactividad. Código REGCON: <code style="font-family:monospace;font-size:13px;">33000635011982</code>. <a href="/reclamar-diferencias-salariales-convenio.html">Guía completa para reclamar diferencias →

**Parche propuesto (APLAZADO: ventana de medición abierta):** Llevar dos de los nueve enlaces de la lista al cuerpo: en la línea 313, donde se explica que Aspirante y Botones quedan a cinco céntimos del mínimo legal, contrastar con «en <a href="/convenio-limpieza-bizkaia.html">Bizkaia</a> ninguna categoría se acerca tanto al suelo porque la jornada es de 35 h»; y en la línea 518, donde se pide verificar la tabla 2025 durante la ultraactividad, remitir a <a href="/convenio-limpieza-madrid.html">Limpieza de Madrid</a>, que está en la misma situación. Van ahí porque son los dos puntos en que el texto ya compara y el lector no tiene adónde ir.

**🟠 6.4 — 1/3**

Nueve hermanas del mismo sector (a_hermanas_mismo_sector=9, sexta del corpus) pero a_otro_sector_misma_provincia=[]: no enlaza a convenio-metal-asturias.html, que sí la enlaza a ella. Cubre una sola de las dos direcciones y la que falta es la que resuelve el error de sector.

> `analisis/auditoria-convenios/2026-08-20/deterministas/convenio-limpieza-asturias.json:261` — "a_otro_sector_misma_provincia": [],
> `analisis/auditoria-convenios/2026-08-20/deterministas/convenio-limpieza-asturias.json:275` — "entrantes_desde": [

**Parche propuesto (APLAZADO: ventana de medición abierta):** Añadir en el bloque de la línea 534, como primer ítem y con contexto: <li>¿Limpias en una fábrica o en un taller? Si tu empresa no es una contrata de limpieza sino industrial, mira el <a href="/convenio-metal-asturias.html">Convenio del Metal de Asturias</a>, que ya enlaza a esta ficha.</li>. Va ahí porque es donde el lector busca 'y si no es el mío'; mejor aún sería subirlo junto al encabezado de la tabla, donde se decide si esta ficha le aplica.

**🟠 6.6 — 1/3**

al_kit=1 y es la guía genérica, colocada al cierre de la sección de reclamación. El paso 2 pide la nómina detallada por escrito — que es literalmente lo que hace plantilla-solicitar-nominas.html — y no la enlaza; ninguna plantilla del kit aparece en la ficha.

> `convenio-limpieza-asturias.html:519` — <li><strong>Pide nómina detallada por escrito</strong> si los conceptos no aparecen separados. Tu empresa está obligada a entregarla por imperativo del art. 29.1 del Estatuto de los Trabajadores. Aprovecha para mencionar la discrepancia con la tabla del convenio.</li>
> `convenio-limpieza-asturias.html:522` — <p>Los sindicatos firmantes — CCOO y UGT-FeSMC — siguen siendo válidos para asesoría durante la ultraactividad. Código REGCON: <code style="font-family:monospace;font-size:13px;">33000635011982</code>. <a href="/reclamar-diferencias-salariales-convenio.html">Guía completa para reclamar diferencias →

**Parche propuesto (APLAZADO: ventana de medición abierta):** En la línea 519, cerrar el paso con: «Pídela con la <a href="/plantilla-solicitar-nominas.html">plantilla para solicitar copia de nóminas</a> y, si al compararlas aparece diferencia, reclama con la <a href="/plantilla-reclamar-atrasos-convenio-salarial.html">plantilla de atrasos</a> los últimos 12 meses.» Va en ese paso porque es la única frase de la ficha que le pide al lector redactar un escrito.

**🟢 6.2 — 2/3**

entrantes_n=10, justo en la mediana del corpus (10,5), y con variedad real de origen: el pilar estatal, dos fichas hermanas y — lo raro — convenio-metal-asturias.html, es decir otro sector de su misma provincia. Las anclas entrantes son descriptivas ('Convenio Limpieza Asturias (3 pagas extras)'). No es 3 porque ninguna guía la enlaza: guias.html no aparece entre los entrantes.

> `analisis/auditoria-convenios/2026-08-20/deterministas/convenio-limpieza-asturias.json:275` — "entrantes_desde": [

**🟢 6.5 — 2/3**

anchors_genericos=[] y cada ancla añade un dato que distingue la ficha destino ('(en ultraactividad)', '(jornada 35 h)', '2026-2030'). No es 3 porque el bloque entero está clonado: la misma lista, en el mismo orden, aparece en cinco fichas de limpieza (Asturias, Murcia, Las Palmas, Zaragoza, Bizkaia); ninguna ancla está escrita para el lector asturiano.

> `convenio-limpieza-asturias.html:535` — <li><a href="/convenio-limpieza-madrid.html">Convenio Limpieza Madrid (en ultraactividad)</a></li>
> `convenio-limpieza-asturias.html:541` — <li><a href="/convenio-limpieza-bizkaia.html">Convenio Limpieza Bizkaia (jornada 35 h)</a></li>

> Asturias emite bien hacia su sector y recibe bien, pero es un nodo de una sola dimensión: todo su tejido es limpieza. La reciprocidad con metal-asturias existe en un sentido y no en el otro, y eso se repite en Zaragoza y Sevilla — es un defecto de sistema, no de esta ficha. Fuera de mi eje: el determinista ya marca 12.2 (SMI obsoleto 16.576 € presentado como el de 2026); si se corrige esa cifra, la frase del aviso bajo la tabla pasa a ser el mejor sitio del corpus para enlazar plantilla-reclamar-absorcion-complementos-smi.html.

### E6 · Forma y lectura

**🔴 7.2 — 0/3** · *matizado por el verificador*

Es la peor de las seis en esta norma: tablas.verde_en_tablas = 3 y, además, la hoja de estilo pinta en verde la columna de bruto anual de la tabla salarial grande (td.sal), que es exactamente la cifra que la norma manda dejar en tinta neutra. El verde deja así de significar «verificado» y pasa a significar «dinero», que es el uso que metal-barcelona y metal-bizkaia evitan.

> `convenio-limpieza-asturias.html:149` — td.sal{font-weight:700;color:var(--green);text-align:right;white-space:nowrap;}
> `convenio-limpieza-asturias.html:323` — <tr><td class="cat">Limpiador/a · Peón/a (Grupo V/VI)</td><td class="num">17.365,50 €</td><td class="num" style="color:var(--green);font-weight:700;">+789,50 €</td></tr>
> `convenio-metal-sevilla.html:150` — td.sal{font-weight:700;color:var(--ink);text-align:right;white-space:nowrap;}

**Parche propuesto (APLAZADO: ventana de medición abierta):** Cambiar la regla de la línea 149 a «td.sal{font-weight:700;color:var(--ink);text-align:right;white-space:nowrap;}», copiando la de metal-sevilla, y quitar el style="color:var(--green);font-weight:700;" de las tres celdas de la columna «vs SMI 2026» (líneas 323-325), dejando solo font-weight:700. El sello de la línea 207 se queda como está: es el único sitio donde el verde debe leerse.

**🔴 8.3 — 0/3**

La misma cita literal del Art. 4 aparece dos veces en la página, en el callout de apertura y en el h3 de particularidades, con el mismo remate («blinda al personal frente al decaimiento del Art. 86.3»). Y las tres pagas extras se explican enteras dos veces, en la viñeta de la línea 214 y en el callout de la línea 240. No es un eco: son dos redacciones completas del mismo contenido separadas por 150 líneas.

> `convenio-limpieza-asturias.html:236` — el propio Art. 4 establece una ultraactividad de duración indefinida: <em>"una vez denunciado el convenio, y en tanto no se llegue a un acuerdo sobre el nuevo, se entenderá que el contenido íntegro normativo del presente convenio mantiene su vigencia hasta la fecha de la firma del nuevo convenio col
> `convenio-limpieza-asturias.html:388` — El texto del Art. 4 establece que <em>"una vez denunciado el convenio, y en tanto no se llegue a un acuerdo sobre el nuevo, se entenderá que el contenido íntegro normativo del presente convenio mantiene su vigencia hasta la fecha de la firma del nuevo convenio colectivo"</em>.

**Parche propuesto (APLAZADO: ventana de medición abierta):** Dejar la cita literal del Art. 4 en un solo sitio, el h3 de la línea 387, y reducir el callout de apertura a la consecuencia práctica sin volver a citar: «<strong>Vigente en 2026.</strong> El convenio terminó su periodo formal el 31 de diciembre de 2025, pero el Art. 4 pacta ultraactividad indefinida: la tabla 2025 y el resto de condiciones siguen aplicándose íntegras hasta que se firme el nuevo convenio. → <a href="#ultraactividad">Por qué esto te protege más que la ultraactividad legal ↓</a>». Y suprimir el callout de la línea 239, cuyo contenido ya está entero en la viñeta de la línea 214.

**🟠 7.4 — 1/3**

No hay nota editorial fragmentada, y su lugar lo ocupan tres callout-info verdes seguidos que el lector encuentra antes de la tabla; los dos últimos son párrafos macizos de más de cien palabras cada uno sobre un solo asunto. A eso se suman los cinco párrafos que parrafos.largos_100 sí detecta (líneas 244, 313, 391, 492 y 513). No es 0 porque el primer callout sí está troceado en tres viñetas con etiqueta.

> `convenio-limpieza-asturias.html:236` — <strong>Convenio plenamente vigente en 2026 por ultraactividad indefinida pactada en el Art. 4.</strong> El periodo formal del convenio fue del 1 de enero al 31 de diciembre de 2025, con denuncia automática prevista para el 30 de septiembre de 2025.
> `convenio-limpieza-asturias.html:240` — <strong>Tres pagas extras anuales — el más generoso del sector.</strong> Mientras la mayoría de convenios provinciales de Limpieza en España tienen 2 pagas extras (14 pagas anuales), el convenio asturiano regula <strong>tres pagas extras</strong> en el Art. 27
> `convenio-limpieza-asturias.html:214` — <li><strong>«12 pagas»:</strong> en realidad son <strong>15</strong>

**Parche propuesto (APLAZADO: ventana de medición abierta):** Sustituir los dos callout-info de las líneas 235-241 por una única nota editorial fragmentada, al modo de metal-sevilla: «<div class="nota-editorial"><p style="margin-bottom:10px;"><strong>En 30 segundos · Qué es.</strong> El convenio de Limpieza de Edificios y Locales del Principado de Asturias (código 33000735011979), firmado el 14 de julio de 2025 por ASPEL y UDELIMPA con CCOO Hábitat, UGT-FeSMC y USO.</p><p style="margin-bottom:10px;"><strong>Estructura.</strong> 27 categorías en seis grupos, 15 pagas (12 mensualidades + 3 extras del Art. 27: Verano, Navidad y Beneficios) y jornada de 1.758 h/año.</p><p style="margin-bottom:10px;"><strong>Vigencia.</strong> El periodo formal terminó el 31-XII-2025, pero el Art. 4 pacta una ultraactividad de duración indefinida: la tabla 2025 sigue aplicándose entera hasta que se firme el nuevo convenio.</p><p style="margin:0;"><strong>Futuro.</strong> La negociación del nuevo texto estaba prevista para la primera semana de febrero de 2026.</p></div>». El detalle largo del Art. 4 ya está en su h3 de la línea 387 y el de las tres pagas puede ir en la sección de pagas.

**🟠 7.5 — 1/3**

La jerarquía es formalmente correcta (headings.h1 = 1, saltos_jerarquia = []), pero dos h2 de la misma página se llaman casi igual y el segundo es justo el encabezado vacío que la norma señala: «Particularidades adicionales del convenio» no dice nada que oriente, y quien haya leído «Particularidades únicas del convenio asturiano» ochenta líneas antes no puede saber qué esperar debajo. El resto de encabezados sí funciona.

> `convenio-limpieza-asturias.html:369` — <h2>Particularidades únicas del convenio asturiano</h2>
> `convenio-limpieza-asturias.html:417` — <h2>Particularidades adicionales del convenio</h2>

**Parche propuesto (APLAZADO: ventana de medición abierta):** Renombrar el h2 de la línea 417 por lo que realmente contiene —jornada, permisos y garantías de cobro— y moverlo junto al bloque de pluses: «<h2>Bocadillo, permisos y garantía de cobro: el detalle que no está en la tabla</h2>». Así «Particularidades únicas del convenio asturiano» se queda como único bloque con ese rótulo.

**🟠 8.1 — 1/3** · *matizado por el verificador*

Sobra el bloque «Particularidades adicionales del convenio»: es una lista de ocho viñetas heterogéneas —bocadillo, vacaciones, excedencias, permisos, intereses de demora, atrasos, tiempo parcial y remisión al estatal— colocada después de la subrogación, sin criterio que la una salvo «lo que no cupo antes». Sus contenidos tienen sitio natural en secciones ya existentes.

> `convenio-limpieza-asturias.html:417` — <h2>Particularidades adicionales del convenio</h2>
> `convenio-limpieza-asturias.html:419` — <li><strong>Bocadillo dentro de jornada efectiva:</strong> en jornadas continuas, el descanso de 20 minutos para el bocadillo computa como tiempo de trabajo efectivo.

**Parche propuesto (APLAZADO: ventana de medición abierta):** Disolver el bloque: llevar bocadillo, vacaciones y jornada limitada a una sección «Jornada, descansos y vacaciones» junto a los pluses; excedencias y permisos a «Permisos y excedencias»; el pago garantizado y los atrasos al final de la sección de tabla salarial (donde el lector ya está mirando dinero); y la remisión al convenio estatal a «Fuentes oficiales».

**🟠 8.6 — 1/3**

jerga marca «comisión paritaria» con explicacion_cerca = false, y en el HTML se confirma: la primera vez que aparece es dentro del pacto anti-dumping, dando por sabido qué es y qué puede hacer; la explicación llega ochenta líneas más tarde, en una pill-card de recursos. Las otras dos —ultraactividad y subrogación— sí están explicadas al primer uso, y por eso no es 0.

> `convenio-limpieza-asturias.html:391` — La Comisión Paritaria fija anualmente los costes mínimos repercutibles para las categorías de Limpiador/a y Especialista en los servicios concertados con administraciones públicas
> `convenio-limpieza-asturias.html:439` — Para dudas interpretativas o aplicación de cláusulas, la Comisión Paritaria está integrada por representantes de ASPEL+UDELIMPA y CCOO+UGT+USO.

**Parche propuesto (APLAZADO: ventana de medición abierta):** Glosar el término la primera vez que se usa, en la línea 391: «La <strong>Comisión Paritaria</strong> —el órgano mixto de empresas y sindicatos firmantes que interpreta el convenio y cuyos acuerdos obligan a las dos partes— fija anualmente los costes mínimos repercutibles para las categorías de Limpiador/a y Especialista…». Con eso, la pill-card de la línea 439 puede quedarse solo con el «dónde acudir».

**🟠 11.1 — 1/3**

tablas.sin_th = 0 pero sin_scope = 3 y sin_caption = 3. La tabla salarial es de 43 filas por 5 columnas: sin scope, un lector de pantalla que baje por ella pierde la referencia de columna a las pocas filas y no sabe si el número que oye es el mensual, el anual, el prorrateado o el trienio. En una ficha cuyo activo es esa tabla, es un defecto de producto, no de accesibilidad formal.

> `convenio-limpieza-asturias.html:248` — <table>
> `convenio-limpieza-asturias.html:301` — Limpiador/a38,59 €/día17.365,50 €1.447,13 €/mes10,90 €

**Parche propuesto (APLAZADO: ventana de medición abierta):** Poner scope="col" en los cinco th de la tabla salarial y scope="row" en las celdas de categoría (cambiando td class="cat" por th scope="row" class="cat"), y abrir la tabla con un caption: «<caption style="caption-side:top;text-align:left;font-size:13px;color:var(--ink-light);padding-bottom:8px;">Tabla salarial 2025 del convenio de Limpieza de Asturias, vigente en 2026 por ultraactividad: salario base, bruto anual en 15 pagas, equivalente mensual prorrateado en 12 y trienio, por categoría (BOPA 146/2025 con la corrección del BOPA 200).</caption>». Repetir el patrón en las tablas de las líneas 320 y 469.

**🟠 12.6 — 1/3**

La ficha aplica el inclusivo con cuidado en casi todas sus 27 categorías, pero se le escapa dentro de la misma tabla: «Peón Especialista» en masculino literal siete filas antes de «Peón/a». Quien lea la tabla no puede saber si son dos categorías distintas o la misma escrita de dos maneras — que es justo lo que la coherencia terminológica debe evitar en una tabla salarial.

> `convenio-limpieza-asturias.html:300` — Peón Especialista41,75 €/día18.787,50 €1.565,63 €/mes11,68 €
> `convenio-limpieza-asturias.html:307` — Peón/a38,59 €/día17.365,50 €1.447,13 €/mes10,90 €

**Parche propuesto (APLAZADO: ventana de medición abierta):** Escribir «Peón/a Especialista» en la línea 300, igual que «Peón/a» en la 307 y «Limpiador/a» en la 301.

**🟢 7.8 — 2/3**

Sigue el canon (sello, datos clave, tabla, pluses, subrogación, comparativa, FAQ, quién audita) y su contenido exclusivo —la equiparación con el SESPA, la indemnización por cese 60-63 y el pacto anti-dumping— está en un bloque propio a mitad de página, no al final. No llega a 3 por dos cosas: no tiene el índice de navegación que sí trae hosteleria-madrid, y una parte de lo exclusivo se desangra en el cajón de sastre de la línea 417.

> `convenio-limpieza-asturias.html:371` — Equiparación salarial con SESPA en centros sanitarios (Art. 30)
> `convenio-limpieza-asturias.html:372` — Es una cláusula única del convenio asturiano: limpiar un hospital del SESPA bajo este convenio equivale económicamente a estar en plantilla pública.
> `convenio-hosteleria-madrid.html:180` — td.sal{font-weight:700;color:var(--green);text-align:right;white-space:nowrap;}

**🟢 8.2 — 2/3**

El orden es razonable: el callout de la línea 210 responde en la primera pantalla a las dos búsquedas reales («35 horas» y «12 pagas») con la cifra dentro, y la tabla es el primer h2. No es 3 porque entre esa respuesta y la tabla se cuelan dos callouts largos de vigencia y de pagas, es decir contexto jurídico antes de la escala salarial completa.

> `convenio-limpieza-asturias.html:214` — Si cobras con las extras <strong>prorrateadas en 12 mensualidades</strong>, una <strong>Limpiador/a percibe 1.447 €/mes</strong> (mismo bruto anual: 17.365,50 €).
> `convenio-limpieza-asturias.html:243` — <h2 id="tabla-salarial">Tabla salarial 2025 — categoría a categoría</h2>

**🟢 12.3 — 2/3**

El esqueleto es el del corpus y coincide con el de limpieza-zaragoza, la otra ficha del mismo sector: datos clave, tabla, pluses, subrogación, comparativa provincial, recursos, FAQ y firma. La única desviación real frente al canon es la ausencia de índice de navegación, que hosteleria-madrid y las dos fichas más nuevas del piloto sí traen.

> `convenio-limpieza-asturias.html:464` — <h2>Comparativa con otros convenios provinciales de Limpieza</h2>
> `convenio-limpieza-zaragoza.html:219` — <div style="font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--gold-light);margin-bottom:10px;">Índice del convenio</div>

**🔵 8.8 — 3/3**

Es la única ficha del piloto que trata la representación como un dato con nombre y porcentaje en vez de como un par de siglas de adorno: norma.sindicatos reparte CCOO 8 · UGT 7 · USO 8, y el texto dedica un h3 a explicar que hay un tercer sindicato firmante y cuánto pesa cada uno. Eso es exactamente «plural correcto y con las siglas realmente mayoritarias en ese territorio».

> `convenio-limpieza-asturias.html:384` — <h3>Tres sindicatos firmantes incluyendo USO</h3>
> `convenio-limpieza-asturias.html:385` — El convenio fue suscrito por <strong>tres sindicatos</strong>: CCOO Hábitat de Asturias (40,00% de representación social), UGT-FeSMC (43,22%) y <strong>USO Federación de Servicios (14,19%)</strong>.

> El defecto de forma que más pesa aquí no es ninguna de las doce métricas por separado, sino su suma en la primera pantalla: cuatro cajas verdes seguidas (sello + tres callout-info) antes de llegar a la tabla. El verde deja de destacar nada porque lo destaca todo, y por eso el 7.2 y el 7.4 se refuerzan mutuamente. Fuera de mi eje: el recolector ya marca hard-fail 12.2 por presentar 16.576 € como SMI de 2026 (el real es 17.094 €) en tres sitios, y eso invalida el argumento entero de la sección «Verificación A+B — todas las categorías cumplen el SMI 2026», incluidas las tres celdas verdes que propongo despintar. Conviene que el eje de verdad lo resuelva antes de aplicar mis parches de forma.
