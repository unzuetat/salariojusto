# Calculadora v1 — snapshot pre-rediseño

Esta carpeta congela el estado de la calculadora de SalarioJusto **antes del rediseño en dos capas (calc v2 minimalista)** del 2026-04-29.

## Cómo es la v1 en una frase

Home con un solo formulario que pedía bruto + CCAA + situación familiar + hijos + ascendientes + discapacidad + año nacimiento + etc., calculaba neto con el algoritmo oficial de la AEAT (`lib/irpf2026.js`) y al pulsar "Calcular" llamaba a `api/calculate.js` que **pedía a un LLM (Claude Haiku) que se inventara** los rangos de mercado por ciudad y un análisis comparativo. La parte fiscal era rigurosa; la comparativa de mercado era alucinación de LLM.

## Por qué se sustituye

- Rebote post-cálculo del 95,5% en una página optimizada SEO.
- La comparativa de mercado por LLM viola la regla absoluta del proyecto "🚫 Nunca inventar datos ni cifras".
- Capa 1 (bruto → neto) y capa 2 (precisión + situación real) deben estar separadas para reducir fricción.

## Archivos congelados

| Archivo | Origen | Comentario |
|---------|--------|------------|
| `index.html` | `/index.html` | Home completa con calc v1, sticky, hero "Kit del trabajador", todo el contenido SEO. |
| `api/calculate.js` | `/api/calculate.js` | Endpoint Vercel serverless con whitelist + rate-limit que llamaba a Claude Haiku para inventar rangos. |
| `lib/irpf2026.js` | `/lib/irpf2026.js` | Algoritmo IRPF 2026 oficial AEAT. **Este NO debería cambiar entre versiones** — se incluye por completitud. |

No se incluyen: `lib/irpf-autonomico.js` (no afectado), generadores `scripts/*` (no afectados), CSS (inline en `index.html`).

## Cómo restaurar v1

### Opción A · Restaurar 100% desde git (recomendada)

El snapshot está clavado con un tag git inmutable.

```bash
# Volver a v1 sólo de los archivos de la calculadora (mantiene el resto del sitio actual)
git checkout calc-v1-pre-rediseno -- index.html api/calculate.js lib/irpf2026.js

# Verificar
git diff HEAD index.html api/calculate.js lib/irpf2026.js

# Commit en una rama efímera (NUNCA directo a main)
git checkout -b test/restore-calc-v1
git add index.html api/calculate.js lib/irpf2026.js
git commit -m "revert: restore calculadora v1 from tag calc-v1-pre-rediseno"
```

### Opción B · Restaurar desde esta carpeta (sin git)

Si por lo que sea no se puede usar git:

```bash
cp legacy/calc-v1/index.html ./index.html
cp legacy/calc-v1/api/calculate.js ./api/calculate.js
cp legacy/calc-v1/lib/irpf2026.js ./lib/irpf2026.js
```

### Diferencias entre A y B

- **A** restaura el estado exacto del repo en el momento del snapshot (commit `e545ff2`). Es la verdad.
- **B** restaura los 3 archivos congelados aquí. Es una copia.
- Si esta carpeta `legacy/calc-v1/` se modificara accidentalmente, A sigue funcionando — el tag git no se puede alterar sin re-tag forzado.

## Trazabilidad

- **Tag git**: `calc-v1-pre-rediseno`
- **Commit base**: `e545ff2` — *docs(informe): borrador v0.2 — N=200 cerrado, citas literales BOE, framing al 5.1*
- **Fecha del snapshot**: 2026-04-29
- **Motivo**: pre-rediseño calc v2 minimalista (capa 1 bruto→neto + capa 2 precisión inline, sin LLM alucinador).
- **Rama del rediseño**: `test/calc-v2-minimalista` (efímera).

## Si la calc v1 se necesita devuelta y v2 ya está en producción

1. Se restaura desde `calc-v1-pre-rediseno` en una rama efímera.
2. Se decide qué partes de v2 se quieren conservar (ej. el SEO bajo el fold puede haberse mejorado en v2).
3. Se mergea con criterio, no full-revert ciego.
