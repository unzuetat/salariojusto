#!/usr/bin/env node
/*
 * secciones-convenios · Auditor de secciones canónicas de las fichas de convenio.
 *
 * PARA QUÉ: las fichas se construyen clonando otra ficha. Cuando se clona una
 * reciente en vez del canon, se heredan sus ausencias y el patrón se degrada en
 * silencio. Pasó el 22-sep-2026: el bloque "Quién audita esto" se había caído de
 * las 6 fichas de comercio (todas menos Madrid) sin que ningún script lo viera.
 *
 * CÓMO DECIDE QUÉ ES CANON — dos fuentes, nunca la opinión de quien lo ejecuta:
 *
 *   1. NORMAS ESCRITAS del proyecto (prescriptivas, da igual la adopción):
 *      el sello "Verificado contra [boletín]" y el footer legal con Privacidad /
 *      Aviso legal / Contacto son obligatorios por decisión tomada, no por
 *      costumbre. Van marcados `norma: true` y fallan aunque las lleve el 10 %.
 *
 *   2. ADOPCIÓN MEDIDA en el corpus (descriptiva, se recalcula en cada pasada):
 *      un bloque que llevan ≥95 % de las fichas es infraestructura: si falta en
 *      una, es una regresión. Entre 60 % y 95 % es canon mayoritario: se avisa.
 *      Por debajo del 60 % es práctica emergente: solo se informa, porque exigir
 *      a 59 fichas algo que hacen 5 sería inventarse un canon que no existe.
 *
 *   El umbral se aplica sobre la adopción REAL de cada ejecución, así que el
 *   auditor se recalibra solo según evoluciona el corpus. Si una práctica
 *   emergente cuaja, empieza a exigirse sin tocar el script.
 *
 * Uso:
 *   node scripts/audit/secciones-convenios.js                 # informe completo
 *   node scripts/audit/secciones-convenios.js --quiet         # solo fallos
 *   node scripts/audit/secciones-convenios.js --ficha <arch>  # una sola ficha
 *   node scripts/audit/secciones-convenios.js --deuda         # qué falta y a quién
 *
 *   Exit 1 si falta una norma escrita o hay una regresión. Exit 0 si no.
 *
 * Relacionado: convenios-sync.js (contadores), legal-claims.js (citas jurídicas).
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const argv = process.argv.slice(2);
const QUIET = argv.includes('--quiet');
const DEUDA = argv.includes('--deuda');
const UNA = (() => { const i = argv.indexOf('--ficha'); return i >= 0 ? argv[i + 1] : null; })();

const C = { r: '\x1b[31m', g: '\x1b[32m', y: '\x1b[33m', d: '\x1b[90m', b: '\x1b[1m', x: '\x1b[0m' };

// ── Umbrales de adopción ────────────────────────────────────────────────────
const UMBRAL_REGRESION = 0.95; // lo llevan casi todas → si falta, es regresión
const UMBRAL_CANON = 0.60;     // mayoría clara → aviso

// ── Bloques a verificar ─────────────────────────────────────────────────────
// `norma: true` = obligatorio por decisión escrita del proyecto, sin importar
// la adopción. El resto se clasifica por lo que hace el corpus.
const BLOQUES = [
  { id: 'canonical',   nombre: 'Canonical',              re: /rel="canonical"/,            que: 'evita duplicados en el índice' },
  { id: 'breadcrumb',  nombre: 'Breadcrumb visible',     re: /class="breadcrumb"/,         que: 'ruta de vuelta al directorio' },
  { id: 'schema-bc',   nombre: 'Schema BreadcrumbList',  re: /BreadcrumbList/,             que: 'migas en el resultado de búsqueda' },
  { id: 'schema-faq',  nombre: 'Schema FAQPage',         re: /"FAQPage"/,                  que: 'rich snippet y citabilidad por IA' },
  { id: 'footer',      nombre: 'Footer legal',           re: /aviso-legal\.html/,          que: 'LSSI + RGPD + AdSense', norma: true },
  { id: 'analytics',   nombre: 'Ahrefs Analytics',       re: /analytics\.ahrefs\.com/,     que: 'medición de la ficha' },
  { id: 'sello',       nombre: 'Sello ✓ Verificado',     re: /eeat-sello/,                 que: 'norma T10: boletín + fecha a la vista', norma: true },
  { id: 'firma',       nombre: '"Quién audita esto"',    re: /eeat-firma/,                 que: 'E-E-A-T: quién responde de la cifra' },
  { id: 'faq',         nombre: 'Sección FAQ',            re: /id="faq"/,                   que: 'responde la duda concreta' },
  { id: 'related',     nombre: 'Convenios relacionados', re: /class="related"/,            que: 'teje el clúster sector × provincia' },
  { id: 'fuentes',     nombre: 'Fuentes / marco legal',  re: /id="fuentes"|Marco legal/,   que: 'lleva al documento exacto' },
  { id: 'nota',        nombre: 'Nota editorial 30 s',    re: /nota-editorial/,             que: 'resumen ejecutivo en cabecera' },
  { id: 'toc',         nombre: 'Índice de la ficha',     re: /class="toc"/,                que: 'navegación en fichas largas' },
  { id: 'guias',       nombre: '"Guías y herramientas"', re: /Gu[ií]as y herramientas/,    que: 'salida hacia calculadora y plantillas' },
  { id: 'te-cubre',    nombre: '"¿Te cubre?"',           re: /id="te-cubre"/,              que: 'encaje antes que cifra' },
];

// ── Corpus ──────────────────────────────────────────────────────────────────
const todas = fs.readdirSync(ROOT).filter((f) => /^convenio-.*\.html$/.test(f)).sort();
if (!todas.length) { console.error('No se han encontrado fichas convenio-*.html'); process.exit(1); }

const texto = new Map(todas.map((f) => [f, fs.readFileSync(path.join(ROOT, f), 'utf8')]));
const tiene = (f, b) => b.re.test(texto.get(f));

// Adopción medida sobre TODO el corpus (aunque se audite una sola ficha).
for (const b of BLOQUES) {
  b.llevan = todas.filter((f) => tiene(f, b));
  b.faltan = todas.filter((f) => !tiene(f, b));
  b.adopcion = b.llevan.length / todas.length;
  b.nivel = b.norma ? 'norma'
    : b.adopcion >= UMBRAL_REGRESION ? 'regresion'
    : b.adopcion >= UMBRAL_CANON ? 'canon'
    : 'emergente';
}

const ETIQUETA = {
  norma:     { txt: 'NORMA',     col: C.r, fallo: true },
  regresion: { txt: 'REGRESIÓN', col: C.r, fallo: true },
  canon:     { txt: 'canon',     col: C.y, fallo: false },
  emergente: { txt: 'emergente', col: C.d, fallo: false },
};

console.log(`\n══ secciones-convenios · ${todas.length} fichas ══\n`);

// ── Modo ficha única ────────────────────────────────────────────────────────
if (UNA) {
  const f = path.basename(UNA);
  if (!texto.has(f)) { console.error(`${C.r}No existe la ficha ${f}${C.x}`); process.exit(1); }
  console.log(`${C.b}${f}${C.x}\n`);
  let fallos = 0, avisos = 0;
  for (const b of BLOQUES) {
    const ok = tiene(f, b);
    const e = ETIQUETA[b.nivel];
    if (ok) { if (!QUIET) console.log(`  ${C.g}✓${C.x} ${b.nombre.padEnd(26)} ${C.d}${b.que}${C.x}`); continue; }
    if (e.fallo) { fallos++; console.log(`  ${C.r}✗${C.x} ${b.nombre.padEnd(26)} ${e.col}${e.txt}${C.x} · ${b.que} ${C.d}(lo llevan ${b.llevan.length}/${todas.length})${C.x}`); }
    else { avisos++; if (!QUIET) console.log(`  ${C.y}·${C.x} ${b.nombre.padEnd(26)} ${e.col}${e.txt}${C.x} · ${b.que} ${C.d}(lo llevan ${b.llevan.length}/${todas.length})${C.x}`); }
  }
  console.log();
  if (fallos) { console.log(`${C.r}❌ ${fallos} sección(es) obligatoria(s) ausente(s)${C.x}${avisos ? ` · ${C.y}${avisos} aviso(s)${C.x}` : ''}\n`); process.exit(1); }
  console.log(`${C.g}✅ sin ausencias obligatorias${C.x}${avisos ? ` · ${C.y}${avisos} aviso(s)${C.x}` : ''}\n`);
  process.exit(0);
}

// ── Informe del corpus ──────────────────────────────────────────────────────
console.log(`${C.d}  nivel      adopción   sección${C.x}`);
for (const b of BLOQUES) {
  const e = ETIQUETA[b.nivel];
  const pct = `${Math.round(b.adopcion * 100)}%`.padStart(4);
  const cuenta = `${b.llevan.length}/${todas.length}`.padStart(6);
  const marca = b.faltan.length === 0 ? `${C.g}✓${C.x}` : e.fallo ? `${C.r}✗${C.x}` : `${C.y}·${C.x}`;
  console.log(`  ${marca} ${e.col}${e.txt.padEnd(10)}${C.x} ${cuenta} ${pct}  ${b.nombre}`);
}

// ── Fallos: normas escritas y regresiones ───────────────────────────────────
const criticos = BLOQUES.filter((b) => ETIQUETA[b.nivel].fallo && b.faltan.length);
if (criticos.length) {
  console.log(`\n${C.r}── Obligatorias ausentes ──${C.x}`);
  for (const b of criticos) {
    console.log(`\n  ${C.r}✗ ${b.nombre}${C.x} ${C.d}(${b.que})${C.x} — falta en ${b.faltan.length}:`);
    for (const f of b.faltan) console.log(`      ${f}`);
  }
}

// ── Deuda de canon (no bloquea) ─────────────────────────────────────────────
const deuda = BLOQUES.filter((b) => b.nivel === 'canon' && b.faltan.length);
if (deuda.length && (DEUDA || !QUIET)) {
  console.log(`\n${C.y}── Deuda de canon (mayoritario pero no universal) ──${C.x}`);
  for (const b of deuda) {
    console.log(`\n  ${C.y}· ${b.nombre}${C.x} ${C.d}(${b.que})${C.x} — falta en ${b.faltan.length} de ${todas.length}:`);
    const lista = DEUDA ? b.faltan : b.faltan.slice(0, 8);
    for (const f of lista) console.log(`      ${f}`);
    if (!DEUDA && b.faltan.length > lista.length) console.log(`      ${C.d}… y ${b.faltan.length - lista.length} más (--deuda para verlas)${C.x}`);
  }
}

// ── Fichas más incompletas ──────────────────────────────────────────────────
if (!QUIET) {
  const exigibles = BLOQUES.filter((b) => b.nivel === 'norma' || b.nivel === 'regresion' || b.nivel === 'canon');
  const ranking = todas
    .map((f) => ({ f, faltan: exigibles.filter((b) => !tiene(f, b)).map((b) => b.id) }))
    .filter((x) => x.faltan.length)
    .sort((a, b) => b.faltan.length - a.faltan.length);
  if (ranking.length) {
    console.log(`\n${C.d}── Fichas con más ausencias (norma + regresión + canon) ──${C.x}`);
    for (const { f, faltan } of ranking.slice(0, 12)) {
      console.log(`  ${String(faltan.length).padStart(2)}  ${f.padEnd(46)} ${C.d}${faltan.join(', ')}${C.x}`);
    }
    if (ranking.length > 12) console.log(`  ${C.d}… y ${ranking.length - 12} fichas más con alguna ausencia${C.x}`);
  }
}

// ── Veredicto ───────────────────────────────────────────────────────────────
const nFallos = criticos.reduce((a, b) => a + b.faltan.length, 0);
const nDeuda = deuda.reduce((a, b) => a + b.faltan.length, 0);
console.log();
if (nFallos) {
  console.log(`${C.r}❌ ${nFallos} ausencia(s) obligatoria(s)${C.x} · ${C.y}${nDeuda} de canon${C.x}\n`);
  process.exit(1);
}
console.log(`${C.g}✅ sin ausencias obligatorias${C.x}${nDeuda ? ` · ${C.y}${nDeuda} de canon por saldar${C.x}` : ''}\n`);
process.exit(0);
