## Qué es

Sitio de transparencia salarial para España: **55 fichas verificadas de convenios colectivos** (provinciales + sectoriales estatales) con tablas salariales cotejadas contra el boletín oficial, calculadora de salario neto IRPF 2026 (escalas autonómicas + tarifa foral Bizkaia) y kit del trabajador con plantillas para la Directiva UE 2023/970. Proyecto independiente, gratis, sin registro, autoría pública "Telmo". El 96,6 % de los clics vienen de las fichas de convenio, no de la calculadora.

## Tech stack

- **HTML + CSS + JS vanilla**, sin frameworks ni build. Deploy automático en **Vercel** desde `main` (proyecto Vercel `project-t15ty`, no `salariojusto`). `vercel.json` solo con redirects (www→apex, /en→/, /index.html→/).
- **Node** en `scripts/`: `generate-convenios.js` (⛔ LEGADO/NEUTRALIZADO — las fichas se redactan A MANO; `skipHtmlGeneration:true`), `generate-pages.js`, `generate-plantillas.js`, `generate-callouts.js`, `inject-seo-tags.js`. `api/calculate.js` = única function serverless (calculadora).
- **Python** en `scripts/audit/`: sistema de auditoría de convenios (`convenios-recolector.py`, `convenios-sintetizador.py`, `convenios-patrones.py`, `gsc-dia.py`, `aplicar-boilerplate.py`), `thin.py`, `singularidad.sh`; `scripts/gsc-dashboard.py` (dashboard GSC local vía launchd 08:30, sin tokens de IA); `ga4-fetch.py` + `ga4-resumen.py`.
- **Auditor de coherencia** `node scripts/audit/convenios-sync.js` (read-only, marca file:line de contadores descuadrados).
- **Censo** `data/convenios/censo.json` = fuente de verdad del nº y estado de fichas (NUNCA grepear HTML). Lector `scripts/audit/censo-convenios.js`. Estados: vigente · ultraactividad · especial · marco.
- **MCP de Google Search Console** `scripts/mcp/gsc-server.py` (FastMCP, mismo Service Account que GA4 en `~/.config/ga4-salariojusto.json`, propiedad `sc-domain:salariojusto.es`, scope user).
- **Agentes Claude del repo** (en producción desde #102): `.claude/agents/sj-eje-e1..e6-*.md` + `sj-verificador.md`; comando `.claude/commands/sj-auditoria.md`.
- **CI**: `.github/workflows/ga4-daily.yml` (GA4 daily fetch 06:00 UTC; el workflow usa secrets `GA4_OAUTH_*`, mientras que la doc local habla de Service Account — sin verificar cuál está activo).
- Detector de boletines fase 1: `scripts/audit/vigilancia-convenios.js` + `scripts/detector/boe-adapter.js`, cola en `data/detector/candidatos.json`.
- OG cards por convenio: `og-cards/<slug>.html` → PNG 2400×1260; `scripts/sj-og.mjs` inyecta la meta (no genera la imagen).
- GA4 (G-MXJ8V2FBW9, property 528537093) · AdSense (ca-pub-1110009006533891) · Vercel preview: `project-t15ty-git-<rama>-unzuetat-8895s-projects.vercel.app`.

## Arquitectura

```
/                              → index.html, home publisher (calc bajo el fold)
/convenios.html                → hub; desde #99 con 8 sectores en <details> replegables (Hostelería abierta)
/salarios.html · /guias.html · /mapa-del-sitio.html · /sobre.html (E-E-A-T, promesa de monetización #98)
/convenio-{sector}-{provincia}.html → 55 fichas (91 html en raíz en total)
/salario-minimo-interprofesional-2026.html → página canónica SMI (PR #101 pendiente)
/api/calculate.js              → calculadora
/data/convenios/censo.json + *.json (dataset gemelo; ~30 de 55 fichas con JSON)
/scripts/ · /scripts/audit/ · /scripts/mcp/ · /og-cards/ · /docs/ (estandar-ficha-convenio.md, seo-playbook.md)
/analisis/                     → zona privada (auditorías, GSC/GA4); auditoria-convenios/ SÍ versionada desde #102
/press/ · /outreach/ · /research/ · /legacy/ → no servidos / material
```

### Inventario de convenios (censo 30-ago: **55 fichas = 50 provinciales + 5 marcos**; 32 vigentes · 13 ultraactividad · 7 especiales · 3 marco)

- **Hostelería (18)**: alicante, baleares (⭐ piloto §6), barcelona, bizkaia, cadiz, cantabria, gipuzkoa, girona, granada, laspalmas, madrid (referencia canónica de formato), malaga, maresme, sevilla, tarragona, valencia, valladolid, zaragoza.
- **Limpieza (14)**: alicante, asturias (reconstrucción 2026-2027 en PR #101), barcelona (→ Cataluña), bizkaia, catalunya (noindex), edificios-locales (pilar), laspalmas, madrid (⭐ piloto §6), malaga, murcia, pontevedra, sevilla, tenerife, valencia, zaragoza.
- **Metal (10)**: barcelona, bizkaia, valencia, madrid, gipuzkoa, navarra, zaragoza, asturias, alava, sevilla.
- **Comercio (NUEVO ago-2026)**: comercio-madrid (Comercio Vario, #95) · **Comercio del Metal**: bizkaia (#97, ultraactividad "qué cobras hoy", tablas 2019) y barcelona (#99, atrasos de 14 meses).
- **Construcción (2)**: bizkaia, madrid · **Oficinas (3)**: madrid (Nivel 9 → SMI, #96), valencia, bizkaia (decaído desde 2013).
- **Marcos estatales (5)**: hosteleria, limpieza-edificios-locales, tecnicos-espectaculos (noindex), seguridad-privada, contact-center.

## Estado actual — funciona

- **Producción `main` = PR #102** (8-sep, `3353216`). Secuencia: #95 Comercio Vario Madrid · #96 fix Oficinas Madrid Nivel 9 al SMI · #97 Comercio del Metal Bizkaia · #98 sobre.html promesa de monetización · #99 Comercio del Metal Barcelona + hub por sectores · #100 SMI 2026 a 17.094 € en 10 fichas (cierra el bug "16.576 € como SMI 2026", 613 clics/28d afectados) · **#102 sistema de auditoría en 4 capas + 7 fichas corregidas**.
- **Sistema de auditoría de convenios en 4 capas** (`/sj-auditoria`, vivo en producción desde #102): capa 0 determinista (`convenios-recolector.py`, 55 fichas en ~3 s), capa 1 seis agentes de eje ciegos entre sí, capa 2 verificador adversarial, capa 3 sintetizador (score 0-100 + hard-fails; la aritmética la hace el script). Rúbrica v1: E1 verdad 22 · E2 singularidad 22 · E3 respuesta 20 · E4 captación 14 · E5 enlazado 12 · E6 forma 10 + 28 hard-fails. Cobertura ciclo completo: 16 de 55 (piloto de 6 + metal de 10). Hard-fails deterministas del corpus: 34 (20-ago) → **25 (8-sep)**.
- **Correcciones verificadas EN PRODUCCIÓN** (#102): sellos de Bizkaia BOPV/BOE → BOB con número y fecha (metal, hostelería, construcción); hostelería Valencia sin la denuncia inventada (0 apariciones) ni el placeholder; metal Asturias/Navarra/Zaragoza sin la afirmación falsa sobre la antigüedad de Madrid.
- **GSC (28d hasta 6-sep)**: 7.001 clics (+49 %), 318.031 impresiones (+78 %), CTR 2,20 %, posición 5,73. La caída del 5-6 sep (6,13 → 8,77) es muy probablemente ruido de datos frescos: 0 commits entre el 2 y el 6, y las consultas nuevas pasan de entrar en pos 6,6-8,5 a entrar en 17,4 y 23,1.
- Pilotos §6, MCP GSC, censo coherente, dashboard GSC local, OG cards, detector fase 1: operativos.

## Estado actual — pendiente

1. **Tres ramas con commits SIN PUSH** (9-sep 13:00; Telmo los sube él). `chore/privado-fuera-del-deploy` → `155ee4a` "versiona la zona de trabajo interno y la saca del despliegue" (sin rama remota; **su upstream es `origin/main`**, empujar con destino explícito o irá a producción). `fix/smi-canonico-y-asturias-2026` → 3 commits, incluido el merge de main y `daa7138` que resuelve los sellos de Bizkaia a favor de la redacción de #102. `main` → `c377089`, el respaldo de las 65 ramas.
2. **REVISIONES CON FECHA** (registradas como crumbs el 9-sep, pero el MCP no guarda el campo `dueAt`: viven aquí):
   - **10-sep** · leer GSC de Comercio del Metal Bizkaia a D+21 (hoy pos 12,81 · 1.724 impr · 76 clics, la peor de los 12 lanzamientos). De ahí depende acelerar o replantear el fan-out del sector.
   - **10-sep** · comprobar en GSC_STATUS si se pidió reindex de #98/#99/#100/#102. Crítico en las 10 fichas del #100: el SMI corregido no sirve mientras Google sirva la versión con la cifra falsa.
   - **11-sep** · re-medir la caída del 5-6 sep con `scripts/audit/gsc-dia.py`. Si se corrige hacia 6,0-6,3 era ruido; si se confirma en 7-8,8, investigar.
   - **15-sep** · comparar los dos pilotos §6 y **decidir si se propaga a las 44 fichas restantes**. Está bloqueado hasta entonces.
3. **PR #101 abierto** (SMI canónico + reconstrucción de Limpieza Asturias con el convenio 2026-2027 + ítem 9 de la cola). Al mergear: reindexar Asturias + página canónica del SMI.
4. **`feat/alertas-convenio`** (bce04fc, 30-ago, pusheada, sin PR): MVP de alertas por email (Brevo, doble opt-in). Decidir si se publica; necesita env vars de Brevo en Vercel.
5. **Piloto §6**: los dos pilotos DIVERGEN a 28 días (Baleares 318 → 504 clics y pos 5,54 → 4,44; Limpieza Madrid 406 → 341 y pos 4,72 → 5,37, y en sus consultas de siempre 6,34 → 8,06). Propagación bloqueada hasta la revisión del 15-sep (punto 2).
6. **GSC**: excluir siempre las URLs con `#` al diagnosticar. La caída del 5-6 sep se re-mide el 11-sep (punto 2).
7. **Tandas de auditoría restantes** (capas 1-3): hostelería (17), grupo suelto (9), limpieza (16). Cobertura actual: 16 de 55.
8. **Cola de correcciones** `analisis/auditoria-convenios/COLA-CORRECCIONES.md`: 14 hallazgos verificados; aplicados el 1 (#100), 2-3-4 (#102) y 9 (PR #101). Quedan: bloque «¿Cobras menos…?» clonado en 29 fichas con el "Art. 34" mal (5); limpieza-zaragoza "1 de 19 bajo SMI" cuando son 3 y hostelería-valencia con 1.100,46 €/mes bajo SMI sin advertirlo (6 — verificar si #100 lo tocó); fuentes citadas no clicables (7); verde en salarios vía CSS del canon, 32 fichas → arreglo de plantilla (8); metal-gipuzkoa dos categorías bajo SMI sin decirlo + sin mencionar su régimen foral (12/14); limpieza-asturias con dos códigos REGCON, uno cableado en `aplicar-boilerplate.py:296` (4); 58 enlaces hermanos que faltan, Madrid 20 y Bizkaia 19 (10).
9. **Patrones de plantilla (no ficha a ficha)**: tablas sin `scope`/`caption` 54/55; bloques >100 palabras 37; hermana de provincia sin enlazar 28; registro pobre en censo 22; 12 islas con ≤3 enlaces entrantes.
10. **Lecturas GSC atrasadas** (sin anotar en GSC_STATUS): Comercio Vario Madrid (D+21 ~8-sep) · Oficinas Bizkaia y Pontevedra (~3-sep). Bizkaia y el reindex, en el punto 2.
11. **AdSense**: rechazo #3 el 8-ago ("poco valor"). Regla para la #4: no pulsar "resuelto" sin checklist verde y ≥3-4 semanas desde el último cambio grande. Plan cerrado, no iteraciones sueltas.
12. **Siguientes convenios**: Grandes Almacenes estatal (BOE-A-2026-3276) · fan-out Comercio del Metal (Navarra, Gipuzkoa, Madrid, Valencia, Zaragoza) · metal Pontevedra/A Coruña (naval) · Comerç de Catalunya cuando salga en el DOGC · enriquecer Hostelería Cantabria.
13. Persistentes: P1 generadores neutralizados · Seguridad Privada sin nota-editorial/TOC · WIP en `stash@{0}` (nota-editorial, 7-ago) y `stash@{1}` (pre-reapelación) · OG card a medida de oficinas-bizkaia · Hostelería Catalunya autonómico aparcado.

## Decisiones importantes

### Sesiones 19-ago → 9-sep (auditoría, GSC y git)
- **El score compuesto NO ordena fichas**: al promediar 6 ejes se compensan (cada eje abre 25-44 pts, el compuesto 17,5). Se ordena por hard-fails y por eje más débil; el score solo sirve para seguir UNA ficha entre pasadas. El sintetizador redistribuye peso según `tipo` (un `marco` no puntúa en E5 ni captación).
- **Lo binario no puntúa, avisa**: verde en tablas, tablas sin caption, saltos de jerarquía y bloques densos bajaron de E6 a la capa 0 como avisos (`*`).
- **Un defecto en más de la mitad del corpus se arregla en plantilla/proceso**, no ficha a ficha.
- **El verde viaja en el CSS del canon**, no inline (`td.sal{color:var(--green)}` y en `@media(max-width:720px)` también `.num`). metal-barcelona/bizkaia NO son modelos "a cero verde" (28 y 84 celdas).
- **Hallazgo entra en la cola solo si está comprobado contra el archivo real**, no porque lo diga un agente. El verificador adversarial tumbó falsos positivos en el piloto (reflow a tarjetas ≠ desborde; "1.184 € en 2025" es histórico legítimo; "¿Está vigente? No" no es llamar vigente a un decaído) y evitó un parche que metía un dato falso (dividir el anual entre 12 en un convenio de 15 pagas).
- **Freno de ventana abierta**: fichas tocadas hace <3 semanas están midiendo tracción → parches `aplazado_por_ventana`. EXCEPCIÓN: una cifra que invierte la conclusión editorial (SMI) se corrige igual.
- **Verificar cambio previo antes de proponer** (norma dura): `git log -- <archivo>` + GSC_STATUS + memorias de pilotos. Mínimo ~7 días de runway antes de leer señal.
- **Anclas `#` no hunden la posición** (hipótesis refutada 8-sep: r=−0,15, y las fichas con ≥40 % de anclas cayeron +0,11 frente a +0,47 las de <20 %) pero **rompen la medición**: son el 37 % de las apariciones con CTR 0,03 %. Excluirlas siempre al diagnosticar (CTR real 2,27 % vs 1,55 % mezclado). Ver `analisis/auditoria-convenios/2026-09-08/DIAGNOSTICO-ANCLAS.md`.
- **Los 2-3 últimos días de GSC llegan incompletos**: la señal de que es ruido es que las consultas *nuevas* del día entren en una posición mucho peor que los días anteriores. Re-medir antes de concluir (`scripts/audit/gsc-dia.py`).
- **Para saber si una rama está fusionada, preguntar a GitHub, no a git** (9-sep): con squash merge los commits de la rama nunca son ancestros de `main`, así que `git branch --merged` da 0 y `git diff main...rama` da falsos positivos. La fuente fiable es `gh pr list --state merged`. Antes de podar, respaldo con nombre + SHA.
- **Estilo editorial escueto**: no mencionar lo que no existe, fuera construcciones "X, no — Y, sí" y guiones retóricos; versión corta por defecto.
- **Sector Comercio abierto**: 2,7 M ocupados, sin convenio estatal → todo provincial. **Comercio del Metal ≠ Metal industrial ≠ Comercio Vario** (códigos REGCON distintos). En Cataluña no hay comercio general provincial.
- **Ultraactividad pactada (art. 2 bis) ≠ decaído**: Comercio del Metal Bizkaia mantiene tablas 2019 congeladas y vigentes; Oficinas Bizkaia está decaído.
- **La norma "tocar la home al añadir convenio" se amplía al hub `convenios.html`** y a las 2-3 fichas hermanas que deberían enlazar a la nueva: el enlazado interno es una estrella, no una red (cada ficha nueva enlaza a las viejas y ninguna vieja se actualiza).

### Sesiones de agosto (conservadas)
- **Convenio DECAÍDO ≠ ultraactividad** (Ley 3/2012): nunca "sigue aplicándose" de un decaído; suelo real = SMI + convenio estatal + ET.
- **Sindicatos en plural, sin protagonismo CCOO/UGT** (ELA/LAB encabezan en Euskadi). CCOO como fuente de datos sí vale.
- **Nº de pagas determina la paradoja SMI**: la comparación es ANUAL (17.094 € en 14 pagas); cotejar pagas del articulado.
- **Criterio GSC #26**: nunca pedir indexación antes de que la URL dé 200 en producción.
- **Palanca §6 frase-extraíble**: los asistentes IA citan el salario a quien lo tiene en prosa con la traza del boletín pegada. No propagar sin validar en piloto.
- **Sin atribución a Claude en GitHub** (commits, PR, comentarios). Sobreescribe el default del harness.
- **Salario diario** (Andalucía): columna «≈ bruto/año» estimada con asterisco + fórmula visible.
- **Pedir el boletín aunque se pueda calcular**; discrepancia entre agregadores → el convenio manda.
- **Verificar `git branch --show-current` antes de commitear** con el IDE abierto. Y comprobar el **upstream**: una rama de trabajo puede tener `origin/main` como upstream y un `git push` a secas iría a producción (pasó con `fix/lote-verdad-auditoria`).

### Preservadas (núcleo)
Estado de convenios = censo, nunca grep · MCP GSC = demanda no capturada · verificación doble vía (2025×factor = 2026 al céntimo) · no inventar links/cifras · provincial > autonómico · noindex deliberado ≠ olvido · diseño en rama `design/*` · autoría pública solo "Telmo" · verificar antes de redactar derecho · nunca push a main sin OK · GSC reindex con URL directa · al añadir convenio: censo + JSON + sitemap + home + hub + llms.txt + sobre + mapa + OG card · lenguaje inclusivo en categorías · preview local + OK antes de commit · cotejo con link exacto + ubicación · salarios en tinta neutra (verde solo en el sello Verificado) · Madrid = referencia canónica de formato · flujo por convenio: fuente oficial → Telmo pega MD → cotejo → clonar canónica → propagar → OG → rama feat/ → PR → squash con OK.

## URLs

- Repo: https://github.com/unzuetat/salariojusto · Prod: https://salariojusto.es · MC: https://missioncontrol-coral.vercel.app
- Docs de auditoría: `analisis/auditoria-convenios/` — `RUBRICA-V1.md`, `CANDIDATAS.md`, `CALIBRACION.md`, `PROTOCOLO-AGENTES.md`, `COLA-CORRECCIONES.md`, `PROMPT-FIX-SMI.md`; ejecuciones en `2026-08-20/`, `08-24/`, `08-29/`, `09-01/`, `09-08/`, `09-09/`. Diagnóstico de anclas en `2026-09-08/DIAGNOSTICO-ANCLAS.md`. Enlaces hermanos que faltan en `2026-08-24/ENLACES-QUE-FALTAN.md`.
- Respaldo de ramas locales: `analisis/respaldo-ramas/ramas-locales-2026-09-09.txt`.
- Dashboard GSC local: `analisis/gsc-dashboard.html` (autorregenerado cada mañana). Posición diaria: `scripts/audit/gsc-dia.py`.
- Comercio Vario Madrid: BOCM nº 183 (2-ago-2025), código 28000805011982 · Comercio del Metal Bizkaia: BOB nº 141 (23-jul-2018) + rev. BOB nº 38 (22-feb-2019), código 48000575011981 · Comercio del Metal Barcelona: BOPB 18-mar-2026 CVE 202610051357, código 08000765011993 · Oficinas Madrid revisión SMI: BOCM nº 102 (1-may-2026), código 28003005011981 · SMI 2026: RD 126/2026 (BOE-A-2026-3815) = 17.094 €/año.
- Credenciales GA4/GSC: `~/.config/ga4-salariojusto.json`. Registrar MCP: `claude mcp add gsc -s user --env GSC_SITE_URL=sc-domain:salariojusto.es -- <venv>/python <repo>/scripts/mcp/gsc-server.py`.
- Memorias locales en `~/.claude/projects/-Users-telmo-Projects-salariojusto/memory/`.

## Despliegues

| Entorno | URL | Rama |
|---|---|---|
| Producción | https://salariojusto.es | `main` (auto-deploy Vercel) |
| Test | preview por rama `project-t15ty-git-<rama>-unzuetat-8895s-projects.vercel.app` | rama de trabajo (sin rama test fija) |

**Pendiente de producción a 9-sep (13:00)**: PR #101 abierto y ya rebasado limpio sobre main (SMI canónico + Asturias 2026-2027 + sellos de Bizkaia conservados de #102) · `feat/alertas-convenio` (MVP alertas Brevo, sin PR, requiere decisión) · `chore/privado-fuera-del-deploy` (1 commit sin push, sin rama remota) · `c377089` en `main` local sin push.

## Git a 2026-09-09 (13:00, máquina casa)

- **✅ Rebase del PR #101 RESUELTO.** `fix/smi-canonico-y-asturias-2026` quedó rebasada sobre main; el conflicto de los tres sellos de Bizkaia se resolvió conservando la redacción de #102 (BOB con número y fecha), que es la correcta.
- **`origin/main`** = `3353216` (8-sep, PR #102: sistema de auditoría de 4 capas + 7 fichas corregidas + `.gitignore` ampliado).
- **Sin push en 3 ramas**: `chore/privado-fuera-del-deploy` (1, rama actual, sin remoto), `fix/smi-canonico-y-asturias-2026` (3), `main` (1 = `c377089`).
- **⚠️ Patrón repetido: ramas de trabajo con upstream a `origin/main`.** Ya ha pasado dos veces (`fix/lote-verdad-auditoria` y ahora `chore/privado-fuera-del-deploy`): un `git push` a secas empuja a producción. Comprobar `git rev-parse --abbrev-ref @{upstream}` antes de empujar, y usar destino explícito.
- **Ramas locales podadas de 65 a 13** (9-sep): 50 borradas tras verificarlas contra la API de GitHub (`gh pr list --state merged`), no por heurística — con squash merge `git branch --merged` da 0 y `git diff main...rama` da falsos positivos. Respaldo con nombre + SHA de las 65 en `analisis/respaldo-ramas/ramas-locales-2026-09-09.txt`: se recupera cualquiera con `git branch <nombre> <sha>`. NO se tocó `test/quitar-en` (sin PR de ningún tipo, de junio).
- **Ramas locales sin remoto**: `feat/convenio-comercio-madrid`, `fix/smi-2026-nueve-fichas`, `chore/privado-fuera-del-deploy`.
- **`seo/onpage-agosto`**: 34 commits por detrás de main, remoto vivo, vieja.
- **`analisis/gsc-history.json`**: serie temporal NO regenerable (histórico de posiciones diarias). Valorar versionarla; si se borra la carpeta, se pierde.
- **Stash**: `stash@{0}` WIP nota-editorial (7-ago) · `stash@{1}` WIP pre-reapelación AdSense.
- Tag `backup/comercio-metal-bcn-d25cc78`.

## Última actualización

**2026-09-09 (13:00) — PR #102 en producción, poda de ramas y rebase ya resuelto.** El sistema de auditoría de 4 capas y las 7 fichas corregidas están **vivos en producción** (#102, verificado sobre `origin/main`: sellos de Bizkaia en BOB, denuncia inventada de Valencia a cero, "Madrid" fuera de las tres fichas del metal). Se podaron 50 ramas locales con verificación contra GitHub y respaldo recuperable. El rebase del PR #101 quedó **resuelto** (conserva los sellos de #102); quedan 3 ramas con commits sin push, que Telmo sube él. GSC: la caída del 5-6 sep sigue pendiente de confirmar (re-medir 10-11 sep); la hipótesis de que las anclas `#` hundían la posición quedó **refutada** (r=−0,15; las fichas con más anclas cayeron menos).
