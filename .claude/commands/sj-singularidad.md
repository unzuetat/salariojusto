---
description: Mide solapamiento de contenido entre páginas (boilerplate/contenido en masa) — la causa raíz del rechazo AdSense "poco valor". Determinista. Invoca con /sj-singularidad.
---

# /sj-singularidad — qué páginas son "contenido de poco valor"

Convierte el genérico de AdSense en datos accionables: qué páginas comparten
demasiado contenido y qué bloques diferenciar primero.

1. **Correr**: `bash scripts/audit/singularidad.sh` (umbral 0.65) o
   `bash scripts/audit/singularidad.sh 0.50` (más estricto).
2. **Leer** `singularidad.md`. Triar (≤12 líneas):
   - Top del ranking = páginas con más boilerplate (las que tumban AdSense).
   - "Bloques compartidos más frecuentes" = qué frases/secciones están copiadas
     en N páginas → eso es lo que hay que diferenciar o recortar.
   - Distinguir grupo `kit` (boilerplate "Marco legal" entre plantillas) vs
     `convenios` (estructura plantillada entre provincias).
3. **Plan de diferenciación**, no de borrado: añadir contenido único sustancial
   por página + variar/recortar los bloques repetidos. Priorizar por
   boilerplate_ratio × impresiones (cruzar con LANDINGS.csv).
4. **Regla dura (memoria `reference_adsense`)**: NO re-solicitar revisión AdSense
   hasta que el nº de páginas sobre umbral sea ~0. Re-apelar sin bajar esto
   quema el intento (van 2 rechazos).

## Emparejar con /goal

`/goal scripts/audit/singularidad.sh sale con exit 0` + iterar diferenciando
contenido hasta que ninguna página supere el umbral. Es el criterio objetivo
de "listo para re-apelar AdSense".

## Reglas

- Dependencia: `perl` (ships con macOS/Linux). Determinista.
- `singularidad.md` es regenerado (gitignored). No editar a mano.
- Nunca push a main sin OK. Diferenciar contenido = decisión de producto, con OK.
