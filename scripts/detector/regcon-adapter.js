#!/usr/bin/env node
/**
 * regcon-adapter.js — DETECTOR: adaptador REGCON (registro oficial de convenios).
 *
 * Consulta el Registro de Convenios y Acuerdos Colectivos del Mº de Trabajo
 * (consulta pública, sin identificación) y devuelve el HISTORIAL DE TRÁMITES de
 * un convenio: texto nuevo, revisión salarial, denuncia, acuerdos de comisión
 * paritaria, prórroga, ampliación de ultraactividad...
 *
 * PARA QUÉ: una ficha nuestra envejece cuando el convenio recibe un trámite
 * posterior a la última vez que la verificamos. REGCON es la única fuente que
 * lo dice de forma oficial y homogénea para las 52 provincias. El caso que lo
 * justifica: el acta de la comisión paritaria de 17-12-2025 de Comercio del
 * Metal de Valencia cambió el seguro de convenio de 20.465 a 21.465 €.
 *
 * NO actualiza fichas ni escribe en el censo: deja candidatos para revisión
 * humana, igual que boe-adapter.js. El texto oficial sigue saliendo del BOP.
 *
 * Uso:
 *   node scripts/detector/regcon-adapter.js                 # las fichas del censo con código
 *   node scripts/detector/regcon-adapter.js --codigo 46000235011982
 *   node scripts/detector/regcon-adapter.js --save          # + escribe data/detector/regcon-estado.json
 *   node scripts/detector/regcon-adapter.js --delay 1500    # ms entre consultas (def. 1200)
 *
 * Fuente: https://expinterweb.mites.gob.es/regcon/pub/consultaPublicaEstatal
 * Se consulta de una en una y con pausa: es una web del Ministerio, no una API.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const CENSO = path.join(ROOT, 'data', 'convenios', 'censo.json');
const OUT_DIR = path.join(ROOT, 'data', 'detector');
const OUT = path.join(OUT_DIR, 'regcon-estado.json');
const URL = 'https://expinterweb.mites.gob.es/regcon/pub/consultaPublicaEstatal';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

const c = (s, n) => `\x1b[${n}m${s}\x1b[0m`;
const red = (s) => c(s, 31), green = (s) => c(s, 32), yellow = (s) => c(s, 33);
const dim = (s) => c(s, 90), bold = (s) => c(s, 1), cyan = (s) => c(s, 36);

/* ── Severidad por tipo de trámite ────────────────────────────────────────
 * Qué significa para una ficha nuestra que aparezca un trámite posterior.  */
const SEVERIDAD = [
  [/TEXTO NUEVO|NUEVO ACUERDO/i,              'critico',  'convenio nuevo: la ficha describe el anterior'],
  [/REVISI[ÓO]N SALARIAL/i,                   'critico',  'tablas nuevas: las cifras de la ficha pueden estar caducadas'],
  [/ACUERDOS? DE COMISI[ÓO]N PARITARIA/i,     'alto',     'acta paritaria: suele tocar importes o interpretar artículos'],
  [/MODIFICACI[ÓO]N/i,                        'alto',     'el articulado cambió'],
  [/PR[ÓO]RROGA|AMPLIACI[ÓO]N ULTRAACTIVIDAD/i, 'alto',   'cambia el estado jurídico declarado en la ficha'],
  [/GARANT[ÍI]A SALARIAL/i,                   'alto',     'cláusula de garantía activada: puede haber atrasos'],
  [/DENUNCIA|PROMOCI[ÓO]N DE NEGOCIACI[ÓO]N/i, 'senal',   'negociación abierta: el convenio está caliente'],
  [/LAUDO ARBITRAL|MEDIACI[ÓO]N|TRIBUNAL/i,   'senal',    'conflicto o resolución judicial en curso'],
];
const clasifica = (tramite) => {
  for (const [re, nivel, motivo] of SEVERIDAD) if (re.test(tramite)) return { nivel, motivo };
  return { nivel: 'info', motivo: 'trámite sin efecto directo conocido sobre la ficha' };
};
const ORDEN = { critico: 0, alto: 1, senal: 2, info: 3 };

/* ── HTTP con cookie jar mínimo ───────────────────────────────────────── */
function jar() {
  const store = new Map();
  return {
    header: () => [...store].map(([k, v]) => `${k}=${v}`).join('; '),
    absorb: (res) => {
      const raw = typeof res.headers.getSetCookie === 'function'
        ? res.headers.getSetCookie()
        : (res.headers.get('set-cookie') ? [res.headers.get('set-cookie')] : []);
      for (const line of raw) {
        const [pair] = line.split(';');
        const i = pair.indexOf('=');
        if (i > 0) store.set(pair.slice(0, i).trim(), pair.slice(i + 1).trim());
      }
    },
  };
}

async function abrirSesion(cookies) {
  const res = await fetch(URL, { headers: { 'User-Agent': UA, Accept: 'text/html' } });
  cookies.absorb(res);
  await res.text();
  if (!res.ok) throw new Error(`REGCON no responde al abrir sesión: HTTP ${res.status}`);
}

/**
 * El formulario es Spring MVC. Dos detalles que hacen que funcione:
 *   - `_buscar` es el botón: sin él el servidor devuelve el formulario otra vez.
 *   - `consulta_token_value_id` es un anti-doble-submit (Date.now() en el JS
 *     original), no un CSRF: vale cualquier timestamp, pero no puede ir vacío.
 */
async function consultar(codigo, cookies) {
  const body = new URLSearchParams({
    codigoConvenio: codigo,
    esNuevaBusqueda: 'true',
    _esNuevaBusqueda: '1',
    consulta_token_value_id: String(Date.now()),
    _buscar: 'Buscar',
  });
  const res = await fetch(URL, {
    method: 'POST',
    headers: {
      'User-Agent': UA,
      'Content-Type': 'application/x-www-form-urlencoded',
      Referer: URL,
      Origin: 'https://expinterweb.mites.gob.es',
      Cookie: cookies.header(),
    },
    body,
  });
  cookies.absorb(res);
  const html = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return html;
}

/* ── Parseo de la tabla de resultados ─────────────────────────────────── */
const limpia = (s) => s
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ').replace(/&aacute;/g, 'á').replace(/&eacute;/g, 'é')
  .replace(/&iacute;/g, 'í').replace(/&oacute;/g, 'ó').replace(/&uacute;/g, 'ú')
  .replace(/&Aacute;/g, 'Á').replace(/&Eacute;/g, 'É').replace(/&Iacute;/g, 'Í')
  .replace(/&Oacute;/g, 'Ó').replace(/&Uacute;/g, 'Ú').replace(/&ntilde;/g, 'ñ')
  .replace(/&Ntilde;/g, 'Ñ').replace(/&amp;/g, '&')
  .replace(/\s+/g, ' ').trim();

const isoDe = (ddmmyyyy) => {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(ddmmyyyy || '');
  return m ? `${m[3]}-${m[2]}-${m[1]}` : null;
};

function parseTramites(html) {
  const tabla = /<table[\s\S]*?<\/table>/i.exec(html);
  if (!tabla) return [];
  const filas = tabla[0].match(/<tr[\s\S]*?<\/tr>/gi) || [];
  const out = [];
  for (const fila of filas) {
    const celdas = (fila.match(/<td[\s\S]*?<\/td>/gi) || []).map(limpia).filter((x, i, a) => a.length > 0);
    if (celdas.length < 5) continue;
    const [codigo, denominacion, tramite, autoridad, publicacion, desde, hasta] = celdas;
    if (!/^\d{14}$/.test(codigo || '')) continue;
    out.push({
      codigo,
      denominacion,
      tramite,
      autoridad,
      publicacion: isoDe(publicacion),
      vigenciaDesde: isoDe(desde),
      vigenciaHasta: isoDe(hasta),
      ...clasifica(tramite),
    });
  }
  // más reciente primero
  return out.sort((a, b) => String(b.publicacion).localeCompare(String(a.publicacion)));
}

/* ── Censo: códigos y fecha de última verificación ────────────────────── */
function fichasDelCenso() {
  const censo = JSON.parse(fs.readFileSync(CENSO, 'utf8'));
  return (censo.fichas || []).map((f) => {
    const m = /\b(\d{14})\b/.exec(f.fuenteEstado || '');
    return { ...f, codigo: m ? m[1] : null };
  });
}

/**
 * Última vez que tocamos el CONTENIDO de la ficha.
 *
 * OJO: no vale `git log -1`. Los cambios sitewide (instalar analytics, aplicar
 * boilerplate, refrescar el footer) tocan las 90+ páginas de golpe y dejan a
 * todas las fichas con fecha de hoy, lo que haría imposible que ningún trámite
 * de REGCON fuese "posterior" y volvería el detector verde de forma permanente.
 * Así que se salta cualquier commit que toque más de MAX_MASIVO ficheros y se
 * toma el primero que parezca un trabajo sobre esta ficha.
 */
// Calibrado 22-sep-2026 contra el historial real: publicar una ficha toca
// 16-17 ficheros (ficha + censo + index + convenios + sitemap + llms + OG);
// un cambio sitewide toca 90+. 40 separa los dos casos sin ambigüedad.
const MAX_MASIVO = 40;
function ultimaRevision(archivo) {
  try {
    const { execFileSync } = require('child_process');
    const git = (args) => execFileSync('git', args, { cwd: ROOT }).toString().trim();
    const log = git(['log', '--format=%H|%cI', '-n', '40', '--', archivo]).split('\n').filter(Boolean);
    for (const linea of log) {
      const [sha, iso] = linea.split('|');
      const tocados = git(['show', '--pretty=', '--name-only', sha]).split('\n').filter(Boolean).length;
      if (tocados <= MAX_MASIVO) return { fecha: iso.slice(0, 10), sha: sha.slice(0, 7), tocados };
    }
    const [sha, iso] = (log[0] || '').split('|');
    return sha ? { fecha: iso.slice(0, 10), sha: sha.slice(0, 7), tocados: null, soloMasivos: true } : null;
  } catch { return null; }
}

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

/* ── Main ─────────────────────────────────────────────────────────────── */
async function main() {
  const argv = process.argv.slice(2);
  const save = argv.includes('--save');
  const codigoUnico = argv.includes('--codigo') ? argv[argv.indexOf('--codigo') + 1] : null;
  const delay = argv.includes('--delay') ? Number(argv[argv.indexOf('--delay') + 1]) : 1200;

  const cookies = jar();
  await abrirSesion(cookies);

  let objetivos;
  if (codigoUnico) {
    objetivos = [{ codigo: codigoUnico, archivo: null, ambito: '—', sector: '—' }];
  } else {
    const fichas = fichasDelCenso();
    const conCodigo = fichas.filter((f) => f.codigo);
    const sinCodigo = fichas.filter((f) => !f.codigo);
    objetivos = conCodigo;
    console.log(`\n${bold('══ REGCON · estado de las fichas del censo ══')}`);
    console.log(dim(`   ${conCodigo.length} con código · ${sinCodigo.length} sin código en el censo (no consultables aún)\n`));
    if (sinCodigo.length) {
      console.log(dim(`   Sin código: ${sinCodigo.map((f) => f.archivo.replace(/^convenio-|\.html$/g, '')).join(', ')}\n`));
    }
  }

  const resultados = [];
  for (const [i, f] of objetivos.entries()) {
    process.stderr.write(dim(`   [${i + 1}/${objetivos.length}] ${f.codigo}…\r`));
    let tramites = [], error = null;
    try {
      tramites = parseTramites(await consultar(f.codigo, cookies));
    } catch (e) { error = e.message; }

    const rev = f.archivo ? ultimaRevision(f.archivo) : null;
    const verificada = rev ? rev.fecha : null;
    const posteriores = verificada
      ? tramites.filter((t) => t.publicacion && t.publicacion > verificada)
      : [];
    resultados.push({
      ...f, verificada, revision: rev, error,
      totalTramites: tramites.length,
      // REGCON pagina de 15 en 15 y ordena por fecha descendente: para vigilar
      // lo reciente basta la primera página, para el historial completo no.
      paginaCompleta: tramites.length < 15,
      tramites, posteriores,
    });
    if (i < objetivos.length - 1) await dormir(delay);
  }
  process.stderr.write(' '.repeat(60) + '\r');

  informe(resultados, !!codigoUnico);

  if (save) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
    fs.writeFileSync(OUT, JSON.stringify({
      _doc: 'Estado de los convenios del censo según REGCON. Generado por scripts/detector/regcon-adapter.js. CANDIDATOS a revisión humana: no actualiza fichas ni censo. El texto oficial sigue saliendo del boletín.',
      generado: new Date().toISOString(),
      fuente: URL,
      fichas: resultados,
    }, null, 2) + '\n');
    console.log(dim(`\n   Guardado en ${path.relative(ROOT, OUT)}`));
  }
}

function informe(res, unico) {
  const pinta = (t) => {
    const col = t.nivel === 'critico' ? red : t.nivel === 'alto' ? yellow : t.nivel === 'senal' ? cyan : dim;
    return `${col(t.tramite)} ${dim(`(${t.publicacion})`)}`;
  };

  if (unico) {
    for (const f of res) {
      if (f.error) { console.log(red(`   ERROR ${f.codigo}: ${f.error}`)); continue; }
      console.log(`\n${bold(f.tramites[0]?.denominacion || f.codigo)} ${dim(f.codigo)}`);
      for (const t of f.tramites) console.log(`   · ${pinta(t)} ${dim('— ' + t.motivo)}`);
    }
    return;
  }

  const conAviso = res.filter((f) => f.posteriores.length)
    .sort((a, b) => ORDEN[a.posteriores[0].nivel] - ORDEN[b.posteriores[0].nivel]);
  const alDia = res.filter((f) => !f.posteriores.length && !f.error);
  const fallos = res.filter((f) => f.error);

  console.log(bold(red(`  ⚠ FICHAS CON TRÁMITE POSTERIOR A NUESTRA ÚLTIMA REVISIÓN (${conAviso.length})`)));
  console.log(dim('    La ficha se tocó por última vez en la fecha de la izquierda; REGCON registró algo después.\n'));
  for (const f of conAviso) {
    const slug = (f.archivo || '').replace(/^convenio-|\.html$/g, '');
    console.log(`  ${bold(slug)} ${dim(`· revisada ${f.verificada}`)}`);
    for (const t of f.posteriores.slice(0, 4)) console.log(`      · ${pinta(t)} ${dim('— ' + t.motivo)}`);
    if (f.posteriores.length > 4) console.log(dim(`      · … y ${f.posteriores.length - 4} más`));
    console.log('');
  }

  /* Negociación abierta: vale al margen de si la ficha está al día. Un convenio
   * denunciado sin texto nuevo posterior es el que se va a firmar pronto.     */
  const calientes = res
    .map((f) => {
      const den = f.tramites.find((t) => /DENUNCIA|PROMOCI[ÓO]N DE NEGOCIACI[ÓO]N/i.test(t.tramite));
      if (!den) return null;
      const textoNuevo = f.tramites.find((t) => /TEXTO NUEVO|NUEVO ACUERDO/i.test(t.tramite));
      if (textoNuevo && textoNuevo.publicacion > den.publicacion) return null; // ya se firmó
      return { f, den };
    })
    .filter(Boolean)
    .sort((a, b) => String(b.den.publicacion).localeCompare(String(a.den.publicacion)));

  console.log(bold(cyan(`  🔥 NEGOCIACIÓN ABIERTA · denunciados sin texto nuevo posterior (${calientes.length})`)));
  console.log(dim('    Se va a firmar convenio nuevo: la ficha cambiará y el que llegue antes se lleva la consulta.\n'));
  for (const { f, den } of calientes) {
    const slug = (f.archivo || '').replace(/^convenio-|\.html$/g, '');
    console.log(`      ${slug.padEnd(30)} ${dim(`denunciado ${den.publicacion}`)}`);
  }
  console.log('');

  console.log(bold(green(`  ✓ SIN NOVEDAD EN REGCON (${alDia.length})`)));
  console.log(dim(`    ${alDia.map((f) => (f.archivo || '').replace(/^convenio-|\.html$/g, '')).join(', ') || '—'}\n`));

  if (fallos.length) {
    console.log(bold(yellow(`  ? NO CONSULTADAS (${fallos.length})`)));
    for (const f of fallos) console.log(`      ${f.codigo} — ${f.error}`);
    console.log('');
  }
  console.log(dim('  Un aviso NO significa que la ficha esté mal: significa que hay que mirarlo.'));
  console.log(dim('  La cifra se verifica en el boletín, nunca en REGCON.\n'));
}

main().catch((e) => { console.error(red(`\nFallo: ${e.message}`)); process.exit(1); });
