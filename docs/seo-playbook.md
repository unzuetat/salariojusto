# SEO Playbook — sistema operativo de salariojusto.es

Lee esto cuando te sientes a trabajar el SEO/landings. Es el manual del sistema.
Comando rápido para orientarte: **`/sj-guia`**.

---

## 0. La filosofía (por qué existe todo esto)

Este proyecto sangra por **drift silencioso**: titles que Google no re-rastrea,
sitemap roto 18 días sin avisar, IBM Plex Mono que reaparece solo, meta refreshes
que nunca propagan. El historial entero es eso.

**Principio rector:** lo que se puede verificar, se verifica con un script
determinista (no con mi juicio ni con un Excel a mano). Lo derivado se regenera
de la verdad; solo lo humano (decisiones) se mantiene a mano y persiste.

---

## 1. Los comandos `/sj-*`

| Comando | Qué hace | Cuándo usarlo |
|---|---|---|
| **`/sj-dashboard`** | Regenera `LANDINGS.csv` (Excel) + mirror MC. Una fila por landing: CTR, pos, última acción, decisión, próximo paso. | Al empezar a trabajar, o tras cualquier cambio, para no perder el hilo. |
| **`/sj-invariantes`** | Auditoría determinista: sitemap↔HTML, footer legal, IBM Plex Mono (regresión PR#22), llms.txt. | Antes de pushear, tras tocar generadores, o como health-gate periódico. |
| **`/sj-guia`** | Te orienta: recuerda el sistema + lista lo pendiente (próximos pasos) + qué hacer ahora. | Al sentarte a trabajar, si no sabes por dónde seguir. |

Pendientes de replicar (mismo molde, cuando haga falta): `/sj-gen-check`
(verificar fix Prioridad 1), `/sj-tanda-preflight` (gate pre-tanda GSC),
`/sj-convenios-patron`, `/sj-kit-inventario`.

---

## 2. El flujo dashboard + capa humana

Dos naturalezas de dato, **nunca mezclar**:

- **Derivado** (título, sitemap, HTTP, CTR/imp/pos, última acción): se **regenera**
  con `/sj-dashboard`. No editar a mano. No puede mentir.
- **Humano** (decisión tomada, notas, próximo paso): vive en
  **`data/landings-notas.csv`** (`slug,decision,notas,proximo_paso`). Se edita a
  mano, sobrevive a cada regeneración, se versiona en git.

Ciclo de trabajo:
1. `/sj-dashboard` → abrir `LANDINGS.csv` en Excel/Sheets. Pivotar por `grupo/sector` = el árbol.
2. Trabajar una landing. Al decidir algo → anotarlo en `data/landings-notas.csv`
   (yo lo hago cuando decidimos en sesión; si falta el slug, se añade fila).
3. Regenerar para ver el estado fusionado.

Artefactos regenerados (`LANDINGS.csv`, `LANDINGS_DASHBOARD.md`) → **gitignored**,
no se commitean. Lo versionado: `data/landings-notas.csv`, scripts y comandos.

---

## 3. Goals (`/goal`) — cómo aprovecharlos

`/goal <condición>` = "no pares hasta que esto sea verdad, y verifícalo". Útil
cuando la condición es **verificable, autónoma (sin tu GSC) y acotada**.

- Empareja con un script: `/goal el script scripts/audit/invariantes.sh sale con
  exit 0` + `/sj-invariantes` → itero arreglando hasta verde.
- **NO** sirve para cosas que dependen de tu GSC (reindexar) ni para SEO abierto
  ("Asturias a top 5"): el hook bloquearía sin fin. El proxy verificable sí
  ("title vivo == repo == fórmula").
- `/goal clear` solo para abortar antes de tiempo (se auto-limpia al cumplirse).

---

## 4. Reindexación GSC (acción tuya, no mía)

- Fuente de verdad cross-máquina: **`GSC_STATUS.md` en Mission Control**. Leerlo
  SIEMPRE antes de proponer una tanda (no repetir URLs).
- Yo audito qué title reconoce Google (SERP/`/sj-invariantes`) y propongo la
  **Tanda J** priorizada; tú la ejecutas en GSC ("Solicitar indexación", máx ~10/día).
- Cola viva: columna `proximo_paso` del dashboard (filtrar "Tanda J").

---

## 5. Reglas que no cambian

- **Nunca push a main sin OK.** Crear/editar local es libre.
- No inventar datos/cifras/links (memoria `feedback_nunca_inventar`).
- Prioridad 1 = arreglar generadores (revierten PR#22). Bloquea el pipeline de
  convenios, **no** el trabajo SEO/GSC (corre en paralelo).
- Al cerrar sesión / `/export-mc`: regenerar dashboard + subir
  `LANDINGS_DASHBOARD.md` a MC con `mc_upsert_file` (mismo acto que el resto del
  estado → nunca divergen).

---

## 6. Estado y memoria

- **Dónde estoy ahora:** `/seo-status` (foto rápida desde MC) o `/sj-dashboard`.
- **Decisiones de sesión:** crumbs en MC (proyecto `salariojusto`).
- **Pendientes priorizados:** memoria local `project_pendientes_siguiente_sesion`.
- **Estrategia SEO por fases:** memoria `project_fase3_longtail_directiva` +
  crumbs MC del 12-may (auditoría titles, Tanda J, estrategia por fases).

_Última edición del playbook: 2026-05-17._
