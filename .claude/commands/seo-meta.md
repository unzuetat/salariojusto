---
description: Propón 3 variantes de title + meta description para una landing con CTR bajo (<1% + ≥1000 imp). Invoca con /seo-meta [ruta].
---

# /seo-meta — rewriting de meta title / meta description

Genera 3 variantes de `<title>` y `<meta name="description">` para una landing con CTR bajo pese a tener impresiones suficientes. La decisión de aplicar es del usuario.

## Activación

- Con argumento: `/seo-meta /salario-neto-45000-euros-brutos-madrid.html` — trabajas directamente sobre esa URL.
- Sin argumento: pídele al usuario la ruta (o dile que la saque del último `SEO weekly` crumb si hay alguna marcada con alarma amarilla CTR <1%).

## Qué hacer

1. **Leer la landing actual** (bash + Read):
   - `curl -s https://salariojusto.es{ruta}` o leer el HTML local si está en el repo.
   - Extraer el `<title>` y el `<meta name="description">` actuales.
   - Extraer también: `<h1>`, el primer `<p>` del hero, y cualquier cifra clave de la card principal (ej. neto anual y mensual).

2. **Cargar contexto del proyecto**:
   - `mc_get_file` projectId=`salariojusto` name=`CONTEXT.md` — para entender decisiones editoriales (regla "utilidad primero", lenguaje inclusivo, etc.).
   - Si la landing es de convenio, considerar qué sector y provincia es.

3. **Analizar el problema del CTR bajo**. Hipótesis típicas:
   - Title demasiado largo (>60 chars) — se trunca en SERP.
   - Title sin la query típica del usuario.
   - Meta description genérica (misma que otra landing del cluster).
   - Falta promesa concreta (cifra, año, ciudad).
   - Falta de CTA implícito en meta.

4. **Generar 3 variantes** con ángulos distintos:

   **Variante 1 — Directa / cifra arriba**: prioriza colocar la cifra clave (ej. "32.854 €") cerca del inicio del title. Para landings salario-neto.

   **Variante 2 — Pregunta / dolor**: usa el formato pregunta que imita cómo busca la gente ("¿Cuánto son 45.000 € brutos en Madrid?"). Meta description responde en una frase.

   **Variante 3 — Autoridad / fuente**: resalta el cálculo oficial, IRPF autonómico y año. Para usuarios que buscan confianza.

   Reglas por variante:
   - Title ≤60 caracteres.
   - Meta description entre 140 y 160 caracteres.
   - Lenguaje inclusivo (`trabajadores y trabajadoras`, o neutro).
   - Sin mayúsculas gritonas, sin emojis.
   - Nunca inventar cifras: la cifra que pongas tiene que estar en la landing actual (ya extraída en paso 1).

5. **Output**:

```
🎯 Rewrite meta · {ruta}

ACTUAL
  <title> ({N} chars): {texto}
  <meta>  ({N} chars): {texto}
  Diagnóstico: {1 frase del problema probable}

VARIANTE 1 — cifra directa
  <title> ({N} chars): {propuesta}
  <meta>  ({N} chars): {propuesta}

VARIANTE 2 — pregunta / dolor
  <title> ({N} chars): {propuesta}
  <meta>  ({N} chars): {propuesta}

VARIANTE 3 — autoridad / fuente
  <title> ({N} chars): {propuesta}
  <meta>  ({N} chars): {propuesta}

Para aplicar:
· Si es landing salario-neto, el cambio va en scripts/generate-pages.js (función generateSalaryPage — campos title/desc) y después regenerar con node scripts/generate-pages.js.
· Si es landing de convenio, va en scripts/generate-convenios.js o en el HTML estático de la landing específica.
· NUNCA editar el HTML generado a mano — se pierde al regenerar.
```

6. **Si el usuario elige una variante**, hacerlo de forma guiada:
   - Identificar dónde vive el template real (el generador correspondiente).
   - Mostrar el diff propuesto antes de escribir.
   - Editar con `Edit` tool.
   - Regenerar ejecutando el script.
   - Commit + push a `test/next` (preguntando confirmación primero, regla del proyecto).

## Reglas

- **Nunca inventar cifras.** Si vas a poner un neto o un IRPF, lee la landing primero y copia la cifra real.
- **Nunca editar HTML generado directamente** en salario-neto-\*-\*.html. Siempre a través del generador.
- **Máximo 3 variantes.** Menos si una de las tres degrada respecto al actual — dilo y recorta.
- **Sugerir test A/B no es real aquí** (el sitio no tiene infra para eso). La forma de medir el efecto es relanzar la URL a GSC tras el cambio y comparar CTR a 4 semanas.
