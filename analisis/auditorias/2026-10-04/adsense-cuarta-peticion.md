# Auditoría pre-AdSense · cuarta petición · 4-oct-2026

**Veredicto: no solicitar la revisión todavía.** Hay 12 bloqueantes confirmados contra el HTML real, casi todos baratos de arreglar, y tres decisiones que solo Telmo puede tomar. El contenido NO es pobre: el problema son afirmaciones falsas o caducas en superficie YMYL, una calculadora que promete lo que no hace, contadores podridos en la primera pantalla y medio repositorio interno servido en producción.

Producción = `origin/main` 757c108, verificado byte a byte en 98 de 98 URLs. Todo lo que sigue está en producción ahora mismo.

**Este fichero está bajo `analisis/`, que hoy es público en salariojusto.es. No commitearlo hasta que exista `.vercelignore` (PR 1).**

## Método

Ocho agentes en paralelo, cada uno con un frente cerrado y sin permiso de escritura (home · políticas · thin/duplicados · SEO técnico · E-E-A-T · navegación · producción · fichas). Informes completos y capturas en `/private/tmp/claude-501/-Users-telmo-Projects-salariojusto/726ab512-1cf6-4895-aaa5-eecd53193027/scratchpad/adsense/` (`A-home.md` … `H-fichas.md`, `G-vivo.md` con 12 PNG). Los tres verificadores adversariales cayeron por el límite de sesión de la API; la verificación de todos los 🔴 y de los 🟠 principales la hice yo con comprobaciones directas sobre los ficheros (greps, parseo de JSON-LD, censo, 2 peticiones HTTP). Lo que no recomprobé lleva la marca «citado por X, no recomprobado».

Recuento bruto de los ocho informes: 19 🔴 · 78 🟠 · ~100 🟡. Tras verificar y deduplicar: **12 🔴 · 24 🟠 · 🟡 agrupados**. Refutados o matizados: 5 (al final).

## Lo que está bien y no hay que tocar

- Contenido indexable sólido: mediana 3.685 palabras de cuerpo por página, 0 páginas < 400, 0 con boilerplate > 60 %, solape entre fichas del mismo sector 2-7 %. Kit 12/12 plantillas completas con copiar/descargar funcionales.
- `ads.txt` correcto y en `text/plain`; publisher vigente en 95/95 páginas; la cuenta zombi no aparece.
- Consent mode por defecto denegado en 93/93; un solo banner (renderizado, no hipótesis); «Rechazar» persiste; 0 errores de consola en 7 páginas.
- Footer legal en 93/93; canonical correcto en 94/94; sitemap = exactamente las 86 indexables; 0 enlaces internos a ficheros inexistentes; 272 bloques JSON-LD sin errores de sintaxis; H1 único y titles/descriptions sin duplicados.
- Mega-menú: 57/57 fichas enlazadas con rótulo correcto, sin noindex (los rótulos falsos de la issue #108 ya no están).
- SMI 2026 coherente en 40+ páginas contra el RD 126/2026 (salvo los dos puntos del 🔴 10). Plantilla del RD 723/2026 correcta. Ningún provincial dice «verificado contra el BOE». «Unzueta» no aparece en ningún fichero servido.
- Deploy: 98/98 URL idénticas a `main`; cabeceras limpias; API responde 200 JSON a tres peticiones reales.

## 🔴 Bloqueantes confirmados

| # | Dónde | Qué | Evidencia (leída por mí) | Arreglo |
|---|---|---|---|---|
| 1 | `index.html:3792` | El único enlace legal del footer de la home apunta a un BOE equivocado | Rótulo «Directiva UE 2023/970 de Transparencia Retributiva» → `BOE-A-2023-13408`, cuyo título real es «Resolución de 26 de mayo de 2023, del Ayuntamiento de Colmenar Viejo… convocatoria para proveer varias plazas». `normas.json` tiene la URL buena (EUR-Lex CELEX 32023L0970) | Sustituir por la URL de `normas.json`. Añadir a `legal-claims.js` un check de destino para enlaces del BOE (hoy valida citas, no destinos) |
| 2 | `index.html:3345, 3418, 3552, 3568, 3609, 2586` | La calculadora promete escala autonómica y no la aplica | L3418: «La escala autonómica se aplica automáticamente desde la CCAA elegida arriba». L3552/3568: `calcNetV2(…, null)`; el listener de `#ccaa` no lee el select; `lib/irpf-autonomico.js` no se carga. L2586 (hero): «IRPF 2026 vigente en tu comunidad autónoma» | O conectar la escala autonómica de verdad, o quitar el select y las dos promesas. Un widget que miente en la home es motivo clásico de rechazo |
| 3 | `index.html:2592-2609, 2624, 2693, meta L73/78/84` | Primera pantalla con cifras falsas | Trust-bar: «39 Convenios verificados» (censo 59), «20 Referencias legales» (`normas.json` 75), «8 + Bizkaia · IRPF autonómico + foral» (no se aplica ninguna, ver 🔴 2), «Julio 2026 · Actualizado» (censo 22-sep). A 10 líneas de «Ver los 59 convenios →». L2624 «Actualizado: julio 2026», L2693 «54 auditados a mano», og/twitter «47», meta «54», directorio lista 47 de 59, mega-menú «Metal 8 fichas» (L2208, hay 10) y «Comercio 3 fichas» (L2247, hay 7) | Decidir qué mide «verificados» (ver Decisiones). Derivar fecha del censo. Meter trust-bar, fechas y contadores del mega-menú en `SYNC_POINTS` de `convenios-sync.js` en el mismo PR, o se vuelven a pudrir |
| 4 | Vercel (sin `.vercelignore`) | Medio repositorio interno servido en producción | En vivo con 200: `analisis/**` (227 ficheros: CSV GA4/GSC, auditorías internas con los fallos de cada ficha, CONTEXT.md de Mission Control), `research/informe-2026/draft.md` (el informe «nunca publicado»), `VERIFICACION-CONVENIOS.md` (flujo «Claude busca… Claude entrega la ficha»), `listado-muestra-200.csv` (200 empresas de terceros), `legacy/calc-v1/index.html` (segunda calculadora con AdSense, sin consent mode, canonical a `/`), `scripts/**`, `docs/`, `data/convenios/censo.json` (notas «SIN cotejo humano», «confianza: revisar»). Contradice el relato de `sobre.html` y duplica la home | `.vercelignore` con `analisis/ research/ scripts/ docs/ legacy/ _og/ og-cards/*.html design-mockups/ VERIFICACION-CONVENIOS.md listado-muestra-200.csv data/convenios/censo.json`. **No excluir `data/convenios/*.json` ni `lib/`: la home los carga en runtime (`index.html:4379-4419, 4559`)**. Cerrar el PR #104 (abierto desde el 9-sep) |
| 5 | 41 páginas (44 enlaces) | CTA «Verificar mi salario →» roto | `href="/#verifica-convenio"`; el id no existe en la home desde `72792fd` (#57, 11-jul); la sección es `id="convenio-section"` (L3632). Incluye `convenios.html:662/852`, `mapa-del-sitio.html:152`, 37 fichas y el BreadcrumbList de construcción estatal | `sed` global `#verifica-convenio` → `#convenio-section` |
| 6 | `convenio-hosteleria-cadiz.html:477`, `-granada:512`, `-malaga:776`, `convenio-oficinas-valencia.html:424`, `-hosteleria-madrid:786` | Placeholder visible y ultraactividad inventada en fichas vigentes | Texto visible: «El convenio está en ultraactividad desde tras el fin de la vigencia formal… la denuncia (los sindicatos la presentó el **fecha pendiente de verificación**)». Censo: Cádiz, Málaga y Oficinas Valencia = `vigente` (no ultraactividad). Madrid:786 misma frase rota («los sindicatos la presentó el octubre de 2025»). Bloque de plantilla `bp-rotado` | Reescribir el bloque en las 5; en las vigentes, quitar la ultraactividad. Añadir `pendiente de verificación` a los placeholders que vigila `secciones-convenios.js` |
| 7 | `convenio-construccion-bizkaia`, `-construccion-madrid`, `-metal-bizkaia`, `-hosteleria-cadiz`, `-cantabria`, `-granada` | Schema FAQPage con 7-8 preguntas y **ninguna** visible en la página | Parseo propio normalizando entidades y comillas: 0 de 7-8 preguntas aparecen en el HTML fuera de `<script>`. Otras 5 fichas tienen más preguntas en schema que visibles (Barcelona 10/6, citado por D/H) | Añadir la sección FAQ visible (es contenido útil) o retirar el schema. Es la política de datos estructurados de Google: markup que no corresponde a contenido visible |
| 8 | `guias.html:63, 378, 632` · `sobre.html:460` · `ley-transparencia-salarial-2026.html` (title/h1) · hub del kit · `rangos…` · sala de prensa | Afirmación legal central sin fuente: «Directiva 2023/970 traspuesta el 7 de junio de 2026», «en vigor desde el 7 de junio» | `normas.json` no registra ninguna norma de transposición (solo el RD 723/2026, que transpone la 2019/1152, con nota «NO confundir»). `pedir-banda:232` dice lo contrario: «si España no la transpone a tiempo…». Un sitio YMYL afirmando una ley que no cita | Verificar en BOE si existe ley/RD de transposición a 4-oct. Si no existe, reescribir las ~12 frases (lista en `C-thin-duplicados.md` §7 y `E-eeat.md`). Registrar antes en `normas.json` lo que se afirme |
| 9 | `convenio-comercio-textil-comunidad-valenciana.html:438, 758` | Dato jurídico falso y firma de verificación que el censo niega | L438: «Aquí no hay interés por mora… el texto del comercio textil no contempla ningún recargo por pagar tarde». El art. 29.3 ET fija el 10 % de interés por mora con independencia del convenio; no está registrado en `normas.json`. L758: «Convenio verificado por Telmo · septiembre de 2026»; censo: «SIN cotejo humano todavía» | Reescribir L438 (registrar art. 29.3 ET primero). L758: o Telmo coteja y se marca en el censo, o se reescribe la firma |
| 10 | `convenio-hosteleria-madrid.html:780` · `que-es-un-salario-justo.html:275` | SMI 2025 presentado como el mínimo legal vigente | «salario mínimo legal (SMI: 1.184 €/mes en 14 pagas)»; el SMI 2026 es 1.221 €/mes · 17.094 € (como dice `salario-minimo-interprofesional-2026.html`). (`convenio-hosteleria-alicante.html:329`, citado por H, no recomprobado) | Corregir a 1.221 / 17.094 y revisar la comparación «por debajo del SMI» que depende de la cifra |
| 11 | `convenio-limpieza-asturias.html:401, 446, 68` | Derecho derogado y plazo vencido en futuro | L401: «el Art. 86.3 … fija una ultraactividad de 1 año» (régimen derogado por el RDL 32/2021). L446: «Atrasos de 2026: el plazo vence el 29 de septiembre de 2026» (ya vencido). L68: FAQPage con texto de 2025 (citado por H). REGCON da vigencia hasta 2027 frente al 2025 del censo (revisión vencida del 30-sep) | Reescribir las tres y actualizar el censo tras mirar REGCON |
| 12 | `convenio-hosteleria.html:7, 12, 212, 214, 256, 602, 644, 682` | El pilar de hostelería niega tres fichas propias y da la cifra vieja | «15 provincias auditadas» ×5 (censo: 18 provinciales); «Pendiente de auditar» en Las Palmas (602), Alicante (644) y Gipuzkoa (682), que tienen ficha indexable | Actualizar a 18 y enlazar las tres. Meter el pilar en `SYNC_POINTS` |

## 🟠 Graves confirmados

**Legal, identidad y privacidad**
- `aviso-legal.html:183`, `privacidad.html:269`, `sala-de-prensa.html:221`: el titular figura como «Telmo Gómez». La norma de la casa es «solo Telmo» en superficie pública. Ver Decisiones: si Gómez no es el apellido legal, esto sube a 🔴 (identificación LSSI falsa).
- `aviso-legal.html:183`: sin domicilio o dirección a efectos de notificaciones ni NIF (LSSI art. 10.1.a y e, leído en el BOE por B).
- `index.html:2392-2398`: etiqueta de **Google Ads** `AW-18033533155` (conversión de anunciante) con segunda carga de `gtag.js`, ping a `pagead2…/ccm/collect` antes del consentimiento (G) y **sin declarar en `privacidad.html`** (0 menciones de «Google Ads»). Solo en la home. Si no hay campaña, quitarla.
- `cookie-consent.js:60-61`: «y, en el futuro, mostrar publicidad» con AdSense cargado en 93/93. No hay «gestionar/revocar consentimiento» en ningún footer.
- `api/calculate.js`: función viva que la home actual **no usa** (ids inexistentes, solo la llama la legacy), genera texto jurídico con un modelo de lenguaje sin pasar por el gate legal, con el prompt citando «SMI 2025 (15.876 €)»; `privacidad.html:133` infradeclara lo que se envía a Anthropic. Apagar o gatear.
- `sobre.html:283`: cotización del trabajador «7,56 % = 4,80 CC + 1,55 + 0,10 FOGASA + 1,11 FP». FOGASA es cuota exclusivamente empresarial; el desglose no corresponde a los tipos del trabajador (a contrastar con la Orden de cotización 2026 antes de editar; el código usa 0,0756).
- `sobre.html:576, 578`: «Ley 12/2023 — modificaciones al IRPF» (es la ley por el derecho a la vivienda, BOE-A-2023-12203) y «Real Decreto 145/2023 — modelo 145» (no localizado; parece cita inventada). Ninguna está en `normas.json`.
- `sobre.html:421, 493`: «Kit del trabajador con 10 esqueletos de plantillas… plantilla 1 redactada; resto en cola editorial». Falso: 12 plantillas completas.
- `que-es-un-salario-justo.html:95, 304` «LISOS art. 22.2 … multas hasta 187.515 €» y hub del kit `:123, 671, 731` «Art. 8.12 LISOS … hasta 187.515 €» y «El Art. 24 de la Directiva exige… sanciones». Cuantías y artículo no coinciden con `normas.json` ni con el RDL 5/2000 (E leyó el BOE: 22.2 es grave en materia de Seguridad Social, 3.750-12.000 €; muy grave hasta 225.018 €; sanciones = art. 23 de la Directiva, represalias = art. 25).
- Monetización contradictoria: `sobre.html` promete «sin acuerdos comerciales», `sala-de-prensa.html:240` «exclusivamente vía Google AdSense», `colabora.html:136` pide donaciones por Ko-fi.
- Sin registro público de correcciones aunque `sobre`, `colabora` y `prensa` lo prometen (E).

**Páginas de apoyo caducadas (en noindex pero enlazadas desde todos los footers)**
- `salario-minimo-interprofesional-2026.html` (46 entrantes, 328 palabras): se contradice. L190-192 «Retención IRPF 0 € (exento) · Neto anual 15.802 €» vs FAQ L224-227 «Sí… 1,48 % … ≈ 15.078 €». Sin enlace al BOE. Recomendación: corregir, engordar a ≥ 900 palabras e indexar (es el editorial que demuestra que el sitio no es un volcado de tablas).
- `sala-de-prensa.html` (82 footers): L202/204 «Próximamente: logo…», «Próximamente: capturas…»; L210 «Cuando se publique el informe de junio 2026» (publicado el 19-may); L141 «herramienta gratuita». O se completa o se quita del footer.
- `tramos-irpf-2026.html`, `colabora.html`: ver recomendación por noindex en `C-thin-duplicados.md` §3.

**Hubs y navegación**
- `salarios.html:7, 12, 100, 215, 223, 233, 428`: «16 provincias · 4 sectores», «26 fichas», «Última actualización: 12 de junio de 2026»; enlaza 30 de 57 fichas (sin comercio ni la mayoría del metal).
- `convenios.html:7, 248, 256, 272, 699`: 59 / «52 convenios auditados · 8 sectores» / «55 fichas auditadas cifra a cifra» / «38 fichas provinciales» en la misma página.
- `mapa-del-sitio.html`: omite 18 páginas indexables (las 12 plantillas, el hub del kit, informe, registro retributivo, pedir banda, que-es, textil CV) y sí lista 2 noindex.
- `construccion-estatal-suelo-salarial.html`: header antiguo sin mega-menú ni Kit, 2 `<footer>`, 2 `</main>` para 1 `<main>`, BreadcrumbList con URL de fragmento (L28).
- `que-es-un-salario-justo.html`: huérfana (0 enlaces entrantes).
- Pilares sectoriales no enlazan 3 fichas de su sector cada uno; `#cobras-menos` roto en el índice de 10 fichas incl. Madrid (F, no recomprobado).
- Página 404 = texto plano de Vercel (79 bytes, «NOT_FOUND»), sin marca ni navegación. No hay `404.html`. Las 168 `salario-neto-*` retiradas caen ahí.

**Fichas (además de los 🔴)**
- Titles con rangos que no están en la página: `convenio-limpieza-laspalmas.html` «1.010–1.384 €/mes» y `convenio-limpieza-sevilla.html` «1.185–1.318 €/mes»: ninguna de las cuatro cifras aparece en el cuerpo.
- Sello «contra el boletín oficial de la provincia» sin número ni fecha en 6 fichas (norma T10): hostelería Cádiz:210, Granada:212, Málaga:163, Sevilla:247, limpieza Las Palmas:198, oficinas Valencia:219 (citado por H con línea; no recomprobado).
- `og:image` 404 en `convenio-limpieza-tenerife.html:14,19` y `convenio-metal-asturias.html:14,19` (`og-cards/*.png` no existen en el repo).
- 7 enlaces externos rotos reales en 5 páginas indexables (2 búsquedas del BOE a página de error, INE 404, ITSS 404, `fedeme.es` TLS roto, `sea.es` caído) + gencat en Limpieza Catalunya. Lista exacta en `D-tecnico.md` §2.6.
- Autoría inconsistente: 11 fichas «por Telmo», 56 «por SalarioJusto», 0 editoriales con autor visible, 90/93 sin `author` en JSON-LD; «Quién audita esto» genérico (E/H).
- Directiva en futuro en 12 líneas de 10 páginas («entrará en vigor», «faltan 17 días» estático): lista en `C-thin-duplicados.md` §7.

## 🟡 Menores (agrupados; detalle en los informes)

- Home: ≈67 KB de 239 KB es código muerto u oculto (JS calc v1 sin disparadores L3809-4357, 18,8 KB CSS huérfano) y dos modales `display:none` (L2403-2581) con claims caducos («Transposición prevista antes del 7 de junio de 2026», «Multas de hasta 225.018 €»). JSON-LD `WebApplication` + `SearchAction` a un `?q=` que no existe (L35-68). `<meta charset>` en el byte 1188. Lighthouse local móvil 88 / LCP 3,3 s; ficha CLS 0,154.
- Banner de cookies = 29 % del viewport móvil y tapa el CTA «Calcular mi salario neto» (captura `home-mobile-390.png`). Mega-menú de 940 px sin scroll a 1366×768. Hamburguesa sin `aria-expanded`. `hola@` en el pie de la home frente a `contacto@` en el resto.
- `lastmod` del sitemap congelado (43/86 desfasados 23-131 días). 11 titles > 100 caracteres; descriptions hasta 478. `/convenios.html/` con barra devuelve 200. `/en/` da 404 y está en `llms.txt`; `llms.txt` lista 5 noindex y omite 4 fichas. 22 `Article` sin `author`.
- Firewall de Vercel («Security Checkpoint») bloquea cualquier cliente sin JS tras ~30 peticiones: contradice el `robots.txt` que invita a GPTBot/ClaudeBot. Comprobar que no afecta a los rastreadores de Google (normalmente exentos).
- Tinta verde por CSS en la columna numérica de 37 fichas (Málaga 1.241 celdas) frente a la norma «verde al mínimo» (H).
- Patronales presentadas como sindicatos en el bloque `bp-rotado` de 7 fichas; «cotejar la tabla 2024» en Madrid:788 y Oficinas Valencia:426 (H, no recomprobado).

## Refutado o matizado (para que no vuelva)

- **«48 fichas afirman verificación no respaldada» (H) → matizado.** En el censo, `revisado:false` = «estado propuesto por Claude, pendiente de ratificación humana contra boletín»: mide el estado jurídico (vigente/ultraactividad), no el cotejo de tablas. Queda confirmado solo Textil (🔴 9) y una pregunta para Telmo sobre el resto (abajo).
- **Oficinas Madrid Nivel 9 «1.184 / 16.576» (H) → refutado.** La tabla está rotulada «Salario/mes 2025 · Anual 2025»: es la fila correcta de 2025, no una regresión del bug del SMI.
- **«Dos banners superpuestos» (B, F) → refutado.** G renderizó la home: un solo banner; el mensaje RGPD de AdSense no aparece.
- **`legacy/` devuelve 403 (A) → refutado.** Era el firewall; en vivo devuelve 200 (🔴 4).
- **«Privacidad no declara Google Ads»**: confirmado (el grep insensible a mayúsculas daba falsos positivos; con «Google Ads» literal hay 0).

## Decisiones que solo Telmo puede tomar

1. **Apellido.** ¿«Gómez» es el apellido legal que debe figurar en aviso legal y privacidad? Si sí, la excepción a «solo Telmo» en las dos páginas legales es razonable (la LSSI exige nombre real) y sobra en sala de prensa. Si no, es un 🔴 de identificación falsa.
2. **Trust-bar «Convenios verificados».** ¿59 fichas publicadas, o las 9 ratificadas en el censo? Si nadie sabe qué mide, quitar el tile. Y «Referencias legales» → 75 (o quitar).
3. **Cotejo humano.** De las 50 fichas con `revisado:false`, 39 dicen «cifra a cifra», 32 «cruzada manualmente» y 11 «verificado por Telmo». ¿Has cotejado tú las tablas de todas? Las que no, se reescriben. Textil seguro que no (lo dice el censo).
4. **Transposición de la Directiva 2023/970.** ¿Existe ley o RD a 4-oct-2026? Determina ~12 frases en 8 páginas (🔴 8). Yo no pude verificarlo contra el BOE.
5. **`/api/calculate`.** Apagar (la home no lo usa) o gatear el texto jurídico.
6. **Google Ads `AW-18033533155`.** ¿Hay campaña? Si no, fuera.
7. **Relato de monetización.** Elegir uno: «sin acuerdos comerciales», «solo AdSense» o «AdSense + donaciones», y alinear sobre, prensa y colabora.
8. **SMI y tramos IRPF.** ¿Se engordan e indexan, o se quedan de apoyo? (Recomendación: SMI sí.)

## Plan cerrado (6 PRs, en este orden)

Cada PR pasa por `scripts/merge-seguro.sh` y se verifica en producción (regla de la casa). Antes de cada commit de fichas: `secciones-convenios.js`, `convenios-sync.js`, `legal-claims.js`, `comparativas.sh`.

1. **PR 1 · Infra (1-2 h, sin decisiones).** `.vercelignore` (respetando `data/convenios/*.json` y `lib/`), `404.html` con marca y navegación, enlace BOE del footer (🔴 1), `#verifica-convenio` → `#convenio-section` en 41 páginas (🔴 5), `og-cards` PNG ausentes (🟠), 7 externos rotos (🟠), `llms.txt` (🟡). Cierra el PR #104.
2. **PR 2 · Home (medio día, decisiones 2 y 6).** Trust-bar y fechas derivadas del censo; meta/og/twitter; «54 auditados a mano»; directorio 47→59; contadores del mega-menú; calculadora (conectar escala autonómica o retirar select y promesas, 🔴 2); etiqueta Google Ads; texto del banner + enlace «gestionar cookies» en el footer; retirar código muerto y modales ocultos; JSON-LD `WebApplication` → `WebSite`/`Organization` sin `SearchAction` falso. **Añadir todo a `SYNC_POINTS`.**
3. **PR 3 · Fichas rojas (1 día, decisión 3).** Bloque `bp-rotado` en 5 fichas (🔴 6); FAQ visible en 6 + 5 desajustes (🔴 7); SMI en Hostelería Madrid y que-es (🔴 10); Textil mora + firma (🔴 9, registrar art. 29.3 ET antes); Asturias ×3 + censo (🔴 11); pilar hostelería 15→18 y 3 enlaces (🔴 12); titles Las Palmas/Sevilla; 6 sellos sin número; gencat. Añadir «pendiente de verificación» a los placeholders del auditor.
4. **PR 4 · Editorial y legal (1 día, decisiones 1, 4, 7, 8).** `sobre.html` (esqueletos, cotización, Ley 12/2023, RD 145/2023, «traspuesta»); transposición en ~12 frases; LISOS y artículos de la Directiva (verificar y registrar); SMI page (corregir, engordar, indexar); sala de prensa (próximamente, informe, monetización); colabora; aviso legal (domicilio/NIF); privacidad (Google Ads o retirada; campos de la API); registro de correcciones público.
5. **PR 5 · Hubs y navegación (medio día).** `salarios.html`, `convenios.html` (un solo total), `mapa-del-sitio` (+18), construcción estatal (header, footers), que-es (enlazar desde guias y home), pilares (3 fichas cada uno), `#cobras-menos` ×10.
6. **PR 6 · API (1 h, decisión 5).** Apagar `/api/calculate` o gatear su texto.

**Después, y solo después:** pedir reindexación en GSC de home, sobre, pilar hostelería, hubs y las fichas tocadas; esperar 3-4 semanas desde el último cambio grande (los tres rechazos se pidieron antes de que Google re-rastreara); comprobar en GSC «Ver página rastreada» que la home indexada ya enseña los contadores nuevos; correr los cuatro auditores en verde; **entonces** pulsar «Solicitar revisión». Nunca antes.

## No verificado

- Si España ha transpuesto la Directiva 2023/970 (BOE/EUR-Lex no respondieron a curl).
- Tipos de cotización 2026 y cuantías LISOS contra fuente primaria leída hoy (E leyó el BOE para LISOS; la cotización queda por contrastar).
- Alicante:329, 6 sellos sin número, `#cobras-menos`, patronales como sindicatos, «tabla 2024»: citados por H/F con línea, no recomprobados por mí.
- Indexación en Google de las rutas internas (`/analisis/`, `/legacy/`): el MCP de GSC no conectó.
- Lighthouse contra producción (se corrió en local por el firewall).
- Renderizado móvil real del solape del botón «Calculadora completa» con el logo en fichas a 390 px (visto en captura, no medido).
