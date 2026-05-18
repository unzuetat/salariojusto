---
description: Te orienta al sentarte a trabajar el SEO: recuerda el sistema, lista lo pendiente y qué hacer ahora. Lee el playbook. Invoca con /sj-guia.
---

# /sj-guia — orientación al empezar a trabajar

No es un volcado del doc: es para que en 30 segundos sepas dónde estás y qué toca.

## Qué hacer

1. **Leer el playbook** `docs/seo-playbook.md` (la fuente de verdad del sistema).
   No reproducirlo entero; usarlo para situar al usuario.

2. **Recordar el toolset en 4 líneas**: `/sj-dashboard` (estado por landing),
   `/sj-invariantes` (drift/health), `/seo-status` (foto SEO desde MC),
   `/goal` (gate verificable). Una frase cada uno.

3. **Mostrar lo pendiente real** (lo que evita "perder el hilo"):
   - Leer `data/landings-notas.csv`.
   - Listar las filas con `proximo_paso` no vacío ni `—`, agrupadas por tipo
     (ej. "Tanda J reindex", "footer legal", "verificar GSC", "decidir title").
   - Máx ~12 líneas. Si hay muchas del mismo tipo, agrupar y contar.

4. **Recomendar el siguiente paso** con criterio: priorizar por impacto y por lo
   no bloqueado por Prioridad 1. Una recomendación concreta, no un menú.

5. Si el usuario pidió contexto más profundo, apuntar a: crumbs MC del 12-may
   (auditoría titles + Tanda J + estrategia fases), memorias
   `project_pendientes_siguiente_sesion` y `project_fase3_longtail_directiva`.

## Reglas

- Conciso y accionable. El valor es orientar, no recitar.
- No ejecutar `/sj-dashboard` ni `/sj-invariantes` automáticamente; sugerirlos si
  el estado parece viejo (mirar el sello de fecha del mirror si está a mano).
- Nunca push a main sin OK.
