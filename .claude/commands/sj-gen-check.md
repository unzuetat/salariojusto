---
description: Arnés anti-regresión de los generadores (Prioridad 1) — verifica en copia aislada que no reintroducen IBM Plex Mono ni pierden URLs de sitemap. Invoca con /sj-gen-check.
---

# /sj-gen-check — ¿el fix de Prioridad 1 funcionó?

Es el gate de la **Prioridad 1** (generadores que revierten PR#22 / pierden URLs).

1. **Dry primero**: `bash scripts/audit/gen-check.sh` (explica qué hará, no ejecuta).
2. **Ejecutar**: `bash scripts/audit/gen-check.sh --run`. Corre los generadores
   en un **git worktree temporal de HEAD** — NUNCA toca el árbol de trabajo.
3. **Leer veredicto**:
   - ✅ generadores limpios → la Prioridad 1 está resuelta (o no reproducía).
   - ❌ páginas ganan IBM Plex Mono / sitemap pierde URLs → P1 NO resuelta;
     el fix va en las **plantillas de los generadores**, no en el HTML.
4. **Emparejar con /goal** al atacar P1:
   `/goal scripts/audit/gen-check.sh --run sale con exit 0` + iterar el fix de
   los generadores hasta verde. Es el criterio de "terminado" objetivo.

## Reglas

- Requiere `git` y `node`. Si faltan, reporta y aborta sin tocar nada.
- Aislado por diseño: el worktree temporal se elimina siempre (trap EXIT).
- No correr los generadores en el árbol real para "probar" — eso ES el daño P1.
- Nunca push a main sin OK.
