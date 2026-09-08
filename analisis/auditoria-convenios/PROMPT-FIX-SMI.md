# Prompt para el hilo de corrección del SMI

Copiar y pegar tal cual en una conversación nueva sobre este repo.
Origen de los datos: auditoría del 20-ago-2026 (`/sj-auditoria`), todos verificados a mano contra el HTML.

---

Tengo que corregir un error de dato en 9 fichas de convenio de salariojusto.es. Lo detectó una auditoría automática y verifiqué los casos uno a uno; el diagnóstico de abajo es fiable, pero **cada cifra nueva que escribas hay que cotejarla contra el boletín antes de ponerla**.

## El error

Nueve fichas afirman que el **SMI 2026 es 16.576 €** brutos/año. El SMI 2026 es **17.094 €** (14 pagas, 1.221 €/mes). 16.576 € era el SMI de 2025.

Fichas afectadas, con sus clics de los últimos 28 días en Search Console:

| ficha | clics 28d |
|---|---|
| `convenio-limpieza-bizkaia.html` | 158 |
| `convenio-limpieza-asturias.html` | 130 |
| `convenio-limpieza-zaragoza.html` | 124 |
| `convenio-limpieza-malaga.html` | 72 |
| `convenio-limpieza-valencia.html` | 64 |
| `convenio-limpieza-murcia.html` | 41 |
| `convenio-limpieza-sevilla.html` | 22 |
| `convenio-limpieza-laspalmas.html` | 2 |
| `convenio-hosteleria-alicante.html` | 0 |

## Por qué NO es un buscar-y-reemplazar

El error arrastra las frases que **interpretan** la diferencia, y en varios casos invierte la conclusión. Tres casos ya verificados con la aritmética hecha:

**`limpieza-zaragoza`** afirma *"Solo 1 de 19 categorías queda bajo el SMI 2026"*. Con el SMI real son **3**:

| categoría | bruto anual | vs 17.094 € |
|---|---|---|
| Aprendiz | 15.621,19 € | −1.472,81 € |
| Limpiador/a | 16.926,95 € | −167,05 € |
| Peón | 16.926,95 € | −167,05 € |

Y dice de Limpiador/a *"está apenas 350,95 € por encima del SMI"*: está **167,05 € por debajo**. Limpiador/a es la categoría central del sector y la cifra que va en el title.

**`limpieza-asturias`** tiene una sección titulada *"Verificación A+B — todas las categorías cumplen el SMI 2026"*, y en el cuerpo *"Las 27 categorías del convenio cumplen formalmente el SMI 2026"*. Aspirante Administrativo/a y Botones cobran 16.576,05 €: **517,95 € por debajo**, no *"apenas 5 céntimos por encima"*.

**Las otras seis fichas no están verificadas una a una.** Hay que repetir el mismo cálculo en cada una: para cada categoría, bruto anual contra 17.094 €, y reescribir toda conclusión que cambie de signo.

## Cómo calcular (importante)

El anual sale de **salario mensual × número de pagas del articulado**, no × 12. Varios de estos convenios tienen 15 o 16 pagas, y ahí está la trampa: una base mensual que parece baja puede dar un anual por encima del SMI, y al revés. Comprobar el número de pagas en el texto del convenio antes de comparar nada. La comparación siempre es **anual contra anual**.

## Trabajo adicional en dos de esas fichas

Ya que hay que abrirlas, dos defectos verificados que conviene arreglar en el mismo paso:

- **`limpieza-asturias`** da **dos códigos REGCON distintos** para el mismo convenio: `33000735011979` (ficha técnica y bloque de fuentes) y `33000635011982` (bloque de sindicatos). Uno es falso: cotejar en REGCON cuál es el bueno.
- **`limpieza-zaragoza`** sirve en el JSON-LD un plus festivo de **15,47 €** mientras el cuerpo dice **16,49 €** en tres sitios (líneas 344, 378 y 687). La cifra obsoleta está en la capa que leen los buscadores y las IA.

## Un caso relacionado pero distinto — `convenio-hosteleria-valencia.html`

No comete el error del 16.576 €, pero **no menciona el SMI en ninguna parte** y publica en el hero *"De 1.100,46 €/mes (ayudantes, riders)"*. Son 15 pagas: 1.100,46 × 15 = **16.506,90 €/año, 587,10 € por debajo del SMI**. Un lector puede concluir que le corresponden 1.100,46 €/mes cuando su suelo legal son 1.221 €/mes. Es la ficha con más tráfico del corpus (163 clics/28d) y necesita el aviso del suelo legal, no un cambio de cifra.

## Reglas del proyecto que aplican

- **Nunca inventar ni aproximar una cifra.** Ante duda de fuente, parar y preguntar.
- Rama nueva (`fix/smi-2026-nueve-fichas` o similar), **nunca commit directo a main**. Preguntar antes de hacer push o deploy.
- Commits y PR **sin atribución a Claude** (ni `Co-Authored-By`, ni firma en el cuerpo del PR).
- Sello "Verificado contra [boletín] + fecha": el boletín correcto de cada provincia (BOP provincial, forales BOB/BOG/BOTHA, BOCM en Madrid), nunca "BOE" si no es estatal.
- Categorías profesionales en lenguaje inclusivo.
- Salarios en tinta neutra, sin verde.
- Enseñarme un preview antes de dar por buenos los cambios editoriales.

## Cómo comprobar que quedó bien

```
python3 scripts/audit/convenios-recolector.py
```

Y mirar `analisis/auditoria-convenios/<fecha>/HARDFAILS-deterministas.md`: el **código 12.2 debe desaparecer** (ahora sale en 9 fichas). El código `12.2*` con asterisco es solo un aviso —referencias históricas legítimas al SMI de años anteriores— y puede quedarse.

Contexto completo de la auditoría, si hace falta: `analisis/auditoria-convenios/COLA-CORRECCIONES.md`.
