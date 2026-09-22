/**
 * Inyecta el snippet de Ahrefs Web Analytics en el <head> de las páginas públicas.
 * Idempotente: si la página ya lo lleva, no la toca.
 *
 * Ancla: la línea de AdSense, presente en todas las páginas públicas y siempre
 * dentro del <head>. El fichero de verificación de Search Console no la tiene
 * y queda fuera a propósito.
 *
 * Uso: node scripts/inject-ahrefs.js [--dry]
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DRY = process.argv.includes('--dry');

const SNIPPET = '  <!-- Ahrefs Web Analytics -->\n' +
  '  <script src="https://analytics.ahrefs.com/analytics.js" data-key="1AxgYAQEZ6Pd6cxSONX20g" async></script>';

const MARCA = 'analytics.ahrefs.com';
const ANCLA = /^.*adsbygoogle\.js.*$/m;

// Los `_preview-*.html` y `_og/` están en .gitignore: no llegan a producción.
const paginas = fs.readdirSync(ROOT)
  .filter(f => f.endsWith('.html') && !f.startsWith('_'))
  .sort();

let inyectadas = 0, yaEstaban = 0, sinAncla = [];

for (const nombre of paginas) {
  const ruta = path.join(ROOT, nombre);
  const html = fs.readFileSync(ruta, 'utf8');

  if (html.includes(MARCA)) { yaEstaban++; continue; }

  const m = html.match(ANCLA);
  if (!m) { sinAncla.push(nombre); continue; }

  const salida = html.replace(ANCLA, `${m[0]}\n${SNIPPET}`);
  if (!DRY) fs.writeFileSync(ruta, salida);
  inyectadas++;
}

console.log(`${DRY ? '[dry] ' : ''}Ahrefs Web Analytics`);
console.log(`  inyectadas:  ${inyectadas}`);
console.log(`  ya la tenían: ${yaEstaban}`);
if (sinAncla.length) {
  console.log(`  sin ancla (no tocadas): ${sinAncla.join(', ')}`);
}
