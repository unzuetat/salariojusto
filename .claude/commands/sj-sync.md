---
description: Doctor de sincronización cross-máquina — ¿esta máquina está alineada con producción (origin/main) antes de trabajar? Caza main vieja y ramas divergentes/sin pushear. Determinista. Invoca con /sj-sync.
---

# /sj-sync — doctor de sincronización entre máquinas

`origin/main` (producción) es la **única fuente de verdad del código**; MC lo es del
contexto. El bug que rompe el trabajo entre máquinas es trabajar sobre una `main`
vieja o mergear una rama que diverge de producción. Este check lo caza.

**Cuándo correrlo:**
- **Al ARRANCAR** (antes de tocar nada, idealmente dentro de `/import-mc`): si hay
  HARD, alinear ANTES de trabajar.
- **Al CERRAR** (antes de `/export-mc`): asegura que lo que dejas es visible para la
  otra máquina (pusheado) y que no arrastras una rama tóxica.

1. Correr: `bash scripts/audit/sync-check.sh`
2. Triar:
   - **❌ HARD `main` por detrás de origin/main** → `git checkout main && git pull --ff-only` antes de empezar. Nunca ramificar trabajo nuevo desde una `main` vieja.
   - **❌ HARD rama actual DIVERGE de origin/main** → producción tiene commits que tu rama no tiene; mergearla revertiría prod. Rebasar sobre `main` (`git rebase origin/main`) o rescatar selectivamente los archivos nuevos a una rama limpia. NO mergear tal cual.
   - **⚠️ WARN commits/ramas sin pushear** → la otra máquina no los ve. Pushear (`git push -u origin <rama>`) antes de cerrar la sesión, o aceptar conscientemente que se quedan en esta máquina.
3. Regla de oro: **ninguna máquina se abandona sin pushear su rama.** Lo que no está en origin, para la otra máquina no existe → se rehace (y choca).

> Integración opcional (la hace el usuario en MC): llamar a este check desde el
> paso 0.5 de `/import-mc` (abortar/avisar si HARD al arrancar) y de `/export-mc`
> (gate: no cerrar con commits sin pushear).
