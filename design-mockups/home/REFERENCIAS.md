# Rediseño Home · Referencias y trayectoria

**Rama**: `design/home-rediseno`
**Estado al pausar**: 19-jul-2026, iterando sobre variante 🅳 (v5 ganadora).
**Regla activa**: [feedback_design_rama_dedicada](~/.claude/projects/-Users-telmo-Projects-salariojusto/memory/feedback_design_rama_dedicada.md) · NO merge a main hasta post-aprobación AdSense (~22 ago).

---

## Contexto

Sesión de diseño arrancada el 19-jul-2026 tras configurar MCP Claude Design. Objetivo: rediseño home con foco en (1) visual, (2) densidad de info, (3) trust, (4) comodidad de navegación. Iteración sobre variante 🅳 (Split editorial + calc dual) tras descarte de 🅰 Editorial, 🅱 Dashboard y 🅲 Buscador-first.

---

## Referencias visuales aportadas por Telmo

### USAFacts.org — capturas
Cuatro capturas del sitio USAFacts como inspiración de elementos que enriquecen sin caer en AI slop:

1. **Footer negro puro** con 3 columnas (Subscribe + newsletter | Browse | More), enlaces limpios, iconos redes sociales en círculos pequeños, copyright + links legales al pie. Fondo negro más neto que `--ink`. Botón CTA magenta redondo.
2. **Sección "Articles"** — grid 3×2 de cards con:
   - Icono isométrico peculiar en morados/azules (charts, dinero, medicare)
   - Título grande sans "Are wages keeping up with inflation?"
   - Metadata "Updates monthly" en gris
   - Cards con fondo gris muy claro (cream light) y sutil elevación
3. **Hero newsletter CTA** — fondo blanco/cream, icono sobre 3D, titular gigante "Our government is complex. Our data doesn't have to be.", input email grande + botón magenta redondo con flecha, curva ondulada al pie
4. **Nav corto**: "About | [Subscribe magenta] | 🔍"
5. **Cookie banner** minimal con 2 botones ("Preferences" outline + "Accept" magenta)

**Elementos extraídos sin copiar**:
- Cards con ilustraciones peculiares → rompen puro texto sin AI-icon-library
- Grid de "temas explicados" con metadata funcional
- Footer negro puro con newsletter + columnas
- Color acento asertivo en botones (magenta USAFacts → rojo `#B91C1C` en SalarioJusto)
- Aire tipográfico grande sans con más peso, menos ornamental

### Brief crítico UX de Telmo (17-jul, mid-turn v4)

Cinco puntos que redirigieron el diseño a v5:

1. **Antipatrón**: la home intenta ser directorio + calculadora + verificador + comparador europeo + hub de guías a la vez. Los ganadores cívicos (OpenSecrets, USAFacts) resuelven con **una sola acción principal above the fold** (buscador o calculadora) y resto como navegación secundaria clara.

2. **Visualización de resultados**: convertir el desglose IRPF/SS/neto y la comparativa con convenio en **gráficos, no solo cifras**. Rasgo común de todos los premiados en categorías de datos.

3. **Sistema de fichas de convenio** con **plantilla visual idéntica y comparables** entre sí (patrón OpenSecrets).

4. **Tratamiento editorial de las guías** al estilo Knight Institute (voz humana, no cards con icono).

5. **Advertencia**: muchos Awwwards priorizan lo visual sobre la usabilidad. Para SalarioJusto (usuarios buscando su sueldo, posiblemente desde móvil en el trabajo), **los Webby en categorías de UX, Government y Best Practices son mejor brújula** que los ganadores más espectaculares de Awwwards.

---

## Trayectoria del mockup 🅳 v1 → v5

Todos los archivos viven en `design-mockups/home/`.

### 🅳 v1 · `variante-d.html`
Split editorial + calc dual. Base: hero split 50/50 con editorial izq + card calc der. Info-bar sticky con KPIs. Directorio 5 col. Trust section fondo blanco con 6 badges.

### 🅳 v2 · `variante-d-v2.html`
Añade **toolbox tabs** (Calc neto + Verificar convenio) + **hub-strip de chips** (Kit + Ley + Guías + Comparador + Plantillas). Chips reubicados abajo entre Trust y Footer tras petición ("plantillas y herramientas jerárquicamente menos importantes").

### 🅳 v3 · `variante-d-v3.html`
Elimina rasgos de "AI slop" identificables:
- Fuera info-bar sticky con dot verde pulsante + KPIs (36/19/6)
- Fuera "3 big numbers" del hero
- Fuera tabs → cards yuxtapuestas
- Menos eyebrows uppercase (1 solo)
- **Titular con voz humana**: "¿Cobras lo que dice tu convenio? Cógelo del BOE. Con la fuente al lado."
- **Nota firmada por Telmo** ("Mantenido por Telmo, un solo trabajador. Sin equipo, sin publicidad")
- **Mock BOCM nº 189 como thumbnail rotado** — pieza tangible peculiar
- **Trust reformulado como párrafo editorial firmado**
- Rojo `--red` como acento asertivo
- Números romanos i/ii/iii en herramientas

### 🅳 v4 · `variante-d-v4.html`
Inspirado en USAFacts sin copia:
- **Sección "Temas explicados"** grid 3×2 con iconos SVG peculiares (barras, mapa, reloj, documento, EU, foral)
- **CTA principal en rojo** con border-radius 100px (píldora asertiva)
- **Sección Newsletter** ("Avísame cuando cambie mi convenio") con input píldora + botón rojo redondo
- **Footer negro puro** #0F0D0B con 4 columnas (brand+firma | Explorar | Sectores | Sobre) + fila bottom con copyright y legales

### 🅳 v5 · `variante-d-v5.html` ← GANADORA ACTUAL
Aplica el brief crítico UX de Telmo:
- **UNA sola acción above-fold**: buscador enorme centrado con placeholder "hostelería madrid, limpieza barcelona…" + 7 quick-chips
- **Calc y verificador degradados** a "también puedes" en sección secundaria
- **Resultados como gráficos** en sección demo:
  - Verificador: barra de rango con marcador rojo posicionando bruto vs min/max nivel
  - Neto: stacked bar SS 6,4% / IRPF 6,9% / Neto 86,7% con leyenda
- **Editorial destacado** "¿Cuánto sube tu convenio en 2026?" con gráfico comparativo horizontal (6 convenios de +5,9% a 0%)
- **Fichas comparables**: intro editorial "Puedes leer una y saber leer las 36"
- **Prioridad UX + móvil**: `@media(max-width:720px)` con rediseño real
- Mantiene: BOE thumbnail rotado, Trust firmado, Footer denso

---

## Principios establecidos (aplicables a fases siguientes)

1. **Una sola acción above the fold** (aplicable también a landings de convenio)
2. **Resultados como gráficos, no cifras sueltas** (aplicable a fichas de convenio)
3. **Fichas comparables**: plantilla visual idéntica entre las 36 landings
4. **Editorial style Knight Institute** para guías y "temas explicados"
5. **UX y móvil > visual espectacular** (brújula Webby, no Awwwards)
6. **Sin AI slop**: fuera dashboards con KPI cards, fuera "3 big numbers" hero, fuera eyebrows uppercase excesivos, fuera icon libraries genéricas
7. **Voz editorial humana**: titulares como preguntas o afirmaciones concretas, nota firmada por Telmo, párrafos con voz
8. **Color acento asertivo** `--red #B91C1C` para llamadas de acción principales
9. **Elementos peculiares**: BOE thumbnail rotado, iconos SVG diseñados, contenido tangible con datos reales verificados

---

## Estado al pausar la sesión

- **Rama**: `design/home-rediseno` pusheada a origin
- **Preview Vercel activo**: `https://project-t15ty-git-design-home-rediseno-unzuetat-8895s-projects.vercel.app/design-mockups/home/variante-d-v5.html`
- **Ganadora actual**: v5 pendiente de validación por Telmo en preview deploy
- **NO se ha mergeado a main** (ni se debe hacer hasta post-aprobación AdSense mediados agosto)

## Qué queda por decidir/iterar (próxima sesión)

### Dudas planteadas sin resolver en v5
1. ¿El buscador above the fold transmite que es LA acción principal, o sigue siendo ambiguo?
2. ¿Los gráficos de resultado se leen bien? ¿La barra de rango con marcador es intuitiva? ¿El stacked bar comunica bruto→neto de forma inmediata?
3. ¿El editorial destacado aporta más que texto plano?
4. ¿La densidad general es funcional o cae en simplismo?

### Ejes de iteración pendientes
- **Mobile**: verificar en dispositivo real que el flujo above-fold funciona (hoy solo hay `@media` genérico)
- **Buscador**: falta implementar autocompletado real (mock actualmente)
- **Gráficos**: los gráficos actuales son estáticos con valores hardcoded. En producción tendrían que ser dinámicos, calculados desde la calc/verificador
- **Editorial destacado**: el gráfico comparativo es mock — hay que decidir si en producción se genera dinámicamente desde el ranking de convenios
- **Densidad del directorio**: 5 columnas en desktop puede sentirse denso — probar 4 col
- **BOE thumbnail rotado**: gusta pero puede rotarse aún más como "collage" con varios BOEs (BOCM + BOG + BOPB apilados)
- **Trust editorial firmado**: mover posición? Actualmente al final, podría ir arriba
- **Newsletter**: ¿realmente vamos a implementar suscripción o es solo mock? Si es solo mock, mejor quitar

### Import al código real
Cuando la ganadora esté validada:
1. Sustituir `index.html` real preservando: JS calculadora funcional + mega-menú + resto de secciones activas
2. Verificar CWV mobile no se rompe (memoria `feedback_sjradar_minimo_7_dias` sobre thin.py)
3. Preview local + push
4. **NO mergear hasta post-aprobación AdSense** — mantener en rama design/home-rediseno

---

## Cómo retomar la próxima sesión

Desde Claude Code:
1. `git checkout design/home-rediseno`
2. Leer este archivo (`design-mockups/home/REFERENCIAS.md`)
3. Abrir preview Vercel de v5 y decidir siguiente iteración
4. Referencia rápida al preview: `https://project-t15ty-git-design-home-rediseno-unzuetat-8895s-projects.vercel.app/design-mockups/home/variante-d-v5.html`

Memoria relacionada:
- `feedback_design_rama_dedicada` (rama obligatoria + no merge en ventana AdSense)
- `reference_vercel_preview_url` (patrón preview Vercel)
- `project_adsense_goal` (ventana crítica agosto)
