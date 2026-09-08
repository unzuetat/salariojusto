---
description: Auditoría integral de las fichas de convenio — 4 capas (recolector determinista → 6 agentes de eje → verificador adversarial → síntesis). Score 0-100 + hard-fails. Invoca con /sj-auditoria [--piloto].
---

# /sj-auditoria — auditar las fichas de convenio

Rúbrica en `analisis/auditoria-convenios/RUBRICA-V1.md`. Banco completo de métricas y por qué
se descartaron las demás, en `CANDIDATAS.md`. Contrato de los agentes, en `PROTOCOLO-AGENTES.md`.

## Capa 0 — determinista (siempre primero)

```
python3 scripts/audit/convenios-recolector.py            # las 54
python3 scripts/audit/convenios-recolector.py --piloto   # solo las 6 de calibración
```

Deja un JSON por ficha en `analisis/auditoria-convenios/<fecha>/deterministas/`, más
`matriz-deterministas.csv` y `HARDFAILS-deterministas.md`. Tarda unos 3 segundos.

Lee **primero** `HARDFAILS-deterministas.md`: si hay hard-fails de dato (código 12.2, 5.x),
eso se arregla antes de gastar en agentes. Un código terminado en `*` es aviso para humano,
no bloqueo.

## Capa 1 — seis agentes de eje, en paralelo

Un agente por eje (`.claude/agents/sj-eje-e1-verdad.md` … `e6-forma.md`). Corren a la vez y
**ciegos entre sí**: que E3 no sepa qué opinó E6 es lo que hace que las notas sean
independientes. Cada uno escribe `juicio/<EJE>/<slug>.json`.

En el prompt de cada agente, dale siempre: la lista de fichas, la fecha del directorio, y el
recordatorio de que **no recalcule lo que ya trae el JSON determinista**.

## Capa 2 — verificador adversarial

`.claude/agents/sj-verificador.md` recibe los hallazgos e intenta refutarlos. Escribe
`verificacion/<slug>.json`. Lo refutado no llega al informe. Sin esta capa, el sistema produce
hallazgos plausibles y falsos, que es peor que no auditar.

## Capa 3 — síntesis

```
python3 scripts/audit/convenios-sintetizador.py --fecha <fecha>
```

Compone `fichas/<slug>.md` (informe con evidencia), `matriz.csv` y `RESUMEN.md`. **La
aritmética la hace el script, nunca un agente.**

## Al leer el resultado

1. **Los hard-fails van antes que el score.** Una ficha con hard-fail no tiene nota, tiene una tarea.
2. **Si el rango de scores es estrecho, la rúbrica no discrimina** y hay que revisarla, no defenderla.
3. **El informe por ficha vale más que el número.** Las notas de juicio son estables en el
   hallazgo, menos en el dígito: el score sirve para comparar una ficha consigo misma entre
   pasadas, no para ordenar un ranking al punto.
4. **Freno de ventana abierta:** las fichas tocadas hace menos de tres semanas están midiendo
   tracción. Sus parches salen marcados `aplazado_por_ventana` y no se aplican todavía.

## Nada de esto toca HTML

La auditoría mide y propone. Las correcciones se aplican aparte, en su rama, y se verifican
contra el boletín antes de escribirlas.
