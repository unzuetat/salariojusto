#!/usr/bin/env node
/*
 * convenios-sync · Auditor de coherencia de convenios.
 *
 * Fuente de verdad = el filesystem (ficheros convenio-*.html + data/convenios/*.json).
 * Comprueba que los contadores y listas repartidos por la web siguen cuadrando.
 * Pensado para correr al añadir/quitar una landing de convenio (o en pre-commit).
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

const noindex = fichas.filter(isNoindex);
const indexables = fichas.filter((f) => !noindex.includes(f));
const bySector = {};
for (const f of fichas) bySector[sectorOf(f)] = (bySector[sectorOf(f)] || 0) + 1;

// Ámbitos/provincias únicos con landing (excluye pilares estatales y espectáculos)
const ambitos = new Set(
  fichas
    .filter((f) => !/^convenio-(hosteleria|limpieza-edificios-locales|tecnicos-espectaculos)\.html$/.test(f))
    .map((f) => f.replace(/^convenio-(hosteleria|limpieza|metal|construccion|oficinas)-/, '').replace(/\.html$/, ''))
);

const jsons = exists('data/convenios')
  ? fs.readdirSync(path.join(ROOT, 'data/convenios')).filter((f) => f.endsWith('.json'))
  : [];

const CANON = {
  total: fichas.length,
  indexables: indexables.length,
  noindex: noindex.length,
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
// expected: 'total' (=todas las fichas) | 'indexables' (=solo indexables)
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

// ── 6. INFO · contadores por-sector / provincias (canon editorial pendiente) ─
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

// ── 7. Informe ──────────────────────────────────────────────────────────────
const fails = results.filter((r) => r.level === 'fail');
const warns = results.filter((r) => r.level === 'warn');
const C = { ok: '✅', fail: '❌', warn: '⚠️ ', info: 'ℹ️ ' };

console.log('\n══ convenios-sync · coherencia de convenios ══\n');
console.log('Fuente de verdad (filesystem):');
console.log(`  ${CANON.total} fichas · ${CANON.indexables} indexables · ${CANON.noindex} noindex · ${CANON.sectores} sectores · ${CANON.ambitos} ámbitos con landing`);
console.log('  Por sector:', Object.entries(bySector).map(([s, n]) => `${s} ${n}`).join(' · '));
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
