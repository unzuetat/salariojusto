#!/usr/bin/env node
/*
 * faq-sync · La FAQ visible manda sobre el FAQPage del JSON-LD.
 *
 * Google exige que los datos estructurados reflejen contenido visible. En
 * octubre de 2026 se midió que en 42 fichas el bloque FAQPage declaraba
 * preguntas que nadie podía leer en la página (y en 6 no había FAQ visible
 * en absoluto). Este script:
 *
 *   --check (por defecto)  compara, ficha a ficha, las preguntas del FAQPage
 *                          con las de la sección visible. Exit 1 si difieren.
 *   --fix                  1) si la ficha no tiene FAQ visible pero sí FAQPage,
 *                             crea la sección «Preguntas frecuentes» (formato
 *                             de hostelería Madrid: h2#faq + h3/p) delante de
 *                             «Fuentes», con las preguntas y respuestas que ya
 *                             estaban escritas en el JSON-LD;
 *                          2) regenera el FAQPage a partir de la FAQ visible
 *                             (h3 + párrafos, o details/summary);
 *                          3) si la ficha tiene FAQ visible y ningún FAQPage,
 *                             crea el bloque detrás del último JSON-LD del
 *                             <head> (añadido el 8-oct-2026 para Málaga).
 *   --root <dir>           carpeta con las fichas (por defecto, la raíz del repo).
 *   --ficha <archivo>      una sola ficha.
 *
 * No inventa contenido: solo mueve texto que ya existe en la ficha.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const FIX = args.includes('--fix');
const rootIdx = args.indexOf('--root');
const ROOT = rootIdx >= 0 ? path.resolve(args[rootIdx + 1]) : path.resolve(__dirname, '..', '..');
const fichaIdx = args.indexOf('--ficha');
const SOLO = fichaIdx >= 0 ? path.basename(args[fichaIdx + 1]) : null;

const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', iquest: '¿', iexcl: '¡', aacute: 'á', eacute: 'é', iacute: 'í', oacute: 'ó', uacute: 'ú', ntilde: 'ñ', Aacute: 'Á', Eacute: 'É', Iacute: 'Í', Oacute: 'Ó', Uacute: 'Ú', Ntilde: 'Ñ', uuml: 'ü', ccedil: 'ç', euro: '€', middot: '·', laquo: '«', raquo: '»', ndash: '–', mdash: '—', hellip: '…', rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”' };
const decode = (s) => s
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&([a-zA-Z]+);/g, (m, e) => (e in ENT ? ENT[e] : m));
const strip = (html) => decode(
  html
    .replace(/<\/li>\s*/g, '; ')
    .replace(/<\/(p|div|tr|h[1-6])>\s*/g, ' ')
    .replace(/<br\s*\/?>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
).replace(/\s+/g, ' ').replace(/\s+([;,.])/g, '$1').replace(/([.!?…])\s*;\s*/g, '$1 ').replace(/;\s*$/, '').trim();
const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ── FAQ visible ──────────────────────────────────────────────────────────────
function faqVisible(html) {
  const start = html.search(/<h2[^>]*id="faq"[^>]*>|<h2[^>]*>\s*Preguntas frecuentes\s*<\/h2>/i);
  if (start < 0) return null;
  const h2End = html.indexOf('</h2>', start) + 5;
  const rest = html.slice(h2End);
  const relEnd = rest.search(/<h2[\s>]|<\/section>|<\/main>|<footer/);
  const end = relEnd < 0 ? html.length : h2End + relEnd;
  const sec = html.slice(h2End, end);
  const pairs = [];
  if (/<h3[\s>]/.test(sec)) {
    const chunks = sec.split(/<h3[^>]*>/).slice(1);
    for (const c of chunks) {
      const i = c.indexOf('</h3>');
      if (i < 0) continue;
      const q = strip(c.slice(0, i));
      const a = strip(c.slice(i + 5));
      if (q) pairs.push({ q, a });
    }
  } else if (/<details[\s>]/.test(sec)) {
    for (const m of sec.matchAll(/<details[^>]*>([\s\S]*?)<\/details>/g)) {
      const sm = m[1].match(/<summary[^>]*>([\s\S]*?)<\/summary>/);
      if (!sm) continue;
      const q = strip(sm[1]);
      const a = strip(m[1].replace(sm[0], ''));
      if (q) pairs.push({ q, a });
    }
  }
  return { start, end, pairs };
}

// ── FAQPage del JSON-LD ──────────────────────────────────────────────────────
const SCRIPT_RE = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
function faqSchema(html) {
  for (const m of html.matchAll(SCRIPT_RE)) {
    let obj;
    try { obj = JSON.parse(m[1]); } catch (e) { continue; }
    const nodes = Array.isArray(obj) ? obj : obj['@graph'] ? obj['@graph'] : [obj];
    const node = nodes.find((n) => n && n['@type'] === 'FAQPage');
    if (node) return { raw: m[0], inner: m[1], obj, node, pairs: (node.mainEntity || []).map((q) => ({ q: String(q.name || '').trim(), a: String((q.acceptedAnswer || {}).text || '').trim() })) };
  }
  return null;
}
function withSchema(html, schema, pairs) {
  schema.node.mainEntity = pairs.map((p) => ({ '@type': 'Question', name: p.q, acceptedAnswer: { '@type': 'Answer', text: p.a } }));
  const json = JSON.stringify(schema.obj, null, 2);
  return html.replace(schema.raw, '<script type="application/ld+json">' + json + '</script>');
}
// FAQPage nuevo cuando la ficha tiene FAQ visible y ningún bloque: se coloca
// detrás del último <script type="application/ld+json"> del <head> (el
// BreadcrumbList en todas las fichas) con la misma sangría. Sin <head> con
// JSON-LD no se inventa sitio: devuelve null y el check sigue en rojo.
function insertSchema(html, pairs) {
  const head = html.indexOf('</head>');
  if (head < 0) return null;
  let last = null;
  for (const m = /<script type="application\/ld\+json">[\s\S]*?<\/script>/g, r = m; ;) { const x = r.exec(html); if (!x || x.index > head) break; last = x; }
  if (!last) return null;
  const lineStart = html.lastIndexOf('\n', last.index) + 1;
  const indent = html.slice(lineStart, last.index).match(/^[ \t]*/)[0];
  const obj = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: pairs.map((p) => ({ '@type': 'Question', name: p.q, acceptedAnswer: { '@type': 'Answer', text: p.a } })) };
  const json = JSON.stringify(obj, null, 2).split('\n').map((l, i) => (i ? indent + l : l)).join('\n');
  const at = last.index + last[0].length;
  return html.slice(0, at) + '\n' + indent + '<script type="application/ld+json">' + json + '</script>' + html.slice(at);
}

// ── Sección visible nueva (solo cuando no existe) ────────────────────────────
function insertSection(html, pairs) {
  const m = html.match(/^([ \t]*)<h2[^>]*id="fuentes"[^>]*>|^([ \t]*)<h2[^>]*>\s*(Fuentes|Marco legal)/m);
  if (!m) return null;
  const indent = (m[1] !== undefined ? m[1] : m[2]) || '';
  const block = [`${indent}<h2 id="faq">Preguntas frecuentes</h2>`, '']
    .concat(pairs.flatMap((p) => [`${indent}  <h3>${escapeHtml(p.q)}</h3>`, `${indent}  <p>${escapeHtml(p.a)}</p>`, '']))
    .join('\n');
  return html.slice(0, m.index) + block + '\n' + html.slice(m.index);
}

// ── Recorrido ────────────────────────────────────────────────────────────────
const fichas = fs.readdirSync(ROOT).filter((f) => /^convenio-.*\.html$/.test(f) && (!SOLO || f === SOLO)).sort();
let mismatches = 0, fixed = 0, created = 0, schemed = 0;
for (const f of fichas) {
  const p = path.join(ROOT, f);
  let html = fs.readFileSync(p, 'utf8');
  let vis = faqVisible(html);
  const sch = faqSchema(html);
  if (!sch && !(vis && vis.pairs.length)) continue; // sin FAQ de ningún tipo: nada que sincronizar
  if (FIX) {
    if ((!vis || !vis.pairs.length) && sch && sch.pairs.length) {
      const out = insertSection(html, sch.pairs);
      if (!out) { console.log(`  ✗ ${f}: sin FAQ visible y sin encabezado «Fuentes» donde insertarla`); mismatches++; continue; }
      html = out; vis = faqVisible(html); created++;
    }
    if (vis && vis.pairs.length && sch) {
      const same = sch.pairs.length === vis.pairs.length && sch.pairs.every((x, i) => x.q === vis.pairs[i].q && x.a === vis.pairs[i].a);
      if (!same) { html = withSchema(html, sch, vis.pairs); fixed++; }
    } else if (vis && vis.pairs.length && !sch) {
      const out = insertSchema(html, vis.pairs);
      if (!out) { console.log(`  ✗ ${f}: FAQ visible sin FAQPage y sin JSON-LD en <head> donde crearlo`); mismatches++; continue; }
      html = out; schemed++;
    }
    fs.writeFileSync(p, html);
  }
  // comprobación (tras el fix, o en modo check)
  const vis2 = faqVisible(html), sch2 = faqSchema(html);
  const vq = (vis2 ? vis2.pairs : []).map((x) => x.q), sq = (sch2 ? sch2.pairs : []).map((x) => x.q);
  const faltan = sq.filter((q) => !vq.includes(q));
  const sobran = vq.filter((q) => !sq.includes(q));
  if (faltan.length || sobran.length || (!sch2 && vq.length)) {
    mismatches++;
    console.log(`  ✗ ${f}: visible ${vq.length} · schema ${sq.length}${faltan.length ? ` · en schema y no visibles: ${faltan.length}` : ''}${sobran.length ? ` · visibles y no en schema: ${sobran.length}` : ''}${!sch2 && vq.length ? ' · sin FAQPage' : ''}`);
  }
}
if (FIX) console.log(`\n  secciones FAQ creadas: ${created} · FAQPage regenerados: ${fixed} · FAQPage creados: ${schemed}`);
console.log(mismatches ? `\n❌ ${mismatches} ficha(s) con FAQ visible ≠ FAQPage` : `\n✅ FAQ visible = FAQPage en las ${fichas.length} fichas con FAQ`);
process.exit(mismatches ? 1 : 0);
