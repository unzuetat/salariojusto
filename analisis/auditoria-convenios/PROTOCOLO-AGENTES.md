# Protocolo común de los agentes de juicio (capa 1)

Lo que todo agente de eje debe cumplir, sea cual sea su lente. Si un agente se salta esto, su salida se descarta.

## 1 · Entrada

Cada agente recibe: **una ficha** (`convenio-*.html`) y su **JSON determinista**
(`analisis/auditoria-convenios/<fecha>/deterministas/<slug>.json`).

**Regla dura: no recalcules lo que ya está contado.** Palabras de prosa, ratio de tabla,
boilerplate, número de cifras, enlaces entrantes, tablas sin `th`, párrafos largos, días
desde el último commit, GSC: todo eso ya está medido. Si tu texto contiene un número que
no viene del JSON determinista ni de una cita literal del HTML, está inventado.

## 2 · Escala

| Nota | Significado |
|---|---|
| **0** | Ausente o mal hecho |
| **1** | Insuficiente: está, pero no cumple su función |
| **2** | Correcto: cumple lo que se espera |
| **3** | Ejemplar: es el nivel al que deberían subir las demás fichas |

`3` es escaso por definición. Si pones `3`, di qué hace esta ficha que las otras no hacen.

## 3 · Evidencia obligatoria

Toda nota necesita al menos una evidencia: **archivo, línea y cita literal**. Una cita es
texto copiado del HTML, no un resumen tuyo.

Si no puedes citar, la métrica es **`no_evaluada`** con su motivo. Nunca rellenes con un `2`
por defecto: un hueco declarado vale más que un número inventado.

## 4 · Parche propuesto

Para toda nota `0` o `1`, propón la corrección **concreta y redactada** — el texto que iría
en su lugar, no "mejorar la redacción". **No edites ningún HTML.** Tu salida es una propuesta.

Excepción — **freno de ventana abierta**: si el JSON determinista trae
`operacion.ventana_medicion_abierta: true`, la ficha se cambió hace menos de tres semanas y
está midiendo tracción. Sigue puntuando y describiendo el defecto, pero marca cada parche con
`"aplazado_por_ventana": true`.

## 5 · Hallazgos que bloquean

Si encuentras un hard-fail de juicio, decláralo aparte con su código y evidencia:

- `5.7` afirmación fáctica sin correlato en la fuente citada (invención)
- `8.11` contradice la promesa de independencia publicada en /sobre
- `12.1` contradice lo que dice otra ficha del corpus
- `4.5` dos cifras distintas para lo mismo en la misma página

Un hard-fail no baja la nota: la anula. No lo compenses puntuando bajo.

**Y no lo puntúes además en tus métricas.** Si un defecto ya bloquea como hard-fail, penalizarlo
otra vez dentro del score hunde varias métricas de varios ejes por un solo fallo. Ejemplo real: una
ficha sin sello de verificación dispara los hard-fails 5.2 y 2.2, y tres ejes distintos le bajaron
además 9.1, 7.8 y 12.3 por lo mismo. Puntúa lo que quede del defecto una vez descontado el bloqueo,
y si no queda nada, márcala `no_evaluada` diciendo que ya bloquea.

**Ni importes normas que a esta ficha no le aplican.** Antes de penalizar por una convención,
comprueba en `data/convenios/censo.json` qué tipo de ficha es. A un explainer sectorial `tipo: marco`
con `indexable: false` no se le exige tabla salarial, ni cifra del puesto, ni longitud de title para
el buscador: por decisión registrada no compite ahí.

## 6 · Salida

Escribe **exactamente un archivo JSON** en
`analisis/auditoria-convenios/<fecha>/juicio/<EJE>/<slug>.json`:

```json
{
  "eje": "E1",
  "slug": "convenio-metal-sevilla",
  "metricas": [
    {
      "id": "2.1",
      "nota": 2,
      "razon": "una frase: por qué esa nota y no la de al lado",
      "evidencia": [{"archivo": "convenio-metal-sevilla.html", "linea": 412, "cita": "texto literal"}],
      "parche": null,
      "aplazado_por_ventana": false
    }
  ],
  "no_evaluadas": [{"id": "5.10", "motivo": "requiere comprobar la URL en vivo"}],
  "hardfails": [{"codigo": "5.7", "detalle": "…", "evidencia": {"linea": 88, "cita": "…"}}],
  "observacion_libre": "lo que no cabe en ninguna métrica y merece leerse"
}
```

**No calcules el score.** Lo compone el sintetizador a partir de tus notas. Tu trabajo es
puntuar con evidencia, no hacer aritmética.

## 7 · Sesgos que debes resistir

- **Longitud ≠ calidad.** Una ficha larga puede ser redundante y una corta, suficiente. El
  JSON te da las palabras exactas: úsalas para comprobar, no para premiar.
- **Presencia ≠ función.** Que exista una sección de FAQ no significa que responda nada.
- **Formato bonito ≠ verdad.** Una tabla impecable con una cifra sin fuente sigue siendo un
  problema de verdad, no de forma.
- **No arrastres tu propio eje.** Si ves un defecto que pertenece a otro eje, anótalo en
  `observacion_libre` y no lo puntúes tú.
