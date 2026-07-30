#!/usr/bin/env node
/**
 * boe-adapter.js — DETECTOR: adaptador BOE (convenios colectivos de ámbito estatal).
 *
 * Lee el sumario diario de la API de datos abiertos del BOE, filtra los
 * convenios colectivos publicados por el Mº de Trabajo (Sección III) y saca
 * CANDIDATOS a la cola de revisión. NO actualiza fichas: la confirmación es
 * humana (ver salariojusto-detector-boletines.md §1).
 *
 * Uso:
 *   node scripts/detector/boe-adapter.js [YYYYMMDD]      # un día (default: hoy)
 *   node scripts/detector/boe-adapter.js --save [YYYYMMDD]  # + añade a la cola
 *   node scripts/detector/boe-adapter.js --days 7        # últimos N días
 *
 * Cola: data/detector/candidatos.json (dedupe por identificador BOE).
 * Fuente: https://www.boe.es/datosabiertos/api/boe/sumario/YYYYMMDD
 */
const fs = require('fs');
const path = require('path');

const COLA = path.join(__dirname, '..', '..', 'data', 'detector', 'candidatos.json');
const API = (ymd) => `https://www.boe.es/datosabiertos/api/boe/sumario/${ymd}`;
const arr = (x) => (x == null ? [] : Array.isArray(x) ? x : [x]);

const DEP_TRABAJO = /trabajo y econom[ií]a social/i;
const ES_CONVENIO = /convenio colectivo/i;
// clasificación por urgencia (determina prioridad en la cola)
function clasifica(t) {
  if (/(tablas?|revisi[oó]n)\s+salarial|salariales/i.test(t)) return 'alta';
  if (/pr[oó]rroga|modificaci[oó]n|acta|correcci[oó]n/i.test(t)) return 'media';
  return 'informativa';
}

async function sumario(ymd) {
  const res = await fetch(API(ymd), { headers: { Accept: 'application/json' } });
  if (res.status === 404) return { vacio: true }; // días sin BOE (domingos, festivos)
  if (!res.ok) throw new Error(`BOE ${ymd}: HTTP ${res.status}`);
  const j = await res.json();
  if (j?.status?.code && j.status.code !== '200') return { vacio: true };
  return j.data?.sumario || {};
}

function candidatosDe(sm, ymd) {
  const dia = arr(sm.diario)[0] || sm;
  const sec3 = arr(dia.seccion).find((s) => s.codigo === '3');
  if (!sec3) return [];
  const out = [];
  for (const dep of arr(sec3.departamento)) {
    if (!DEP_TRABAJO.test(dep.nombre || '')) continue;
    // departamento → epigrafe[] → item[]  ó  departamento → item[]
    const items = dep.epigrafe ? arr(dep.epigrafe).flatMap((e) => arr(e.item)) : arr(dep.item);
    for (const it of items) {
      const titulo = it.titulo || '';
      if (!ES_CONVENIO.test(titulo)) continue;
      const pdf = it.url_pdf?.texto || it.url_pdf || null;
      out.push({
        id: it.identificador,
        fecha: `${ymd.slice(0, 4)}-${ymd.slice(4, 6)}-${ymd.slice(6, 8)}`,
        titulo,
        clasificacion: clasifica(titulo),
        url_pdf: typeof pdf === 'string' ? (pdf.startsWith('http') ? pdf : `https://www.boe.es${pdf}`) : null,
        url_html: `https://www.boe.es/diario_boe/txt.php?id=${it.identificador}`,
        fuente: 'BOE',
        estado: 'pendiente',
      });
    }
  }
  return out;
}

function ymdOf(d) {
  return d.toISOString().slice(0, 10).replace(/-/g, '');
}

async function main() {
  const args = process.argv.slice(2);
  const save = args.includes('--save');
  const daysIdx = args.indexOf('--days');
  const nDays = daysIdx >= 0 ? parseInt(args[daysIdx + 1], 10) : 1;
  const dateArg = args.find((a) => /^\d{8}$/.test(a));

  const fechas = [];
  if (dateArg) fechas.push(dateArg);
  else { const base = new Date(); for (let i = 0; i < nDays; i++) { const d = new Date(base); d.setUTCDate(d.getUTCDate() - i); fechas.push(ymdOf(d)); } }

  let todos = [];
  for (const ymd of fechas) {
    try {
      const sm = await sumario(ymd);
      if (sm.vacio) { console.log(`  ${ymd}: sin BOE`); continue; }
      const c = candidatosDe(sm, ymd);
      todos = todos.concat(c);
      console.log(`  ${ymd}: ${c.length} convenio(s) colectivo(s) del Mº Trabajo`);
    } catch (e) { console.log(`  ${ymd}: ⚠ ${e.message}`); }
  }

  console.log(`\n══ Candidatos BOE (${todos.length}) ══`);
  for (const c of todos) {
    console.log(`  [${c.clasificacion.toUpperCase()}] ${c.id} · ${c.fecha}`);
    console.log(`     ${c.titulo.slice(0, 110)}`);
    console.log(`     ${c.url_html}`);
  }

  if (save) {
    fs.mkdirSync(path.dirname(COLA), { recursive: true });
    let cola = [];
    try { cola = JSON.parse(fs.readFileSync(COLA, 'utf8')); } catch { cola = []; }
    const vistos = new Set(cola.map((x) => x.id));
    const nuevos = todos.filter((c) => !vistos.has(c.id));
    fs.writeFileSync(COLA, JSON.stringify(cola.concat(nuevos), null, 2) + '\n');
    console.log(`\n💾 cola: +${nuevos.length} nuevos (${cola.length + nuevos.length} total) → ${path.relative(process.cwd(), COLA)}`);
  } else {
    console.log(`\n(usa --save para volcar a la cola de revisión)`);
  }
}

main().catch((e) => { console.error('error:', e.message); process.exit(1); });
