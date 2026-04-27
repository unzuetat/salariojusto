/**
 * Generador de landings esqueleto para las 10 plantillas del Kit del trabajador
 * (Directiva UE 2023/970 · transparencia retributiva).
 *
 * SSOT: el array PLANTILLAS de este archivo. Cada elemento se renderiza con
 * `render()` y se escribe en /<slug>.html en la raíz del repo.
 *
 * Uso: node scripts/generate-plantillas.js
 *
 * Estado actual: las 10 landings se publican como esqueleto ("🚧 En preparación")
 * con marco legal y "Cuándo usarla" para que el lector entienda el alcance,
 * y para reservar las URLs canónicas. La redacción de cada plantilla se
 * irá rellenando en próximas tandas reemplazando el campo `body` y cambiando
 * `status` a "ready".
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// ── Plantillas del Kit (SSOT) ────────────────────────────────────────
const PLANTILLAS = [
  {
    num: 1,
    slug: 'pedir-banda-salarial-empresa-2026',
    title: 'Plantilla para pedir la banda salarial a tu empresa (Directiva UE 2023/970)',
    h1: 'Plantilla para pedir la banda salarial a tu empresa',
    metaDescription: 'Modelo de carta para solicitar la banda salarial de tu posición a partir del 7 de junio de 2026, según la Directiva UE 2023/970. Listo para personalizar.',
    breadcrumb: 'Pedir banda salarial a tu empresa',
    hook: 'A partir del 7 de junio de 2026, en cualquier momento de tu relación laboral. La empresa está obligada a darte el rango salarial medio de tu categoría y trabajos de igual valor, desglosado por sexo. Es el derecho individual más directo de la Directiva.',
    legal: [
      'Directiva (UE) 2023/970 — artículo 7 (derecho individual a información retributiva)',
      'Directiva (UE) 2023/970 — artículo 9 (transparencia retributiva ex-ante)',
    ],
  },
  {
    num: 2,
    slug: 'plantilla-solicitar-informacion-salarial-rrhh',
    title: 'Plantilla para solicitar información salarial a RRHH | Modelo carta 2026',
    h1: 'Plantilla para solicitar información salarial a RRHH',
    metaDescription: 'Modelo de carta para pedir el registro retributivo y los salarios medios por sexo a tu empresa. Basado en RD 902/2020 y la Directiva UE 2023/970.',
    breadcrumb: 'Solicitar información salarial a RRHH',
    hook: 'Antes del 7 de junio de 2026 (basada en el RD 902/2020) o como complemento a la #1, cuando necesitas pedir acceso al registro retributivo de tu empresa para detectar diferencias por sexo o categoría.',
    legal: [
      'Real Decreto 902/2020 — artículo 5 (derecho de acceso al registro retributivo)',
      'Real Decreto 901/2020 — planes de igualdad y auditoría retributiva',
      'Directiva (UE) 2023/970 — artículos 7 y 9',
    ],
  },
  {
    num: 3,
    slug: 'plantilla-reclamar-grupo-profesional-superior',
    title: 'Plantilla para reclamar tu grupo profesional cuando haces funciones superiores',
    h1: 'Plantilla para reclamar el reconocimiento de un grupo profesional superior',
    metaDescription: 'Modelo de carta para reclamar el reconocimiento de tu grupo profesional cuando haces funciones de un grupo superior al que figura en tu contrato. Basado en el art. 39 ET.',
    breadcrumb: 'Reclamar grupo profesional superior',
    hook: 'Haces tareas correspondientes a un grupo profesional superior al que tienes reconocido en contrato. Tienes derecho a reclamar el reconocimiento del grupo y la diferencia retributiva — con apoyo en el convenio y el art. 39 ET.',
    legal: [
      'Estatuto de los Trabajadores — artículo 39 (movilidad funcional)',
      'Convenio colectivo aplicable (definición de grupos profesionales)',
    ],
  },
  {
    num: 4,
    slug: 'plantilla-reclamar-atrasos-convenio-salarial',
    title: 'Plantilla para reclamar atrasos por revisión del convenio salarial',
    h1: 'Plantilla para reclamar atrasos por revisión del convenio',
    metaDescription: 'Modelo de carta para reclamar los atrasos cuando tu convenio se actualiza con efectos retroactivos y la empresa no aplica las diferencias. Plazo: 1 año (art. 59 ET).',
    breadcrumb: 'Reclamar atrasos del convenio',
    hook: 'Tu convenio se ha actualizado con efectos retroactivos desde el 1 de enero y la empresa no te ha aplicado las diferencias. Plazo de prescripción: 1 año desde que debieron abonarse (art. 59.1 ET).',
    legal: [
      'Estatuto de los Trabajadores — artículo 59.1 (prescripción de salarios)',
      'Convenio colectivo aplicable (cláusula de revisión salarial)',
    ],
  },
  {
    num: 5,
    slug: 'plantilla-denunciar-discriminacion-salarial',
    title: 'Plantilla para denunciar discriminación salarial por género',
    h1: 'Plantilla para denunciar discriminación salarial por género',
    metaDescription: 'Modelo para denunciar formalmente una situación de discriminación salarial ante Inspección de Trabajo o juzgado social. Carga de la prueba invertida.',
    breadcrumb: 'Denunciar discriminación salarial',
    hook: 'Tienes indicios sólidos de que cobras menos que un compañero/a por razón de sexo. La carga de la prueba se invierte: si aportas indicios, es la empresa quien debe demostrar que no hay discriminación. Vía: Inspección de Trabajo y/o juzgado social.',
    legal: [
      'Directiva (UE) 2023/970 — artículo 18 (compensación íntegra)',
      'Directiva (UE) 2023/970 — artículo 19 (carga de la prueba)',
      'Estatuto de los Trabajadores — artículo 28 (igualdad de remuneración)',
      'Ley Orgánica 3/2007, de igualdad efectiva de mujeres y hombres',
    ],
  },
  {
    num: 6,
    slug: 'plantilla-reclamar-absorcion-complementos-smi',
    title: 'Plantilla para reclamar la absorción indebida de complementos por subida del SMI',
    h1: 'Plantilla para reclamar la absorción indebida de complementos por subida del SMI',
    metaDescription: 'Modelo de carta para reclamar cuando tu empresa reduce complementos al subir el SMI. Los complementos con naturaleza específica no pueden absorberse.',
    breadcrumb: 'Absorción indebida de complementos por SMI',
    hook: 'Al subir el SMI, la empresa ha reducido o eliminado complementos para que no notes el incremento. El Tribunal Supremo establece que los complementos con naturaleza específica (nocturnidad, peligrosidad, transporte) no pueden absorberse.',
    legal: [
      'Estatuto de los Trabajadores — artículo 26.5 (compensación y absorción)',
      'Real Decreto del SMI vigente (cláusula de no absorción)',
      'Doctrina del Tribunal Supremo sobre complementos de naturaleza específica',
    ],
  },
  {
    num: 7,
    slug: 'plantilla-documentar-evidencias-desigualdad-salarial',
    title: 'Plantilla para documentar evidencias de desigualdad salarial antes de reclamar',
    h1: 'Plantilla para documentar evidencias de desigualdad salarial',
    metaDescription: 'Checklist + tabla para registrar indicios de desigualdad salarial (correos, conversaciones, ofertas, comparaciones de funciones) antes de presentar una reclamación.',
    breadcrumb: 'Documentar evidencias de desigualdad',
    hook: 'Sospechas que algo no encaja y quieres reunir indicios sólidos antes de mover ficha. No es una carta — es un checklist + formato de tabla para registrar lo que vas observando (correos, conversaciones, ofertas, anuncios, comparaciones de funciones) sin levantar ruido.',
    legal: [
      'Directiva (UE) 2023/970 — artículo 19 (carga de la prueba)',
      'Estatuto de los Trabajadores — artículo 28 (igualdad de remuneración)',
    ],
  },
  {
    num: 8,
    slug: 'plantilla-calcular-brecha-salarial-empresa',
    title: 'Plantilla para calcular la brecha salarial en tu empresa (umbral del 5%)',
    h1: 'Plantilla para calcular la brecha salarial en tu empresa',
    metaDescription: 'Hoja de cálculo + guía paso a paso para medir si la brecha entre mujeres y hombres en tu empresa supera el 5% — el umbral que activa la evaluación retributiva conjunta.',
    breadcrumb: 'Calcular la brecha salarial',
    hook: 'Quieres medir si la brecha entre mujeres y hombres de tu misma categoría supera el 5% sin justificación objetiva — el umbral que activa la evaluación retributiva conjunta obligatoria. Hoja de cálculo + guía paso a paso para hacerlo con los datos que tu empresa está obligada a darte.',
    legal: [
      'Directiva (UE) 2023/970 — artículo 10 (informe sobre brecha retributiva)',
      'Directiva (UE) 2023/970 — artículo 12 (evaluación retributiva conjunta · umbral 5%)',
      'Real Decreto 902/2020 — auditoría retributiva',
    ],
  },
  {
    num: 9,
    slug: 'plantilla-reclamar-trabajo-igual-valor',
    title: 'Plantilla para reclamar igualdad por "trabajo de igual valor"',
    h1: 'Plantilla para reclamar igualdad salarial por "trabajo de igual valor"',
    metaDescription: 'Modelo para reclamar igualdad retributiva cuando tu trabajo no es idéntico pero tiene responsabilidades, formación y condiciones equivalentes a las del comparador.',
    breadcrumb: 'Trabajo de igual valor',
    hook: 'Tu trabajo no es idéntico al de tu comparador, pero tiene responsabilidades, formación y condiciones equivalentes. La Directiva protege también este escenario, donde puestos ocupados mayoritariamente por mujeres están infravalorados respecto a otros equivalentes ocupados por hombres.',
    legal: [
      'Directiva (UE) 2023/970 — artículo 4 (concepto de trabajo de igual valor)',
      'Estatuto de los Trabajadores — artículo 28 (igualdad de remuneración)',
      'Real Decreto 902/2020 — artículo 4 (sistema de valoración de puestos)',
    ],
  },
  {
    num: 10,
    slug: 'plantilla-reclamar-art-28-et',
    title: 'Plantilla para reclamar igualdad salarial por art. 28 ET (no relacionada con género)',
    h1: 'Plantilla para reclamar igualdad salarial por el art. 28 del Estatuto de los Trabajadores',
    metaDescription: 'Modelo de carta para reclamar igualdad retributiva cuando cobras menos que un compañero/a haciendo el mismo trabajo y la causa no es el género. Vía: art. 28 ET.',
    breadcrumb: 'Reclamación por art. 28 ET',
    hook: 'Cobras menos que un compañero/a haciendo el mismo trabajo, pero la causa no es el género. La vía es el art. 28 del Estatuto de los Trabajadores y el convenio colectivo aplicable, no la Directiva 2023/970.',
    legal: [
      'Estatuto de los Trabajadores — artículo 28 (igualdad de remuneración)',
      'Convenio colectivo aplicable',
      'Constitución Española — artículo 14 (principio de igualdad)',
    ],
  },
];

// ── Render ───────────────────────────────────────────────────────────
const HUB_URL = '/plantillas-transparencia-retributiva-2026.html';
const GUIA_URL = '/ley-transparencia-salarial-2026.html';

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function render(p) {
  const canonical = `https://salariojusto.es/${p.slug}.html`;
  const legalItems = p.legal.map(l => `        <li>${escapeHtml(l)}</li>`).join('\n');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(p.title)} | SalarioJusto</title>
  <meta name="description" content="${escapeHtml(p.metaDescription)}">
  <link rel="canonical" href="${canonical}">
  <meta name="robots" content="index, follow">
  <meta property="og:title" content="${escapeHtml(p.h1)}">
  <meta property="og:description" content="${escapeHtml(p.metaDescription)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="https://salariojusto.es/preview.jpg">
  <meta property="og:type" content="article">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="alternate" hreflang="es" href="${canonical}">
  <link rel="alternate" hreflang="x-default" href="${canonical}">

  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/favicon-180x180.png">

  <script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "SalarioJusto", "item": "https://salariojusto.es/"},
    {"@type": "ListItem", "position": 2, "name": "Guías", "item": "https://salariojusto.es/guias.html"},
    {"@type": "ListItem", "position": 3, "name": "Plantillas de transparencia salarial", "item": "https://salariojusto.es${HUB_URL}"},
    {"@type": "ListItem", "position": 4, "name": "${escapeHtml(p.breadcrumb)}"}
  ]
}
</script>
  <script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "${escapeHtml(p.h1)}",
  "description": "${escapeHtml(p.metaDescription)}",
  "datePublished": "2026-04-27",
  "dateModified": "2026-04-27",
  "publisher": {
    "@type": "Organization",
    "name": "SalarioJusto",
    "url": "https://salariojusto.es"
  },
  "mainEntityOfPage": "${canonical}"
}
</script>

  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-MXJ8V2FBW9"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-MXJ8V2FBW9');
  </script>
  <!-- Google AdSense -->
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1110009006533891" crossorigin="anonymous"></script>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap" rel="stylesheet">

  <style>
    :root {
      --cream-50: #FDFBF7;
      --cream-100: #F7F0E6;
      --cream-200: #EDE0CE;
      --gold: #C17B3E;
      --gold-dark: #A0622A;
      --gold-light: #D9A06A;
      --ink: #2D2520;
      --ink-light: #6B5E52;
      --ink-lighter: #9B8E88;
      --green: #2E7D52;
      --green-bg: #EAF5EE;
      --amber-bg: #FEF3C7;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'DM Sans', sans-serif; background: var(--cream-50); color: var(--ink); line-height: 1.75; }

    header { background: var(--ink); padding: 0 32px; display: flex; align-items: center; justify-content: space-between; height: 56px; }
    .logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
    .logo-icon { width: 30px; height: 30px; background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: #fff; font-family: 'DM Serif Display', serif; }
    .logo-text { font-size: 15px; font-weight: 700; color: #fff; letter-spacing: -0.02em; }
    .logo-text span { color: var(--gold-light); }
    .header-cta { background: var(--gold); color: #fff; padding: 8px 16px; font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; text-decoration: none; }
    .header-cta:hover { background: var(--gold-dark); }

    .breadcrumb { background: var(--cream-100); border-bottom: 1px solid var(--cream-200); padding: 10px 32px; font-size: 12px; color: var(--ink-lighter); }
    .breadcrumb a { color: var(--gold); text-decoration: none; }
    .breadcrumb a:hover { text-decoration: underline; }

    .article-hero { background: var(--ink); padding: 52px 32px 48px; }
    .article-hero-inner { max-width: 800px; margin: 0 auto; }
    .article-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--gold-light); border: 1px solid rgba(193,123,62,0.35); padding: 4px 12px; margin-bottom: 20px; }
    .article-hero h1 { font-family: 'DM Serif Display', serif; font-size: clamp(24px, 3.5vw, 36px); color: #fff; font-weight: 400; line-height: 1.2; margin-bottom: 16px; }
    .article-meta { display: flex; gap: 20px; flex-wrap: wrap; font-size: 12px; color: rgba(255,255,255,0.45); }

    main { max-width: 800px; margin: 0 auto; padding: 48px 24px 80px; }

    .construction-banner { background: var(--amber-bg); border: 1px solid #FDE68A; border-left: 4px solid #F59E0B; padding: 18px 22px; margin-bottom: 32px; }
    .construction-banner h2 { font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 700; color: var(--ink); margin: 0 0 6px; padding: 0; border: none; }
    .construction-banner p { font-size: 14px; color: var(--ink); margin: 0; line-height: 1.65; }

    h2 { font-family: 'DM Serif Display', serif; font-size: 22px; font-weight: 400; color: var(--ink); margin: 40px 0 14px; padding-top: 28px; border-top: 1px solid var(--cream-200); }
    h2:first-of-type { padding-top: 0; border-top: none; margin-top: 0; }
    p { color: var(--ink-light); font-size: 15px; margin-bottom: 16px; }
    ul { padding-left: 22px; margin-bottom: 16px; }
    li { color: var(--ink-light); font-size: 15px; margin-bottom: 8px; line-height: 1.65; }
    a { color: var(--gold); text-decoration: none; }
    a:hover { text-decoration: underline; }
    strong { color: var(--ink); font-weight: 600; }

    .when-box { background: #fff; border: 1px solid var(--cream-200); border-left: 4px solid var(--gold); padding: 20px 24px; margin-bottom: 28px; }
    .when-box p { margin: 0; }

    .legal-box { background: var(--cream-100); border: 1px solid var(--cream-200); padding: 18px 22px; margin-bottom: 28px; }
    .legal-box p.legal-title { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-lighter); font-weight: 700; margin: 0 0 10px; }
    .legal-box ul { margin: 0; padding-left: 18px; }
    .legal-box li { font-size: 14px; }

    .cta-box { background: var(--ink); padding: 32px 36px; margin: 40px 0 24px; text-align: center; }
    .cta-box h3 { font-family: 'DM Serif Display', serif; font-size: 20px; font-weight: 400; color: #fff; margin-bottom: 8px; }
    .cta-box p { color: rgba(255,255,255,0.6); font-size: 14px; margin-bottom: 20px; }
    .cta-btn { display: inline-block; background: var(--gold); color: #fff; padding: 12px 28px; font-size: 13px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; text-decoration: none; }
    .cta-btn:hover { background: var(--gold-dark); text-decoration: none; }
    .cta-btn.secondary { background: transparent; border: 1px solid var(--gold-light); color: var(--gold-light); margin-left: 8px; }
    .cta-btn.secondary:hover { background: var(--gold-dark); border-color: var(--gold-dark); color: #fff; }

    .disclaimer { background: var(--amber-bg); border: 1px solid #FDE68A; border-left: 4px solid #F59E0B; padding: 14px 18px; margin-top: 20px; }
    .disclaimer p { font-size: 12px; color: var(--ink-light); margin: 0; line-height: 1.6; }

    footer { background: var(--ink); padding: 32px; text-align: center; margin-top: 0; }
    .footer-text { font-size: 11px; color: rgba(255,255,255,0.35); line-height: 1.7; max-width: 600px; margin: 0 auto; }
    .footer-text a { color: var(--gold-light); text-decoration: none; }

    @media (max-width: 600px) {
      header { padding: 0 16px; }
      .breadcrumb { padding: 10px 16px; }
      .article-hero { padding: 36px 16px; }
      main { padding: 32px 16px 60px; }
      .cta-box { padding: 24px 20px; }
      .cta-btn.secondary { display: block; margin: 10px 0 0; }
    }
  </style>
</head>
<body>

<header>
  <a href="https://salariojusto.es" class="logo">
    <div class="logo-icon">€</div>
    <div class="logo-text">Salario<span>Justo</span></div>
  </a>
  <a href="https://salariojusto.es" class="header-cta">Calcular mi salario →</a>
</header>

<div class="breadcrumb">
  <a href="https://salariojusto.es">SalarioJusto</a> ›
  <a href="https://salariojusto.es/guias.html">Guías</a> ›
  <a href="${HUB_URL}">Plantillas de transparencia salarial</a> ›
  ${escapeHtml(p.breadcrumb)}
</div>

<div class="article-hero">
  <div class="article-hero-inner">
    <div class="article-badge">Kit del trabajador · Plantilla ${p.num} de 10</div>
    <h1>${escapeHtml(p.h1)}</h1>
    <div class="article-meta">
      <span>Actualizado: 27 abril 2026</span>
      <span>🚧 En preparación</span>
    </div>
  </div>
</div>

<main>

  <div class="construction-banner">
    <h2 style="font-family:'DM Sans',sans-serif;font-size:15px;margin-bottom:6px;border:none;padding:0;">🚧 Esta plantilla está en preparación</h2>
    <p>Estamos terminando de redactarla con todos los detalles legales y los campos personalizables. Mientras tanto, aquí abajo tienes el contexto: cuándo usarla y los artículos en los que se apoya. Vuelve en los próximos días para ver el modelo completo descargable.</p>
  </div>

  <h2>Cuándo usar esta plantilla</h2>

  <div class="when-box">
    <p>${escapeHtml(p.hook)}</p>
  </div>

  <h2>Marco legal en el que se apoya</h2>

  <div class="legal-box">
    <p class="legal-title">Artículos y normas aplicables</p>
    <ul>
${legalItems}
    </ul>
  </div>

  <p>El modelo completo incluirá un texto listo para personalizar (datos del trabajador, datos de la empresa, fechas, hechos), referencias a los artículos legales arriba citados, indicaciones para el envío con prueba de entrega (correo, burofax o registro presencial) y orientación sobre qué hacer si la empresa no responde en plazo.</p>

  <div class="cta-box">
    <h3>Mientras tanto, prepara el contexto</h3>
    <p>Antes de usar cualquier plantilla, conviene tener claro qué derechos tienes y cómo funcionan los plazos.</p>
    <a href="${GUIA_URL}" class="cta-btn">Leer la guía de la Ley →</a>
    <a href="${HUB_URL}" class="cta-btn secondary">Ver el Kit completo</a>
  </div>

  <div class="disclaimer">
    <p>⚠ Información orientativa basada en fuentes públicas y normativa vigente a abril de 2026. La plantilla es un modelo general — para casos complejos, despidos en curso o reclamaciones judiciales, consulta con un sindicato, un graduado social o un abogado laboralista.</p>
  </div>

</main>

<footer>
  <p class="footer-text">
    SalarioJusto es una herramienta informativa independiente para trabajadores. Sin empresas detrás.<br>
    <a href="https://salariojusto.es">Calculadora de salario neto</a> · <a href="https://salariojusto.es/guias.html">Guías para trabajadores</a> · <a href="https://salariojusto.es${HUB_URL}">Kit de plantillas</a>
  </p>
  <p style="font-size:11px;color:rgba(255,255,255,0.35);line-height:1.5;margin-top:14px;text-align:center;">
    <a href="/privacidad.html" style="color:rgba(255,255,255,0.55);text-decoration:none;">Privacidad</a> ·
    <a href="/aviso-legal.html" style="color:rgba(255,255,255,0.55);text-decoration:none;">Aviso legal</a> ·
    <a href="/contacto.html" style="color:rgba(255,255,255,0.55);text-decoration:none;">Contacto</a>
  </p>
</footer>

</body>
</html>
`;
}

// ── Ejecución ────────────────────────────────────────────────────────
function main() {
  let written = 0;
  for (const p of PLANTILLAS) {
    const filePath = path.join(ROOT, `${p.slug}.html`);
    fs.writeFileSync(filePath, render(p), 'utf8');
    console.log(`  ✓ ${p.slug}.html`);
    written++;
  }
  console.log(`\n${written} plantilla${written === 1 ? '' : 's'} generada${written === 1 ? '' : 's'}.`);
}

if (require.main === module) main();

module.exports = { PLANTILLAS, render };
