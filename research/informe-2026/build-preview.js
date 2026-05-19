// Build script: genera el informe SalarioJusto 2026.
// Lee listado-muestra-200.csv para la tabla del anexo.
//   sin flags     → research/informe-2026/preview.html (gitignored, noindex)
//   --prod        → <raíz repo>/informe-transparencia-salarial-2026.html (publicable)

const fs = require('fs');
const path = require('path');

const PROD = process.argv.includes('--prod');
const REPO_ROOT = path.join(__dirname, '..', '..');

const csvPath = path.join(__dirname, 'listado-muestra-200.csv');
const outPath = PROD
  ? path.join(REPO_ROOT, 'informe-transparencia-salarial-2026.html')
  : path.join(__dirname, 'preview.html');

const CANONICAL = 'https://salariojusto.es/informe-transparencia-salarial-2026.html';
const OG_IMG = 'https://salariojusto.es/og-informe-transparencia.png';

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const header = parseRow(lines[0]);
  return lines.slice(1).map(l => {
    const cells = parseRow(l);
    const o = {};
    header.forEach((h, i) => o[h] = cells[i] || '');
    return o;
  });
}
function parseRow(l) {
  const out = []; let cur = ''; let inQ = false;
  for (const c of l) {
    if (c === '"') { inQ = !inQ; continue; }
    if (c === ',' && !inQ) { out.push(cur); cur = ''; continue; }
    cur += c;
  }
  out.push(cur);
  return out;
}
function escHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const rows = parseCsv(fs.readFileSync(csvPath, 'utf8'));

// Datos sectoriales para el SVG de barras
const sectorBars = [
  { code: 'SAN', name: 'Sanidad', n: 7, pct: 35 },
  { code: 'IND', name: 'Industria', n: 4, pct: 20 },
  { code: 'TEC', name: 'Tecnología', n: 3, pct: 15 },
  { code: 'BAN', name: 'Servicios financieros', n: 3, pct: 15 },
  { code: 'HOS', name: 'Hostelería', n: 3, pct: 15 },
  { code: 'ADM', name: 'Administración pública', n: 3, pct: 15 },
  { code: 'EDU', name: 'Educación', n: 2, pct: 10 },
  { code: 'CON', name: 'Construcción', n: 2, pct: 10 },
  { code: 'CSL', name: 'Consultoría', n: 2, pct: 10 },
  { code: 'RET', name: 'Comercio al por menor', n: 1, pct: 5 },
];

// SVG · barras horizontales sectoriales (escala 0-100% para evidenciar la opacidad estructural)
function buildSectorBarsSvg() {
  const w = 720, rowH = 38, padTop = 60, padLeft = 200, barMaxW = 480, padBottom = 50;
  const h = padTop + sectorBars.length * rowH + padBottom;
  const maxPct = 100;
  const xAtPct = pct => padLeft + (pct / maxPct) * barMaxW;
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="Transparencia salarial por sector — % de ofertas que publica el rango">`;
  s += `<style>
    .grid{stroke:#EDE0CE;stroke-width:1}
    .grid-d{stroke:#EDE0CE;stroke-width:1;stroke-dasharray:2 3}
    .lbl-r{font:500 12px 'DM Sans',sans-serif;fill:#6B5E52;text-anchor:end}
    .pct{font:700 12px 'DM Sans',sans-serif;fill:#2D2520}
    .pct-on{font:700 12px 'DM Sans',sans-serif;fill:#fff}
    .axt{font:600 10px 'DM Sans',sans-serif;fill:#9B8E88;letter-spacing:0.06em;text-transform:uppercase}
    .ttl{font:400 16px 'DM Serif Display',serif;fill:#2D2520}
    .sub{font:500 11px 'DM Sans',sans-serif;fill:#9B8E88}
    .bar{fill:#C17B3E}
    .bar-bot{fill:#B91C1C}
    .void{fill:#FAF6EE}
    .void-bot{fill:#FDEDEC}
  </style>`;

  // Título
  s += `<text x="${padLeft}" y="22" class="ttl">Transparencia del rango salarial por sector</text>`;
  s += `<text x="${padLeft}" y="40" class="sub">% de ofertas con cifra o banda en el anuncio · N=20 por sector · captura 28-29 abr 2026</text>`;

  // Eje X: ticks 0, 25, 50, 75, 100
  for (let p = 0; p <= maxPct; p += 25) {
    const x = xAtPct(p);
    s += `<line x1="${x}" y1="${padTop}" x2="${x}" y2="${padTop + sectorBars.length * rowH}" class="grid-d"/>`;
    s += `<text x="${x}" y="${padTop - 6}" text-anchor="middle" class="axt">${p}%</text>`;
  }

  // Barras
  sectorBars.forEach((sec, i) => {
    const y = padTop + i * rowH + 5;
    const barH = 22;
    const x0 = padLeft;
    const xPct = xAtPct(sec.pct);
    const xEnd = xAtPct(100);
    const isBot = i === sectorBars.length - 1;
    const cls = isBot ? 'bar-bot' : 'bar';
    const voidCls = isBot ? 'void-bot' : 'void';
    // Etiqueta sector
    s += `<text x="${padLeft - 12}" y="${y + barH * 0.7}" class="lbl-r">${escHtml(sec.name)}</text>`;
    // Vacío hasta 100% (resalta cuánto falta para "todas las ofertas transparentes")
    s += `<rect x="${x0}" y="${y}" width="${xEnd - x0}" height="${barH}" class="${voidCls}"/>`;
    // Barra real
    s += `<rect x="${x0}" y="${y}" width="${xPct - x0}" height="${barH}" class="${cls}"/>`;
    // pct label
    if (sec.pct >= 8) {
      s += `<text x="${xPct - 8}" y="${y + barH * 0.68}" text-anchor="end" class="pct-on">${sec.pct}%</text>`;
    } else {
      s += `<text x="${xPct + 8}" y="${y + barH * 0.68}" class="pct">${sec.pct}%</text>`;
    }
  });

  // Línea de media (15%)
  const medX = xAtPct(15);
  s += `<line x1="${medX}" y1="${padTop - 4}" x2="${medX}" y2="${padTop + sectorBars.length * rowH + 4}" stroke="#2D2520" stroke-width="1" stroke-dasharray="4 3"/>`;
  s += `<text x="${medX + 6}" y="${padTop + sectorBars.length * rowH + 18}" class="axt">Media España: 15%</text>`;
  // Anotación derecha: "ningún sector llega al 50%"
  s += `<text x="${xAtPct(100)}" y="${padTop + sectorBars.length * rowH + 18}" text-anchor="end" class="axt">Ningún sector supera el 35%</text>`;
  // Línea inferior eje
  s += `<line x1="${padLeft}" y1="${padTop + sectorBars.length * rowH + 1}" x2="${xAtPct(100)}" y2="${padTop + sectorBars.length * rowH + 1}" class="grid"/>`;

  s += `</svg>`;
  return s;
}

// SVG · curva en U del tamaño de empresa
function buildSizeCurveSvg() {
  const sizes = [
    { lbl: 'XS', sub: '<10', pct: 25, n: 5, total: 20 },
    { lbl: 'S',  sub: '10-49', pct: 15, n: 5, total: 34 },
    { lbl: 'M',  sub: '50-249', pct: 15, n: 4, total: 26 },
    { lbl: 'L',  sub: '250-999', pct: 8,  n: 3, total: 39 },
    { lbl: 'XL', sub: '1000+', pct: 16, n: 13, total: 81 },
  ];
  const w = 720, h = 320, padTop = 70, padBottom = 70, padLeft = 70, padRight = 30;
  const plotH = h - padTop - padBottom;
  const plotW = w - padLeft - padRight;
  const colW = plotW / sizes.length;
  const maxPct = 100;
  const yAtPct = pct => padTop + plotH * (1 - pct / maxPct);
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="Transparencia por tamaño de empresa — la paradoja en U">`;
  s += `<style>
    .grid-d{stroke:#EDE0CE;stroke-width:1;stroke-dasharray:2 3}
    .axt{font:600 10px 'DM Sans',sans-serif;fill:#9B8E88;letter-spacing:0.06em;text-transform:uppercase}
    .ttl{font:400 16px 'DM Serif Display',serif;fill:#2D2520}
    .sub{font:500 11px 'DM Sans',sans-serif;fill:#9B8E88}
    .pct{font:700 14px 'DM Sans',sans-serif;fill:#2D2520;text-anchor:middle}
    .lbl{font:600 13px 'DM Sans',sans-serif;fill:#2D2520;text-anchor:middle}
    .lblsub{font:500 10px 'DM Sans',sans-serif;fill:#9B8E88;text-anchor:middle}
    .bar{fill:#C17B3E}
    .bar-low{fill:#B91C1C}
    .void{fill:#FAF6EE}
    .curve{fill:none;stroke:#2D2520;stroke-width:1.5;stroke-dasharray:4 3;opacity:0.55}
  </style>`;

  // Título
  s += `<text x="${padLeft}" y="22" class="ttl">La paradoja del tamaño · curva en U</text>`;
  s += `<text x="${padLeft}" y="40" class="sub">% de ofertas con rango publicado, por tamaño de empresa (n.º empleados)</text>`;

  // Ticks Y
  for (let p = 0; p <= 100; p += 25) {
    const y = yAtPct(p);
    s += `<line x1="${padLeft}" y1="${y}" x2="${w - padRight}" y2="${y}" class="grid-d"/>`;
    s += `<text x="${padLeft - 8}" y="${y + 4}" text-anchor="end" class="axt">${p}%</text>`;
  }

  // Barras y etiquetas
  const points = [];
  sizes.forEach((sz, i) => {
    const x = padLeft + i * colW + colW * 0.18;
    const barW = colW * 0.64;
    const yTop = yAtPct(sz.pct);
    const yBot = yAtPct(0);
    const cls = sz.lbl === 'L' ? 'bar-low' : 'bar';
    // Vacío hasta 100% (sombra)
    s += `<rect x="${x}" y="${padTop}" width="${barW}" height="${plotH}" class="void"/>`;
    // Barra
    s += `<rect x="${x}" y="${yTop}" width="${barW}" height="${yBot - yTop}" class="${cls}"/>`;
    // % encima
    s += `<text x="${x + barW / 2}" y="${yTop - 8}" class="pct">${sz.pct}%</text>`;
    // Etiqueta tamaño
    s += `<text x="${x + barW / 2}" y="${yBot + 22}" class="lbl">${escHtml(sz.lbl)}</text>`;
    s += `<text x="${x + barW / 2}" y="${yBot + 38}" class="lblsub">${escHtml(sz.sub)} empleados</text>`;
    s += `<text x="${x + barW / 2}" y="${yBot + 52}" class="lblsub">N=${sz.total}</text>`;
    points.push({ x: x + barW / 2, y: yTop });
  });

  // Curva discontinua que une los puntos
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  s += `<path d="${path}" class="curve"/>`;

  // Anotación de curva en U
  s += `<text x="${padLeft + plotW / 2}" y="${h - 12}" text-anchor="middle" class="axt">El segmento intermedio (L · 250-999) toca suelo · 8%</text>`;

  s += `</svg>`;
  return s;
}

// SVG · timeline ola legislativa internacional
function buildTimelineSvg() {
  const w = 720, h = 200, padL = 50, padR = 30, padT = 50, padB = 70;
  const yLine = padT + (h - padT - padB) / 2;
  const x0 = padL, x1 = w - padR;
  const events = [
    { y: 2021, lbl: 'Colorado', sub: 'SB19-085', side: 'top' },
    { y: 2023.0, lbl: 'California', sub: 'SB 1162', side: 'bot' },
    { y: 2023.7, lbl: 'New York', sub: '§194-B', side: 'top' },
    { y: 2026, lbl: 'España + Alemania', sub: 'Directiva 2023/970', side: 'bot', highlight: true },
    { y: 2027, lbl: 'Reino Unido', sub: 'sin texto · debate', side: 'top', dim: true },
  ];
  const yMin = 2020, yMax = 2027.5;
  const xAt = year => x0 + ((year - yMin) / (yMax - yMin)) * (x1 - x0);
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="Cronología de leyes de pay transparency">`;
  s += `<style>
    .ttl{font:400 16px 'DM Serif Display',serif;fill:#2D2520}
    .sub{font:500 11px 'DM Sans',sans-serif;fill:#9B8E88}
    .lbl{font:600 12px 'DM Sans',sans-serif;fill:#2D2520}
    .lblsub{font:500 10px 'DM Sans',sans-serif;fill:#6B5E52}
    .lbldim{font:500 12px 'DM Sans',sans-serif;fill:#9B8E88;font-style:italic}
    .lblsub-dim{font:500 10px 'DM Sans',sans-serif;fill:#9B8E88;font-style:italic}
    .yr{font:700 11px 'DM Sans',sans-serif;fill:#9B8E88;letter-spacing:0.06em}
    .hi{fill:#C17B3E}
    .dot{fill:#2D2520}
    .dot-dim{fill:#D9A06A;opacity:0.6}
  </style>`;
  s += `<text x="${padL}" y="22" class="ttl">La ola legislativa de pay transparency · 2021-2027</text>`;
  s += `<text x="${padL}" y="40" class="sub">Fuente: leyes oficiales (SB19-085 CO · SB1162 CA · NY Lab.Law §194-B · Directiva UE 2023/970 · UK call for evidence 2025)</text>`;
  // Línea principal
  s += `<line x1="${x0}" y1="${yLine}" x2="${x1}" y2="${yLine}" stroke="#2D2520" stroke-width="1.5"/>`;
  // Ticks de año
  for (let y = 2020; y <= 2027; y++) {
    const x = xAt(y);
    s += `<line x1="${x}" y1="${yLine - 4}" x2="${x}" y2="${yLine + 4}" stroke="#9B8E88" stroke-width="1"/>`;
    s += `<text x="${x}" y="${yLine + 22}" text-anchor="middle" class="yr">${y}</text>`;
  }
  // Eventos
  events.forEach(e => {
    const x = xAt(e.y);
    const top = e.side === 'top';
    const yLbl = top ? yLine - 14 : yLine + 36;
    const ySub = top ? yLine - 28 : yLine + 50;
    const dot = e.dim ? 'dot-dim' : (e.highlight ? 'hi' : 'dot');
    s += `<circle cx="${x}" cy="${yLine}" r="${e.highlight ? 6 : 4}" class="${dot}"/>`;
    if (e.highlight) {
      s += `<circle cx="${x}" cy="${yLine}" r="11" fill="none" stroke="#C17B3E" stroke-width="1.5" opacity="0.6"/>`;
    }
    const cls = e.dim ? 'lbldim' : 'lbl';
    const subCls = e.dim ? 'lblsub-dim' : 'lblsub';
    s += `<text x="${x}" y="${yLbl}" text-anchor="middle" class="${cls}">${escHtml(e.lbl)}</text>`;
    s += `<text x="${x}" y="${ySub}" text-anchor="middle" class="${subCls}">${escHtml(e.sub)}</text>`;
  });
  s += `</svg>`;
  return s;
}

// Tabla del anexo · 200 filas
const tableRows = rows.map(r =>
  `<tr><td class="num">${escHtml(r.id)}</td><td>${escHtml(r.empresa)}</td><td>${escHtml(r.sector_nombre)}</td><td>${escHtml(r.ccaa)}</td><td class="num">${escHtml(r['tamaño'])}</td><td class="num">${escHtml(r.fecha_captura)}</td></tr>`
).join('\n');

// Calcular días hasta 7-jun-2026
const targetDate = new Date('2026-06-07T00:00:00Z');
const today = new Date('2026-05-19T00:00:00Z');
const daysToTarget = Math.round((targetDate - today) / (1000 * 60 * 60 * 24));

// ---- Bloques que cambian entre preview y producción ----
const pageTitle = PROD
  ? 'Solo 1 de cada 7 ofertas de empleo en España publica el salario (informe 2026) | SalarioJusto'
  : 'PREVIEW · Informe SalarioJusto · Transparencia retributiva en España a las puertas de la Directiva UE 2023/970';

const robotsTag = PROD ? 'index,follow' : 'noindex,nofollow';

const bannerHtml = PROD ? '' : '<div class="preview-banner">PREVIEW LOCAL · NO PUBLICAR · DRAFT V0.2 · 29-ABR-2026</div>';

const breadcrumbHtml = PROD
  ? '<div class="breadcrumb"><a href="https://salariojusto.es/">SalarioJusto</a> · <a href="https://salariojusto.es/guias.html">Guías</a> · <a href="https://salariojusto.es/ley-transparencia-salarial-2026.html">Ley de transparencia salarial 2026</a> · Informe: opacidad salarial en ofertas</div>'
  : '<div class="breadcrumb"><a href="https://salariojusto.es/">SalarioJusto</a> · <a href="https://salariojusto.es/sala-de-prensa.html">Sala de prensa</a> · Informe transparencia retributiva 2026</div>';

const csvHref = PROD ? '/listado-muestra-200.csv' : 'listado-muestra-200.csv';

const headExtra = PROD ? `
<meta name="description" content="Análisis de 200 ofertas de empleo en LinkedIn España: el 85% no publica el rango salarial a las puertas de la Directiva (UE) 2023/970, que entra en vigor el 7 de junio de 2026. Datos por sector, metodología y dataset abierto CC-BY.">
<link rel="canonical" href="${CANONICAL}">
<meta property="og:type" content="article">
<meta property="og:title" content="Solo 1 de cada 7 ofertas de empleo en España publica el salario">
<meta property="og:description" content="Informe SalarioJusto: el 85% de 200 ofertas analizadas no publica el rango salarial, a las puertas de la Directiva UE 2023/970 (7 jun 2026).">
<meta property="og:url" content="${CANONICAL}">
<meta property="og:image" content="${OG_IMG}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${OG_IMG}">
<link rel="alternate" hreflang="es" href="${CANONICAL}">
<link rel="alternate" hreflang="x-default" href="${CANONICAL}">
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="apple-touch-icon" sizes="180x180" href="/favicon-180x180.png">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Solo 1 de cada 7 ofertas de empleo en España publica el salario",
  "description": "Análisis de 200 ofertas en LinkedIn España: el 85% no publica el rango salarial a las puertas de la Directiva (UE) 2023/970.",
  "datePublished": "2026-05-19",
  "dateModified": "2026-05-19",
  "image": "${OG_IMG}",
  "author": { "@type": "Organization", "name": "SalarioJusto", "url": "https://salariojusto.es/" },
  "publisher": { "@type": "Organization", "name": "SalarioJusto", "url": "https://salariojusto.es/" },
  "mainEntityOfPage": "${CANONICAL}",
  "isBasedOn": "https://salariojusto.es/ley-transparencia-salarial-2026.html"
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Dataset",
  "name": "Muestra de 200 ofertas de empleo · transparencia retributiva España 2026",
  "description": "Listado verificable de 200 ofertas de empleo en LinkedIn España (10 sectores × 20), capturadas el 28-29 de abril de 2026. Incluye empresa, sector, comunidad autónoma, tamaño y fecha de captura. No incluye la etiqueta de transparencia individualizada (solo se publica agregada en el informe).",
  "license": "https://creativecommons.org/licenses/by/4.0/",
  "creator": { "@type": "Organization", "name": "SalarioJusto", "url": "https://salariojusto.es/" },
  "temporalCoverage": "2026-04-22/2026-04-29",
  "isAccessibleForFree": true,
  "distribution": {
    "@type": "DataDownload",
    "encodingFormat": "text/csv",
    "contentUrl": "https://salariojusto.es/listado-muestra-200.csv"
  }
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "SalarioJusto", "item": "https://salariojusto.es/"},
    {"@type": "ListItem", "position": 2, "name": "Guías", "item": "https://salariojusto.es/guias.html"},
    {"@type": "ListItem", "position": 3, "name": "Ley de transparencia salarial 2026", "item": "https://salariojusto.es/ley-transparencia-salarial-2026.html"},
    {"@type": "ListItem", "position": 4, "name": "Informe: opacidad salarial en ofertas 2026"}
  ]
}
</script>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-MXJ8V2FBW9"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-MXJ8V2FBW9');</script>
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1110009006533891" crossorigin="anonymous"></script>` : '';

const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${pageTitle}</title>
<meta name="robots" content="${robotsTag}">${headExtra}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display&family=Newsreader:wght@500;600;700&family=IBM+Plex+Mono:wght@500&display=swap" rel="stylesheet">
<style>
  :root{--cream-50:#FDFBF7;--cream-100:#F7F0E6;--cream-200:#EDE0CE;--gold:#C17B3E;--gold-dark:#A0622A;--gold-light:#D9A06A;--ink:#2D2520;--ink-light:#6B5E52;--ink-lighter:#9B8E88;--green:#2E7D52;--green-bg:#EAF5EE;--red:#B91C1C;--amber:#B45309;--amber-bg:#FEF3C7;}
  *{box-sizing:border-box;margin:0;padding:0;}
  html{scroll-behavior:smooth;}
  body{font-family:'DM Sans',sans-serif;background:var(--cream-50);color:var(--ink);line-height:1.75;font-size:16px;}
  .preview-banner{background:#1f1611;color:var(--gold-light);padding:8px 24px;text-align:center;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;font-weight:700;border-bottom:1px solid var(--gold-dark);}
  header{background:var(--ink);padding:0 32px;display:flex;align-items:center;justify-content:space-between;height:56px;position:sticky;top:0;z-index:100;}
  .logo{display:flex;align-items:center;gap:12px;text-decoration:none;}
  .logo-mark{width:28px;height:28px;border:1px solid rgba(217,160,106,0.5);display:flex;align-items:center;justify-content:center;font-family:'Newsreader',serif;font-size:17px;font-weight:500;color:var(--gold-light);line-height:1;padding-top:2px;}
  .logo-text{font-family:'Newsreader',serif;font-size:22px;font-weight:600;color:var(--gold-light);letter-spacing:-0.025em;line-height:1;}
  .logo-text span{color:#fff;}
  .header-meta{font-size:11px;color:rgba(255,255,255,0.55);letter-spacing:0.08em;text-transform:uppercase;font-weight:600;}
  .breadcrumb{background:var(--cream-100);border-bottom:1px solid var(--cream-200);padding:10px 32px;font-size:12px;color:var(--ink-lighter);}
  .breadcrumb a{color:var(--gold);text-decoration:none;}
  .hero{background:var(--ink);padding:72px 32px 60px;text-align:center;border-bottom:6px solid var(--gold);}
  .hero-eyebrow{display:inline-flex;align-items:center;gap:10px;font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:var(--gold-light);margin-bottom:24px;}
  .hero-eyebrow::before,.hero-eyebrow::after{content:'';width:30px;height:1px;background:var(--gold);opacity:0.6;}
  .hero h1{font-family:'DM Serif Display',serif;font-size:clamp(28px,4.5vw,48px);color:#fff;font-weight:400;line-height:1.18;max-width:880px;margin:0 auto 22px;letter-spacing:-0.01em;}
  .hero h1 em{font-style:normal;color:var(--gold-light);}
  .hero-sub{font-size:17px;color:rgba(255,255,255,0.75);max-width:680px;margin:0 auto 28px;line-height:1.6;}
  .hero-meta{font-size:12px;color:rgba(255,255,255,0.5);font-family:'IBM Plex Mono',monospace;letter-spacing:0.05em;}
  .countdown{display:inline-flex;align-items:baseline;gap:8px;background:rgba(193,123,62,0.12);border:1px solid rgba(193,123,62,0.4);padding:10px 20px;margin-top:22px;font-family:'IBM Plex Mono',monospace;}
  .countdown-num{font-size:22px;color:var(--gold-light);font-weight:700;}
  .countdown-lbl{font-size:11px;color:rgba(255,255,255,0.65);text-transform:uppercase;letter-spacing:0.1em;}
  main{max-width:760px;margin:0 auto;padding:48px 24px 80px;}
  .toc{background:#fff;border:1px solid var(--cream-200);padding:24px 28px;margin-bottom:48px;font-size:13px;}
  .toc-title{font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--gold);margin-bottom:14px;}
  .toc ol{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:6px;counter-reset:secn;}
  .toc li{counter-increment:secn;padding-left:32px;position:relative;}
  .toc li::before{content:counter(secn,decimal-leading-zero);position:absolute;left:0;top:0;font-family:'IBM Plex Mono',monospace;font-size:11px;color:var(--ink-lighter);font-weight:700;}
  .toc a{color:var(--ink);text-decoration:none;border-bottom:1px solid transparent;}
  .toc a:hover{color:var(--gold);border-bottom-color:var(--gold);}
  section{margin-bottom:64px;scroll-margin-top:80px;}
  h2{font-family:'DM Serif Display',serif;font-size:30px;font-weight:400;color:var(--ink);margin:0 0 8px;line-height:1.2;letter-spacing:-0.005em;}
  h2 .secn{font-family:'IBM Plex Mono',monospace;font-size:13px;color:var(--gold);font-weight:500;display:block;margin-bottom:8px;letter-spacing:0.08em;text-transform:uppercase;}
  h2 + .deck{font-size:15px;color:var(--ink-light);margin-top:6px;margin-bottom:24px;font-style:italic;line-height:1.6;}
  h3{font-family:'Newsreader',serif;font-size:22px;font-weight:600;color:var(--ink);margin:36px 0 10px;line-height:1.3;}
  h3 .subn{font-family:'IBM Plex Mono',monospace;font-size:11px;color:var(--gold);font-weight:500;letter-spacing:0.06em;display:inline-block;margin-right:10px;vertical-align:middle;}
  h4{font-size:14px;font-weight:700;color:var(--ink);margin:24px 0 6px;letter-spacing:0.02em;}
  p{color:var(--ink-light);margin-bottom:18px;font-size:16px;}
  p.lead{font-family:'Newsreader',serif;font-size:21px;line-height:1.55;color:var(--ink);font-weight:500;margin-bottom:24px;}
  p.lead::first-letter{font-family:'DM Serif Display',serif;font-size:54px;float:left;line-height:1;padding-right:10px;padding-top:6px;color:var(--gold);}
  ul,ol{margin:0 0 18px 22px;color:var(--ink-light);}
  li{margin-bottom:6px;font-size:15px;}
  a{color:var(--gold);text-decoration:none;border-bottom:1px solid var(--gold-light);}
  a:hover{color:var(--gold-dark);}
  strong{color:var(--ink);font-weight:600;}
  blockquote.cite{margin:18px 0 22px;padding:16px 22px;background:var(--cream-100);border-left:4px solid var(--gold);font-family:'Newsreader',serif;font-size:16px;line-height:1.6;color:var(--ink);font-style:italic;}
  blockquote.cite .src{display:block;margin-top:10px;font-family:'DM Sans',sans-serif;font-size:11px;color:var(--ink-lighter);font-style:normal;letter-spacing:0.06em;text-transform:uppercase;font-weight:700;}
  .pullbox{background:#fff;border:1px solid var(--cream-200);border-left:4px solid var(--gold);padding:20px 24px;margin:22px 0;}
  .pullbox h4{margin-top:0;font-family:'Newsreader',serif;font-size:15px;font-weight:700;color:var(--ink);text-transform:none;letter-spacing:0;margin-bottom:8px;}
  .pullbox p{font-size:15px;margin-bottom:8px;}
  .pullbox p:last-child{margin-bottom:0;}
  .stat-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:0;margin:24px 0;border-top:1px solid var(--cream-200);border-bottom:1px solid var(--cream-200);}
  .stat-row .stat{padding:18px 16px;border-right:1px solid var(--cream-200);}
  .stat-row .stat:last-child{border-right:none;}
  .stat-num{font-family:'DM Serif Display',serif;font-size:38px;line-height:1;color:var(--gold);margin-bottom:4px;font-weight:400;}
  .stat-lbl{font-size:11px;color:var(--ink-light);line-height:1.5;letter-spacing:0.04em;}
  table{width:100%;border-collapse:collapse;margin:18px 0 28px;font-size:14px;}
  thead th{font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink-lighter);text-align:left;padding:12px 12px;border-bottom:2px solid var(--ink);background:var(--cream-100);}
  tbody td{padding:11px 12px;border-bottom:1px solid var(--cream-100);color:var(--ink-light);}
  tbody td:first-child{font-weight:700;color:var(--ink);}
  tbody tr.top td:first-child{color:var(--green);}
  tbody tr.bot td:first-child{color:var(--red);}
  td.num{font-family:'IBM Plex Mono',monospace;font-size:12px;color:var(--ink-light);text-align:right;white-space:nowrap;}
  th.num{text-align:right;}
  .chart{margin:32px 0 28px;background:#fff;border:1px solid var(--cream-200);padding:24px 12px 20px;}
  .chart svg{display:block;width:100%;height:auto;max-width:100%;}
  .chart-cap{font-size:12px;color:var(--ink-lighter);margin-top:10px;padding:0 12px;line-height:1.5;}
  .placeholder-chart{background:repeating-linear-gradient(45deg,#fafafa,#fafafa 10px,#f4ede0 10px,#f4ede0 11px);border:1px dashed var(--gold-light);padding:60px 28px;margin:28px 0;text-align:center;}
  .placeholder-chart .ph-tag{display:inline-block;background:var(--gold);color:#fff;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;font-weight:700;padding:4px 10px;margin-bottom:12px;}
  .placeholder-chart h4{font-family:'DM Serif Display',serif;font-size:20px;color:var(--ink);font-weight:400;margin-bottom:8px;text-transform:none;letter-spacing:0;}
  .placeholder-chart p{font-size:13px;color:var(--ink-light);margin:0;max-width:520px;margin-left:auto;margin-right:auto;}
  details.anexo{background:#fff;border:1px solid var(--cream-200);padding:0;margin:32px 0;}
  details.anexo>summary{padding:18px 24px;cursor:pointer;list-style:none;display:flex;align-items:center;justify-content:space-between;font-weight:600;font-size:14px;background:var(--cream-100);}
  details.anexo>summary::-webkit-details-marker{display:none;}
  details.anexo>summary::after{content:'+';font-family:'DM Serif Display',serif;font-size:24px;color:var(--gold);transition:transform 0.2s;}
  details.anexo[open]>summary::after{content:'−';}
  details.anexo .anexo-body{padding:0;max-height:520px;overflow-y:auto;}
  details.anexo table{margin:0;}
  details.anexo thead th{position:sticky;top:0;background:var(--cream-100);}
  footer{background:var(--ink);padding:40px 32px;text-align:center;}
  .footer-text{font-size:12px;color:rgba(255,255,255,0.55);line-height:1.7;}
  .footer-text a{color:var(--gold-light);text-decoration:none;border:none;}
  .footer-rule{height:1px;background:rgba(255,255,255,0.1);max-width:100px;margin:18px auto;}
  @media(max-width:640px){
    main{padding:32px 18px 60px;}
    .hero{padding:48px 20px 40px;}
    .hero h1{font-size:28px;}
    h2{font-size:24px;}
    h3{font-size:18px;}
    p.lead{font-size:18px;}
    .stat-num{font-size:30px;}
  }
</style>
</head>
<body>

${bannerHtml}

<header>
  <a href="https://salariojusto.es/" class="logo"><div class="logo-mark">§</div><div class="logo-text">Salario<span>Justo</span></div></a>
  <span class="header-meta">Informe · Junio 2026</span>
</header>

${breadcrumbHtml}

<section class="hero">
  <div class="hero-eyebrow"><span id="countdown-eyebrow-pre">Informe SalarioJusto · </span><span id="countdown-eyebrow">${daysToTarget} días</span><span id="countdown-eyebrow-post"> para la Directiva UE 2023/970</span></div>
  <h1>Solo <em>1 de cada 7 ofertas</em> de empleo en España permite saber el sueldo antes de aplicar</h1>
  <p class="hero-sub">Análisis de 200 ofertas en LinkedIn España estratificadas por sector revela una opacidad voluntaria del 85% — siete veces más alta en el comercio que en la sanidad — a las puertas del 7 de junio de 2026.</p>
  <p class="hero-meta">Captura: 28-29 abril 2026 · N=200 · 10 sectores × 20 ofertas · LinkedIn España</p>
  <div class="countdown">
    <span class="countdown-num" id="countdown-num">${daysToTarget}</span>
    <span class="countdown-lbl" id="countdown-lbl">días hasta la entrada en vigor · 7 jun 2026</span>
  </div>
</section>

<main>

<nav class="toc" aria-label="Índice">
  <div class="toc-title">Índice</div>
  <ol>
    <li><a href="#sec-1">Hallazgo principal</a></li>
    <li><a href="#sec-2">Qué cambia el 7 de junio · marco legal</a></li>
    <li><a href="#sec-3">Cómo se midió</a></li>
    <li><a href="#sec-4">Resultados por sector</a></li>
    <li><a href="#sec-5">Mirada internacional</a></li>
    <li><a href="#sec-6">El estándar más exigente · 30 de cada 200</a></li>
    <li><a href="#sec-7">Cómo prepararte para el 7 de junio</a></li>
    <li><a href="#sec-anexo">Anexo · muestra completa de 200 empresas</a></li>
  </ol>
</nav>

<section id="sec-1">
  <h2><span class="secn">01 · Hallazgo principal</span>1 de cada 7 ofertas publica el rango</h2>
  <p class="deck">Los datos recogidos entre el 22 y el 29 de abril de 2026 sobre 200 ofertas en LinkedIn España revelan que la opacidad salarial es la norma, no la excepción.</p>

  <p class="lead">En España, el 85% de las ofertas de empleo no permite a quien aplica saber cuánto se paga el puesto. Es la conclusión del análisis de 200 ofertas publicadas en LinkedIn entre el 22 y el 29 de abril de 2026 que SalarioJusto presenta hoy. Solo 30 de las 200 — un 15% — incluían un rango o una cifra salarial concreta en el anuncio. Las 170 restantes recurrían al "salario competitivo", al "según valía" o a la omisión total.</p>

  <p>El 7 de junio de 2026 entra en vigor la Directiva (UE) 2023/970 de transparencia retributiva, que obliga a la empresa a entregar esa información a la persona candidata antes de la entrevista — en el anuncio o por otro medio. La práctica de hoy no es ilegal todavía, pero su margen legal termina ese día.</p>

  <div class="stat-row">
    <div class="stat"><div class="stat-num">85%</div><div class="stat-lbl">de las ofertas no publica rango salarial</div></div>
    <div class="stat"><div class="stat-num">35%</div><div class="stat-lbl">de transparencia en sanidad — sector líder</div></div>
    <div class="stat"><div class="stat-num">5%</div><div class="stat-lbl">de transparencia en retail — sector más opaco</div></div>
    <div class="stat"><div class="stat-num">7×</div><div class="stat-lbl">distancia entre el sector más maduro y el más opaco</div></div>
  </div>

  <p>El detalle por sector marca un contraste de siete veces entre los más maduros y los más opacos. La sanidad es el sector que más publica el rango (35% de las ofertas analizadas), seguido por la industria (20%). En el extremo opuesto, el comercio al por menor publica el rango en una sola de cada veinte ofertas (5%). Educación, construcción y consultoría se quedan en el 10%. El tamaño de la empresa también pesa: las microempresas (menos de 10 empleados) publican rango en el 25% de los casos, mientras que las grandes nacionales (250-999) lo hacen solo en el 8%.</p>

  <p>El otro pilar de la directiva — la prohibición de preguntar a la persona candidata por su salario actual o anterior, taxativa desde el 7 de junio — no es observable desde una oferta pública. Esa pregunta se materializa en cribas telefónicas de RRHH y en entrevistas. <strong>Eso no significa que en la práctica no exista: significa que ningún análisis externo la puede medir, y que su vigilancia tras el 7 de junio dependerá de Inspección de Trabajo, sindicatos y denuncias individuales.</strong></p>
</section>

<section id="sec-2">
  <h2><span class="secn">02 · Marco legal</span>Qué cambia el 7 de junio</h2>
  <p class="deck">El cambio normativo tiene su origen en la Directiva (UE) 2023/970 del Parlamento Europeo y del Consejo de 10 de mayo de 2023 sobre transparencia retributiva. Su artículo 5, titulado "Transparencia retributiva previa al empleo", introduce tres obligaciones nuevas para las empresas en el momento de seleccionar personal.</p>

  <h3><span class="subn">2.1</span>El derecho a recibir el rango salarial · artículo 5.1</h3>
  <p>El apartado 5.1 reconoce un derecho de la persona candidata — no una obligación abstracta de la empresa de publicar — y delimita lo que debe entregársele:</p>
  <blockquote class="cite">
    Los solicitantes de empleo tendrán derecho a recibir del empleador potencial información sobre lo siguiente: a) la retribución inicial o la banda retributiva inicial, basadas en criterios objetivos y neutros con respecto al género, correspondientes al puesto al que aspiran, y b) en su caso, las disposiciones pertinentes del convenio colectivo aplicado por el empleador con respecto al puesto. Esa información se facilitará de tal forma que se garantice una negociación informada y transparente sobre la retribución, por ejemplo, en el anuncio de la vacante que se publique o por otro medio.
    <span class="src">Directiva 2023/970 · Artículo 5, apartado 1</span>
  </blockquote>
  <p>El <strong>Considerando 32</strong> desarrolla y matiza ese "por otro medio" añadiendo dos plazos máximos concretos:</p>
  <blockquote class="cite">
    Los solicitantes de empleo deben recibir información sobre la retribución inicial o la banda retributiva inicial por un medio que garantice una negociación informada y transparente sobre la retribución, por ejemplo, en el anuncio de vacante que se publique, antes de la entrevista de trabajo, o por otro medio antes de la celebración del contrato de trabajo.
    <span class="src">Directiva 2023/970 · Considerando 32</span>
  </blockquote>
  <div class="pullbox">
    <h4>Lo que esto significa en la práctica</h4>
    <p>El considerando 32 fija dos plazos máximos: antes de la entrevista, o "por otro medio antes de la celebración del contrato". Es tentador leer eso como una válvula de escape — "si el rango aparece en el contrato firmado, la empresa cumple". Sería un error de lectura.</p>
    <p>El propio texto reclama que la información se entregue <strong>"por un medio que garantice una negociación informada y transparente sobre la retribución"</strong>. Si la persona candidata sólo descubre el rango cuando firma el contrato — sin margen para discutirlo, sin alternativa, sin tiempo para comparar — la negociación informada no existe. La práctica española de hoy, en la que muchas personas conocen su salario al recibir la primera nómina, queda fuera del espíritu de la directiva incluso bajo el plazo amplio del considerando.</p>
  </div>

  <h3><span class="subn">2.2</span>Prohibido preguntar el salario anterior · artículo 5.2</h3>
  <p>El apartado 5.2 introduce una prohibición taxativa, sin excepciones ni matices temporales:</p>
  <blockquote class="cite">
    Ningún empleador podrá hacer a los solicitantes preguntas sobre su historial retributivo en sus relaciones laborales actuales o anteriores.
    <span class="src">Directiva 2023/970 · Artículo 5, apartado 2</span>
  </blockquote>
  <div class="pullbox">
    <h4>Lo que esto significa en la práctica</h4>
    <p>A partir del 7 de junio de 2026, será <strong>ilegal en España</strong> que un proceso de selección pregunte: "¿Cuál es tu salario actual?", "¿Cuánto cobrabas en tu último puesto?", "¿Cuáles son tus expectativas salariales basándote en tu situación actual?". Ni en el texto público de la oferta, ni en el formulario de aplicación, ni en la entrevista. El cumplimiento se verifica con un único criterio: la oferta y el proceso <strong>no piden</strong> ese dato bajo ninguna formulación.</p>
  </div>

  <h3><span class="subn">2.3</span>Anuncios y procesos no discriminatorios · artículo 5.3</h3>
  <p>El apartado 5.3 cierra el artículo añadiendo una obligación de neutralidad lingüística y procesal:</p>
  <blockquote class="cite">
    Los empleadores deben garantizar que los anuncios de las vacantes de trabajo y las denominaciones de los puestos de trabajo sean neutros con respecto al género, y que los procesos de contratación se desarrollen de un modo no discriminatorio, a fin de no socavar el derecho a la igualdad de retribución por un mismo trabajo o un trabajo de igual valor.
    <span class="src">Directiva 2023/970 · Artículo 5, apartado 3</span>
  </blockquote>

  <div class="pullbox" style="border-left-color:var(--ink);background:var(--cream-100);">
    <h4>Lo que la directiva NO obliga · contra el framing simplista</h4>
    <p>Es habitual leer afirmaciones del tipo <em>"a partir del 7 de junio las empresas tendrán que publicar el salario en todas las ofertas"</em>. Esto es inexacto. La directiva no obliga a publicar el rango en el anuncio: obliga a entregárselo a la persona candidata — en la oferta, antes de la entrevista o, como mucho, antes de firmar el contrato.</p>
    <p>El cumplimiento estricto del 7 de junio se mide con la pregunta del salario anterior (apartado 5.2), no con la presencia o ausencia del rango en el anuncio.</p>
  </div>
</section>

<section id="sec-3">
  <h2><span class="secn">03 · Metodología</span>Cómo se midió</h2>
  <p class="deck">El análisis observa lo que ve quien aplica a una oferta en LinkedIn, no lo que ocurre después. Esa frontera define lo que el dato mide y lo que el dato no puede medir.</p>

  <h3><span class="subn">3.1</span>Diseño muestral</h3>
  <p>Se construyó una muestra estratificada con cuotas iguales por sector — diez sectores con presencia significativa en el mercado laboral español, definidos según la taxonomía de industrias de LinkedIn — con veinte ofertas por sector hasta totalizar <strong>doscientas observaciones</strong>. La selección dentro de cada estrato siguió un orden sistemático: con la búsqueda de LinkedIn filtrada por "España", "última semana" y el sector correspondiente, ordenada por "más recientes", se capturaron las veinte primeras ofertas en orden de aparición. La captura se realizó entre el <strong>28 y el 29 de abril de 2026</strong>, cubriendo ofertas publicadas en los siete días anteriores. El margen de error estimado para las cifras agregadas es de ±7 puntos porcentuales al 95% de confianza.</p>

  <h3><span class="subn">3.2</span>Variables medidas</h3>
  <p>Cada oferta se evaluó con dos criterios independientes que corresponden a las dos disposiciones del artículo 5 de la directiva:</p>
  <ul>
    <li><strong>Transparencia del rango (apartado 5.1)</strong>: ¿publica la oferta una cifra o banda salarial concreta en su texto? Se etiqueta <code>SI</code> cuando aparece un rango numérico ("30.000-38.000 €/año") o una cifra clara, y <code>NO</code> cuando se recurre a expresiones vagas ("competitivo", "según valía") o a la omisión total. <strong>Esta es una métrica observable desde fuera.</strong></li>
    <li><strong>Petición del salario anterior (apartado 5.2)</strong>: ¿pregunta la oferta a la persona candidata por su salario actual o anterior, ya sea en el texto público o en el formulario nativo de aplicación de LinkedIn ("Easy Apply")? <strong>Esta métrica es parcialmente observable</strong>: del subconjunto de ofertas con Easy Apply, el formulario se puede revisar paso a paso sin enviarse; del subconjunto con aplicación a sistemas de selección externos a la empresa (ATS propios), <strong>a veces no es accesible sin registrarse</strong>.</li>
  </ul>
  <p>Se capturaron además variables auxiliares — sector, tamaño de empresa y comunidad autónoma del puesto — para permitir cruces y verificación independiente.</p>

  <h3><span class="subn">3.3</span>Lo que el dato mide y lo que no</h3>
  <p>La transparencia del rango (5.1) es completamente observable desde la oferta: lo que está publicado, está publicado, y todas las ofertas analizadas se han podido leer en su versión pública. La petición del salario anterior (5.2) sólo es parcialmente observable. La pregunta por el salario actual o anterior se materializa típicamente en cribas telefónicas de RRHH y en la primera entrevista — terreno que vive fuera del texto público y del formulario de aplicación. <strong>Por construcción metodológica, ningún análisis observacional de ofertas puede medir bien la métrica del 5.2.</strong> El informe lo declara explícitamente y lo presenta como zona que el 7 de junio obliga a vigilar por mecanismos distintos al análisis externo — Inspección de Trabajo, sindicatos, denuncia individual, encuestas a las personas candidatas.</p>

  <h3><span class="subn">3.4</span>Apertura del dataset</h3>
  <p>La metodología completa, los criterios de inclusión y exclusión y el listado verificable de las doscientas empresas analizadas — sin la columna de transparencia asociada a empresa concreta — se publican junto con el informe en la sala de prensa de SalarioJusto, en formato CSV abierto bajo licencia CC-BY. Cualquier periodista, sindicato, persona investigadora o ciudadana puede reproducir las cifras agregadas a partir de ese listado y de la metodología publicada. El dataset original con las dos columnas evaluativas (transparencia y petición de salario anterior por empresa) es interno: la decisión editorial es que el valor del informe está en el agregado, no en el escarnio individualizado.</p>
</section>

<section id="sec-4">
  <h2><span class="secn">04 · Resultados</span>Resultados por sector</h2>
  <p class="deck">El análisis evalúa 200 ofertas (cuota fija de 20 por sector) sobre dos métricas separadas: transparencia del rango y petición del salario anterior. Como se argumenta en la sección 3, la primera es observable y la segunda no lo es en la práctica — vive fuera del texto público.</p>

  <h3><span class="subn">4.1</span>Transparencia del rango por sector</h3>
  <div class="chart">
    ${buildSectorBarsSvg()}
    <div class="chart-cap">El sector con más ofertas transparentes (sanidad, 35%) es siete veces el más opaco (comercio al por menor, 5%). La media española queda en el 15%. Hostelería, banca, tecnología y administración pública se sitúan exactamente en la media; educación, construcción y consultoría caen al 10%.</div>
  </div>

  <table>
    <thead><tr><th>Sector</th><th class="num">Publica rango</th><th class="num">%</th></tr></thead>
    <tbody>
      <tr><td>Sanidad y atención hospitalaria</td><td class="num">7 / 20</td><td class="num">35%</td></tr>
      <tr><td>Industria y fabricación</td><td class="num">4 / 20</td><td class="num">20%</td></tr>
      <tr><td>Tecnología</td><td class="num">3 / 20</td><td class="num">15%</td></tr>
      <tr><td>Banca y servicios financieros</td><td class="num">3 / 20</td><td class="num">15%</td></tr>
      <tr><td>Hostelería</td><td class="num">3 / 20</td><td class="num">15%</td></tr>
      <tr><td>Administración pública</td><td class="num">3 / 20</td><td class="num">15%</td></tr>
      <tr><td>Servicios educativos</td><td class="num">2 / 20</td><td class="num">10%</td></tr>
      <tr><td>Construcción</td><td class="num">2 / 20</td><td class="num">10%</td></tr>
      <tr><td>Consultoría empresarial</td><td class="num">2 / 20</td><td class="num">10%</td></tr>
      <tr class="bot"><td>Comercio al por menor</td><td class="num">1 / 20</td><td class="num">5%</td></tr>
      <tr style="background:var(--cream-100);font-weight:700;"><td>Total</td><td class="num">30 / 200</td><td class="num">15%</td></tr>
    </tbody>
  </table>

  <h3><span class="subn">4.2</span>Hallazgos sectoriales</h3>

  <div class="pullbox">
    <h4>Sanidad lidera con un 35% — el doble de la media</h4>
    <p>De los siete casos transparentes en sanidad, cinco corresponden a empresas medianas o grandes y dos a entidades pequeñas — una fundación y una consultora de selección. El patrón sectorial es coherente con un mercado laboral marcado por la escasez crónica de profesionales de enfermería y medicina especializada, donde la transparencia funciona como mecanismo de captación de talento. Sanidad es además el único sector del análisis que duplica la media española, una distancia que sugiere que el efecto del 7 de junio será asimétrico: los sectores ya familiarizados con publicar rangos lo formalizarán; los sectores opacos tendrán que construir el reflejo desde cero.</p>
  </div>

  <div class="pullbox">
    <h4>Comercio al por menor cierra la lista con un 5%</h4>
    <p>Solo una de las veinte ofertas analizadas en el sector incluía cifra. Las otras diecinueve omitieron toda referencia salarial. Quince de las veinte redirigían a sistemas de aplicación externos (ATS propios), una proporción muy superior a la media del análisis. La opacidad del retail no es accidental: es consistente con un sector donde la rotación es alta, los procesos de contratación están altamente estandarizados y la sustituibilidad de los perfiles minimiza la presión competitiva por captar talento mediante transparencia. La distancia hasta la sanidad es de siete veces — el dato más extremo del análisis sectorial.</p>
  </div>

  <div class="chart">
    ${buildSizeCurveSvg()}
    <div class="chart-cap">El cruce de transparencia con tamaño de empresa dibuja una curva en forma de U. Las micro y las muy grandes publican más; las grandes nacionales (250-999) son el segmento más opaco del análisis.</div>
  </div>

  <div class="pullbox">
    <h4>La paradoja del tamaño · curva en U</h4>
    <p>Las microempresas (menos de 10 empleados) publican el rango en el 25% de las ofertas. Las pequeñas y medianas (10-249) bajan al 15%. Las grandes nacionales (250-999) tocan suelo con el 8%. Y las muy grandes (1.000+ empleados) repuntan al 16%.</p>
    <p>La explicación más plausible: las micro publican rango porque no tienen estructura de RRHH para esconderlo y compiten por talento desde el día uno; las grandes nacionales son las que más posibilidad tienen de jugar a la opacidad y tienen menos presión externa para cambiar; las multinacionales repuntan porque muchas ya operan bajo políticas globales (procedentes de Colorado, NY, California o normativa interna) que les obliga a publicar.</p>
  </div>

  <div class="pullbox" style="border-left-color:var(--red);">
    <h4>Punto ciego del 5.2 · lo que el análisis no puede ver</h4>
    <p>La pregunta sobre el salario anterior, prohibida taxativamente desde el 7 de junio por el artículo 5.2 de la directiva, se hace típicamente en la criba telefónica de RRHH ("antes de continuar, ¿cuáles son tus expectativas basadas en tu salario actual?") o en la primera entrevista. No vive en el texto de la oferta ni en el formulario de aplicación. Ningún análisis observacional de ofertas puede medirla.</p>
    <p>El 7 de junio no obliga a las empresas a publicar nada nuevo en sus ofertas: obliga a cambiar lo que se pregunta en privado durante la selección. La vigilancia depende de inspección, sindicatos y denuncia individual — y de los testimonios que la prensa pueda recoger.</p>
  </div>

  <h3><span class="subn">4.3</span>El proceso, no sólo la oferta</h3>
  <p>Más allá del texto del anuncio, la opacidad se extiende al proceso. El 38% de las ofertas analizadas (76 de 200) redirige a un sistema de selección externo a LinkedIn — el ATS propio de la empresa, normalmente Workday, Greenhouse o Personio — donde hay que abrir cuenta para presentar la candidatura.</p>
  <table>
    <thead><tr><th>Tipo de aplicación</th><th class="num">Ofertas</th><th class="num">% de la muestra</th></tr></thead>
    <tbody>
      <tr><td>Easy Apply de LinkedIn</td><td class="num">124</td><td class="num">62%</td></tr>
      <tr><td>ATS externo de la empresa</td><td class="num">76</td><td class="num">38%</td></tr>
    </tbody>
  </table>
  <p>El comercio al por menor (15 de 20 ofertas externas) y la administración pública (14 de 20) son los sectores donde el proceso vive más fuera de LinkedIn. Esta capa de opacidad procesal añade fricción a la candidatura y, una vez dentro de un ATS sin estandarizar, abre la puerta a preguntas que el 5.2 prohibirá desde junio.</p>
</section>

<section id="sec-5">
  <h2><span class="secn">05 · Mirada internacional</span>Qué pasó cuando otros legislaron</h2>
  <p class="deck">España no es la primera economía que regula la transparencia retributiva en la fase de contratación. Tres jurisdicciones de Estados Unidos llevan ya entre tres y cinco años con leyes equivalentes. Una jurisdicción de la Unión Europea, Alemania, transpone la misma directiva exactamente el mismo día. Y una economía vecina, el Reino Unido, sigue sin ley vigente — aunque esto suele asumirse al revés.</p>

  <div class="chart">
    ${buildTimelineSvg()}
    <div class="chart-cap">La ola legislativa de pay transparency es una historia de cinco años. Estados Unidos lleva la delantera con tres estados; España y Alemania entran juntas vía directiva europea; Reino Unido, contrariamente al supuesto extendido, sigue debatiendo sin texto legal aprobado.</div>
  </div>

  <h3><span class="subn">5.1</span>Estados Unidos · cinco años por delante</h3>
  <p><strong>Colorado</strong> fue el primer estado en obligar a publicar el rango salarial en cualquier oferta de empleo. Su <strong>Equal Pay for Equal Work Act</strong> (SB19-085) entró en vigor el <strong>1 de enero de 2021</strong>, y exige tres elementos en todo anuncio: tarifa horaria o salario (o un rango razonable), descripción de bonus y comisiones, y descripción de los beneficios. La ley además prohíbe expresamente preguntar por el historial salarial de la persona candidata — la misma prohibición que España adoptará en junio. Las sanciones van de 500 a 10.000 dólares por anuncio no conforme.</p>
  <p><strong>Nueva York</strong> legisló a nivel estatal el <strong>17 de septiembre de 2023</strong> (NY Labor Law §194-B). Exige rango de "buena fe" en toda oferta, promoción o transferencia, en empresas con cuatro o más empleados. La ley aplica a puestos físicamente en NY o remotos que reporten a un supervisor neoyorquino.</p>
  <p><strong>California</strong> entró el <strong>1 de enero de 2023</strong> con la SB 1162. Aplica a empresas con quince o más empleados y requiere que el "pay scale" aparezca en el cuerpo del anuncio — explícitamente prohibido esconderlo detrás de un enlace o un código QR. La ley también limita los rangos absurdamente amplios ("$15 a $200.000 la hora" para un puesto administrativo no satisface la norma).</p>

  <div class="pullbox">
    <h4>Lo que enseña Estados Unidos</h4>
    <p>Cinco años después de la primera ley, en Colorado el cumplimiento es alto pero no universal: las empresas que dependen de talento estatal cumplen, las que ven el estado como mercado secundario adoptan posturas defensivas (rangos extremadamente amplios, ofertas marcadas como "remoto excepto Colorado"). Es razonable esperar el mismo patrón en España: las empresas que compiten por talento publicarán rango aunque no estén obligadas; las que pueden permitirse no hacerlo, mantendrán la opacidad mientras la directiva se lo permita.</p>
  </div>

  <h3><span class="subn">5.2</span>Alemania · entra a la vez que España</h3>
  <p>Alemania transpone la Directiva 2023/970 en <strong>el mismo plazo que España</strong>: 7 de junio de 2026. Su ley actual, la <strong>Entgelttransparenzgesetz</strong> (EntgTranspG) de 2017, ya cubría parcialmente el derecho de la propia plantilla a conocer información retributiva comparada — pero solo en empresas con doscientos o más empleados.</p>
  <p>La transposición de la directiva amplía el régimen en dos direcciones: añade la prohibición de preguntar por el salario anterior, y traslada el derecho de información al momento previo a la contratación. La Comisión federal "para la Implementación de Bajo-Burocracia de la Directiva" publicó su informe final el <strong>24 de octubre de 2025</strong>, con un borrador legislativo previsto para el primer trimestre de 2026.</p>

  <h3><span class="subn">5.3</span>Reino Unido · sigue sin ley</h3>
  <p>Esta sección requiere una corrección frente al supuesto extendido. <strong>El Reino Unido no tiene ley de transparencia salarial en ofertas de empleo</strong>. La Equality Act 2010 cubre únicamente el reporte anual de la brecha de género para empresas con doscientos cincuenta o más empleados, y declara parcialmente inejecutables las cláusulas de confidencialidad salarial.</p>
  <p>En <strong>abril de 2025</strong>, el gobierno británico abrió un "call for evidence" para evaluar una posible reforma que incluiría rangos en ofertas y prohibición de preguntar el salario anterior — sin texto legal aprobado y sin calendario cerrado. La Employment Rights Act 2025 introduce "Equality Action Plans" voluntarios desde abril de 2026 (obligatorios desde primavera de 2027), pero estos planes no incluyen rangos en ofertas.</p>

  <div class="pullbox">
    <h4>Por qué importa</h4>
    <p>El framing tentador "España es el último país europeo en regular esto" no es exacto. Es más preciso decir: <strong>"Estados Unidos lleva cinco años por delante. España y Alemania entran juntas en junio. Reino Unido sigue debatiendo."</strong></p>
  </div>

  <h3><span class="subn">5.4</span>Tabla comparativa</h3>
  <table>
    <thead><tr><th>Jurisdicción</th><th>Rango en oferta obligatorio</th><th>Prohibido preguntar salario anterior</th><th>Vigor</th><th>Empresas afectadas</th></tr></thead>
    <tbody>
      <tr><td>Colorado</td><td>Sí, en el anuncio</td><td>Sí</td><td>1-ene-2021</td><td>Cualquiera con empleados en CO</td></tr>
      <tr><td>California</td><td>Sí, en el cuerpo del anuncio</td><td>(Ley separada)</td><td>1-ene-2023</td><td>15+ empleados</td></tr>
      <tr><td>New York State</td><td>Sí, en el anuncio</td><td>(Ley separada)</td><td>17-sep-2023</td><td>4+ empleados</td></tr>
      <tr style="background:var(--amber-bg);"><td><strong>España</strong></td><td>No literal — antes de entrevista por algún medio</td><td><strong>Sí</strong></td><td><strong>7-jun-2026</strong></td><td>Todas</td></tr>
      <tr style="background:var(--amber-bg);"><td>Alemania</td><td>Equivalente a España</td><td>Sí</td><td>7-jun-2026</td><td>Todas</td></tr>
      <tr><td>Reino Unido</td><td>No (en estudio desde 2025)</td><td>No (en estudio desde 2025)</td><td>—</td><td>—</td></tr>
    </tbody>
  </table>
</section>

<section id="sec-6">
  <h2><span class="secn">06 · Estándar más exigente</span>30 de cada 200 ya cumplen</h2>
  <p class="deck">De las 200 ofertas analizadas, 30 cumplen ya hoy con el nivel más alto de transparencia retributiva: publican un rango o cifra concreta en el anuncio. La directiva no llegará a ellas como cambio cultural, sólo como formalización de una práctica existente.</p>

  <h3><span class="subn">6.1</span>Reparto del subgrupo transparente</h3>
  <p>El reparto sectorial del subgrupo transparente refleja exactamente lo que ya muestra la sección 4: sanidad concentra siete de las treinta ofertas con rango (un 35% del sector); industria aporta cuatro; tecnología, banca, hostelería y administración pública aportan tres cada uno; educación, construcción y consultoría dos cada uno; comercio al por menor cierra con una sola oferta transparente. La distribución por tamaño se reparte así: 5 microempresas (XS), 5 pequeñas (S), 4 medianas (M), 3 grandes (L) y 13 muy grandes (XL). El reparto refleja la curva en U descrita en la sección 4.2 — las muy pequeñas y las muy grandes publican más, las grandes nacionales son el segmento más opaco.</p>

  <h3><span class="subn">6.2</span>Dos vías que llegan al mismo sitio</h3>
  <p>Predominan dos perfiles dentro del subgrupo transparente. El primero: empresas pequeñas o microempresas que necesitan atraer talento sin presupuesto de marca y que asumen la transparencia como ventaja competitiva. El segundo: filiales de multinacionales que ya operan bajo políticas globales de pay transparency procedentes de las normativas estatales estadounidenses (Colorado, California, Nueva York) o de la regulación interna de matrices alemanas. <strong>Las dos vías llegan al mismo resultado por motivos opuestos: las primeras por necesidad competitiva, las segundas por arrastre regulatorio externo.</strong> El segmento intermedio — empresas grandes nacionales con suficiente músculo para no necesitar competir por transparencia y sin obligación legal aún — es el que menos publica y el que más trabajo de adaptación tendrá entre hoy y el 7 de junio.</p>

  <h3><span class="subn">6.3</span>Verificación · listado completo de la muestra</h3>
  <p>SalarioJusto publica en la sala de prensa el listado completo de las <strong>200 empresas con nombre</strong>, en formato CSV abierto y como tabla expandible al final de este informe, con siete columnas: identificador de oferta (1-200), nombre de empresa, código y nombre del sector, comunidad autónoma del puesto, tamaño y fecha de captura. <strong>Lo que el listado no contiene es la etiqueta de transparencia asociada a cada empresa</strong>: ni si publicó rango, ni si pidió salario anterior. Esa información se publica únicamente como agregado por sector y por tamaño de empresa (las tablas de las secciones 4.1 y 6.1).</p>

  <p>La decisión es deliberada y responde a tres principios del proyecto editorial. El primero, <em>en esta entrega, mención de la excelencia antes que escarnio</em>: hoy —antes del 7 de junio de 2026— no publicar el rango todavía no incumple la ley, así que este informe no señala una a una a las 170 empresas que operan dentro de la legalidad vigente. Es una decisión editorial para esta foto inicial, no una renuncia: cuando el incumplimiento sea legalmente nítido, identificar a quien no cumpla es periodismo legítimo. El segundo, <em>transparencia metodológica máxima</em>: la lista de 200 nombres permite a cualquier periodista, sindicato, persona investigadora o ciudadana confirmar que las ofertas son reales, que los sectores están equilibrados y que el muestreo no se ha amañado para producir un titular. El tercero, <em>responsabilidad sobre la inferencia</em>: quien quiera saber si una empresa concreta de la muestra publicó o no su rango el día que se capturó la oferta, puede ir a su perfil de LinkedIn y comprobarlo en cinco segundos. En esta entrega no construimos el informe con esa información asociada a nombre.</p>

  <p><a href="#sec-anexo">Ver tabla expandible al final del informe</a> · <a href="https://salariojusto.es/sala-de-prensa.html">Sala de prensa de SalarioJusto</a></p>
</section>

<section id="sec-7">
  <h2><span class="secn">07 · Acción</span>Cómo prepararte para el 7 de junio</h2>

  <div class="pullbox">
    <h4>Si trabajas por cuenta ajena</h4>
    <p>Empieza por entender qué cambia exactamente para ti: la <a href="https://salariojusto.es/ley-transparencia-salarial-2026.html">guía de la Ley de Transparencia Salarial</a> explica tus derechos, los plazos y qué hacer si la empresa no cumple. SalarioJusto ha publicado además un Kit con diez plantillas redactadas para ejercer los derechos que entran en vigor el 7 de junio: pedir la banda salarial a tu empresa, reclamar atrasos por convenio, denunciar discriminación retributiva, y siete más. Todas con verificación contra fuente oficial (BOE, jurisprudencia del Tribunal Supremo) y referencias literales para que las puedas usar tal cual.</p>
    <p><a href="https://salariojusto.es/plantillas-transparencia-retributiva-2026.html">salariojusto.es/plantillas-transparencia-retributiva-2026.html</a></p>
  </div>

  <div class="pullbox">
    <h4>Si eres empresa</h4>
    <p>Hay tres cambios mínimos que pueden implementarse antes del 7 de junio:</p>
    <ol>
      <li><strong>Eliminar la pregunta del salario anterior</strong> de toda plantilla de proceso de selección — texto público, formulario de aplicación y guion de entrevista.</li>
      <li><strong>Redactar la banda salarial</strong> de cada vacante antes de publicarla, basada en criterios objetivos del puesto, no del perfil que se espera contratar.</li>
      <li><strong>Formar al equipo de selección</strong> en el matiz del 5.1: no es obligatorio publicar el rango en la oferta, pero sí entregárselo a la persona candidata antes de la entrevista.</li>
    </ol>
  </div>

  <div class="pullbox">
    <h4>Si eres prensa o sindicato</h4>
    <p>El dataset completo del análisis (200 ofertas anonimizadas respecto a su tratamiento) está disponible bajo CC-BY en la sala de prensa de SalarioJusto, junto con el documento de metodología y los criterios de evaluación. Para entrevistas o ampliaciones: <a href="mailto:prensa@salariojusto.es">prensa@salariojusto.es</a>.</p>
  </div>
</section>

<section id="sec-anexo">
  <h2><span class="secn">Anexo</span>Muestra completa · 200 empresas analizadas</h2>
  <p class="deck">Listado verificable de las 200 empresas que entraron en el análisis. No incluye la etiqueta de transparencia asociada a empresa concreta — esa columna se publica únicamente como agregado en las tablas de las secciones 4.1 y 6.1.</p>

  <details class="anexo" open>
    <summary>Ver / ocultar las 200 empresas (id · empresa · sector · CCAA · tamaño · fecha)</summary>
    <div class="anexo-body">
      <table>
        <thead><tr><th class="num">#</th><th>Empresa</th><th>Sector</th><th>Comunidad autónoma</th><th class="num">Tamaño</th><th class="num">Fecha</th></tr></thead>
        <tbody>
${tableRows}
        </tbody>
      </table>
    </div>
  </details>

  <p style="font-size:13px;color:var(--ink-lighter);margin-top:18px;">Descarga del CSV abierto: <a href="${csvHref}" download>Descargar el CSV de la muestra (200 filas)</a> · Licencia CC-BY 4.0 (atribución a SalarioJusto).</p>
</section>

</main>

<footer>
  <p class="footer-text">
    SalarioJusto · Herramienta gratuita para quien trabaja · Sin empresas detrás<br>
    Informe Transparencia retributiva en España · Publicado el 19 de mayo de 2026 · Datos: ofertas capturadas el 28-29 de abril de 2026
  </p>
  <div class="footer-rule"></div>
  <p class="footer-text">
    <a href="https://salariojusto.es/">salariojusto.es</a> ·
    <a href="https://salariojusto.es/sala-de-prensa.html">Sala de prensa</a> ·
    <a href="mailto:prensa@salariojusto.es">prensa@salariojusto.es</a>
  </p>
</footer>

<script>
(function () {
  var target = new Date('2026-06-07T00:00:00Z');
  var now = new Date();
  var diffMs = target.getTime() - now.getTime();
  var days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  var elNum = document.getElementById('countdown-num');
  var elLbl = document.getElementById('countdown-lbl');
  var elEye = document.getElementById('countdown-eyebrow');
  var elEyePost = document.getElementById('countdown-eyebrow-post');

  if (days > 1) {
    if (elNum) elNum.textContent = days;
    if (elLbl) elLbl.textContent = 'días hasta la entrada en vigor · 7 jun 2026';
    if (elEye) elEye.textContent = days + ' días';
    if (elEyePost) elEyePost.textContent = ' para la Directiva UE 2023/970';
  } else if (days === 1) {
    if (elNum) elNum.textContent = '1';
    if (elLbl) elLbl.textContent = 'día hasta la entrada en vigor · 7 jun 2026';
    if (elEye) elEye.textContent = '1 día';
  } else if (days === 0) {
    if (elNum) elNum.textContent = '0';
    if (elLbl) elLbl.textContent = 'la directiva entra en vigor hoy';
    if (elEye) elEye.textContent = 'hoy';
    if (elEyePost) elEyePost.textContent = ' entra en vigor la Directiva UE 2023/970';
  } else {
    var sinceDays = Math.abs(days);
    if (elNum) elNum.textContent = sinceDays;
    if (elLbl) elLbl.textContent = 'días desde la entrada en vigor · 7 jun 2026';
    if (elEye) elEye.textContent = sinceDays + ' días';
    if (elEyePost) elEyePost.textContent = ' desde la entrada en vigor de la Directiva UE 2023/970';
  }
})();
</script>

</body>
</html>
`;

fs.writeFileSync(outPath, html, 'utf8');
console.log('OK ·', outPath, '·', (html.length / 1024).toFixed(1), 'KB ·', rows.length, 'filas en anexo');
