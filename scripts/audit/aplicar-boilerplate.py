#!/usr/bin/env python3
"""
scripts/audit/aplicar-boilerplate.py — Sustituye el bloque "¿Cobras menos?" repetido verbatim
en las landings de convenio por una de 5 variantes (V1a/V1b/V1c/V3/V4) según el estado legal
del convenio. Cumple feedback_no_thin_programatico (evita boilerplate verbatim entre landings).

Cómo decide la variante:
  - V4: landings sin convenio provincial propio (mapping fijo: construccion-estatal,
    convenio-tecnicos-espectaculos)
  - V3: convenios en ultraactividad post-denuncia (mapping fijo conocido + detección
    por palabras clave "ultraactividad" o "denunciad" en el HTML)
  - V1a / V1b / V1c: vigentes/prorrogados — sub-variante elegida por hash determinista
    del slug para reparto uniforme

Variables que sustituye:
  {año_tabla}, {organismo_mediacion}, {sindicatos_firmantes}, {codigo_regcon},
  {año_tabla_heredada}, {fecha_inicio_ultraactividad}, {fecha_denuncia},
  {sindicato_denunciante}, {convenio_estatal_referencia}, {sindicatos_sectoriales},
  {referencia_normativa}

Detección del bloque actual: busca <h2[^>]*>¿Cobras menos hasta el siguiente <h2> o el
final del <main>. Marcado con <!-- bp-rotado --> para idempotencia.

Uso:
  python scripts/audit/aplicar-boilerplate.py --dry-run [--landing X.html]
  python scripts/audit/aplicar-boilerplate.py
"""

import argparse
import hashlib
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SITEMAP = ROOT / "sitemap.xml"
DOMAIN = "https://salariojusto.es/"
MARKER = "<!-- bp-rotado -->"

# ===== Clasificación por tipo =====

LANDINGS_V4 = {
    "construccion-estatal-suelo-salarial.html",
    "convenio-tecnicos-espectaculos.html",
}

# Hubs estatales que no tienen bloque "¿Cobras menos?" para reemplazar.
# Pueden tener su propio bloque añadido manualmente más adelante.
LANDINGS_SIN_BLOQUE = {
    "convenio-limpieza-edificios-locales.html",
    "construccion-estatal-suelo-salarial.html",
}

# Landings que están en ultraactividad post-denuncia (estado conocido por el equipo).
LANDINGS_V3 = {
    "convenio-limpieza-zaragoza.html",
    "convenio-limpieza-asturias.html",
    "convenio-limpieza-madrid.html",
    "convenio-limpieza-malaga.html",
    "convenio-limpieza-valencia.html",
    "convenio-hosteleria-madrid.html",
    "convenio-hosteleria-valencia.html",
    "convenio-hosteleria-cadiz.html",
    "convenio-hosteleria-granada.html",
    "convenio-hosteleria-malaga.html",
    "convenio-hosteleria-cantabria.html",
    "convenio-hosteleria-valladolid.html",
    "convenio-oficinas-valencia.html",
}


def clasificar_tipo(slug: str, html: str) -> str:
    # Confiamos solo en los mappings explícitos. La detección automática por palabra clave
    # daba falsos positivos (p.ej. Murcia cita "ultraactividad" como contexto comparativo
    # pero está vigente).
    if slug in LANDINGS_V4:
        return "V4"
    if slug in LANDINGS_V3:
        return "V3"
    return "V1"


def subvariante_v1(slug: str) -> str:
    # Hash determinista para reparto uniforme entre V1a / V1b / V1c
    h = int(hashlib.md5(slug.encode("utf-8")).hexdigest(), 16) % 3
    return ["V1a", "V1b", "V1c"][h]


# ===== Configuración por landing (mapping de variables) =====
# Mapping completo para landings BOE remixed; placeholders para thin.

CONFIG = {
    # === V3 — Ultraactividad ===
    "convenio-limpieza-zaragoza.html": {
        "año_tabla": "2025", "año_tabla_heredada": "2025",
        "organismo_mediacion": "SAMA (Servicio Aragonés de Mediación y Arbitraje)",
        "sindicatos_firmantes": "CCOO Hábitat, UGT-FeSMC y OSTA",
        "codigo_regcon": "50000755011981",
        "fecha_inicio_ultraactividad": "el 1 de enero de 2026",
        "fecha_denuncia": "2 de octubre de 2025",
        "sindicato_denunciante": "CCOO",
    },
    "convenio-limpieza-asturias.html": {
        "año_tabla": "2025", "año_tabla_heredada": "2025",
        "organismo_mediacion": "SASEC (Servicio Asturiano de Solución Extrajudicial de Conflictos)",
        "sindicatos_firmantes": "CCOO y UGT-FeSMC",
        "codigo_regcon": "33000635011982",
        "fecha_inicio_ultraactividad": "el 1 de enero de 2026",
        "fecha_denuncia": "octubre de 2025",
        "sindicato_denunciante": "CCOO",
    },
    "convenio-limpieza-madrid.html": {
        "año_tabla": "2025", "año_tabla_heredada": "2025",
        "organismo_mediacion": "el Instituto Laboral de la Comunidad de Madrid",
        "sindicatos_firmantes": "AELMA, CCOO Hábitat y UGT-FeSMC",
        "codigo_regcon": "28005755011982",
        "fecha_inicio_ultraactividad": "el 1 de enero de 2026",
        "fecha_denuncia": "octubre de 2025",
        "sindicato_denunciante": "los sindicatos",
    },
    "convenio-limpieza-malaga.html": {
        "año_tabla": "2025", "año_tabla_heredada": "2025",
        "organismo_mediacion": "SERCLA (Sistema Extrajudicial de Resolución de Conflictos Laborales de Andalucía)",
        "sindicatos_firmantes": "CCOO Hábitat y UGT-FeSMC",
        "codigo_regcon": "29000625011982",
        "fecha_inicio_ultraactividad": "el 1 de enero de 2026",
        "fecha_denuncia": "octubre de 2025",
        "sindicato_denunciante": "los sindicatos",
    },
    "convenio-limpieza-valencia.html": {
        "año_tabla": "2025", "año_tabla_heredada": "2025",
        "organismo_mediacion": "el TAL (Tribunal de Arbitraje Laboral) de la Comunitat Valenciana",
        "sindicatos_firmantes": "CCOO Hábitat y UGT-FeSMC",
        "codigo_regcon": "46000595011982",
        "fecha_inicio_ultraactividad": "el 1 de enero de 2026",
        "fecha_denuncia": "octubre de 2025",
        "sindicato_denunciante": "los sindicatos",
    },
    "convenio-hosteleria-madrid.html": {
        "año_tabla": "2024", "año_tabla_heredada": "2024",
        "organismo_mediacion": "el Instituto Laboral de la Comunidad de Madrid",
        "sindicatos_firmantes": "AHM, CCOO de Servicios y UGT-FeSMC",
        "codigo_regcon": "28002085011981",
        "fecha_inicio_ultraactividad": "tras el fin de la vigencia formal del convenio",
        "fecha_denuncia": "octubre de 2025",
        "sindicato_denunciante": "los sindicatos",
    },
    "convenio-hosteleria-valencia.html": {
        "año_tabla": "2025", "año_tabla_heredada": "2025",
        "organismo_mediacion": "el TAL (Tribunal de Arbitraje Laboral) de la Comunitat Valenciana",
        "sindicatos_firmantes": "CONHOSTUR, CCOO de Servicios y UGT-FeSMC",
        "codigo_regcon": "46001285011982",
        "fecha_inicio_ultraactividad": "tras el fin de la vigencia formal del convenio",
        "fecha_denuncia": "octubre de 2025",
        "sindicato_denunciante": "los sindicatos",
    },
    "convenio-hosteleria-cadiz.html": {
        "año_tabla": "2025", "año_tabla_heredada": "2025",
        "organismo_mediacion": "SERCLA",
        "sindicatos_firmantes": "Horeca Cádiz, CCOO de Servicios y UGT-FeSMC",
        "codigo_regcon": "11000895011982",
        "fecha_inicio_ultraactividad": "tras el fin de la vigencia formal del convenio",
        "fecha_denuncia": "fecha pendiente de verificación",
        "sindicato_denunciante": "los sindicatos",
    },
    "convenio-hosteleria-granada.html": {
        "año_tabla": "2025", "año_tabla_heredada": "2025",
        "organismo_mediacion": "SERCLA",
        "sindicatos_firmantes": "Horeca Granada, CCOO de Servicios y UGT-FeSMC",
        "codigo_regcon": "18000425011982",
        "fecha_inicio_ultraactividad": "tras el fin de la vigencia formal del convenio",
        "fecha_denuncia": "fecha pendiente de verificación",
        "sindicato_denunciante": "los sindicatos",
    },
    "convenio-hosteleria-malaga.html": {
        "año_tabla": "2025", "año_tabla_heredada": "2025",
        "organismo_mediacion": "SERCLA",
        "sindicatos_firmantes": "MAHOS, CCOO de Servicios y UGT-FeSMC",
        "codigo_regcon": "29000725011982",
        "fecha_inicio_ultraactividad": "tras el fin de la vigencia formal del convenio",
        "fecha_denuncia": "fecha pendiente de verificación",
        "sindicato_denunciante": "los sindicatos",
    },
    "convenio-hosteleria-cantabria.html": {
        "año_tabla": "2025", "año_tabla_heredada": "2025",
        "organismo_mediacion": "ORECLA (Organismo de Resolución Extrajudicial de Conflictos Laborales de Cantabria)",
        "sindicatos_firmantes": "AEHC, CCOO de Servicios y UGT-FeSMC",
        "codigo_regcon": "39000425011982",
        "fecha_inicio_ultraactividad": "tras el fin de la vigencia formal del convenio",
        "fecha_denuncia": "fecha pendiente de verificación",
        "sindicato_denunciante": "los sindicatos",
    },
    "convenio-hosteleria-valladolid.html": {
        "año_tabla": "2025", "año_tabla_heredada": "2025",
        "organismo_mediacion": "SERLA (Servicio Regional de Relaciones Laborales de Castilla y León)",
        "sindicatos_firmantes": "Provahosva, CCOO de Servicios y UGT-FeSMC",
        "codigo_regcon": "47000235011982",
        "fecha_inicio_ultraactividad": "tras el fin de la vigencia formal del convenio",
        "fecha_denuncia": "fecha pendiente de verificación",
        "sindicato_denunciante": "los sindicatos",
    },
    "convenio-oficinas-valencia.html": {
        "año_tabla": "2024", "año_tabla_heredada": "2024",
        "organismo_mediacion": "el TAL (Tribunal de Arbitraje Laboral) de la Comunitat Valenciana",
        "sindicatos_firmantes": "Cierval, CCOO Servicios y UGT-FeSMC",
        "codigo_regcon": "46001815011982",
        "fecha_inicio_ultraactividad": "tras el fin de la vigencia formal del convenio",
        "fecha_denuncia": "fecha pendiente de verificación",
        "sindicato_denunciante": "los sindicatos",
    },

    # === V1 — Vigentes ===
    "convenio-limpieza-sevilla.html": {
        "año_tabla": "2025", "organismo_mediacion": "SERCLA",
        "sindicatos_firmantes": "ASEAL, CCOO Hábitat y UGT-FeSMC",
        "codigo_regcon": "41000475011982",
    },
    "convenio-limpieza-catalunya.html": {
        "año_tabla": "2026", "organismo_mediacion": "el TLC (Tribunal Laboral de Catalunya)",
        "sindicatos_firmantes": "Pimec, CCOO Hábitat y UGT-FeSMC",
        "codigo_regcon": "79002415012005",
    },
    "convenio-limpieza-barcelona.html": {
        "año_tabla": "2026", "organismo_mediacion": "el TLC (Tribunal Laboral de Catalunya)",
        "sindicatos_firmantes": "Pimec, CCOO Hábitat y UGT-FeSMC",
        "codigo_regcon": "79002415012005",
    },
    "convenio-limpieza-bizkaia.html": {
        "año_tabla": "2025", "organismo_mediacion": "PRECO (Servicio Vasco de Resolución de Conflictos)",
        "sindicatos_firmantes": "Adelbi, CCOO Irakaskuntza, ELA, LAB y UGT-Euskadi",
        "codigo_regcon": "48001205011981",
    },
    "convenio-limpieza-murcia.html": {
        "año_tabla": "2025", "organismo_mediacion": "ORCL (Organismo Regional de Conflictos Laborales de Murcia)",
        "sindicatos_firmantes": "ASPRELM, CCOO Hábitat y UGT-FeSMC",
        "codigo_regcon": "30000845011982",
    },
    "convenio-limpieza-laspalmas.html": {
        "año_tabla": "2026", "organismo_mediacion": "TLC (Tribunal Laboral Canario)",
        "sindicatos_firmantes": "Asopro, CCOO Hábitat y UGT-FeSMC",
        "codigo_regcon": "35000245011982",
    },
    "convenio-limpieza-edificios-locales.html": {
        "año_tabla": "anual del convenio Estatal", "organismo_mediacion": "el SIMA (Servicio Interconfederal de Mediación y Arbitraje)",
        "sindicatos_firmantes": "ASPEL, CCOO Hábitat y UGT-FeSMC",
        "codigo_regcon": "99005635011982",
    },
    "convenio-hosteleria-barcelona.html": {
        "año_tabla": "2026", "organismo_mediacion": "el TLC (Tribunal Laboral de Catalunya)",
        "sindicatos_firmantes": "Gremi de Restauració de Barcelona, CCOO de Serveis y UGT-FeSMC",
        "codigo_regcon": "08002195011982",
    },
    "convenio-hosteleria-girona.html": {
        "año_tabla": "2026", "organismo_mediacion": "el TLC (Tribunal Laboral de Catalunya)",
        "sindicatos_firmantes": "Federació d'Hostaleria de Girona, CCOO de Serveis y UGT-FeSMC",
        "codigo_regcon": "17000245011982",
    },
    "convenio-hosteleria-maresme.html": {
        "año_tabla": "2026", "organismo_mediacion": "el TLC (Tribunal Laboral de Catalunya)",
        "sindicatos_firmantes": "Gremi de Restauració del Maresme, CCOO de Serveis y UGT-FeSMC",
        "codigo_regcon": "08002235011982",
    },
    "convenio-hosteleria-tarragona.html": {
        "año_tabla": "2026", "organismo_mediacion": "el TLC (Tribunal Laboral de Catalunya)",
        "sindicatos_firmantes": "Federació Empresarial d'Hostaleria de Tarragona, CCOO de Serveis y UGT-FeSMC",
        "codigo_regcon": "43000345011982",
    },
    "convenio-hosteleria-baleares.html": {
        "año_tabla": "2025", "organismo_mediacion": "TAMIB (Tribunal de Arbitraje i Mediació de les Illes Balears)",
        "sindicatos_firmantes": "FEHM y FEHB, CCOO de Serveis y UGT-FeSMC",
        "codigo_regcon": "07000395011982",
    },
    "convenio-hosteleria-bizkaia.html": {
        "año_tabla": "2025", "organismo_mediacion": "PRECO (Servicio Vasco de Resolución de Conflictos)",
        "sindicatos_firmantes": "Hostelería Bizkaia, CCOO Irakaskuntza, ELA, LAB y UGT-Euskadi",
        "codigo_regcon": "48000915011982",
    },
    "convenio-hosteleria-sevilla.html": {
        "año_tabla": "2026", "organismo_mediacion": "SERCLA",
        "sindicatos_firmantes": "Horeca Sevilla, CCOO de Servicios y UGT-FeSMC",
        "codigo_regcon": "41001705011982",
    },
    "convenio-hosteleria-zaragoza.html": {
        "año_tabla": "2026", "organismo_mediacion": "SAMA (Servicio Aragonés de Mediación y Arbitraje)",
        "sindicatos_firmantes": "Horeca Zaragoza, CCOO Servicios y UGT-FeSMC",
        "codigo_regcon": "50000655011982",
    },
    "convenio-construccion-bizkaia.html": {
        "año_tabla": "2026", "organismo_mediacion": "PRECO (Servicio Vasco de Resolución de Conflictos)",
        "sindicatos_firmantes": "Ascobi-Bieba, CCOO Construcción, ELA, LAB y UGT-FICA",
        "codigo_regcon": "48000045011982",
    },
    "convenio-metal-bizkaia.html": {
        "año_tabla": "2026", "organismo_mediacion": "PRECO (Servicio Vasco de Resolución de Conflictos)",
        "sindicatos_firmantes": "FVEM, CCOO Industria, ELA, LAB y UGT-FICA",
        "codigo_regcon": "48004245011982",
    },

    # === V4 — Sin convenio provincial propio ===
    "construccion-estatal-suelo-salarial.html": {
        "convenio_estatal_referencia": "VII Convenio General del Sector de la Construcción (CGSC)",
        "organismo_mediacion": "el SIMA (Servicio Interconfederal de Mediación y Arbitraje)",
        "sindicatos_sectoriales": "CCOO Construcción y UGT-FICA",
        "referencia_normativa": "BOE-A-2023-19903 (VII CGSC) + Estatuto de los Trabajadores",
    },
    "convenio-tecnicos-espectaculos.html": {
        "convenio_estatal_referencia": "Convenio Estatal de Actividades de Producción Audiovisual y de Espectáculos en directo",
        "organismo_mediacion": "el SIMA (Servicio Interconfederal de Mediación y Arbitraje)",
        "sindicatos_sectoriales": "CCOO Servicios y UGT-FeSMC",
        "referencia_normativa": "Convenio Estatal AV + Estatuto de los Trabajadores",
    },
}


# ===== Plantillas de los bloques =====

TEMPLATE_V1A = """  <h2 id="reclamar">¿Cobras menos de lo que fija el convenio?</h2>
  <p>{MARKER} Tu convenio está plenamente vigente y eres titular de derechos exigibles frente a tu empresa: la tabla salarial, los pluses regulados, la jornada máxima, las pagas extras, la subrogación y las protecciones por incapacidad o invalidez. Ninguna de esas cláusulas depende de la voluntad de la empresa ni puede modificarse unilateralmente — son de obligado cumplimiento.</p>
  <ol style="padding-left:20px;margin:14px 0;font-size:14.5px;color:var(--ink-light);line-height:1.7;">
    <li><strong>Verifica tu nómina contra la tabla {año_tabla}</strong>. Localiza tu categoría en el Anexo I, comprueba el salario base y suma los pluses regulados que te correspondan (transporte, festivo, nocturnidad, antigüedad si estás cubierto/a). Si la cifra que aparece en tu nómina es inferior, la diferencia son atrasos exigibles.</li>
    <li><strong>Reclama por escrito a tu empresa</strong> indicando los conceptos no abonados, el importe estimado y el período afectado. Envíalo por burofax con acuse de recibo o por correo electrónico con confirmación de lectura. La reclamación interna no interrumpe la prescripción, pero documenta tu posición ante un eventual juicio.</li>
    <li><strong>Si no responden o lo rechazan</strong>, presenta papeleta de conciliación ante {organismo_mediacion}. Es gratuita, <strong>interrumpe el plazo de prescripción</strong> y es paso previo obligatorio antes de demanda. Plazo legal: <strong>1 año por mensualidad</strong> desde la fecha en que debió pagarse (art. 59.2 ET).</li>
  </ol>
  <p>Los sindicatos firmantes del convenio — {sindicatos_firmantes} — ofrecen asistencia jurídica gratuita a personas afiliadas para conflictos colectivos e individuales. Código REGCON: <code style="font-family:monospace;font-size:13px;">{codigo_regcon}</code>. <a href="/reclamar-diferencias-salariales-convenio.html">Guía completa para reclamar diferencias →</a></p>
"""

TEMPLATE_V1B = """  <h2 id="reclamar">¿Tu nómina no encaja con el convenio?</h2>
  <p>{MARKER} Reclamar diferencias salariales tiene un procedimiento sencillo y gratuito si lo sigues en el orden correcto. La clave es <strong>documentar bien y actuar antes del año de prescripción</strong> que marca el art. 59.2 ET — cada mes que pasa sin reclamar es un mes que pierdes.</p>
  <ol style="padding-left:20px;margin:14px 0;font-size:14.5px;color:var(--ink-light);line-height:1.7;">
    <li><strong>Documenta la diferencia</strong>. Compara tres meses consecutivos de nómina con la tabla {año_tabla} del Anexo I para tu categoría. Anota diferencias por concepto (salario base, plus de transporte, plus festivo, nocturnidad, antigüedad si aplica) y guarda copias de las nóminas. Esa documentación es la base de toda la reclamación.</li>
    <li><strong>Comunica formalmente a RRHH</strong> lo que falta y por qué. Identifica los artículos del convenio que sustentan tu derecho, calcula el importe total y pide pago en plazo razonable. Envío con prueba (burofax o email con acuse) — conserva copia. Es la última oportunidad de resolver sin conflicto.</li>
    <li><strong>Si no hay respuesta o es negativa</strong>, ve a {organismo_mediacion} a presentar papeleta de conciliación. Interrumpe el plazo, es gratuita y abre la vía al juzgado de lo social si en el acto no hay acuerdo. Tienes 1 año por mensualidad desde que debió pagarse: actúa por las más antiguas primero para no perderlas.</li>
  </ol>
  <p>Si necesitas apoyo, {sindicatos_firmantes} prestan asesoría gratuita a personas afiliadas. Código REGCON del convenio: <code style="font-family:monospace;font-size:13px;">{codigo_regcon}</code>. <a href="/reclamar-diferencias-salariales-convenio.html">Guía completa para reclamar diferencias →</a></p>
"""

TEMPLATE_V1C = """  <h2 id="reclamar">¿Cuánto te están dejando de pagar?</h2>
  <p>{MARKER} Antes de hablar de procedimiento, conviene tener una cifra. Reclamar sin saber cuánto reclamas es perderse en el proceso; con la cifra clara, todo lo demás encaja.</p>
  <ol style="padding-left:20px;margin:14px 0;font-size:14.5px;color:var(--ink-light);line-height:1.7;">
    <li><strong>Pon la cifra encima de la mesa</strong>. Toma tu salario base de la tabla {año_tabla} para tu categoría exacta, multiplica por los días o meses efectivamente trabajados en el período afectado, suma los pluses devengados (transporte, festivo, nocturnidad, antigüedad si tienes trienios consolidados) y compáralo con el bruto que has cobrado. La resta — si es positiva — es lo que reclamas.</li>
    <li><strong>Convierte la cifra en una solicitud por escrito</strong>. Una carta dirigida a la empresa con tabla de diferencias mes a mes, citando el artículo del convenio que respalda cada concepto, pidiendo el pago en plazo y enviada con acuse de recibo. Por encima de cualquier llamada o conversación informal: queda escrito y queda probado.</li>
    <li><strong>Cuando la empresa no paga</strong>, la papeleta de conciliación ante {organismo_mediacion} es el siguiente paso obligatorio. Gratuita, rápida, <strong>interrumpe el plazo de prescripción de 1 año por mensualidad</strong> (art. 59.2 ET) y abre la vía judicial si no hay acuerdo en el acto.</li>
  </ol>
  <p>Asesoría sindical gratuita disponible en {sindicatos_firmantes} para personas afiliadas. Convenio inscrito en REGCON con código <code style="font-family:monospace;font-size:13px;">{codigo_regcon}</code>. <a href="/reclamar-diferencias-salariales-convenio.html">Guía completa para reclamar diferencias →</a></p>
"""

TEMPLATE_V3 = """  <h2 id="reclamar">¿Cobras menos de lo que fija el convenio?</h2>
  <p>{MARKER} El convenio está en ultraactividad desde {fecha_inicio_ultraactividad}, pero eso <strong>no autoriza a tu empresa a bajar tu salario ni tus pluses</strong>. Las cláusulas normativas — la tabla salarial, los complementos de puesto, las pagas extras, la subrogación, la jornada, las vacaciones, las protecciones por IT e invalidez — siguen plenamente vigentes y son de obligado cumplimiento. Lo que decae con la denuncia ({sindicato_denunciante} la presentó el {fecha_denuncia}) son las cláusulas obligacionales (paz social, comisión paritaria, prórroga automática), no las que regulan tu sueldo y condiciones.</p>
  <ol style="padding-left:20px;margin:14px 0;font-size:14.5px;color:var(--ink-light);line-height:1.7;">
    <li><strong>Verifica que tu nómina aplica la tabla {año_tabla_heredada}</strong> (la última pactada antes de la denuncia, vigente hasta que se publique el convenio nuevo). Multiplica salario base × días o meses, suma los pluses regulados que te corresponden y compara con lo cobrado.</li>
    <li><strong>Pide nómina detallada por escrito</strong> si los conceptos no aparecen separados. Tu empresa está obligada a entregarla por imperativo del art. 29.1 del Estatuto de los Trabajadores. Aprovecha para mencionar la discrepancia con la tabla del convenio.</li>
    <li><strong>Si la empresa pretende inaplicar el convenio</strong>, debe seguir el procedimiento de descuelgue (Art. 34) con periodo de consultas y comunicación a {organismo_mediacion}. Cualquier rebaja unilateral es <strong>nula</strong>. Presenta papeleta de conciliación ante {organismo_mediacion} para interrumpir el plazo. Tienes <strong>1 año por mensualidad</strong> (art. 59.2 ET).</li>
  </ol>
  <p>Los sindicatos firmantes — {sindicatos_firmantes} — siguen siendo válidos para asesoría durante la ultraactividad. Código REGCON: <code style="font-family:monospace;font-size:13px;">{codigo_regcon}</code>. <a href="/reclamar-diferencias-salariales-convenio.html">Guía completa para reclamar diferencias →</a></p>
"""

TEMPLATE_V4 = """  <h2 id="reclamar">¿Cobras menos de lo que fija el sector?</h2>
  <p>{MARKER} Tu sector no cuenta con convenio provincial propio: tu marco normativo es el {convenio_estatal_referencia} más el Estatuto de los Trabajadores. Aunque no haya tabla local, las cláusulas del Estatal sobre salario mínimo de categoría, pluses, jornada anual y subrogación son de aplicación directa.</p>
  <ol style="padding-left:20px;margin:14px 0;font-size:14.5px;color:var(--ink-light);line-height:1.7;">
    <li><strong>Identifica tu categoría en el Estatal</strong> ({convenio_estatal_referencia}) y compara con tu nómina. El Estatal publica tablas anuales o referencias porcentuales sobre SMI; localiza la última vigente y comprueba que tu salario y pluses (peligrosidad, nocturnidad, festivo, antigüedad si aplica) están al menos en el suelo del sector.</li>
    <li><strong>Documenta la diferencia y reclama por escrito</strong> a tu empresa detallando los conceptos infrapagados, citando el artículo del Estatal y el del Estatuto de los Trabajadores que respalda tu reclamación. Envíalo con prueba de recepción.</li>
    <li><strong>Si no hay acuerdo</strong>, presenta papeleta de conciliación ante {organismo_mediacion} para interrumpir el plazo de prescripción. <strong>1 año por mensualidad</strong> desde que debió abonarse (art. 59.2 ET). La denuncia ante Inspección de Trabajo es vía paralela si hay incumplimiento sistémico.</li>
  </ol>
  <p>Los sindicatos sectoriales {sindicatos_sectoriales} ofrecen asesoría gratuita a personas afiliadas. Referencia normativa: {referencia_normativa}. <a href="/reclamar-diferencias-salariales-convenio.html">Guía completa para reclamar diferencias →</a></p>
"""

TEMPLATES = {"V1a": TEMPLATE_V1A, "V1b": TEMPLATE_V1B, "V1c": TEMPLATE_V1C,
             "V3": TEMPLATE_V3, "V4": TEMPLATE_V4}


# ===== Localización del bloque actual + reemplazo =====

# Patrón del bloque a reemplazar. Captura ambas variantes presentes hoy en el corpus:
#   <h2 ...>¿Cobras menos | ¿Cuánto te están | ¿Tu nómina no encaja ...
#   <h2 ...>Si cobras menos del convenio: cómo reclamar en X
# Termina antes del siguiente <h2>, el bloque .related o el .eeat-firma (componente Rec 3).
BLOCK_RE = re.compile(
    r'(<h2[^>]*>'
    r'(?:¿(?:Cobras menos|Cuánto te están|Tu nómina no encaja)'
    r'|Si cobras menos del convenio)'
    r'[^<]*</h2>'
    r'.*?)'
    r'(?=<h2[\s>]|<div class="related"|<div class="eeat-firma"|</main>)',
    re.DOTALL | re.IGNORECASE,
)


def aplicar(html: str, tipo: str, config: dict) -> tuple:
    if MARKER in html:
        return html, "ya-rotado"
    if tipo == "V1":
        # Subvariante elegida fuera; aquí se asume tipo ya resuelto a V1a/V1b/V1c.
        return html, "v1-sin-subvariante"
    if tipo not in TEMPLATES:
        return html, f"tipo-desconocido:{tipo}"

    plantilla = TEMPLATES[tipo]
    # Sustituir variables
    contexto = dict(config)
    contexto["MARKER"] = MARKER
    try:
        nuevo_bloque = plantilla.format(**contexto)
    except KeyError as e:
        return html, f"falta-variable:{e}"

    nuevo, n = BLOCK_RE.subn(nuevo_bloque, html, count=1)
    if n == 0:
        return html, "bloque-no-encontrado"
    return nuevo, "rotado"


# ===== Selección de landings =====

def listar_landings() -> list:
    sm = SITEMAP.read_text(encoding="utf-8")
    slugs = []
    for m in re.finditer(r"<loc>https://salariojusto\.es/([^<]+)</loc>", sm):
        slug = m.group(1)
        if slug.startswith("convenio-") or slug.startswith("construccion-"):
            slugs.append(slug)
    return sorted(set(slugs))


# ===== Main =====

def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--landing", default=None)
    args = parser.parse_args()

    if args.landing:
        slugs = [args.landing]
    else:
        slugs = [s for s in listar_landings() if s not in LANDINGS_SIN_BLOQUE]

    print(f"Landings a procesar: {len(slugs)} (excluidas {len(LANDINGS_SIN_BLOQUE)} sin bloque: {sorted(LANDINGS_SIN_BLOQUE)})")
    cont = {"rotado": 0, "ya-rotado": 0, "error": 0, "sin-config": 0}

    for slug in slugs:
        path = ROOT / slug
        if not path.exists():
            print(f"  [skip] {slug}")
            continue
        html = path.read_text(encoding="utf-8")

        if slug not in CONFIG:
            print(f"  [SIN CONFIG] {slug}")
            cont["sin-config"] += 1
            continue

        tipo = clasificar_tipo(slug, html)
        if tipo == "V1":
            tipo = subvariante_v1(slug)

        config = CONFIG[slug]
        nuevo, estado = aplicar(html, tipo, config)

        flag = "(DRY) " if args.dry_run else ""
        print(f"  {flag}{slug:48s}  tipo={tipo:4s}  estado={estado}")

        if estado == "rotado":
            cont["rotado"] += 1
            if not args.dry_run:
                path.write_text(nuevo, encoding="utf-8")
        elif estado == "ya-rotado":
            cont["ya-rotado"] += 1
        else:
            cont["error"] += 1

    print()
    print("Resumen:")
    for k, v in cont.items():
        print(f"  {k}: {v}")
    return 0 if cont["error"] == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
