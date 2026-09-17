#!/usr/bin/env node
/**
 * legal-claims.js — GATE de afirmaciones jurídicas.
 *
 * Fuente de verdad: data/legal/normas.json (registro de normas verificadas
 * contra el BOE CONSOLIDADO, una a una, con fecha de comprobación).
 *
 * Escanea los HTML del sitio, extrae toda cita normativa y falla cuando una
 * cita no está respaldada por el registro. No juzga si la frase es correcta:
 * garantiza que la norma en la que se apoya se ha verificado y que el lector
 * puede llegar a ella.
 *
 * Uso:  node scripts/audit/legal-claims.js [--inventario] [--pagina X.html]
 *         --inventario  lista lo citado y lo agrupa, sin fallar (para poblar el registro)
 *         --pagina      audita solo esa página
 *
 * Regla: ver memoria feedback_verificar_antes_de_redactar_derecho.
 *        La norma se verifica y se registra ANTES de escribir la frase.
 *        Motivo del gate: el 06-jul-2026 y el 13-sep-2026 se publicó dos veces
 *        el régimen de ultraactividad derogado (Ley 3/2012) como si fuera vigente.
 *
 * Exit 1 si hay citas sin respaldo, normas caducadas o conceptos sin norma.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const REGISTRO = path.join(ROOT, 'data', 'legal', 'normas.json');

const c = (s, code) => `\x1b[${code}m${s}\x1b[0m`;
const red = (s) => c(s, 31), green = (s) => c(s, 32), yellow = (s) => c(s, 33), dim = (s) => c(s, 90), bold = (s) => c(s, 1);

/* ── Extractores ─────────────────────────────────────────────────────────
   Cada patrón devuelve una clave canónica "NORMA:ARTICULO" o "NORMA".      */

const LEYES = [
  // [regex, normalizador → id de norma]
  [/\bReal\s+Decreto[-\s]ley\s+(\d+)\/(\d{4})/gi, (m) => `RDL ${m[1]}/${m[2]}`],
  [/\bRDL\s+(\d+)\/(\d{4})/gi, (m) => `RDL ${m[1]}/${m[2]}`],
  [/\bReal\s+Decreto\s+Legislativo\s+(\d+)\/(\d{4})/gi, (m) => `RDLeg ${m[1]}/${m[2]}`],
  [/\bReal\s+Decreto\s+(\d+)\/(\d{4})/gi, (m) => `RD ${m[1]}/${m[2]}`],
  [/\bLey\s+Org[áa]nica\s+(\d+)\/(\d{4})/gi, (m) => `LO ${m[1]}/${m[2]}`],
  // lookbehind obligatorio: sin él, «Real Decreto-ley 32/2021» y «RD-Ley 6/2019»
  // se contaban además como «Ley 32/2021» y «Ley 6/2019», que no existen.
  // Un gate con ruido se ignora, así que aquí el ruido es un bug.
  [/(?<!Decreto[-\s])(?<!RD[-\s])(?<!RDL[-\s])\bLey\s+(\d+)\/(\d{4})/gi, (m) => `Ley ${m[1]}/${m[2]}`],
  [/\bDirectiva\s+\(?(?:UE)?\)?\s*(\d{4})\/(\d+)/gi, (m) => `Directiva UE ${m[1]}/${m[2]}`],
];

// Artículos referidos a un cuerpo legal nombrado en la misma frase
const ARTICULOS = [
  [/\bart[íi]culos?\s+(\d+(?:\.\d+)?(?:\s*bis)?)\s+(?:y\s+\d+\s+)?del\s+Estatuto\s+de\s+los\s+Trabajadores/gi, (m) => `ET:${m[1].replace(/\s+/g, ' ').trim()}`],
  [/\bart\.\s*(\d+(?:\.\d+)?(?:\s*bis)?)\s+del\s+Estatuto\s+de\s+los\s+Trabajadores/gi, (m) => `ET:${m[1].replace(/\s+/g, ' ').trim()}`],
  [/\bart[íi]culo\s+(\d+(?:\.\d+)?)\s+del\s+ET\b/gi, (m) => `ET:${m[1]}`],
  [/\bart\.\s*(\d+(?:\.\d+)?)\s+del\s+ET\b/gi, (m) => `ET:${m[1]}`],
];

/* Listas del tipo «Art. 59 (prescripción), Art. 86.3 (ultraactividad)» — el
   cuerpo legal se nombra una vez y luego se enumeran los artículos sueltos.
   Sin esto, sobre.html citaba el art. 59 y el gate lo daba por no citado
   (falso positivo), y de paso no veía que su «Art. 63 (denuncia)» era falso:
   el 63 ET son los comités de empresa. */
const LISTA_ARTICULOS = /Estatuto de los Trabajadores[^.]{0,80}?((?:\s*Art\.\s*\d+(?:\.\d+)?\s*\([^)]*\),?)+)/gi;
const ART_SUELTO = /Art\.\s*(\d+(?:\.\d+)?)/g;

/* Conceptos jurídicos de alto riesgo: no bastan por sí solos, exigen que la
   página cite además la norma de respaldo declarada en el registro.        */
const CONCEPTOS = {
  ultraactividad: 'ET:86',
  'ámbito superior': 'ET:86',
  'ambito superior': 'ET:86',
  decaído: 'ET:86',
  decaido: 'ET:86',
  decaída: 'ET:86',
  decae: 'ET:86',
  prescriben: 'ET:59',
  prescripción: 'ET:59',
};

function stripHtml(h) {
  return h
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')  // el JSON-LD se audita aparte
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ');
}

function jsonLdText(h) {
  return [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)]
    .map((m) => m[1]).join(' ').replace(/\s+/g, ' ');
}

function extraer(texto) {
  const hits = new Map(); // clave → nº de apariciones
  const add = (k) => hits.set(k, (hits.get(k) || 0) + 1);

  for (const [re, norm] of ARTICULOS) {
    for (const m of texto.matchAll(re)) add(norm(m));
  }
  // listas enumeradas tras nombrar el cuerpo legal una sola vez
  for (const bloque of texto.matchAll(LISTA_ARTICULOS)) {
    for (const a of bloque[1].matchAll(ART_SUELTO)) add(`ET:${a[1]}`);
  }
  for (const [re, norm] of LEYES) {
    for (const m of texto.matchAll(re)) add(norm(m));
  }
  for (const [palabra, respaldo] of Object.entries(CONCEPTOS)) {
    const re = new RegExp(`\\b${palabra.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    if (re.test(texto)) add(`@concepto:${palabra}→${respaldo}`);
  }
  return hits;
}

function paginas() {
  const soloUna = process.argv.indexOf('--pagina');
  if (soloUna > -1 && process.argv[soloUna + 1]) return [process.argv[soloUna + 1]];
  return fs.readdirSync(ROOT).filter((f) => f.endsWith('.html') && !f.startsWith('_')).sort();
}

function cargarRegistro() {
  if (!fs.existsSync(REGISTRO)) {
    console.error(red(`\n  No existe ${path.relative(ROOT, REGISTRO)}.`));
    console.error(dim('  Créalo antes de usar el gate: es el registro de normas verificadas contra el BOE consolidado.\n'));
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(REGISTRO, 'utf8'));
}

function main() {
  const inventario = process.argv.includes('--inventario');
  const reg = inventario && !fs.existsSync(REGISTRO) ? { normas: {} } : cargarRegistro();
  const verificadas = reg.normas || {};

  const global = new Map();   // clave → Set(páginas)
  const porPagina = new Map();

  for (const f of paginas()) {
    const h = fs.readFileSync(path.join(ROOT, f), 'utf8');
    const hits = extraer(stripHtml(h) + ' ' + jsonLdText(h));
    if (!hits.size) continue;
    porPagina.set(f, { hits, tieneBoe: /boe\.es/i.test(h) });
    for (const k of hits.keys()) {
      if (!global.has(k)) global.set(k, new Set());
      global.get(k).add(f);
    }
  }

  if (inventario) {
    console.log(bold(`\n  Inventario de citas normativas · ${porPagina.size} páginas\n`));
    const filas = [...global.entries()].sort((a, b) => b[1].size - a[1].size);
    for (const [k, pags] of filas) {
      const estado = k.startsWith('@concepto:') ? dim('concepto') :
        verificadas[k] ? green('registrada') : red('SIN REGISTRAR');
      console.log(`  ${String(pags.size).padStart(3)} págs  ${estado.padEnd(24)}  ${k}`);
    }
    console.log(dim(`\n  ${filas.length} claves distintas. Regístralas en data/legal/normas.json antes de escribir sobre ellas.\n`));
    return;
  }

  /* ── Modo gate ─────────────────────────────────────────────────────── */
  const fallos = [];

  for (const [f, { hits, tieneBoe }] of porPagina) {
    for (const [k] of hits) {
      if (k.startsWith('@concepto:')) {
        const [, resto] = k.split('@concepto:');
        const [palabra, respaldo] = resto.split('→');
        // el concepto exige que la página cite explícitamente su norma de respaldo,
        // en el artículo o en cualquiera de sus apartados (ET:86 ≡ ET:86.3)
        const cubierto = [...hits.keys()].some((h) => h === respaldo || h.startsWith(`${respaldo}.`));
        if (!cubierto) {
          fallos.push({ f, tipo: 'concepto-sin-norma', detalle: `«${palabra}» sin citar ${respaldo}` });
        }
        continue;
      }
      // Resolución jerárquica: «ET:86.3» se respalda con la entrada «ET:86».
      // El registro guarda artículos, no apartados.
      const base = k.includes(':') ? `${k.split(':')[0]}:${k.split(':')[1].split('.')[0]}` : k;
      const n = verificadas[k] || verificadas[base];
      if (!n) {
        fallos.push({ f, tipo: 'sin-registrar', detalle: k });
        continue;
      }
      if (n.derogado) {
        // Citar una norma superada es legítimo si es relato histórico Y la página
        // advierte del cambio nombrando la norma que la sustituyó. Si no, es trampa.
        const advierte = n.sustituidaPor && hits.has(n.sustituidaPor);
        if (!advierte) {
          fallos.push({ f, tipo: 'DEROGADA', detalle: `${k} — ${n.derogado}` });
        }
        continue;
      }
      if (!n.urlConsolidada || !n.verificado) {
        fallos.push({ f, tipo: 'registro-incompleto', detalle: `${k} sin urlConsolidada o sin fecha de verificación` });
      }
    }
    if (hits.size && !tieneBoe) {
      fallos.push({ f, tipo: 'sin-enlace-boe', detalle: `${hits.size} citas y ningún enlace a boe.es` });
    }
  }

  console.log(bold(`\n  Gate de afirmaciones jurídicas · ${porPagina.size} páginas con citas normativas\n`));
  if (!fallos.length) {
    console.log(green('  ✓ Todas las citas están respaldadas por el registro.\n'));
    return;
  }

  /* Severidad: solo lo que puede publicar derecho falso rompe la build.
     Los avisos marcan superficie sin respaldo, que es deuda, no error. */
  const ERRORES = new Set(['DEROGADA', 'sin-registrar', 'registro-incompleto']);

  const porTipo = {};
  for (const x of fallos) (porTipo[x.tipo] ||= []).push(x);
  const orden = ['DEROGADA', 'sin-registrar', 'registro-incompleto', 'concepto-sin-norma', 'sin-enlace-boe'];
  for (const tipo of orden) {
    const xs = porTipo[tipo];
    if (!xs) continue;
    const esError = ERRORES.has(tipo);
    const color = esError ? red : yellow;
    console.log(color(`  ${esError ? 'ERROR' : 'aviso'} · ${tipo}  (${xs.length})`));
    const vistos = new Map();
    for (const x of xs) {
      if (!vistos.has(x.f)) vistos.set(x.f, []);
      vistos.get(x.f).push(x.detalle);
    }
    for (const [f, ds] of [...vistos].slice(0, 40)) {
      console.log(`     ${f}`);
      for (const d of [...new Set(ds)].slice(0, 6)) console.log(dim(`        · ${d}`));
    }
    console.log();
  }
  const nErrores = fallos.filter((x) => ERRORES.has(x.tipo)).length;
  const nAvisos = fallos.length - nErrores;
  console.log(`  ${nErrores ? red(`${nErrores} errores`) : green('0 errores')} · ${yellow(`${nAvisos} avisos`)}`);
  console.log(dim('  El registro manda: verifica contra fuente primaria y regístralo ANTES de escribir la frase.\n'));
  if (nErrores) process.exit(1);
}

main();
