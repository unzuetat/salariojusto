---
description: Verifica el patrón unificado de convenios (notaEditorial en JSON + fórmula ganadora en titles). Determinista. Invoca con /sj-convenios-patron.
---

# /sj-convenios-patron — patrón unificado de convenios

1. Correr: `bash scripts/audit/convenios-patron.sh`
2. Leer `patron-convenios.md`. Triar (≤10 líneas):
   - **HARD** title sin patrón alguno → fórmula ganadora (memoria
     `feedback_formula_titles_convenios`): cifra-arrancante €/mes + provincia + año.
     Proponer el title corregido.
   - **WARN notaEditorial** → memoria `feedback_patron_unificado_convenios`.
     `construccion_estatal.json` está exento (marco estatal, sin tablas).
   - **WARN sin cifra-arrancante** → mejorable, no urgente.
3. La longitud de nombres de grupos en JSON es revisión humana (estructura
   heterogénea, no se asevera para no dar falsos positivos).
4. No arreglar sin OK. Nunca push a main sin OK.
