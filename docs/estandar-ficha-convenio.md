# Estándar de ficha de convenio — "el patrón Madrid"

_Fuente de verdad del formato y los "aciertos" de una landing de convenio. Referencia real: `convenio-hosteleria-madrid.html` (aprobada por Telmo, ID 13). Deriva de las reglas T5-T10 de `CORRECCIONES_JULIO.md` (MC). Borrador 2026-07-29 — pendiente de validación de Telmo._

## Cómo se usa (modelo propose-never-overwrite)

1. **1ª pasada (landing nueva):** el andamiador genera el ESQUELETO desde el MD del convenio — todo lo "universal" de abajo — y deja huecos para el editorial. Claude enriquece a mano.
2. **2ª+ pasadas: NUNCA sobrescribe.** Compara la landing contra este estándar y **propone** los cambios (esto falta / esto se desvía → así lo dejaría). Telmo **aprueba/deniega uno a uno**. Solo lo aprobado se aplica.
3. **Auditor** (`scripts/audit/convenios-sync.js` ampliado): chequea las 39 fichas contra esta checklist y reporta desviaciones, sin escribir.

**⚠️ SALVAGUARDA T5 (innegociable):** el estándar cubre el ANDAMIAJE. El **editorial exclusivo por provincia** (hook, ejemplo trabajado, análisis de singularidad) es de propiedad manual, se conserva y se destaca — **nunca** se plantilla ni se recorta para "parecerse a Madrid". Es el ~55-60% de valor original que salva del "poco valor" de AdSense.

---

## A · Metadata (universal — lo garantiza el andamiador)

- **Título SEO (fórmula validada):** `[rango cifra €/mes] — Tablas salariales [Sector] [Provincia] [Año] | SalarioJusto`. Ej. Madrid: `1.086–1.415 €/mes — Tablas salariales Hostelería Madrid 2026 | SalarioJusto`. Cifra al inicio (mayor CTR, validado GSC).
- **Meta description:** nombre del convenio + estado (ultraactividad / vigencia + boletín y fecha) + rango salarial + 1-2 pluses concretos. Específica, con cifras reales.
- **Schema:** `FAQPage` (con sus `Question`/`Answer`), `BreadcrumbList`, `Organization`. (Evaluar `Article` con byline humano para E-E-A-T.)
- **Idioma:** lenguaje inclusivo, 0 masculinos genéricos.

## B · Estructura de secciones (orden canónico Madrid)

Marcadas: 🟦 universal (andamiador) · 🟨 datos del MD (andamiador rellena) · 🟥 editorial exclusivo (mano, protegido).

1. 🟦 H1 `Convenio de [sector] — [provincia]` + breadcrumb.
1b. 🟦 **Índice de contenidos (TOC) navegable** — enlaza a las secciones de abajo. Obligatorio (Madrid lo tiene; era el punto que faltaba en Alicante).
2. 🟦 **"Antes de seguir: ¿este convenio te cubre?"** — triage de ámbito funcional. 🟨 actividades cubiertas.
3. 🟨 **"¿En qué [Clase/Grupo] está tu trabajo?"** → tabla salarial (ver D).
4. 🟨 **"Lo que se suma siempre al salario base"**.
5. 🟦🟨 **"Tu jornada y descansos"** (básico · flexibilización · casos especiales · pausa · horas extras).
6. 🟦🟨 **"Vacaciones, festivos y licencias"**.
7. 🟨 **"Pluses y complementos"** — una subsección por plus real del convenio (nocturnidad, formación, antigüedad, etc.).
8. 🟨 **"Contrato fijo discontinuo"** (o el más usado del sector/provincia).
9. 🟥 **Análisis de singularidad** — lo propio de esta provincia (ej. Madrid: "NO tiene subrogación"; Alicante: paradoja del SMI). **Aquí vive el valor exclusivo.**
10. 🟦 **"[Provincia] frente a otras del sector"** → **T9: SOLO anclas fijas** (vs SMI / vs pilar sectorial / vs su propia historia). ⚠️ Prohibido ranking posicional ("Xª de N"). _Nota: la Madrid actual aún tiene la versión vieja; corregirla al canonizar._
11. 🟦 **"¿Cobras menos de lo que fija el convenio?"** — CTA a reclamación.
12. 🟦🟥 **"Preguntas frecuentes"** — FAQ con schema. Estructura universal; preguntas específicas del convenio.

## C · Sello y secciones de confianza (universal — faltan en varias fichas)

- **Sello T10:** "Verificado contra **[fuente oficial real]** · Publicado/actualizado [fecha]". Fuente = la REAL: BOP provincial · **BOB** Bizkaia · **BOG** Gipuzkoa · DOGC Catalunya · BOE estatal. Nunca "BOE" en una foral/provincial.
- **"Quién audita"** — bloque E-E-A-T de metodología de verificación.
- **"Más recursos"** — enlaces útiles.
- **"Guías y herramientas"** — enlaces a Kit/guías.

(Madrid tiene las tres; Alicante 0 → añadirlas.)

## D · Estilo (T6-T8)

- **T7 · Verde selectivo:** verde SOLO en la cifra-titular "¿cuánto cobro?" (salario base año vigente por grupo). Pluses, comparativas, nocturnidad, secundarios → tinta normal.
- **T6 · Emojis funcionales (check/cruz) en B&N**, nunca color.
- **T8 · Tablas salariales colapsadas por defecto**, excepto la de mayor tráfico (abierta).

## E · Enlazado interno (checklist Madrid)

Toda ficha enlaza a: **hub `/convenios.html`** (T2) · **pilar sectorial** (`/convenio-hosteleria.html`) · **misma provincia otro sector** si existe (`/convenio-limpieza-madrid.html`) · **guía de reclamación** (`/reclamar-diferencias-salariales-convenio.html`) · **plantilla del Kit** relevante · **SMI** y **ley-transparencia** cuando venga a cuento. Footer legal completo (privacidad · aviso legal · contacto · mapa).

## F · Qué chequea el auditor (verificable en automático)

- [ ] Título casa con la fórmula (rango € al inicio + sector + provincia + año).
- [ ] Sello T10 presente + fuente coherente con la provincia (foral→BOB/BOG).
- [ ] Las 3 secciones de confianza presentes.
- [ ] Link al hub `/convenios.html` (T2) + pilar sectorial.
- [ ] 0 emojis en color (T6) · 0 comparativa posicional "Xª de N" (T9).
- [ ] Índice de contenidos presente.
- [ ] Schema FAQPage + BreadcrumbList + Organization.
- [ ] (heurístico) densidad de verde por debajo de umbral (T7).
- [ ] 0 masculinos genéricos evidentes (lenguaje inclusivo).

Lo NO auto-verificable (calidad del hook, del ejemplo, de la singularidad) queda a revisión humana — el auditor no juzga el alma, solo el andamiaje.
