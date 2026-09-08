# convenio-hosteleria-valencia

**Score: 65.5/100** · hard-fails: **3**

Sector hosteleria · estado `ultraactividad` · 4720 palabras de prosa · boilerplate 0.123 · último cambio hace 21 días
GSC 28d: 163 clics · 4216 impresiones · CTR 3.87% · posición 7.2

## Hard-fails — no se compensan con la nota

- **5.1** (determinista) · 44% de las cifras están en secciones sin referencia a artículo/anexo/boletín (74 de 169)
- **5.7** (E2) · El bloque plantillado atribuye a 'los sindicatos' una denuncia del convenio 'el octubre de 2025' que no consta en ninguna fuente citada por la ficha: el resto de la página sostiene que la vigencia terminó el 31/12/2025 y que las tablas siguen por ultraactividad del art. 86.3 ET, sin mencionar denuncia alguna, y el censo (fuenteEstado de convenio-hosteleria-valencia) tampoco la recoge. Es un hecho fabricado por el molde al rellenarse con los valores de otra ficha. La misma frase de la misma plantilla aparece en Asturias y Zaragoza, allí con la denuncia real de CCOO, lo que confirma el origen.
- **5.7** (E3) · El bloque «¿Cobras menos de lo que fija el convenio?» afirma que la denuncia del convenio la presentaron los sindicatos en octubre de 2025. Esa fecha no aparece en ninguna de las fuentes que la propia ficha cita (BOP Valencia núm. 26 de 7-feb-2023 y acta paritaria 1/2024, BOP 87 de 7-may-2024), ni en el resto de la página, que se limita a decir que el convenio expiró el 31-XII-2025. Además la frase está sintácticamente rota («está en ultraactividad desde tras el fin de la vigencia formal», «los sindicatos la presentó»), lo que delata que es un bloque rotado desde otra ficha —el mismo texto aparece en Zaragoza, donde la denuncia de CCOO el 2-oct-2025 sí está documentada, y en Asturias—. El mismo bloque arrastra la remisión a un «Art. 34 (descuelgue)» que tampoco consta en el articulado del convenio de Valencia. Es una fecha inventada en el párrafo que el lector lee justo antes de reclamar.

## Ejes

**Cuello de botella: E1 (55.5% de su peso).** Es por donde empieza el arreglo.

| eje | | puntos | peso |
|---|---|---|---|
| E1 | Verdad demostrada | 12.2 | 22 |
| E2 | Singularidad y ventaja | 12.6 | 22 |
| E3 | Respuesta al trabajador | 16.7 | 20 |
| E4 | Captación y citabilidad | 9.3 | 14 |
| E5 | Enlazado y clúster | 8.0 | 12 |
| E6 | Forma y lectura | 6.7 | 10 |

### E1 · Verdad demostrada

**🟠 5.8 — 1/3** · *matizado por el verificador*

Las afirmaciones de derecho llevan condición y artículo, pero la afirmación central de la página —cuál es el salario mínimo del convenio en 2026— se enuncia sin el único matiz que la hace legalmente utilizable: 1.100,46 €/mes en 15 pagas son 16.506,90 € al año, por debajo del SMI 2026 (17.094 €), de modo que esa cifra no puede pagarse hoy. Y la Tabla II BIS reproduce importes de 853,87 € a 1.038,09 € como lo que cobra quien entra sin experiencia, sin advertir que el SMI actúa igualmente como suelo. La ficha no menciona el SMI ni una sola vez en el cuerpo.

> `convenio-hosteleria-valencia.html:873` — Según el texto publicado en BOP Valencia núm. 26 del 7 de febrero de 2023, el salario base mensual mínimo es de <strong>1.100,46 €</strong> (Nivel V de restauración) y puede llegar hasta <strong>1.415,47 €</strong> en las categorías superiores de hoteles 4-5 estrellas.
> `convenio-hosteleria-valencia.html:795` — Si has <strong>trabajado 9 meses o más</strong> en el área funcional para la que te contratan, no eres "sin experiencia" y debes cobrar la tabla normal desde el primer día.

**Parche propuesto:** Añadir un callout inmediatamente bajo las tablas y repetir el matiz en la FAQ de la línea 873: «Ojo con el suelo legal. El Nivel V de la Tabla I (1.100,46 €/mes × 15 pagas = 16.506,90 €/año) queda por debajo del SMI 2026, fijado en 17.094 € brutos anuales por el RD 126/2026. Como el SMI se compara en cómputo anual y es irrenunciable (art. 27 ET), tu empresa debe complementar la diferencia: en 2026 nadie puede cobrar menos de 17.094 € al año a jornada completa, aunque la tabla del convenio en ultraactividad diga otra cosa. Lo mismo se aplica a la tabla rebajada del Anexo II BIS.» Sin este bloque la página publica cifras que hoy son ilegales como si fueran exigibles.

**🟠 5.10 — 1/3** · *matizado por el verificador*

Hay un enlace oficial, pero lleva a la portada del buscador del BOP y la propia ficha reconoce que el lector tendrá que repetir la búsqueda con el CSV; el otro enlace no es oficial sino a un repositorio jurídico privado. Además todo ello está sepultado dentro de un <details> plegado al final de la FAQ, no en una sección de fuentes visible.

> `convenio-hosteleria-valencia.html:897` — Ambas publicaciones son verificables en <a href="https://bop.dival.es/bop" target="_blank" rel="noopener">bop.dival.es</a> buscando por el CSV o por el código de convenio.
> `convenio-hosteleria-valencia.html:891` — <summary><span class="acordeon-chevron">▸</span>Otras preguntas frecuentes<span class="summary-hint">Pulsa para ver 3 preguntas más (fijo-discontinuo, plus formación, fuentes oficiales)</span></summary>

**Parche propuesto:** Sacar las fuentes del acordeón a una sección propia «Fuentes oficiales» con el patrón de Metal Sevilla, y sustituir el enlace al buscador por los enlaces directos al documento: BOP Valencia nº 26 de 7-II-2023 (CSV BOPV-2023/01380, texto íntegro y Anexo II) y BOP Valencia nº 87 de 7-V-2024 (acta paritaria 1/2024, cláusula de garantía IPC), más el código 46001285011982 enlazado a https://expinterweb.mites.gob.es/regcon/. Degradar el enlace a noticias.juridicas.com a mención secundaria: no es fuente oficial y hoy compite visualmente con la que sí lo es.

**🟢 2.1 — 2/3**

Hay trabajo propio en varias secciones —la reconstrucción de cómo se calculó la paga de garantía IPC con su base y sus beneficiarios, el ámbito ampliado a riders y dark kitchens, la Tabla II BIS— pero convive con mucha transcripción sin anclar: el determinista cuenta 74 de 169 cifras en secciones sin referencia a artículo, anexo o boletín (43,8% de cifras huérfanas, la peor del piloto).

> `convenio-hosteleria-valencia.html:714` — <strong>El IPC interanual de diciembre 2024 cerró cerca del 2,8%</strong>, claramente superior al 1,62% pactado — habría que verificar con la empresa o el sindicato si la nueva paga de garantía se ha aplicado.
> `convenio-hosteleria-valencia.html:276` — <li class="no"><strong>NO te cubre</strong> si tu empresa solo prepara y reparte productos cocinados a domicilio sin tener establecimiento presencial (dark kitchens puras pueden quedar fuera, se interpreta caso por caso).</li>

**🟢 5.11 — 2/3**

El bloque principal de tablas dice su año y explica por qué una tabla de 2025 rige en 2026, lo que resuelve la duda temporal más importante. No llega a 3 porque 500 líneas más abajo aparece una segunda tabla de 2023 cuyo encabezado de columna dice solo «Tabla normal» y da 1.178,28 € para Nivel III donde la tabla vigente da 1.214,84 €: dos cifras para el mismo puesto, separadas únicamente por un año escrito en el h3.

> `convenio-hosteleria-valencia.html:283` — <div class="card-title" id="tabla-salarial">Tablas salariales 2025 — Hostelería Provincia de Valencia</div>
> `convenio-hosteleria-valencia.html:777` — <h3>Tabla rebajada vs tabla normal (Tabla I — restauración, 2023)</h3>

**🟢 9.1 — 2/3**

Fecha concreta y posterior a los boletines citados (28-may-2026 > 7-may-2024). No llega a 3 porque el sello certifica solo contra el BOP 26/2023 mientras una sección entera de la ficha —la paga de garantía IPC— descansa en el acta paritaria del BOP 87 de 7-may-2024, que el sello no menciona; y el bloque de autoría es el boilerplate genérico, sin nombrar el boletín.

> `convenio-hosteleria-valencia.html:234` — <strong>✓ Verificado</strong> contra BOP Valencia Núm. 26/2023 por SalarioJusto · última revisión 28 de mayo de 2026
> `convenio-hosteleria-valencia.html:945` — Esta ficha de convenio ha sido cruzada manualmente contra el texto íntegro del boletín oficial por el equipo de SalarioJusto.

**🟢 9.2 — 2/3**

Dice desde el hero hasta cuándo valen estas tablas y saca la consecuencia práctica de la ultraactividad —que no hay subida automática—, y deja abierta una revisión pendiente concreta (la garantía IPC de 2024-2025). No llega a 3 porque no dice qué vigilar ni cuándo: no hay ninguna pista sobre el calendario del nuevo convenio, algo que Limpieza Zaragoza sí resuelve con su histórico de renovaciones.

> `convenio-hosteleria-valencia.html:226` — El convenio expiró el 31/12/2025 pero las tablas siguen aplicándose por ultraactividad (art. 86.3 ET) mientras se negocia un nuevo texto. No hay incremento automático.
> `convenio-hosteleria-valencia.html:714` — Si el IPC de cualquiera de esos años supera el pactado, debería abonarse de nuevo la paga única adicional.

> Sin ventana de medición abierta (ultimo_commit 2026-07-30, 21 días): los parches son aplicables ya. No arrastra el error de los 16.576 € porque sencillamente no menciona el SMI en ningún punto del cuerpo (el JSON determinista lo confirma: smi.smi_obsoleto_citado = [], y el grep solo lo encuentra en un enlace del pie), y ese silencio es aquí más grave que el error ajeno: publica como salario mínimo del convenio para 2026 una cifra anual que está por debajo del SMI vigente. No lo declaro 5.7 —la cifra existe en el BOP y está bien transcrita— ni 4.5 por el choque entre la tabla 2025 y la tabla 2023, porque el año consta en ambos encabezados de sección; pero el verificador adversarial debería mirar las dos cosas. Fuera de mi eje: hardfail determinista 5.1 (43,8% de cifras en secciones sin referencia), que es la causa material de que esta ficha no se deje verificar pese a tener el contenido más rico del piloto.

### E2 · Singularidad y ventaja

**🟠 3.1 — 1/3** · *matizado por el verificador*

boilerplate_ratio 0.123, el más alto del piloto, y las 8 frases compartidas no son cromo sino el bloque jurídico '¿Cobras menos?' clonado; aquí además llegó roto, con la fecha y el sujeto de la denuncia sin rellenar y una preposición huérfana que delata la plantilla.

> `convenio-hosteleria-valencia.html:863` — El convenio está en ultraactividad desde tras el fin de la vigencia formal del convenio, pero eso <strong>no autoriza a tu empresa a bajar tu salario ni tus pluses</strong>.
> `convenio-hosteleria-valencia.html:867` — debe seguir el procedimiento de descuelgue (Art. 34) con periodo de consultas y comunicación a el TAL (Tribunal de Arbitraje Laboral) de la Comunitat Valenciana

**Parche propuesto:** Reescribir entero el bloque de las líneas 862-869 con lo que esta ficha ya sabe y el molde ignora: 'El XVII Convenio expiró el 31 de diciembre de 2025 y sus tablas siguen aplicándose por ultraactividad (art. 86.3 ET): tu empresa no puede rebajarlas. Si te paga menos, empieza por la tabla que te corresponde —Tabla I si es restauración, II si es hotel de 4 o 5 estrellas, III si es de 3 estrellas o vivienda turística—, comprueba que las tres pagas extras suman 15 mensualidades y no 14, y revisa que no te estén aplicando el Anexo II BIS de personas sin experiencia si ya tenías nueve meses en el sector. La vía previa es el TAL (Tribunal de Arbitraje Laboral de la Comunitat Valenciana); tienes un año por mensualidad (art. 59.2 ET).' Antes de publicarlo, verificar en el BOP Valencia 26/2023 el artículo real de inaplicación: el '(Art. 34)' actual está copiado del molde —aparece idéntico en 11 fichas de sectores y provincias distintos— y en esta página no se corresponde con ningún artículo citado en el resto del texto.

**🟠 8.4 — 1/3** · *matizado por el verificador*

es la ficha más intercambiable del piloto en este punto: recoge la estacionalidad genérica del sector vía fijo-discontinuo, pero nada de lo que hace singular a la hostelería de esta provincia en 2026 —la DANA del 29 de octubre de 2024 en l'Horta Sud y las Fallas como pico de contratación— aparece en ninguna línea; el campo nota del censo está vacío y la ficha tampoco lo suple.

> `convenio-hosteleria-valencia.html:718` — Es <strong>la modalidad más utilizada</strong> en hostelería de Valencia por la estacionalidad del sector (turismo, eventos, restauración de temporada).
> `convenio-hosteleria-valencia.html:224` — Tablas oficiales, jornada anual, 3 pagas extras, subrogación y pluses. BOP Valencia núm. 26, 7 feb 2023. Vigencia 2022–2025 (en ultraactividad).

**Parche propuesto:** Dos hechos que investigar antes de escribir una línea, no un párrafo que rellenar. (1) DANA del 29-oct-2024: comprobar en el BOP de Valencia y en el registro de actas de la Comisión Paritaria del convenio si hubo acuerdo sectorial de hostelería sobre ERTE por fuerza mayor, permiso retribuido recuperable del RDL 7/2024 o recuperación de jornada en los municipios afectados de l'Horta Sud; si lo hubo, es una sección propia ('Qué pasó con tu contrato si tu bar estaba en zona DANA') que ninguna otra web tiene y que sigue afectando al cómputo de 2026; si no lo hubo, decirlo también sirve, porque entonces se aplicó el régimen general y conviene explicar cuál. (2) Fallas: verificar en el articulado y en el calendario laboral autonómico el tratamiento del 19 de marzo y de los días falleros como festivos trabajados y su cuantía —la ficha ya tiene un epígrafe de 'Festivos trabajados (cuando eliges metálico)' donde encajaría—, porque es el pico anual de contratación del sector en la provincia. Sin al menos uno de los dos, esta ficha es la de cualquier provincia turística con otras cifras.

**🟢 3.2/3.3 — 2/3**

ratio_tabla 0.246, el más alto del piloto, con palabras_prosa 4720: la prosa explica bien qué tabla te toca y cuándo se te aplica la rebajada, pero buena parte del texto (licencias, festivos, jornada) rodea las tablas en vez de explicarlas, y el bloque comparativo necesita un callout posterior para corregir su propia lectura.

> `convenio-hosteleria-valencia.html:859` — <strong>Una matización al callout</strong>: Valencia aparece "última" en el ranking del salario mensual base de Camarero/a, pero tiene <strong>3 pagas extras en lugar de 2</strong>
> `convenio-hosteleria-valencia.html:775` — <strong>durante los primeros 9 meses te pagan con una tabla rebajada</strong>. Al día siguiente del noveno mes, pasas automáticamente a cobrar la tabla normal.

**🟢 3.4 — 2/3**

frases_exclusivas 164 de 187, pero la exclusividad es desigual: hay hechos propios de verdad (la ventana de nocturnidad 00:30-06:00 confirmada en acta paritaria, la inclusión expresa de riders) conviviendo con secciones de licencias y festivos que son el molde de hostelería con otras cifras.

> `convenio-hosteleria-valencia.html:882` — las dos horas y media entre 22:00 y 00:30 NO generan plus en hostelería de Valencia. […] La acta paritaria del 23-ene-2024 confirmó esta interpretación frente a una consulta del sector de ocio nocturno (discotecas).
> `convenio-hosteleria-valencia.html:275` — <strong>Te cubre si eres rider</strong> de una empresa hostelera: el reparto de comidas y bebidas a pie o en vehículo (sin autorización de transporte) está expresamente incluido

**🟢 3.5 — 2/3**

faq_clonadas 5 de faq_total 8: las tres propias son buenas y con respuesta que solo vale aquí, pero una de las clonadas es puro molde de archivo y las mejores quedan escondidas dentro de un acordeón plegado.

> `convenio-hosteleria-valencia.html:884` — La subrogación cubre a quien haya cubierto el puesto al menos el <strong>85% de los días de servicio durante los últimos 4 meses</strong>. Esto NO ocurre en otros convenios provinciales como Madrid.
> `convenio-hosteleria-valencia.html:896` — ¿Dónde puedo consultar el texto oficial del convenio?

**🟢 10.1 — 2/3**

aporta sobre el BOP una ordenación real (el bloque '¿te cubre?' con riders y dark kitchens, la Tabla II BIS explicada, el acta paritaria de 2024 incorporada), pero no traduce las tablas a bruto anual por categoría, que es la operación que el boletín no hace y el lector necesita.

> `convenio-hosteleria-valencia.html:284` — Salario base mensual bruto en 15 pagas (12 mensualidades + 3 extras de junio, navidad y marzo). Cifras oficiales publicadas en BOP Valencia núm. 26 del 7 de febrero de 2023.
> `convenio-hosteleria-valencia.html:702` — el IPC interanual 2023 fue del <strong>3,1%</strong> — superior al 2,5% pactado en el Art. 16 para ese año. La Comisión Paritaria activó la cláusula de garantía

**🟢 10.2 — 2/3**

hay una ventaja identificable frente a la cifra pelada —la honestidad de matizar la propia comparativa desfavorable y de admitir lo que no se sabe sobre la paga de garantía—, pero está en el último tercio de la página; en la primera pantalla solo hay un rango salarial que cualquier agregador también publica.

> `convenio-hosteleria-valencia.html:714` — habría que verificar con la empresa o el sindicato si la nueva paga de garantía se ha aplicado.
> `convenio-hosteleria-valencia.html:224` — De <strong>1.100,46 €/mes</strong> (ayudantes, riders) a <strong>1.415,47 €/mes</strong> (jefaturas en hoteles 4-5★) según categoría, en <strong>15 pagas</strong>.

> Ventana cerrada (ultimo_commit 2026-07-30, 21 días): los parches son aplicables ya. Es la ficha más intercambiable de las seis pese a tener 4.720 palabras de prosa, y conviene entender por qué, porque el diagnóstico vale para todo el corpus: no le falta volumen, le falta provincia. Tiene el boilerplate_ratio más alto (0.123), el ratio_tabla más alto (0.246), 5 de 8 FAQ clonadas, ningún bloque nota-editorial ni respuesta-directa (las tienen Madrid y Sevilla) y, sobre todo, ninguna referencia a lo único que hace irrepetible a la hostelería valenciana de 2026. Lo que sí tiene de propio —riders incluidos en el ámbito, la ventana de nocturnidad desde las 00:30, el Anexo II BIS— está bien y es defendible; el problema es que podría estar en la ficha de cualquier provincia costera cambiando cifras. Nota fuera de mi eje: la sección de reclamación remite al descuelgue del 'Art. 34' sin que ese artículo aparezca citado en ningún otro punto de la ficha; para el eje de veracidad, junto con el hard-fail 5.7.

### E3 · Respuesta al trabajador

**🟢 1.1 — 2/3**

Cifra, año y fuente están arriba —el determinista lo confirma y el sello cita el BOP Valencia 26/2023—, y además se avisa del estado de ultraactividad antes de que el lector se haga ilusiones. Pero lo que encabeza es un rango de 1.100,46 a 1.415,47 €/mes: quien busca «cuánto cobra una camarera en Valencia» no encuentra sus 1.214,84 €/mes hasta la tabla. Y hay ruido: más abajo la comparativa da 1.190,34 €/mes como «Camarero/a base mínimo», cifra de otra tabla (hoteles 3★), lo que obliga a leer una nota al pie para saber cuál es la suya.

> `convenio-hosteleria-valencia.html:224` — De 1.100,46 €/mes (ayudantes, riders) a 1.415,47 €/mes (jefaturas en hoteles 4-5★) según categoría, en 15 pagas .
> `convenio-hosteleria-valencia.html:313` — Camarero/a · Cocinero/a · Barman/Barwoman · Sumiller · Recepcionista · Repostero/a
> `convenio-hosteleria-valencia.html:854` — Cuantía Camarero/a en Valencia: III-3 (Hotel 3★ y viviendas turísticas).

**🟢 1.3 — 2/3**

Sobre el papel es el camino más completo del piloto: plazo del art. 59.2, papeleta ante el TAL de la Comunitat Valenciana, derecho a la nómina desglosada, cálculo explicado, reclamación retroactiva desde el día 1 en el caso de la tabla «sin experiencia», y el determinista registra tres enlaces al kit —los únicos con plantilla de atrasos y plantilla de solicitud de nóminas—. Lo que impide darle un 3 es que el paso decisivo está mal: manda al lector a un «Art. 34 (descuelgue)» que no consta en el articulado de este convenio (la ficha cita en todo momento los arts. 5, 10-21, 25, 28, 41, 42 y 51), y el párrafo de cabecera del bloque está roto y afirma una fecha de denuncia que no aparece en ninguna fuente citada. El camino existe pero uno de sus mojones apunta a un sitio que no está.

> `convenio-hosteleria-valencia.html:867` — Si la empresa pretende inaplicar el convenio , debe seguir el procedimiento de descuelgue (Art. 34) con periodo de consultas y comunicación a el TAL (Tribunal de Arbitraje Laboral) de la Comunitat Valenciana.
> `convenio-hosteleria-valencia.html:807` — tienes derecho a reclamar las diferencias con efectos retroactivos desde el día de tu contratación. Plazo: 1 año (art. 59.2 ET).

**🟢 1.9 — 2/3**

No disimula el hueco: hay un aviso destacado en la primera pantalla que dice que el convenio expiró el 31-XII-2025, que las tablas de 2025 siguen aplicándose por el art. 86.3 ET y —el matiz que casi nadie escribe— que no hay incremento automático, así que el lector entiende por qué su tabla es de hace tres años. Se queda en 2 porque no da el suelo real: el SMI no aparece con cifra en ningún punto del cuerpo (solo como enlace en el pie), y eso importa aquí más que en otras fichas, porque el Nivel V de la Tabla I —16.507 €/año— queda por debajo del SMI 2026 (17.094 €) y la ficha no lo advierte.

> `convenio-hosteleria-valencia.html:226` — El convenio expiró el 31/12/2025 pero las tablas siguen aplicándose por ultraactividad (art. 86.3 ET) mientras se negocia un nuevo texto. No hay incremento automático.
> `convenio-hosteleria-valencia.html:327` — 1.100,46 €
> `convenio-hosteleria-valencia.html:966` — Salario Mínimo Interprofesional 2026

**🔵 1.2 — 3/3**

Responde 7 de las 8 preguntas de una camarera valenciana, y casi todas con cifra: cuánto debe cobrar, cuánto le pagan el festivo trabajado (105,28 € en metálico), si cobra nocturnidad al salir a las dos de la mañana —con la respuesta incómoda de que entre las 22:00 y las 00:30 no se paga—, si le toca antigüedad a los 6 años —no, está congelada desde 1998—, qué hacer si es fija-discontinua y no la llaman, si es legal el contrato «sin experiencia» con tabla rebajada, si pierde el puesto cuando cambia la concesión, y cómo reclamar. Es la cobertura más ancha del piloto y la única que anticipa preguntas que el lector no sabe que debe hacerse (el plus de formación de 240 €/año, el 85% de días para la subrogación). La que falla: «trabajo 20 horas a la semana, ¿cuánto me corresponde?» — la tabla es de jornada completa y el tiempo parcial solo se menciona a propósito del fijo-discontinuo.

> `convenio-hosteleria-valencia.html:659` — Tabla I (restauración) 95,40 € 105,28 € 116,16 €
> `convenio-hosteleria-valencia.html:615` — 22:00 – 00:30 NO se paga (considerada parte de la jornada habitual)
> `convenio-hosteleria-valencia.html:666` — Si has empezado a trabajar en hostelería de Valencia después de 1998-2000, tu plus de antigüedad es cero , por mucho que pasen los años.

**🔵 1.4 — 3/3**

Es la mejor autoubicación del corpus junto con Comercio Madrid, y por delante en un aspecto: además de listar en lenguaje llano decenas de establecimientos reales por familia (chiringuitos, croasanterías, tablaos, cibercafés), escribe explícitamente lo que NO cubre —autónomo puro, dark kitchen sin local, otra provincia— y resuelve el caso frontera de moda, el del rider de plataforma. Y la tabla no da niveles abstractos: cada nivel lleva su columna «Puesto típico» con los oficios reales, y hay tres tablas según el tipo de establecimiento, que es como se organiza de verdad la hostelería. El lector sabe en menos de treinta segundos si le cubre, en qué tabla está y en qué fila.

> `convenio-hosteleria-valencia.html:275` — Te cubre si eres rider de una empresa hostelera: el reparto de comidas y bebidas a pie o en vehículo (sin autorización de transporte) está expresamente incluido — incluido el reparto a través de plataformas digitales
> `convenio-hosteleria-valencia.html:276` — NO te cubre si tu empresa solo prepara y reparte productos cocinados a domicilio sin tener establecimiento presencial (dark kitchens puras pueden quedar fuera, se interpreta caso por caso).
> `convenio-hosteleria-valencia.html:301` — Jefe/a de Cocina · Jefe/a de Sala · Encargado/a General · Gerente de Restauración Moderna

**🔵 1.6 — 3/3**

Es la única de las seis que convierte el prorrateo en una prueba de detección de fraude en lugar de en una nota al pie: le dice al lector que sume las líneas de extras de su recibo, que el total debe equivaler a tres mensualidades de base, y que si solo ve dos pagas o un prorrateo de 2/12 le están aplicando un convenio que no es el suyo. A eso suma el aviso de bruto antes de IRPF y Seguridad Social, el cálculo del bruto anual paso a paso con una categoría concreta, la base horaria explicada con su fórmula para poder auditar el plus de nocturnidad hora a hora, y un segundo test de error —contrastar la nómina con el Anexo II BIS para descubrir si te están pagando la tabla rebajada de «sin experiencia» sin derecho—. Es el nivel al que deberían subir las otras cinco. Solo le falta la absorción y compensación para no dejar ningún error típico fuera.

> `convenio-hosteleria-valencia.html:695` — Compárate con tu nómina : si te están prorrateando las pagas extras mes a mes (líneas separadas en la nómina), suma los importes "extra Junio + extra Navidad + extra Marzo prorrateado" — el total debe equivaler a 3 mensualidades de salario base al año . Si solo ves 2 pagas extras o el prorrateo de 2
> `convenio-hosteleria-valencia.html:431` — Importes brutos antes de descuentos de IRPF y Seguridad Social. Para calcular tu salario neto exacto con tu situación familiar, usa la calculadora oficial de SalarioJusto .
> `convenio-hosteleria-valencia.html:807` — revisa tu nómina y contrato. Si la cuantía coincide con el Anexo II BIS (las cifras rebajadas) y tú ya tenías ≥9 meses en hostelería, tienes derecho a reclamar las diferencias con efectos retroactivos

> LAS 8 PREGUNTAS QUE TECLEARÍA UNA CAMARERA VALENCIANA ANTES DE LLEGAR AQUÍ: (1) «¿cuánto tengo que cobrar de camarera en Valencia en 2026?»; (2) «he trabajado el festivo, ¿me lo tienen que pagar y cuánto?»; (3) «salgo a las dos de la mañana, ¿me corresponde nocturnidad?»; (4) «llevo 6 años en el mismo bar, ¿me toca antigüedad?»; (5) «soy fija-discontinua y no me llaman para la temporada, ¿qué hago?»; (6) «me contrataron como “sin experiencia” y cobro menos que mis compañeros, ¿es legal?»; (7) «el ayuntamiento ha cambiado la empresa del comedor, ¿pierdo mi puesto?»; (8) «hago 20 horas a la semana, ¿cuánto me corresponde de esa tabla?». RECORRIDO: responde 1, 2, 3, 4, 5, 6 y 7; falla en 8. — Es la ficha que mejor entiende a quién le habla. Se nota en que responde preguntas que el lector no sabía que tenía (el plus de formación de 240 €/año que casi nadie reclama, el 85% de días para entrar en la subrogación, el umbral de las 00:30 que anula la nocturnidad de casi todo el turno de noche) y en que usa la nómina como instrumento de detección, no como decorado. Su problema no es de cobertura sino de higiene: el bloque final de reclamación —justo el que remata toda esa cadena— es una plantilla rotada, con una frase rota, una fecha de denuncia sin fuente y una remisión a un artículo que no es de este convenio. Es el punto donde el lector pasa de leer a actuar, y es el único punto descuidado de la página. Fuera de mi eje: el determinista marca hardfail 5.1 (44% de las cifras en secciones sin referencia a artículo o boletín) y la comparativa introduce un segundo importe de Camarero/a (1.190,34 €/mes, de la tabla de hoteles 3★) que convive con los 1.214,84 €/mes de la Tabla I; está explicado en la nota al pie, pero un lector rápido se lleva dos cifras. VENTANA CERRADA: 21 días desde el último commit, así que las correcciones son aplicables ya.

### E4 · Captación y citabilidad

**🟢 2.4 — 2/3**

Cumple: cifra al frente, sector, provincia y año, y la horquilla evita prometer un salario único en un convenio con tres tablas distintas. No llega a 3 por dos motivos concretos: a 97 caracteres el paréntesis y la marca caen fuera del recorte, y la horquilla no es la cifra del puesto que más se busca —en hostelería la consulta es 'camarero', que en esta ficha cobra 1.214,84 € y no aparece ni en el title ni en la meta.

> `convenio-hosteleria-valencia.html:6` — <title>1.100–1.415 €/mes — Tablas salariales Hostelería Valencia 2026 (en ultraactividad) | SalarioJusto</title>
> `convenio-hosteleria-valencia.html:313` — <td>Camarero/a · Cocinero/a · Barman/Barwoman · Sumiller · Recepcionista · Repostero/a</td>
            <td class="num">1.214,84 €</td>

**Parche propuesto:** {'descripcion': "No es obligatorio (nota 2), pero si se toca, la vía es cambiar la horquilla por el puesto de más volumen y recuperar los caracteres del paréntesis: 'Camarero/a 1.214,84 €/mes — Hostelería Valencia 2026: tablas' (60 caracteres). Con 4.216 impresiones y 3,87% de CTR a posición 7,2, es una ficha que rinde razonablemente: probar, no reescribir por sistema."}

**🟢 2.5 — 2/3**

Cumple lo esperado: arranca con la cifra dentro del recorte, explica en una línea por qué unas tablas de 2025 valen en 2026 —que es la objeción que frena el clic en un convenio decaído— y deja dentro las 15 pagas y la jornada. No llega a 3 porque a 249 caracteres la traza final (BOP Valencia núm. 26) queda fuera del recorte, igual que en Comercio Madrid.

> `convenio-hosteleria-valencia.html:7` — <meta name="description" content="1.100,46 € a 1.415,47 €/mes según categoría. Tablas salariales del convenio de hostelería de Valencia 2026 en ultraactividad (art. 86.3 ET): cifras 2025 aplicables mientras se negocia. 15 pagas, jornada 1.794 h/año. BOP Valencia núm. 26, 07/02/2023.">

**🟢 4.1 — 2/3**

La FAQ principal sí es autocontenida —cifras, pagas, boletín y la razón de la vigencia en una sola respuesta—, pero la frase donde la cifra aparece por primera vez, la del hero, depende por completo del h1 que tiene encima: dice la horquilla y el número de pagas y no dice ni el sector, ni la provincia, ni el año. Arrancada de la página no significa nada.

> `convenio-hosteleria-valencia.html:224` — De <strong>1.100,46 €/mes</strong> (ayudantes, riders) a <strong>1.415,47 €/mes</strong> (jefaturas en hoteles 4-5★) según categoría, en <strong>15 pagas</strong>.
> `convenio-hosteleria-valencia.html:873` — Las tablas 2025 siguen aplicándose en 2026 por ultraactividad (art. 86.3 ET). Según el texto publicado en BOP Valencia núm. 26 del 7 de febrero de 2023, el salario base mensual mínimo es de <strong>1.100,46 €</strong> (Nivel V de restauración) y puede llegar hasta <strong>1.415,47 €</strong> en las 

**🟢 4.2 — 2/3**

El dato es extraíble: cada fila da nivel, puestos típicos, salario mensual y bruto anual, con la unidad dentro de la celda y el periodo en el encabezado. No llega a 3 porque los encabezados no distinguen entre las tres tablas —'Salario mes' significa una cosa en restauración y otra en hoteles de 4-5★— y porque el número de pagas, que es lo que hace interpretable el mensual, vive en un párrafo por encima y no en la tabla.

> `convenio-hosteleria-valencia.html:292` — <th>Nivel</th>
            <th>Puesto típico</th>
            <th style="text-align:right;">Salario mes</th>
            <th style="text-align:right;">Bruto/año</th>
> `convenio-hosteleria-valencia.html:284` — Salario base mensual bruto en 15 pagas (12 mensualidades + 3 extras de junio, navidad y marzo). Cifras oficiales publicadas en BOP Valencia núm. 26 del 7 de febrero de 2023.

**🟢 4.4 — 2/3**

La traza acompaña al bloque de tablas —el párrafo inmediatamente anterior cita boletín, número y fecha— y en el articulado casi cada apartado cierra con su artículo. Pero no baja al nivel de tabla: las tres tablas salariales quedan cubiertas por una sola referencia situada por encima de la primera, de modo que la Tabla II y la Tabla III, si se extraen sueltas, viajan sin fuente. El determinista las lista a las dos en cifras.secciones_sin_fuente.

> `convenio-hosteleria-valencia.html:284` — Cifras oficiales publicadas en BOP Valencia núm. 26 del 7 de febrero de 2023. Siguen aplicándose en 2026 por ultraactividad (art. 86.3 ET).
> `convenio-hosteleria-valencia.html:280` — <p class="nota-pie">Base: Arts. 1 (ámbito territorial), 2 (ámbito funcional) y 3 (ámbito personal) del XVII Convenio Intersectorial de Hostelería de Valencia.</p>

*Descartadas por el verificador:* `4.3` (El hallazgo se apoya en una cita recortada y en una ambigüedad que la ficha resuelve dos veces. (1) El card-title no dice «Tablas salariales 2025»: dice «Tablas salariales 2025 — Hostelería Provincia de Valencia», es decir, contiene sector, provincia y año, que es literalmente lo que exige la métrica 4.3 («la ficha dice explícitamente provincia, sector y año junto a la cifra», CANDIDATAS.md:97). E4 lo transcribe entero en su evidencia y lo trunca en la razón. (2) «Un motor tiene que resolver por su cuenta si 1.214,84 € es la cifra de 2025 o la vigente en 2026 [...] algo que ninguna tabla explica» es falso: el párrafo inmediatamente anterior a Tabla I lo explica, y el badge del hero (línea 221, «Tablas salariales 2025 · vigentes en 2026») lo repite antes del primer scroll. El residuo que queda —h3 sin territorializar y tablas sin caption— no pertenece a 4.3 sino a 11.1, donde E6 ya lo puntúa con sin_caption=20. No debe contarse dos veces.)

> Ventana cerrada (ultimo_commit 2026-07-30, 21 días): los parches se pueden ejecutar. Es la ficha con más tablas del piloto (20 según el determinista) y eso convierte su defecto en el más caro: cada tabla es una oportunidad de cita y ninguna se identifica a sí misma. El parche de 4.3 es mecánico y escala — el mismo caption sirve para las veinte. Un detalle que el sintetizador debería cruzar con E2/E5: tres preguntas de la FAQ viven dentro de un <details class="acordeon"> plegado (línea 890), incluidas la de 'qué hago si mi empresa paga menos' y la de dónde consultar el texto oficial. Están en el JSON-LD, así que para la máquina existen, pero para el lector están escondidas; no lo puntúo porque el contenido sí está y la citabilidad no se resiente. Fuera de mi eje: el determinista declara un hard-fail 5.1 (74 de 169 cifras, el 44%, en secciones sin referencia a artículo, anexo o boletín) — es la peor densidad de traza del piloto y explica por qué mi 4.4 se queda en 2 pese a que el bloque principal sí está bien citado.

### E5 · Enlazado y clúster

**🟠 6.4 — 1/3**

Solo cubre bien una dirección — 'Más recursos para Valencia' con Limpieza y Oficinas — y le falta la otra: a_hermanas_mismo_sector=1 y ese único destino es el pilar estatal, no una provincia. La ficha nombra ocho provincias hermanas en la fuente de su comparativa y no enlaza a ninguna. Además omite a convenio-metal-valencia.html, que sí la enlaza a ella.

> `analisis/auditoria-convenios/2026-08-20/deterministas/convenio-hosteleria-valencia.json:522` — "a_hermanas_mismo_sector": 1,
> `convenio-hosteleria-valencia.html:854` — <p class="callout-comp-tabla__source">Comparado con: Barcelona, Bizkaia, Cantabria, Cádiz, Granada, Madrid, Málaga, Sevilla. Bizkaia queda fuera del cálculo salarial: estructura 'total garantizado' por 6 niveles abstractos — no segrega categoría camarero/a. Cuantía Camarero/a en Valencia: III-3 (Hot

**Parche propuesto:** En la línea 854, convertir la enumeración en enlaces: «Comparado con: <a href="/convenio-hosteleria-barcelona.html">Barcelona</a>, <a href="/convenio-hosteleria-bizkaia.html">Bizkaia</a>, <a href="/convenio-hosteleria-cantabria.html">Cantabria</a>, <a href="/convenio-hosteleria-cadiz.html">Cádiz</a>, <a href="/convenio-hosteleria-granada.html">Granada</a>, <a href="/convenio-hosteleria-madrid.html">Madrid</a>, <a href="/convenio-hosteleria-malaga.html">Málaga</a> y <a href="/convenio-hosteleria-sevilla.html">Sevilla</a>.» Va ahí porque es la única frase de la ficha en que el lector ya está comparando provincias y no tiene adónde ir. Y añadir convenio-metal-valencia.html al bloque de la línea 953, por reciprocidad.

**🟢 6.3 — 2/3**

Hay enlaces que nacen donde toca: la nota al pie de la tabla manda a la calculadora justo cuando acaba de decir que los importes son brutos, y la fuente de la comparativa remite al pilar sectorial en la frase en que compara. No es 3 porque los dos enlaces de la misma provincia siguen apilados en el bloque final y el párrafo de la comparativa nombra ocho provincias sin enlazar ninguna.

> `convenio-hosteleria-valencia.html:431` — <p class="nota-pie">Importes brutos antes de descuentos de IRPF y Seguridad Social. Para calcular tu <strong>salario neto exacto</strong> con tu situación familiar, usa la <a href="/">calculadora oficial de SalarioJusto</a>.</p>
> `convenio-hosteleria-valencia.html:854` — <p class="callout-comp-tabla__source">Comparado con: Barcelona, Bizkaia, Cantabria, Cádiz, Granada, Madrid, Málaga, Sevilla. Bizkaia queda fuera del cálculo salarial: estructura 'total garantizado' por 6 niveles abstractos — no segrega categoría camarero/a. Cuantía Camarero/a en Valencia: III-3 (Hot
> `convenio-hosteleria-valencia.html:953` — <li><a href="/convenio-limpieza-valencia.html">Convenio de Limpieza de Edificios y Locales en Valencia</a></li>

**🟢 6.5 — 2/3**

anchors_genericos=[] y las anclas de los bloques finales nombran sector y provincia con precisión. No es 3 porque son etiquetas de catálogo y porque las ocho provincias de la línea 854 son texto plano: ahí están escritos los mejores anclas posibles de toda la ficha y no son enlaces.

> `convenio-hosteleria-valencia.html:953` — <li><a href="/convenio-limpieza-valencia.html">Convenio de Limpieza de Edificios y Locales en Valencia</a></li>
> `convenio-hosteleria-valencia.html:854` — <p class="callout-comp-tabla__source">Comparado con: Barcelona, Bizkaia, Cantabria, Cádiz, Granada, Madrid, Málaga, Sevilla. Bizkaia queda fuera del cálculo salarial: estructura 'total garantizado' po…

**🔵 6.2 — 3/3**

entrantes_n=14 desde seis fichas distintas, y tres de ellas son de otro sector de la misma provincia — limpieza, metal y oficinas de Valencia —, además del pilar sectorial y de dos hermanas de hostelería. Ninguna otra ficha del piloto tiene esa reciprocidad cross-sector triple, y las anclas entrantes nombran sector y provincia ('Convenio de Hostelería en Valencia').

> `analisis/auditoria-convenios/2026-08-20/deterministas/convenio-hosteleria-valencia.json:545` — "entrantes_desde": [

*Descartadas por el verificador:* `6.6` (La métrica 6.6 es «Puente al Kit en el punto donde nace la necesidad, no al final» (CANDIDATAS.md:131) y la ficha tiene ese puente. El bloque «¿Cobras menos de lo que fija el convenio?» cierra, tras los tres pasos, con un enlace a la guía de reclamación — que el recolector cuenta como Kit por su propia regla (convenios-recolector.py:398: `kit = {h for h in destinos if "plantilla" in h or "reclamar" in h ...}`). Es decir, de los tres enlaces al Kit uno está exactamente donde el lector acaba de descubrir que cobra de menos, no en la lista final. «Cantidad sin colocación» no se sostiene. Lo único cierto es que las dos plantillas concretas no se citan en el paso 2, y eso es una mejora de colocación, no una insuficiencia de nota 1 sobre una ficha con al_kit=3, el máximo del piloto y el percentil 75 del corpus, como el propio E5 reconoce.)

> Valencia es el nodo mejor conectado del piloto en entrada y el que más desperdicia su propia salida: la comparativa de la línea 854 es un mapa del clúster de hostelería escrito en texto plano. Ese patrón se repite en las 10 fichas del corpus que llevan 'Comparado con:' — todas enlazan solo al pilar sectorial y ninguna a las provincias que nombran (una sola excepción, un enlace a Barcelona). Es el enlace que más falta en todo el corpus y se arregla con una sola línea por ficha.

### E6 · Forma y lectura

**🟠 7.2 — 1/3**

En escritorio cumple: tablas.verde_en_tablas = 0 y la clase td.sal no llega a usarse, así que las cifras salen en tinta neutra. Pero la regla del bloque móvil pinta en verde todas las celdas numéricas de .tabla-salarios, que son precisamente las tres tablas de salario base y bruto anual de la ficha. Por debajo de 720 px —donde está la mayor parte del tráfico— cada cifra salarial es verde. El defecto viene heredado del canon, que trae la misma regla, así que corregirlo aquí obliga a decidirlo también allí.

> `convenio-hosteleria-valencia.html:147` — .tabla-salarios td.sal,.tabla-salarios td.num{font-size:15px;color:var(--green);}
> `convenio-hosteleria-valencia.html:302` — <td class="num">1.337,87 €</td>
> `convenio-hosteleria-madrid.html:189` — .tabla-salarios td.sal,.tabla-salarios td.num{font-size:15px;color:var(--green);}

**Parche propuesto:** Cambiar la línea 147 a «.tabla-salarios td.sal,.tabla-salarios td.num{font-size:15px;color:var(--ink);font-weight:700;}» y, si hace falta destacar la cifra en la tarjeta móvil, hacerlo con peso tipográfico, no con color. Cambiar además td.sal de la línea 137 a var(--ink) para que la regla no pueda reaparecer. Conviene aplicar el mismo cambio en convenio-hosteleria-madrid.html (línea 189), porque es de donde viene.

**🟠 11.1 — 1/3**

sin_scope = 20 y sin_caption = 20 en las veinte tablas, y una de ellas no tiene ni th: la de «Lo básico» de jornada es una tabla de datos de dos columnas cuya primera columna es el nombre del dato, y sin encabezado un lector de pantalla oye pares sueltos sin saber qué está enumerando. Es el mismo defecto que arrastra el canon en su tabla equivalente.

> `convenio-hosteleria-valencia.html:443` — <table>
> `convenio-hosteleria-valencia.html:445` — <tr><td>Jornada máxima anual</td><td><strong>1.794 horas</strong> efectivas</td></tr>
> `convenio-hosteleria-valencia.html:292` — <th>Nivel</th>

**Parche propuesto:** Dar cabecera a la tabla de jornada: «<thead><tr><th scope="col">Límite de jornada</th><th scope="col">Lo que fija el convenio</th></tr></thead>», y convertir la primera celda de cada fila en th scope="row". En las tres tablas salariales, añadir scope="col" a los cuatro th y un caption que las distinga entre sí, que es lo que hoy solo dice el h3: «<caption style="caption-side:top;text-align:left;font-size:13px;color:var(--ink-light);padding-bottom:8px;">Tabla I — restaurantes, cafeterías, bares y colectividades: salario base mensual y bruto anual en 15 pagas por nivel profesional (BOP Valencia núm. 26, 7-II-2023).</caption>», adaptando el rótulo a las Tablas II y III.

**🟢 7.4 — 2/3**

De 61 párrafos, parrafos.largos_100 solo detecta dos, y los dos rondan justo el umbral: no hay ladrillos. La entrada a la ficha está troceada en hero, aviso de ultraactividad, card de datos clave e índice, cada pieza con una sola idea. No llega a 3 porque no tiene nota editorial con etiquetas temáticas: el lector que quiera el resumen de treinta segundos tiene que armárselo leyendo cuatro bloques distintos.

> `convenio-hosteleria-valencia.html:226` — El convenio expiró el 31/12/2025 pero las tablas siguen aplicándose por ultraactividad (art. 86.3 ET) mientras se negocia un nuevo texto. No hay incremento automático.
> `convenio-hosteleria-valencia.html:666` — Esto sorprende: <strong>los complementos de antigüedad están congelados</strong> desde los convenios de 1995-1997

**🟢 8.1 — 2/3**

No hay bloque prescindible: las trece secciones h2 responden a preguntas distintas y las que podrían parecer relleno —fijo-discontinuo, Tabla II BIS— son justo las que cubren las situaciones más frecuentes del sector. No es 3 porque «Registro diario de jornada (obligatorio)» y «Pausa dentro de la jornada» son dos h3 de dos y tres líneas que caben en el bloque «Lo básico» sin perder nada.

> `convenio-hosteleria-valencia.html:479` — Registro diario de jornada (obligatorio)
> `convenio-hosteleria-valencia.html:482` — Pausa dentro de la jornada

**🟢 8.2 — 2/3**

El hero da el rango salarial completo con las dos puntas y el número de pagas antes de cualquier contexto, y el índice deja saltar a las tablas. No es 3 porque entre esa promesa y las tablas se interpone la sección de ámbito funcional, que son nueve viñetas largas: quien ya sabe que trabaja en hostelería en Valencia tiene que atravesarlas o usar el índice para llegar a su cifra.

> `convenio-hosteleria-valencia.html:224` — De <strong>1.100,46 €/mes</strong> (ayudantes, riders) a <strong>1.415,47 €/mes</strong> (jefaturas en hoteles 4-5★) según categoría, en <strong>15 pagas</strong>.
> `convenio-hosteleria-valencia.html:267` — <h2 id="ambito">Antes de seguir: ¿este convenio te cubre?</h2>

**🟢 8.3 — 2/3**

No encuentro ninguna idea desarrollada dos veces en secciones distintas del cuerpo: la ultraactividad se enuncia en el hero y se remata en marco legal, pero con función distinta (aviso y fuente), y el Plus de Formación se explica una sola vez. Las FAQ repiten lo del cuerpo, que es la redundancia esperada del formato. No es 3 porque el aviso de ultraactividad aparece tres veces en la primera pantalla —badge, párrafo bajo el badge y hero-sub— diciendo lo mismo con distinta tipografía.

> `convenio-hosteleria-valencia.html:224` — Vigencia 2022–2025 (en ultraactividad).
> `convenio-hosteleria-valencia.html:226` — El convenio expiró el 31/12/2025 pero las tablas siguen aplicándose por ultraactividad (art. 86.3 ET) mientras se negocia un nuevo texto.

**🟢 8.6 — 2/3**

jerga detecta seis términos y todos con explicacion_cerca = true; en el HTML la explicación explica de verdad y a veces con consecuencia práctica («No hay incremento automático» tras ultraactividad, o el aviso de que un prorrateo de 2/12 delata que te aplican otro convenio). No es 3 porque la explicación del término más caro para el bolsillo —qué implica exactamente que el convenio esté en ultraactividad respecto a la subida que no llega— se queda en una línea y no se traduce a euros, como sí hace limpieza-zaragoza.

> `convenio-hosteleria-valencia.html:695` — Si solo ves 2 pagas extras o el prorrateo de 2/12, te están aplicando un convenio que NO es el tuyo.
> `convenio-hosteleria-valencia.html:226` — las tablas siguen aplicándose por ultraactividad (art. 86.3 ET) mientras se negocia un nuevo texto. No hay incremento automático.

**🟢 8.8 — 2/3**

norma.sindicatos da CCOO 4 · UGT 4 y norma.dice_los_sindicatos = 2. Las menciones son de firmantes, con la denominación federal completa y sin protagonismo de una sigla sobre la otra: uso como fuente del dato, legítimo. No es 3 porque la ficha nunca habla de la representación del sector más allá de quién firmó, ni da un porcentaje que sitúe a nadie.

> `convenio-hosteleria-valencia.html:916` — <strong>FeSMC-PV UGT</strong> (Federación de Servicios, Movilidad y Consumo del País Valenciano) · <strong>CCOO Servicios País Valenciano</strong>

**🟢 12.3 — 2/3**

El esqueleto es prácticamente el del canon, sección por sección y en el mismo orden, incluida la comparativa provincial y el bloque de firma. No hay desviación estructural que señalar; lo que se aparta son adiciones de contenido propio, no cambios de armazón.

> `convenio-hosteleria-valencia.html:717` — Contrato fijo-discontinuo: el más usado en hostelería
> `convenio-hosteleria-madrid.html:727` — Contrato fijo discontinuo: el que más se usa en hostelería

**🟢 12.6 — 2/3**

El desdoblamiento inclusivo es consistente en las tres tablas de niveles («Camarero/a», «Jefe/a de Cocina», «Repartidor/a (rider)», «Gobernante/a») y los candidatos masculinos que marca norma —Auxiliar, Ayudante, Recepcionista— son epicenos. La única grieta: la misma categoría se escribe «Barman/Barwoman» en la Tabla I y «Barman» a secas en la Tabla II, cuarenta y seis líneas después.

> `convenio-hosteleria-valencia.html:313` — <td>Camarero/a · Cocinero/a · Barman/Barwoman · Sumiller · Recepcionista · Repostero/a</td>
> `convenio-hosteleria-valencia.html:359` — <td>Camarero/a · Cocinero/a · Recepcionista · Barman · Camarero/a de Pisos</td>

**🔵 7.5 — 3/3**

headings.h1 = 1, saltos_jerarquia = [] pese a bajar hasta h4, y —esto es lo que la separa— los encabezados por sí solos ya cuentan la ficha: dicen la cifra, el artículo y a veces la advertencia. «Plus Compensatorio de Formación: 240 €/año si la empresa no te forma», «La trampa: el certificado debe ser de formación real y efectiva», «Pagas extras: por qué Valencia tiene 3 y no 2», «Si te cambian de jefe: el convenio Valencia SÍ tiene subrogación (Art. 41)». Leídos en fila son un índice narrado, no una lista de etiquetas.

> `convenio-hosteleria-valencia.html:634` — Plus Compensatorio de Formación: 240 €/año si la empresa no te forma
> `convenio-hosteleria-valencia.html:644` — La trampa: el certificado debe ser de formación "real y efectiva"
> `convenio-hosteleria-valencia.html:747` — Si te cambian de jefe: el convenio Valencia SÍ tiene subrogación (Art. 41)

**🔵 7.8 — 3/3**

Es la ficha que mejor demuestra que el canon y lo exclusivo no se estorban. Reproduce el esqueleto de hosteleria-madrid sección por sección —hasta el «Si te cambian de jefe», que en Madrid encabeza la negativa y aquí la afirmativa— y encima mete tres bloques que no existen en el canon y que son puro Valencia: la Tabla II BIS de salario sin experiencia, la paga única de la cláusula IPC activada en 2024 y el Plus Funcional de Restauración Moderna. Ninguno está pegado al final: los tres van en el cuerpo, antes de la comparativa.

> `convenio-hosteleria-valencia.html:774` — Salario sin experiencia: la Tabla II BIS (Art. 5.E)
> `convenio-hosteleria-valencia.html:698` — La paga única IPC: cláusula de garantía activada en 2024
> `convenio-hosteleria-madrid.html:753` — Si te cambian de jefe: el convenio Madrid NO tiene subrogación

> En forma es la mejor de las cinco fichas con tablas: encabezados narrados, cero ladrillos, contenido exclusivo integrado sin romper el canon. Su único defecto serio es que hereda del canon el verde sobre las cifras en móvil, lo que convierte la corrección en una decisión de plantilla y no de ficha: si se toca aquí hay que tocar hosteleria-madrid, y con él todas las que copien esa hoja de estilo. Fuera de mi eje: el recolector marca hard-fail 5.1 porque el 44% de las cifras (74 de 169) están en secciones sin referencia a artículo, anexo o boletín — no es un problema de forma sino de trazabilidad, pero conviene decir que la ficha tiene el hábito contrario en sus mejores secciones (cada plus lleva su artículo en el encabezado), así que el arreglo es extender un patrón que ya existe, no inventarlo.
