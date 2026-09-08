# Calibración del piloto · 20-ago-2026

Seis fichas elegidas por varianza máxima. La pregunta que el piloto tenía que responder no era
"¿cómo están estas seis?", sino **"¿sirve la rúbrica?"**. Respuesta: los ejes sí, el número único no.

## Resultado

| ficha | E1 | E2 | E3 | E4 | E5 | E6 | score | hard-fails |
|---|---|---|---|---|---|---|---|---|
| tecnicos-espectaculos | 11,0 | 19,9 | 10,0 | 8,2 | 4,0 | 6,1 | **59,2** | 2 |
| limpieza-asturias | 9,8 | 18,9 | 14,4 | 9,3 | 5,6 | 4,2 | **62,2** | 5 |
| hosteleria-valencia | 12,2 | 12,6 | 16,7 | 9,3 | 8,0 | 6,7 | **65,5** | 3 |
| comercio-madrid | 13,4 | 17,8 | 16,0 | 11,7 | 4,8 | 6,1 | **69,8** | 0 |
| limpieza-zaragoza | 17,1 | 20,8 | 14,7 | 7,8 | 6,4 | 4,2 | **71,0** | 2 |
| metal-sevilla | 19,6 | 21,0 | 14,4 | 7,8 | 7,2 | 6,7 | **76,7** | 0 |

Pesos: E1 22 · E2 22 · E3 20 · E4 14 · E5 12 · E6 10.

## 1 · Los ejes discriminan; el compuesto, no

Normalizando cada eje a 0-100 para poder compararlos:

| eje | rango | veredicto |
|---|---|---|
| E1 Verdad demostrada | 44,5 pts (45→89) | separa bien |
| E2 Singularidad | 38,2 pts (57→95) | separa bien |
| E3 Respuesta | 33,5 pts (50→84) | separa poco |
| E5 Enlazado | 33,3 pts (33→67) | separa poco |
| E4 Captación | 27,9 pts (56→84) | separa poco |
| E6 Forma | 25,0 pts (42→67) | separa poco |

Cada eje por separado abre entre 25 y 44 puntos. **El score compuesto solo abre 17,5** (59,2→76,7).
La causa no es que las fichas se parezcan: es que **los ejes se compensan entre sí**. Promediar seis
lentes independientes cancela la varianza, que es justo lo que hace un promedio.

## 2 · Lo que el número esconde

Dos casos donde el score dice lo contrario de lo que pasa:

- **`tecnicos-espectaculos` queda última (59,2) y es la ficha más singular del corpus** —boilerplate
  0,0, 76 de 76 frases exclusivas, segunda mejor nota en E2—. Su score bajo viene de E5 y E4, ejes
  que la penalizan por no tener hermanas provinciales ni competir en el buscador: es un explainer
  `tipo: marco` con `indexable:false` por decisión registrada. El número la castiga por ser lo que es.
- **`metal-sevilla` queda primera (76,7) y es de las peores en citabilidad** (E4 7,8 de 14, empatada
  con la última). El promedio se lo tapa la verdad y la singularidad, donde es excelente.

Y el orden por score **no coincide con el orden por gravedad**: `hosteleria-valencia` puntúa por
encima de `limpieza-asturias` mientras publica un dato inventado —una denuncia que no existe— en la
ficha con más tráfico del sitio.

## 3 · Decisión

**El score se queda, pero deja de ordenar.**

1. **Para comparar fichas entre sí:** ordenar por hard-fails, y luego por el **eje más débil**
   (cuello de botella), no por el promedio. Una ficha vale lo que vale su peor lente.
2. **Para seguir una ficha en el tiempo:** el score sí sirve — misma ficha, misma rúbrica, dos fechas.
   Es el único uso donde el promedio no engaña.
3. **Publicar siempre el perfil de seis ejes junto al número.** Sin el perfil, el número miente por
   omisión.
4. **E4 y E6 necesitan revisión antes del barrido completo:** son los que menos separan, y en E6 buena
   parte de sus doce comprobaciones son binarias (hay `caption` o no lo hay) — eso es un invariante,
   y su sitio son los hard-fails, no el score.
5. **El tipo de ficha condiciona qué ejes aplican.** Un `tipo: marco` no debe puntuarse en E5 ni en la
   parte de captación de E4. Ya está escrito en el protocolo; falta que el sintetizador lo aplique
   solo, redistribuyendo el peso entre los ejes que sí aplican.

## 4 · Lo que confirmó el peso elegido

E1 y E2 —verdad y singularidad, los dos ejes de 22 puntos que pediste que pesaran más— son
precisamente **los que mejor separan**. El peso estaba bien puesto.

## 5 · Rendimiento del verificador adversarial

| ficha | confirmados | matizados | refutados |
|---|---|---|---|
| limpieza-asturias | 17 | 7 | 0 |
| comercio-madrid | 16 | 3 | 0 |
| metal-sevilla | 15 | 10 | 0 |
| limpieza-zaragoza | 10 | 8 | 2 |
| hosteleria-valencia | 5 | 4 | 2 |
| tecnicos-espectaculos | 7 | 7 | 1 |

**5 hallazgos refutados de 111.** La tasa importa menos que el contenido: uno de los refutados venía
con un parche que habría metido un dato falso —dividir el bruto anual entre 12 en un convenio de 15
pagas—, exactamente el error contra el que existe la norma de contar las pagas. La capa 2 se paga sola.

Que Asturias diera 17 confirmados y 0 refutados mientras Valencia daba 2 refutados de 11 es señal
sana: el verificador no refuta por cuota.

## 6 · Ocho correcciones a la capa 0 salidas del piloto

Los agentes encontraron ocho fallos en el recolector determinista, todos corregidos:

1. Tabla con reflow a tarjetas marcada como "desborda en móvil" (falso positivo).
2. Referencias históricas legítimas al SMI de años anteriores tratadas como error (→ aviso `*`).
3. "¿Está vigente? No" leído como afirmar que un convenio decaído está vigente (falso positivo).
4. El corpus se medía contra las 6 del piloto en vez de contra las 54 (bug de alcance).
5. El check schema-vs-cuerpo miraba la respuesta truncada a 300 caracteres.
6. **El verde de los salarios no se detectaba**: viaja en el CSS, no inline. 32 fichas afectadas.
7. Los bloques densos solo se medían en `<p>`, ignorando callouts en `<div>`.
8. `frases_compartidas_top` es una muestra de 8 y un agente la leyó como el total (eran 23).

Que un agente de juicio corrija al script determinista es el rendimiento esperado del piloto, no un
accidente.
