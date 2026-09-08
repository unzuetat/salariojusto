#!/usr/bin/env node
/**
 * sj-og — asigna una miniatura social (og:image / twitter:image) a una landing.
 *
 * Convención: cada landing <slug>.html usa la imagen og-cards/<slug>.png.
 * El script coloca la imagen ahí e inyecta/actualiza las meta en el HTML,
 * de forma idempotente (si ya existen, las reemplaza).
 *
 * Uso:
 *   node scripts/sj-og.mjs <slug|archivo.html> [ruta-imagen | --last] [--commit]
 *
 * Ejemplos:
 *   node scripts/sj-og.mjs convenio-metal-gipuzkoa --last
 *   node scripts/sj-og.mjs convenio-metal-sevilla ~/Downloads/mi-card.png --commit
 *   node scripts/sj-og.mjs convenio-hosteleria-baleares.html ~/Desktop/card.jpg
 *
 * --last   : usa la imagen más reciente de ~/Descargas (Downloads).
 * --commit : hace git add + commit del HTML + la imagen.
 *
 * Requisitos: macOS `sips` (nativo) para leer dimensiones y convertir a PNG.
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ROOT = execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim();
const BASE_URL = 'https://salariojusto.es';
const args = process.argv.slice(2);

if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
  console.log('Uso: node scripts/sj-og.mjs <slug|archivo.html> [ruta-imagen | --last] [--commit]');
  process.exit(0);
}

const doCommit = args.includes('--commit');
const useLast = args.includes('--last');
const positional = args.filter((a) => !a.startsWith('--'));

// 1) Resolver el HTML de la landing
let slug = positional[0].replace(/\.html$/, '');
const htmlPath = path.join(ROOT, `${slug}.html`);
if (!fs.existsSync(htmlPath)) {
  console.error(`❌ No existe ${slug}.html en la raíz del repo.`);
  process.exit(1);
}

// 2) Resolver la imagen de origen
let srcImg = positional[1];
if (useLast || !srcImg) {
  const dl = path.join(os.homedir(), 'Downloads');
  const imgs = fs
    .readdirSync(dl)
    .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
    .map((f) => ({ f, t: fs.statSync(path.join(dl, f)).mtimeMs }))
    .sort((a, b) => b.t - a.t);
  if (imgs.length === 0) {
    console.error('❌ No hay imágenes en ~/Downloads.');
    process.exit(1);
  }
  srcImg = path.join(dl, imgs[0].f);
  console.log(`📥 Última descarga: ${imgs[0].f}`);
}
srcImg = srcImg.replace(/^~/, os.homedir());
if (!fs.existsSync(srcImg)) {
  console.error(`❌ No existe la imagen: ${srcImg}`);
  process.exit(1);
}

// 3) Colocar en og-cards/<slug>.png (convierte a PNG si hace falta, vía sips)
const outDir = path.join(ROOT, 'og-cards');
fs.mkdirSync(outDir, { recursive: true });
const destRel = `og-cards/${slug}.png`;
const destAbs = path.join(ROOT, destRel);

if (/\.png$/i.test(srcImg)) {
  fs.copyFileSync(srcImg, destAbs);
} else {
  try {
    execSync(`sips -s format png ${JSON.stringify(srcImg)} --out ${JSON.stringify(destAbs)}`, { stdio: 'ignore' });
  } catch {
    console.error('❌ No pude convertir a PNG (¿sips disponible?). Copia la imagen como .png y reintenta.');
    process.exit(1);
  }
}

// 4) Leer dimensiones reales (sips); si falla, se omiten width/height
let w = null, h = null;
try {
  const out = execSync(`sips -g pixelWidth -g pixelHeight ${JSON.stringify(destAbs)}`, { encoding: 'utf8' });
  w = (out.match(/pixelWidth:\s*(\d+)/) || [])[1] || null;
  h = (out.match(/pixelHeight:\s*(\d+)/) || [])[1] || null;
} catch { /* sin dims */ }

// 5) Inyectar/actualizar meta en el HTML (idempotente)
let html = fs.readFileSync(htmlPath, 'utf8');
const imgUrl = `${BASE_URL}/${destRel}`;
const set = (re, tag) => {
  if (re.test(html)) html = html.replace(re, tag);
  else return false;
  return true;
};

// og:image
if (!set(/<meta property="og:image" content="[^"]*">/, `<meta property="og:image" content="${imgUrl}">`)) {
  html = html.replace(/(<meta property="og:title"[^>]*>)/, `$1\n  <meta property="og:image" content="${imgUrl}">`);
}
// og:image:width / height
html = html.replace(/\s*<meta property="og:image:width"[^>]*>/g, '');
html = html.replace(/\s*<meta property="og:image:height"[^>]*>/g, '');
if (w && h) {
  html = html.replace(
    /(<meta property="og:image" content="[^"]*">)/,
    `$1\n  <meta property="og:image:width" content="${w}">\n  <meta property="og:image:height" content="${h}">`
  );
}
// twitter:image
if (!set(/<meta name="twitter:image" content="[^"]*">/, `<meta name="twitter:image" content="${imgUrl}">`)) {
  html = html.replace(/(<meta name="twitter:card"[^>]*>)/, `$1\n  <meta name="twitter:image" content="${imgUrl}">`);
}

fs.writeFileSync(htmlPath, html);

console.log(`✅ ${destRel}  (${w || '?'}×${h || '?'})`);
console.log(`   og:image + twitter:image → ${imgUrl}`);
if (w && h && !(w === '1200' && h === '630')) {
  console.log(`   ⚠️  ratio ${w}×${h}: X (summary_large_image) recorta a ~1.91:1. Ideal 1200×630.`);
}

// 6) Commit opcional
if (doCommit) {
  execSync(`git -C ${JSON.stringify(ROOT)} add ${JSON.stringify(destRel)} ${JSON.stringify(slug + '.html')}`, { stdio: 'inherit' });
  execSync(`git -C ${JSON.stringify(ROOT)} commit -q -m "feat(og): miniatura social para ${slug}"`, { stdio: 'inherit' });
  console.log('   📦 commit hecho (sin push).');
} else {
  console.log(`   Para publicar: git add ${destRel} ${slug}.html && commit + push`);
}
