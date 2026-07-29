#!/usr/bin/env node
/*
 * convenios-sync · Auditor de coherencia de convenios.
 *
 * Fuente de verdad = el filesystem (ficheros convenio-*.html + data/convenios/*.json).
 * Comprueba que los contadores y listas repartidos por la web siguen cuadrando.
 * Pensado para correr al añadir/quitar una landing de convenio (o en pre-commit).
 *
 * CANON DE CONTEO (decidido 28-jul-2026):
 *   - "convenios provinciales" = la cifra principal (fichas con ámbito territorial).
 *   - marcos sectoriales estatales = APARTE (convenio-hosteleria.html,
 *     convenio-limpieza-edificios-locales.html, convenio-tecnicos-espectaculos.html).
 *   - Total de fichas = provinciales + marcos (hoy 36 + 3 = 39).
 *
 * Uso:
 *   node scripts/audit/convenios-sync.js          # informe legible
 *   node scripts/audit/convenios-sync.js --quiet  # solo fallos
 *   Exit 1 si hay algún ❌ (contador incoherente o huérfano). Exit 0 si todo cuadra.
 *
 * Mapa completo de puntos: SYNC_POINTS.md (Mission Control).
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const QUIET = process.argv.includes('--quiet');

const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const exists = (f) => fs.existsSync(path.join(ROOT, f));

// ── 1. Descubrir las fichas (fuente de verdad) ──────────────────────────────
const fichas = fs.readdirSync(ROOT).filter((f) => /^convenio-.*\.html$/.test(f)).sort();
const isNoindex = (f) => /noindex/i.test(read(f));
const sectorOf = (f) => (f.match(/^convenio-([a-z]+)/) || [])[1] || '?';

// Marco sectorial estatal = ficha SIN ámbito territorial (bare-sector).
const MARCO_RE = /^convenio-(hosteleria|limpieza-edificios-locales|tecnicos-espectaculos)\.html$/;
const isMarco = (f) => MARCO_RE.test(f);

const noindex = fichas.filter(isNoindex);
const indexables = fichas.filter((f) => !noindex.includes(f));

const marcos = fichas.filter(isMarco);                 // estatales (aparte)
const provinciales = fichas.filter((f) => !isMarco(f)); // cifra principal
const provincialesIdx = provinciales.filter((f) => !noindex.includes(f));

const bySector = {};
for (const f of fichas) bySector[sectorOf(f)] = (bySector[sectorOf(f)] || 0) + 1;

// Provinciales por sector (todas, incl. noindex) → cuadra la tabla editorial.
const provBySector = {};
for (const f of provinciales) provBySector[sectorOf(f)] = (provBySector[sectorOf(f)] || 0) + 1;

// Provinciales indexables por sector → cuadra los links del mega-menú (no se enlaza lo noindex).
const provIdxBySector = {};
for (const f of provincialesIdx) provIdxBySector[sectorOf(f)] = (provIdxBySector[sectorOf(f)] || 0) + 1;

// Ámbitos/provincias únicos con landing (excluye marcos estatales)
const ambitos = new Set(
  provinciales.map((f) => f.replace(/^convenio-(hosteleria|limpieza|metal|construccion|oficinas)-/, '').replace(/\.html$/, ''))
);

const jsons = exists('data/convenios')
  ? fs.readdirSync(path.join(ROOT, 'data/convenios')).filter((f) => f.endsWith('.json'))
  : [];

const CANON = {
  total: fichas.length,
  indexables: indexables.length,
  noindex: noindex.length,
  provinciales: provinciales.length,
  marcos: marcos.length,
  sectores: Object.keys(bySector).length,
  ambitos: ambitos.size,
};

// ── 2. Utilidad de localización (archivo:línea de un patrón) ─────────────────
function findLine(file, regex) {
  if (!exists(file)) return null;
  const lines = read(file).split('\n');
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(regex);
    if (m) return { line: i + 1, value: m[1], text: lines[i].trim() };
  }
  return null;
}

const results = []; // {level:'ok'|'fail'|'warn'|'info', msg}
const push = (level, msg) => results.push({ level, msg });

// ── 3. CHECK A · coherencia sitemap ─────────────────────────────────────────
if (exists('sitemap.xml')) {
  const sm = read('sitemap.xml');
  const inSitemap = (f) => sm.includes('/' + f + '<') || sm.includes('/' + f + '"') || sm.includes('/' + f + '\n');
  const huérfanos = indexables.filter((f) => !inSitemap(f));
  const sobrantes = noindex.filter((f) => inSitemap(f));
  if (huérfanos.length) push('fail', `sitemap: ${huérfanos.length} ficha(s) indexable(s) NO están en sitemap.xml → ${huérfanos.join(', ')}`);
  else push('ok', 'sitemap: todas las fichas indexables están listadas');
  if (sobrantes.length) push('fail', `sitemap: ${sobrantes.length} ficha(s) noindex SÍ están en sitemap (no deberían) → ${sobrantes.join(', ')}`);
} else push('warn', 'sitemap.xml no encontrado');

// ── 4. CHECK B · contadores TOTALES (deben igualar el canon) ────────────────
// kind: 'total' (=todas las fichas) | 'indexables' | 'provinciales' | 'marcos'
const TOTAL_CHECKS = [
  ['index.html', /(\d+) convenios<\/strong> auditados contra BOE/, 'total', 'home · mega-footer'],
  ['index.html', /Ver los (\d+) convenios/, 'total', 'home · hero CTA'],
  ['index.html', /Directorio · (\d+) fichas/, 'total', 'home · eyebrow directorio'],
  ['index.html', /(\d+) fichas hoy, más en camino/, 'total', 'home · lede directorio'],
  ['convenios.html', /(\d+) convenios auditados · 6 sectores/, 'total', 'hub · hero badge'],
  ['convenios.html', /Convenios auditados<\/div><div class="stat-value">(\d+)</, 'total', 'hub · resumen'],
  ['convenios.html', /content="(\d+) convenios colectivos con tablas/, 'total', 'hub · meta description'],
  ['mapa-del-sitio.html', /(\d+) convenios colectivos auditados/, 'total', 'mapa · meta'],
  ['sobre.html', /(\d+) fichas de convenios provinciales/, 'total', 'sobre · autoría'],
  ['llms.txt', /(\d+) convenios indexables/, 'indexables', 'llms.txt · cobertura'],
];
for (const [file, rx, kind, label] of TOTAL_CHECKS) {
  const expected = CANON[kind];
  const hit = findLine(file, rx);
  if (!hit) { push('warn', `${label} (${file}): patrón no encontrado — ¿cambió el texto? revisar a mano`); continue; }
  const val = Number(hit.value);
  if (val === expected) push('ok', `${label}: ${val} ✔ (${file}:${hit.line})`);
  else push('fail', `${label}: dice ${val}, debería ser ${expected} → ${file}:${hit.line}`);
}

// ── 5. CHECK C · verificador de la home (CONVENIO_INDEX) ─────────────────────
if (exists('index.html')) {
  const idx = read('index.html');
  const block = idx.match(/const CONVENIO_INDEX\s*=\s*\[([\s\S]*?)\];/);
  if (block) {
    const entries = (block[1].match(/\bid:\s*'/g) || []).length;
    push('info', `verificador CONVENIO_INDEX: ${entries} fichas con datos JSON de ${CANON.total} (cobertura ${Math.round((entries / CANON.total) * 100)}%). Ampliar = conectar más JSON gemelos.`);
  } else push('warn', 'no se encontró CONVENIO_INDEX en index.html');
}

// ── 6. CHECK D · tabla "Cobertura editorial" de sobre.html (por sector) ──────
// La columna "Fichas" de cada sector debe igualar las fichas PROVINCIALES de ese
// sector (los marcos estatales van aparte, en la nota bajo la tabla). Este era el
// bug histórico: la tabla sumaba 28 mientras el texto decía 39.
const SOBRE_SECTOR_MAP = [
  ['Hostelería', 'hosteleria'],
  ['Limpieza de Edificios y Locales', 'limpieza'],
  ['Metal', 'metal'],
  ['Oficinas y Despachos', 'oficinas'],
  ['Construcción', 'construccion'],
];
if (exists('sobre.html')) {
  const html = read('sobre.html');
  const tStart = html.indexOf('id="cobertura"');
  const region = tStart >= 0 ? html.slice(tStart, html.indexOf('</table>', tStart)) : '';
  let sobreSum = 0;
  let sobreOk = true;
  for (const [label, sector] of SOBRE_SECTOR_MAP) {
    const expected = provBySector[sector] || 0;
    const m = region.match(new RegExp('>' + label + '</td>[\\s\\S]*?text-align:right[^>]*>\\s*(\\d+)\\s*<'));
    if (!m) { push('warn', `sobre · cobertura: fila "${label}" no encontrada — revisar tabla a mano`); sobreOk = false; continue; }
    const val = Number(m[1]);
    sobreSum += val;
    if (val !== expected) { push('fail', `sobre · cobertura "${label}": dice ${val}, debería ser ${expected} (provinciales)`); sobreOk = false; }
  }
  if (sobreOk) push('ok', `sobre · cobertura: filas por sector cuadran · suman ${sobreSum} provinciales (+ ${CANON.marcos} marcos = ${CANON.total})`);
  if (sobreSum && sobreSum !== CANON.provinciales) push('fail', `sobre · cobertura: la tabla suma ${sobreSum} provinciales, deberían ser ${CANON.provinciales}`);
} else push('warn', 'sobre.html no encontrado');

// ── 7. CHECK E · mega-menú de la home (links provinciales por sector) ────────
// Cada columna del mega-menú enlaza SOLO fichas provinciales indexables (lo noindex
// no se enlaza). El nº de links por sector debe igualar provIdxBySector. Cazó en su
// día el link ausente de Limpieza Alicante.
if (exists('index.html')) {
  const idx = read('index.html');
  const mStart = idx.indexOf('class="mega-menu"');
  const region = mStart >= 0 ? idx.slice(mStart, idx.indexOf('mega-footer', mStart)) : '';
  if (!region) push('warn', 'mega-menú no encontrado en index.html');
  else {
    let megaOk = true;
    for (const sector of ['hosteleria', 'limpieza', 'metal', 'oficinas', 'construccion']) {
      const expected = provIdxBySector[sector] || 0;
      // /convenio-<sector>-<ambito>.html — el marco (p.ej. limpieza-edificios-locales) no casa por el guion.
      const links = (region.match(new RegExp('href="/convenio-' + sector + '-[a-z]+\\.html"', 'g')) || []).length;
      if (links !== expected) { push('fail', `mega-menú "${sector}": ${links} link(s) provincial(es), deberían ser ${expected} → revisar columna`); megaOk = false; }
    }
    if (megaOk) push('ok', `mega-menú: links provinciales por sector cuadran (${provincialesIdx.length} provinciales indexables enlazados)`);
  }
}

// ── 8. INFO · contadores por-sector / provincias (canon editorial pendiente) ─
// No fallan: su cifra "oficial" la debe fijar Telmo. Se listan para revisión.
const EDITORIAL = [
  ['salarios.html', /(\d+) provincias auditadas/g, 'salarios · provincias auditadas'],
  ['convenio-hosteleria.html', /(\d+) provincias auditadas/g, 'pilar hostelería · provincias'],
  ['convenio-limpieza-edificios-locales.html', /(\d+) provincias auditadas/g, 'pilar limpieza · provincias'],
];
const editorialVals = [];
for (const [file, rx, label] of EDITORIAL) {
  if (!exists(file)) continue;
  const vals = [...read(file).matchAll(rx)].map((m) => m[1]);
  if (vals.length) editorialVals.push(`${label}: ${[...new Set(vals)].join(', ')}`);
}

// ── 9. Informe ──────────────────────────────────────────────────────────────
const fails = results.filter((r) => r.level === 'fail');
const warns = results.filter((r) => r.level === 'warn');
const C = { ok: '✅', fail: '❌', warn: '⚠️ ', info: 'ℹ️ ' };

console.log('\n══ convenios-sync · coherencia de convenios ══\n');
console.log('Fuente de verdad (filesystem):');
console.log(`  📐 CIFRA CANÓNICA: ${CANON.provinciales} convenios provinciales + ${CANON.marcos} marcos estatales = ${CANON.total} fichas`);
console.log(`     Provinciales por sector: ${Object.entries(provBySector).map(([s, n]) => `${s} ${n}`).join(' · ')}`);
console.log(`     Marcos estatales: ${marcos.map((f) => f.replace(/^convenio-|\.html$/g, '')).join(', ')}`);
console.log(`  ${CANON.indexables} indexables · ${CANON.noindex} noindex · ${CANON.sectores} sectores · ${CANON.ambitos} ámbitos con landing`);
console.log('  Por sector (todas):', Object.entries(bySector).map(([s, n]) => `${s} ${n}`).join(' · '));
console.log(`  data/convenios: ${jsons.length} JSON\n`);

for (const r of results) {
  if (QUIET && (r.level === 'ok' || r.level === 'info')) continue;
  console.log(`  ${C[r.level]} ${r.msg}`);
}

if (!QUIET && editorialVals.length) {
  console.log('\n  ── Contadores editoriales por revisar (fija el canon en SYNC_POINTS) ──');
  for (const e of editorialVals) console.log(`  ℹ️  ${e}`);
}

console.log(`\n${fails.length ? '❌' : '✅'} ${fails.length} incoherencia(s) · ${warns.length} aviso(s)\n`);
process.exit(fails.length ? 1 : 0);
