---
description: Foto rápida del estado SEO. Úsalo cuando quieras saber dónde estás sin abrir nada. Invoca con /seo-status.
---

# /seo-status — dónde estoy en el ciclo SEO

Dame un resumen conciso (máx 15 líneas) del estado SEO de SalarioJusto ahora mismo.

## Qué hacer

1. **Leer contexto operativo desde Mission Control** (no desde memoria local):
   - `mc_get_file` projectId=`salariojusto` name=`SEO_DASHBOARD.md`
   - `mc_get_file` projectId=`salariojusto` name=`GSC_STATUS.md`
   - `mc_get_crumbs` projectId=`salariojusto` — buscar los últimos 8 crumbs cuyo título empiece por `SEO weekly ·`. Si hay 0, indica "aún sin lecturas".
   - `mc_get_briefing_history` kind=`project` projectId=`salariojusto` — coger el último briefing (ejecutivo o técnico, el más reciente).

2. **Calcular ventana temporal**:
   - Fecha actual (bash: `date +%Y-%m-%d`).
   - Días desde último `SEO weekly` crumb (si existe).
   - Semanas desde última Tanda GSC enviada (ver GSC_STATUS.md — la más reciente).
   - Según `SEO_DASHBOARD.md § 6`, identificar en qué lectura clave del ciclo estás (baseline 27-abr, primera señal 18-may, decisión Sprint 1 el 08-jun, decisión apertura sectorial el 22-jun).

3. **Evaluar alarmas activas** comparando el crumb weekly más reciente con los umbrales de `SEO_DASHBOARD.md § 4`. Si el crumb más reciente no tiene datos para algún umbral, marcarlo como "pendiente".

4. **Output — exactamente este formato**:

```
📅 Hoy es {YYYY-MM-DD}. Último weekly: {fecha o "ninguno"} (hace {N} días).

🔖 Ciclo GSC
   Última tanda: {letra} enviada el {fecha} — {N} semanas
   Próxima lectura clave: {hito del § 6 más cercano}

📊 Última lectura weekly
   {1-2 bullets con cifras clave del último crumb weekly · o "sin lecturas aún"}

🚨 Alarmas activas
   🔴 {si hay} · {umbral y acción sugerida}
   🟡 {si hay} · {umbral}
   🟢 {si todo OK}

🧭 Decisión pendiente (del último briefing)
   {1 frase con el "Movimiento" principal del briefing más reciente}

▶️  Sugerencia
   {1 sugerencia de la acción más alineada con hoy: ¿toca weekly? ¿toca tanda? ¿toca esperar?}
```

## Reglas

- No inventar cifras. Si un dato falta en los crumbs, escribir "sin dato" o "pendiente".
- No ejecutar `/seo-weekly` u otros commands como efecto colateral — este es solo foto.
- Brevedad absoluta: si el output supera 20 líneas, has hecho algo mal.
- Si el usuario pregunta por algo más al terminar, responder normal; no volver a cargar todo.
