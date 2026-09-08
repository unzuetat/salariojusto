# salariojusto.es — CONTEXT

> Snapshot del 8-sep-2026. Generado por `/export-mc` con Mission Control caído (504);
> pendiente de subir con `mc_upsert_file` cuando el backend responda.

## Qué es

Sitio de transparencia salarial: fichas verificadas de convenios colectivos provinciales
(54 en el censo) + kit de plantillas de reclamación. El 96,6% de los clics vienen de las
fichas de convenio, no de la calculadora.

## Tech stack

HTML estático generado con Node (`scripts/generate-*.js`) sobre `data/convenios/*.json`,
desplegado en Vercel. Auditoría y analítica en Python (stdlib + Google API client).
Sin framework de front.

## Arquitectura

- `convenio-*.html` — 54 fichas, muchas redactadas a mano por encima del generador
  (`skipHtmlGeneration: true` en `CONVENIO_CONFIG`)
- `data/convenios/censo.json` — **fuente de verdad** del estado de cada convenio (nunca grepear el HTML)
- `data/convenios/*.json` — datasets por convenio (30 de 54 fichas)
- `scripts/audit/` — auditoría determinista (ver abajo)
- `scripts/gsc-dashboard.py` — dashboard GSC diario vía launchd 08:30, sin tokens de IA
- `analisis/auditoria-convenios/` — rúbrica, informes y cola de correcciones

## Estado actual — funciona

**Sistema de auditoría de convenios, 4 capas** (`/sj-auditoria`):

- **Capa 0** `scripts/audit/convenios-recolector.py` — 54 fichas en ~3 s, un JSON por ficha.
  Emite 31 hard-fails y 135 avisos deterministas.
- **Capa 1** — seis agentes de juicio, uno por eje, en `.claude/agents/sj-eje-e*.md`
- **Capa 2** — `sj-verificador.md`, adversarial: intenta refutar cada hallazgo
- **Capa 3** `scripts/audit/convenios-sintetizador.py` — compone score y hard-fails
- Extras: `convenios-patrones.py` (patrones transversales), `gsc-dia.py` (posición diaria)

**Cobertura**: 16 de 54 fichas con el ciclo completo (piloto de 6 + sector metal de 10).

**Rúbrica v1**: 6 ejes ponderados (E1 verdad 22 · E2 singularidad 22 · E3 respuesta 20 ·
E4 captación 14 · E5 enlazado 12 · E6 forma 10) + 28 hard-fails que bloquean y no puntúan.

## Estado actual — pendiente

1. **Sin commit**: 7 fichas con correcciones de la cola aplicadas (sellos Bizkaia, denuncia
   inventada de Valencia, antigüedad de Madrid) + todo `analisis/auditoria-convenios/` y
   `scripts/audit/*.py` como untracked.
2. **Tandas de auditoría restantes**: hostelería (17), grupo suelto (9), limpieza (16).
3. **Cola de correcciones**: 14 hallazgos verificados, ~9 sin aplicar.
4. **Re-medir el 5-6 sep en GSC** (ver Decisiones).
5. **Comparar los dos pilotos §6**: `hosteleria-baleares` sube fuerte, `limpieza-madrid` baja.
   Decide si se propaga a 44 fichas.

## Decisiones importantes

- **El score no ordena fichas.** El piloto demostró que promediar 6 ejes los compensa entre sí:
  cada eje abre 25-44 puntos de rango pero el compuesto solo 17,5. Se ordena por hard-fails y
  por eje más débil. El score solo sirve para seguir UNA ficha entre pasadas.
- **Lo binario no puntúa, avisa.** Verde en tablas, tablas sin caption, saltos de jerarquía y
  bloques densos bajaron de E6 a la capa 0 como avisos deterministas.
- **Un defecto que afecta a más de la mitad del corpus no se arregla ficha a ficha.**
  Tablas sin `scope`/`caption`: 54 de 55. Verde en salarios: 32. Hermana de provincia sin
  enlazar: 28. Son plantilla o proceso.
- **El verde viaja en el CSS, no inline.** El canon `hosteleria-madrid` define
  `td.sal{color:var(--green)}` y en `@media(max-width:720px)` lo fuerza también a `.num`.
  Corregir es un cambio de plantilla. `metal-barcelona` y `metal-bizkaia` NO son modelos a cero.
- **Las anclas `#` no hunden la posición** (hipótesis refutada: r=−0,15, y las fichas con más
  anclas cayeron *menos*). Pero son el 37% de las apariciones con CTR 0,03%: rompen la medición,
  no el posicionamiento. Excluirlas siempre al diagnosticar.
- **Los 2-3 últimos días de GSC llegan incompletos.** El 5-6 sep marcan 7,15 y 8,77 de posición
  frente a 6,13 el día 4, sin ningún cambio en el sitio y con las consultas nuevas entrando en
  posición 17 y 23 (venían entrando en 7-8). Re-medir antes de concluir.

## Despliegues

| entorno | rama | URL |
|---|---|---|
| prod | `main` | https://salariojusto.es |
| test | rama de trabajo | `project-t15ty-git-<rama>-unzuetat-8895s-projects.vercel.app` |

Rama actual de trabajo: `fix/lote-verdad-auditoria` (sincronizada con `origin/main`, 0 ahead / 0 behind).

## URLs

- Repo: https://github.com/unzuetat/salariojusto
- Dashboard GSC local: `analisis/gsc-dashboard.html` (se regenera solo cada mañana)
- Documentos de la auditoría: `analisis/auditoria-convenios/` — `RUBRICA-V1.md`,
  `CANDIDATAS.md`, `CALIBRACION.md`, `COLA-CORRECCIONES.md`, `PROMPT-FIX-SMI.md`
