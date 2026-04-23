---
description: Genera la próxima tanda GSC (hasta 10 URLs) respetando los 6 criterios. Invoca con /seo-tanda.
---

# /seo-tanda — próxima tanda GSC de reindexación

Propón la próxima tanda (letra D, E, F… según corresponda) de URLs para pegar en Google Search Console → Inspección URL → Solicitar indexación.

## Qué hacer

1. **Cargar estado**:
   - `mc_get_file` projectId=`salariojusto` name=`GSC_STATUS.md` — ver tandas ya enviadas y backlog
   - `mc_get_file` projectId=`salariojusto` name=`CONTEXT.md` — ver qué landings nuevas existen
   - Bash: `ls /Users/telmo/Projects/salariojusto/*.html` (o `find` con pattern) — lista real de archivos en el repo. Esto es la fuente de verdad sobre qué existe.
   - Bash: `git log --name-status --since="3 weeks ago" -- '*.html'` — commits recientes, así identificas contenido **nuevo desde la última tanda**.

2. **Determinar letra de tanda**: la siguiente en el alfabeto tras la última registrada en GSC_STATUS.md.

3. **Construir lista candidata** aplicando los 6 criterios de `GSC_STATUS.md § "Criterios para Tanda D+"` en orden:
   1. Contenido nuevo > reindexación (prioriza landings aparecidas desde la última tanda).
   2. Cerrar clusters (si faltan tramos para una ciudad en `/salario-neto-`, completarlos juntos).
   3. Máximo 10 URLs.
   4. Orden dentro de tanda: páginas-pilar/convenios estatales primero, luego provinciales, luego landings salario-neto.
   5. Verificar HTTP 200 en prod (con `curl -s -o /dev/null -w "%{http_code}" https://salariojusto.es/ruta`). Si alguna da !=200, sustituir por la siguiente candidata y anotar el descarte.
   6. Vigilar señal de impresiones por cluster (si el último `SEO weekly · …` crumb en MC apunta un cluster con <500 imp acumuladas y llevamos >4 semanas, NO añadir más landings a ese cluster sin backlinks primero — proponer pausa).

4. **Output** en este formato exacto:

```
📋 Tanda {letra} propuesta · {YYYY-MM-DD}

Criterios aplicados:
· {breve: "contenido nuevo de Sprint 1 Limpieza primero"}
· {breve: "cerrar cluster salario-neto 50k Madrid/BCN/VLC"}
· {etc}

URLs (pegar en GSC una a una):
 1. https://salariojusto.es/ruta.html   ← {razón: pilar, nuevo, cierra cluster…}
 2. ...
10. ...

Verificación pre-envío:
· HTTP 200 confirmado: {N}/10
· Descartadas por no-200: {lista o "ninguna"}

Contexto para la próxima revisión:
· Ventana de lectura esperada: {fecha inicio} a {fecha fin} (4-8 semanas)
· Cluster principal monitorizado: {cluster}
· Alarma relevante: {umbral del SEO_DASHBOARD § 4 que aplica}
```

5. **Actualizar GSC_STATUS.md** en MC solo si el usuario confirma que ha enviado la tanda. El patrón es: pedirle al final *"¿la has enviado ya? Si sí, la añado como completada; si no, la dejo como propuesta pendiente"*.

   - Si confirma → `mc_upsert_file` con el file actualizado (nueva sección "Tanda {letra} — ✅ Completada YYYY-MM-DD" con las 10 URLs verificadas) + `mc_add_crumbs` con título `"GSC Tanda {letra} enviada"` y cuerpo con las 10 URLs y razones.
   - Si rechaza → no tocar nada, solo dejar la propuesta en pantalla para cuando la ejecute.

## Reglas

- **Verificar siempre HTTP 200 antes de proponer.** Nunca una URL que no existe o que redirige.
- **Si hay alarma roja del último weekly en el cluster que tocaría expandir**, proponer pausa explícita en vez de una tanda. No seguir produciendo tandas de un cluster sin señal.
- **Nunca inventar URLs.** Si una landing no está en el repo ni en los commits recientes, no existe para esta tanda.
- Máximo 10 URLs. Si hay más candidatas, las restantes las dejas como "backlog para Tanda {siguiente}" al final del output.
