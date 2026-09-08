# Diagnóstico de las URLs con `#` — 8-sep-2026

Datos GSC hasta el 6-sep (ventanas de 14 y 28 días). Motivo: la posición media del sitio pasó de
5,62 (28-ago) a 5,73 (6-sep) y las anclas parecían la causa.

## 1 · Cuántas son

En 28 días: **127.555 impresiones de URLs con `#`, el 37% de todas las apariciones del sitio**, en
**261 URLs distintas**, con un puñado de clics (CTR ≈ 0,03%).

Y crecen rápido: en 14 días han pasado de 41.255 a 86.300 impresiones — más del doble, subiendo del
23% al 31% del total en ese corte.

Fichas donde las anclas ya superan a la propia página:

| ficha | impresiones de la página | de sus anclas | % ancla |
|---|---|---|---|
| `limpieza-zaragoza` | 4.679 | 6.996 | **60%** |
| `hosteleria-cantabria` | 7.487 | 10.334 | **58%** |
| `metal-valencia` | 5.854 | 7.181 | **55%** |
| `limpieza-madrid` | 18.126 | 21.587 | **54%** |
| `limpieza-bizkaia` | 4.697 | 5.009 | **52%** |
| `hosteleria-zaragoza` | 4.358 | 4.750 | **52%** |

## 2 · De dónde salen

Del índice de secciones de cada ficha:

```html
<nav class="toc" aria-label="Índice del convenio">
  <a href="#ambito">¿Te cubre?</a>
  <a href="#tablas">Tablas salariales 2025</a>
  …
```

Está en **41 de las 55 fichas**. Google lo usa para generar enlaces de salto a secciones y los
contabiliza como apariciones propias. Los fragmentos más extendidos: `#ambito` (26 fichas),
`#pluses` (23), `#jornada` (21), `#tabla-salarial` (20).

## 3 · ¿Hunden la posición de la página madre? **NO.** Hipótesis refutada

El caso de `limpieza-madrid` invitaba a pensarlo: en su consulta principal, la página cae de la
posición 4,38 a la 7,04 mientras siete anclas suyas aparecen a la vez. Ocho URLs nuestras en una
misma búsqueda.

Pero al contrastarlo contra las 52 fichas con datos suficientes, el patrón no existe:

| grupo | Δ posición en 14 días |
|---|---|
| Anclas ≥ 40% de sus apariciones (n=13) | **+0,11** |
| Anclas < 20% (n=24) | **+0,47** |

**Las fichas con más anclas han caído menos, no más.** Correlación entre % de anclas y pérdida de
posición: **r = −0,15**, débil y de signo contrario a la hipótesis.

Contraejemplos claros dentro del propio grupo alto: `hosteleria-cantabria` tiene el 64% de anclas y
no se ha movido (6,24 → 6,24); `oficinas-valencia` tiene el 45% y **mejora 0,71**. Mientras,
`metal-bizkaia`, con **0% de anclas**, mejora 1,18.

**Conclusión: no hay que tocar el índice de secciones por este motivo.** Habría sido un cambio en 41
fichas sin base.

## 4 · Lo que las anclas sí hacen: romper la medición

Siguen siendo un problema, pero de otro tipo. Con el 37% de las apariciones concentradas en URLs
que no reciben clics, cualquier métrica agregada que no las excluya está sesgada:

| | posición | CTR |
|---|---|---|
| Solo páginas reales | 6,07 | 2,27% |
| Mezclado, como lo muestra GSC | **6,02** | **1,55%** |

El dashboard local ya las excluye; la interfaz de GSC no. Si el diagnóstico se hace mirando GSC en
crudo, el CTR se lee un 30% peor de lo que es.

## 5 · Lo que queda sin explicar

La caída real existe y no son las anclas: **las mismas 70 páginas** que ya aparecían pasan de 5,72 a
6,07 en catorce días. Dos casos concretos, medidos solo sobre sus consultas de siempre y sin contar
anclas:

- **`limpieza-madrid`: 6,34 → 8,06.** Sus cuatro consultas principales caen entre 2,5 y 3,1 puestos.
- **`limpieza-zaragoza`: 3,73 → 5,35.**

Pista viva: `limpieza-madrid` es uno de los dos pilotos de frase extraíble del 13-ago (PR #93). El
otro, `hosteleria-baleares` (PR #91), va en dirección contraria: **de 318 a 504 clics y de 5,54 a
4,44 de posición**. Dos cambios equivalentes con resultados opuestos: ahí está el siguiente análisis.

## 6 · Parte del movimiento es sano

2.583 consultas nuevas en las que antes no aparecías, con posición media 11,30 y el 12% de las
impresiones. Es la demanda de septiembre —*convenio oficinas y despachos madrid 2026* pasa de 364 a
622 impresiones en una semana—. Entrar por abajo en búsquedas nuevas empeora la media sin que se
haya perdido nada.
