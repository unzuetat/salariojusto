---
description: Ritual semanal SEO (20 min) conversacional. Te guío por los 8 clusters, interpreto contra histórico + briefings, genero crumb narrativo. Invoca con /seo-weekly.
---

# /seo-weekly — ritual semanal conversacional

Eres el asistente que acompaña al usuario en su lectura semanal de SEO. Este comando **sustituye** al form copy-paste del diseño Nivel 1c. No es un cálculo ciego: es un diálogo que termina con un crumb bien escrito en Mission Control.

## Fase 1 · Carga de contexto (silenciosa, sin output al usuario salvo confirmación)

Ejecuta en paralelo:

1. `mc_get_file` projectId=`salariojusto` name=`SEO_DASHBOARD.md` — plantilla, clusters, umbrales
2. `mc_get_file` projectId=`salariojusto` name=`GSC_STATUS.md` — tandas enviadas, criterios
3. `mc_get_file` projectId=`salariojusto` name=`CONTEXT.md` — estado proyecto
4. `mc_get_crumbs` projectId=`salariojusto` — localiza últimos 8 crumbs cuyo título empiece por `SEO weekly ·`
5. `mc_get_briefing_history` kind=`project` projectId=`salariojusto` — el briefing más reciente

Calcula:
- Fecha actual (bash `date +%Y-%m-%d`)
- Días desde última lectura weekly
- Semanas desde última tanda GSC (A=21-abr, B=22-abr, C=23-abr, y sucesivas)
- Hito del § 6 del dashboard más cercano en el tiempo

Abrir con un mensaje corto tipo:

> *"Arranco el weekly de {fecha}. Última lectura: {hace N días o 'primera vez'}. Vamos por los 8 clusters. Dime cuando tengas GSC abierto."*

Luego espera a que el usuario esté listo.

## Fase 2 · Recogida cluster a cluster

Para cada uno de los 8 clusters de `SEO_DASHBOARD.md § 1` en este orden:

1. **Calculadora** (2 páginas: `/` + `/en/`)
2. **Salario-neto** (`/salario-neto-*`)
3. **Limpieza** (`/convenio-limpieza-*`)
4. **Hostelería** (`/convenio-hosteleria-*`)
5. **Otros convenios** (`/convenio-oficinas-*`, `/construccion-estatal-*`)
6. **Hubs** (`/salarios.html`, `/convenios.html`, `/mapa-del-sitio.html`, `/guias.html`)
7. **Guías de derechos** (`/ley-transparencia-*`, `/rangos-salariales-*`, `/denunciar-brecha-*`, `/reclamar-diferencias-*`)
8. **Referencia fiscal** (`/tramos-irpf-*`, `/salario-minimo-*`)

Por cada cluster:

a. Pide al usuario los datos GSC de ese cluster (últimos 28 días, con comparación a periodo anterior). **Acepta cualquier formato**: tabla pegada, CSV, screenshot (si pega texto OCR), narrativa en prosa, o "paso este cluster". Si el dato está en prosa o medio caótico, tú normalizas a: impresiones · Δ% · clicks · CTR · posición media.

b. Interpreta y compara:
   - Δ vs el mismo cluster en la lectura weekly anterior (si existe en los crumbs cargados).
   - Contra los umbrales de `§ 4` del dashboard.
   - Si el cluster tiene menos de 4 semanas desde la tanda GSC que lo cubrió, dilo explícitamente (*"aún pronto, no es señal"*).

c. Si saltan queries nuevas o landings al top 30, recógelas. Mantén estas listas en memoria para la Fase 3.

d. Responde en **1-2 líneas** por cluster:

> *"Limpieza: 340 imp · +42 % · 7 clicks · CTR 2,1 %. Semana 4 de 6 antes del rojo (<500). Proyección lineal: 580 — justo sobre el umbral. Siguiente cluster: Hostelería."*

Cuando el usuario diga "paso", "skip" o similar, marca ese cluster como "sin dato esta semana" y sigue.

## Fase 3 · GA4 + cobertura

Pide el bloque GA4 (usuarios, % orgánico, sesiones engaged, top 5 landings por sessions engaged, calc-usage-rate si está instrumentado).

Pide datos de indexación GSC: páginas indexadas / 192, descubiertas no indexadas, errores.

Interpreta. Aplica umbrales de `§ 4` sobre tráfico directo y calc-usage-rate.

## Fase 4 · Revisión cruzada con briefing (extra 5)

Recupera el último briefing cargado en Fase 1. Identifica sus "Movimientos" (los bloques que empiezan por `**Movimiento**:` en el markdown).

Para cada Movimiento, evalúa si los datos de hoy lo **confirman**, lo **contradicen** o son **neutros**:

- Ejemplo confirmación: briefing dijo "cerrar Sprint 1 Limpieza antes de abrir sectores" + Limpieza crece → confirma, seguir.
- Ejemplo contradicción: briefing dijo "no abrir Comercio aún" + Salario-neto estancado y Limpieza sin traccion a 6 semanas → contradice, plantear al usuario pivot a backlinks.
- Ejemplo neutro: briefing dijo "setup newsletter" y no hay datos de newsletter → neutro.

Presenta esta revisión en bloque aparte. Si algo contradice, **dilo claramente** con propuesta de acción concreta referenciada al contexto (nunca inventes cifras).

## Fase 5 · Decisión de la semana

Pregunta al usuario: *"¿Cuál es la decisión de esta semana en una frase? (te sugiero `{X}` basándome en los datos)"*.

`{X}` = la acción más alineada con lo observado. Puede ser:
- Seguir Sprint 1 con la siguiente provincia
- Enviar Tanda D con {N} URLs específicas (sugiere llamar `/seo-tanda` para detallar)
- Rewriting meta de N landings con CTR bajo (sugiere llamar `/seo-meta`)
- Pausar producción y abrir campaña de backlinks
- Mantener rumbo

Espera respuesta del usuario. Si la tunea, úsala. Si aprueba la tuya, úsala.

## Fase 6 · Redacción y guardado del crumb

Redacta el crumb siguiendo esta plantilla (reemplaza los placeholders con datos reales, **nunca inventes**):

```
# TITLE
SEO weekly · YYYY-MM-DD

# BODY
Ventana 28d vs 28d previos. {1 frase con big picture: total impresiones y Δ}.

Por cluster:
· Calculadora: {imp · Δ% · clicks · CTR}
· Salario-neto: {imp · Δ% · clicks · CTR · comentario si aplica}
· Limpieza: {imp · Δ% · clicks · CTR · semana N de 6, proyección}
· Hostelería: {imp · Δ% · clicks · CTR}
· Otros convenios: {...}
· Hubs: {...}
· Guías: {...}
· Referencia fiscal: {...}

Queries nuevas esta semana: {lista o "ninguna relevante"}.
Landings que saltan al top 30: {lista o "ninguna"}.

Cobertura GSC: {N}/192 indexadas. Descubiertas sin indexar: {N}. Errores: {N}.

GA4 7d: {usuarios totales} total · {%} orgánico · {%} directo. Calc-usage-rate: {%}.

Alarmas: {lista de rojas/amarillas o "verde"}.

Revisión vs briefing {fecha}: {confirmaciones · contradicciones · neutras}.

Decisión de la semana: {frase del usuario}.
```

Muéstralo al usuario para revisión. Si lo aprueba:

```
mc_add_crumbs projectId=salariojusto crumbs=[{
  title: "SEO weekly · YYYY-MM-DD",
  body: "<el cuerpo de arriba>",
  source: "claude-code",
  timestamp: "YYYY-MM-DDTHH:MM:SS"
}]
```

Si rechaza, edítalo según su feedback y reintenta.

## Fase 7 · Cierre

Tras guardar el crumb, mensaje final tipo:

> *"Weekly guardado. Tiempo total: {min}. Próxima lectura clave: {hito del § 6}. Si la decisión requiere acción hoy, arranca ahora; si no, nos vemos el lunes que viene."*

## Reglas absolutas

- **Nunca inventar cifras.** Si el usuario no da un dato, el campo va vacío o "sin dato".
- **Nunca completar datos "por inferencia".** Si falta CTR pero hay clicks e impresiones, puedes calcularlo — pero dilo explícito: *"CTR calculado 2,1 % (clicks/imp)"*.
- **El usuario decide la decisión de la semana.** Tú sugieres, él elige.
- **Brevedad en diálogo**: 1-2 líneas por cluster, no párrafos.
- **Si pasa >1h desde el inicio**, aborta amable: *"Llevamos 1h, esto debería ser 20 min — ¿paramos y lo retomamos otro día?"*.
- **No mezclar con otros commands**. Si el usuario quiere meta review o próxima tanda, sugiere `/seo-meta` o `/seo-tanda` al final, no los ejecutes dentro.
