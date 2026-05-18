---
description: Gate pre-Tanda GSC — verifica que las URLs candidatas dan 200, están en sitemap y su title vivo == repo. Invoca con /sj-tanda-preflight.
---

# /sj-tanda-preflight — gate antes de enviar una Tanda a GSC

Evita quemar cuota GSC en URLs rotas/no desplegadas (lecciones Tandas D, E, F, G).

1. **Conseguir las URLs candidatas** de la tanda propuesta (de la conversación,
   de `/seo-tanda`, o de la columna `proximo_paso` del dashboard filtrando "Tanda J").
2. **Correr**: `bash scripts/audit/tanda-preflight.sh URL1 URL2 ...`
   (o pasarlas por stdin, una por línea).
3. **Leer la tabla**: cada URL → HTTP · en sitemap · title vivo vs repo.
   Cualquier ❌ = NO enviar esa URL hasta resolver.
4. **Paso que el script NO hace** (recordarlo siempre): dedup contra
   `GSC_STATUS.md` en MC (protocolo #7). Leer ese archivo con `mc_get_file`
   projectId=`salariojusto` y descartar/justificar URLs ya enviadas en tandas
   previas. Sin este paso la tanda no está lista.
5. Resumir: cuáles pasan el gate, cuáles no y por qué. No ejecutar la tanda
   (eso es acción del usuario en GSC).
