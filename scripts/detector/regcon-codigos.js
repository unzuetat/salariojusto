#!/usr/bin/env node
/**
 * regcon-codigos.js — DETECTOR: resuelve el código REGCON de las fichas que no lo tienen.
 *
 * El censo guarda el código de convenio (14 dígitos) dentro de `fuenteEstado`,
 * pero sólo 21 de las 59 fichas lo llevan. Sin código no se las puede vigilar
 * con regcon-adapter.js. Este script busca cada ficha en REGCON por sector y
 * provincia y PROPONE candidatos.
 *
 * NO escribe en el censo. El censo es hand-curated y cada código tiene que
 * ratificarlo una persona: una propuesta con puntuación alta sigue siendo una
 * propuesta, y confundir dos convenios del mismo sector y provincia (Industria
 * del Metal vs Comercio del Metal) es exactamente el error que más daño hace.
 *
 * Uso:
 *   node scripts/detector/regcon-codigos.js                 # todas las que faltan
 *   node scripts/detector/regcon-codigos.js --sector metal  # sólo un sector
 *   node scripts/detector/regcon-codigos.js --save          # + data/detector/regcon-codigos.json
 */
const fs = require('fs');
const path = require('path');
const R = require('./regcon-lib');

const ROOT = path.join(__dirname, '..', '..');
const CENSO = path.join(ROOT, 'data', 'convenios', 'censo.json');
const OUT_DIR = path.join(ROOT, 'data', 'detector');
const OUT = path.join(OUT_DIR, 'regcon-codigos.json');

const c = (s, n) => `\x1b[${n}m${s}\x1b[0m`;
const red = (s) => c(s, 31), green = (s) => c(s, 32), yellow = (s) => c(s, 33);
const dim = (s) => c(s, 90), bold = (s) => c(s, 1), cyan = (s) => c(s, 36);

/* ── Cómo se llama cada sector nuestro en REGCON ───────────────────────────
 * `buscar`  = palabras que se mandan al formulario (búsqueda OR).
 * `exige`   = alguna de estas tiene que aparecer en la denominación.
 * `excluye` = descarta el candidato aunque encaje lo demás. Es lo que separa
 *             la Industria del Metal del Comercio del Metal, y la limpieza de
 *             edificios de la limpieza viaria o la de centros sanitarios.     */
/* OJO CON EL IDIOMA: REGCON guarda la denominación tal cual la deposita cada
 * autoridad laboral, así que los convenios catalanes están en catalán
 * ("Hostaleria", "Neteja", "Comerç del Metall", "Indústria siderometal·lúrgica")
 * y por eso las seis fichas catalanas no aparecían buscando en castellano. */
const SECTORES = {
  hosteleria: {
    // En Gipuzkoa el sectorial se llama "ALOJAMIENTOS DE GIPUZKOA": el nombre
    // del sector cambia por territorio, no sólo de idioma.
    buscar: 'HOSTELERIA HOSTELERÍA HOSTALERIA ALOJAMIENTOS TURISMO',
    exige: [/HOSTELER[ÍI]A|HOSTALERIA|ALOJAMIENTOS/],
    excluye: [/COLECTIVIDADES|CATERING|ALOJAMIENTOS? RURAL/],
  },
  limpieza: {
    buscar: 'LIMPIEZA EDIFICIOS LOCALES NETEJA EDIFICIS LOCALS',
    exige: [/LIMPIEZA|NETEJA/],
    excluye: [
      /VIARIA|P[ÚU]BLICA|URBANA|RESIDUOS|SANITARI|HOSPITAL|SECO|TINTORER/,
      /HERM[ÉE]TIC|CONTENEDOR|AVIONES|AEROPUERTO|CENTROS DEPENDI/,
    ],
  },
  metal: {
    buscar: 'METAL SIDEROMETALURGIA SIDEROMETAL·LURGICA METALL INDUSTRIA',
    exige: [/METAL|SIDEROMETAL/],
    // Comercio del Metal es OTRO convenio, y en Barcelona se llama "Comerç"
    excluye: [/COMERCIO|COMER[ÇC]|TIENDAS|VENTA|DISTRIBUCI[ÓO]N/],
  },
  'comercio-metal': {
    buscar: 'COMERCIO METAL COMERÇ METALL',
    exige: [/COMERCIO.*METAL|METAL.*COMERCIO|COMER[ÇC].*METALL/],
    excluye: [/INDUSTRIA|IND[ÚU]STRIA/],
  },
  oficinas: {
    buscar: 'OFICINAS DESPACHOS',
    exige: [/OFICINAS/],
    // "Oficinas de farmacia" y "Oficinas de importación" son sectores distintos
    // que comparten la palabra: sin excluirlos se colaban por delante.
    excluye: [/FARMACIA|IMPORTACI[ÓO]N|EXPORTACI[ÓO]N|SEGUROS|GESTOR[ÍI]AS? ADMINISTRATIVAS/],
  },
  construccion: {
    buscar: 'CONSTRUCCION CONSTRUCCIÓN EDIFICACION',
    exige: [/CONSTRUCCI[ÓO]N|EDIFICACI[ÓO]N/],
    excluye: [/MATERIALES|DERIVADOS DEL CEMENTO|YESO|MADERA/],
  },
  comercio: {
    buscar: 'COMERCIO',
    exige: [/COMERCIO/],
    excluye: [/METAL|TEXTIL|ALIMENTACI/],
  },
  tecnicos: {
    buscar: 'ESPECTACULOS ESPECTÁCULOS TECNICOS',
    exige: [/ESPECT[ÁA]CULOS/],
    excluye: [],
  },
};

/* Ámbito del censo → autoridad laboral de REGCON. Casi todos son literales;
 * aquí sólo van los que no coinciden con la clave de R.AUTORIDAD.           */
const AMBITO_ESPECIAL = {
  'Maresme': { autoridad: 'Barcelona', funcional: R.AMBITO_FUNCIONAL.inferiorProvincia },
  'Catalunya (autonómico)': { autoridad: 'Catalunya' },
  'Estatal': { autoridad: 'Estatal' },
};

const norm = (s) => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase();

/**
 * El 8º dígito del código de convenio dice de qué tipo es: 5 = sectorial,
 * 2 = empresa. Comprobado contra todo el corpus (46000105011981 Industria del
 * Metal, 28002085011981 Hostelería Madrid, 08002545011994 Siderometalúrgica
 * Barcelona… frente a 46151172112025 METALCÚDIA SA o 41116272112026 INFRA-
 * ESTRUCTURA LIMPIEZA SL). Filtrar por aquí quita el ruido de los cientos de
 * convenios de empresa sin depender de cómo esté escrita la denominación.
 */
const esSectorial = (codigo) => /^\d{14}$/.test(codigo) && codigo[7] === '5';

/**
 * REGCON recorta la denominación en la tabla de resultados, así que la palabra
 * que identifica el sector puede quedarse fuera: "Convenio colectivo de la
 * Industria, las Nuevas Tecnologías y" es en realidad el del Metal de Valencia.
 * Si el texto llega al límite, no se puede exigir que contenga el patrón.
 */
const LARGO_CORTE = 52;
const pareceTruncada = (d) => (d || '').length >= LARGO_CORTE;

/**
 * Puntúa un candidato de REGCON contra la ficha que buscamos.
 *
 * La señal fuerte es la FECHA DE FIN DE VIGENCIA que ya tenemos en el censo:
 * si el candidato acaba el mismo día, es él. Lo que NO vale es premiar que el
 * convenio esté vivo — oficinas-bizkaia describe a propósito un convenio
 * decaído en 2012, y ese criterio colocaba primero a "OFICINAS DE FARMACIA".
 */
function puntua(cand, spec, ficha) {
  const d = norm(cand.denominacion);
  if (!esSectorial(cand.codigo)) return null;          // fuera los convenios de empresa
  if (spec.excluye.some((re) => re.test(d))) return null;

  const encaja = !spec.exige.length || spec.exige.some((re) => re.test(d));
  if (!encaja && !pareceTruncada(d)) return null;      // no es del sector y el texto está completo

  let p = encaja ? 45 : 20;                             // sin confirmar por denominación, a revisar
  if (norm(cand.autoridad).includes(norm(ficha.ambito).split(' ')[0])) p += 10;

  const finCenso = ficha.vigenciaFin || null;
  const finCand = cand.ultimo?.vigenciaHasta || null;
  if (finCenso && finCand) {
    if (finCenso === finCand) p += 40;             // misma fecha de fin: es él
    else if (finCenso.slice(0, 4) === finCand.slice(0, 4)) p += 15;  // mismo año
    else p -= 15;                                   // no descarta: puede haber prórroga posterior
  } else if (!finCenso && finCand && finCand >= '2024-01-01' && ficha.estado === 'vigente') {
    p += 10;                                        // sin fecha en el censo, al menos que esté vivo
  }

  if (/SECTOR|PROVINCIAL|GENERAL/.test(d)) p += 5;
  if (d.split(/\s+/).length <= 6) p += 8;           // el sectorial suele tener nombre escueto
  return { score: Math.max(1, Math.min(p, 99)), confirmado: encaja };
}

/* En Cataluña buena parte de lo sectorial se deposita en la autoridad
 * autonómica, no en la provincial: buscando sólo en Barcelona, Girona o
 * Tarragona no aparece nada. Si la provincial no da nada, se reintenta ahí. */
const FALLBACK_AUTONOMICO = {
  Barcelona: 'Catalunya', Girona: 'Catalunya', Tarragona: 'Catalunya',
  Lleida: 'Catalunya', Maresme: 'Catalunya',
};

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const argv = process.argv.slice(2);
  const save = argv.includes('--save');
  const soloSector = argv.includes('--sector') ? argv[argv.indexOf('--sector') + 1] : null;

  const censo = JSON.parse(fs.readFileSync(CENSO, 'utf8'));
  let pendientes = (censo.fichas || []).filter((f) => !/\b\d{14}\b/.test(f.fuenteEstado || ''));
  if (soloSector) pendientes = pendientes.filter((f) => f.sector === soloSector);

  console.log(`\n${bold('══ REGCON · resolver códigos de convenio ══')}`);
  console.log(dim(`   ${pendientes.length} fichas sin código · propuestas para ratificación humana\n`));

  const jar = await R.abrirSesion();
  const resultados = [];

  for (const [i, f] of pendientes.entries()) {
    const spec = SECTORES[f.sector];
    const esp = AMBITO_ESPECIAL[f.ambito] || {};
    const autoridadNombre = esp.autoridad || f.ambito;
    const autoridad = R.AUTORIDAD[autoridadNombre];
    const slug = f.archivo.replace(/^convenio-|\.html$/g, '');
    process.stderr.write(dim(`   [${i + 1}/${pendientes.length}] ${slug}…\r`));

    if (!spec || !autoridad) {
      resultados.push({ ...f, slug, error: !spec ? `sector "${f.sector}" sin patrón` : `ámbito "${f.ambito}" sin autoridad laboral` , candidatos: [] });
      continue;
    }

    const intentar = async (autoridadId) => {
      const { filas, total } = await R.buscarTodo(jar, {
        denominacion: spec.buscar,
        tipoBusquedaDenominacion: 'OR',
        autoridadLaboral: autoridadId,
        idNaturalezaConsPublica: R.NATURALEZA.convenioColectivo,
        idAmbFuncionalConsPublica: esp.funcional || R.AMBITO_FUNCIONAL.sectorProvincial,
      }, { maxPaginas: 3 });

      const candidatos = R.agrupaPorConvenio(filas)
        .map((cand) => ({ cand, p: puntua(cand, spec, f) }))
        .filter(({ p }) => p !== null)
        .sort((a, b) => b.p.score - a.p.score)
        .slice(0, 5)
        .map(({ cand, p }) => ({
          codigo: cand.codigo, denominacion: cand.denominacion, autoridad: cand.autoridad,
          score: p.score, confirmadoPorDenominacion: p.confirmado,
          ultimoTramite: cand.ultimo ? `${cand.ultimo.publicacion} ${cand.ultimo.tramite}` : null,
          vigenciaHasta: cand.ultimo?.vigenciaHasta || null,
        }));
      return { candidatos, total };
    };

    try {
      let { candidatos, total } = await intentar(autoridad);
      let consultada = autoridadNombre;

      const fallback = FALLBACK_AUTONOMICO[f.ambito];
      if (!candidatos.length && fallback && R.AUTORIDAD[fallback]) {
        await dormir(1200);
        ({ candidatos, total } = await intentar(R.AUTORIDAD[fallback]));
        if (candidatos.length) consultada = `${autoridadNombre} → ${fallback} (autonómico)`;
      }
      resultados.push({ ...f, slug, autoridadConsultada: consultada, totalEnRegcon: total, candidatos });
    } catch (e) {
      resultados.push({ ...f, slug, error: e.message, candidatos: [] });
    }
    await dormir(1200);
  }
  process.stderr.write(' '.repeat(70) + '\r');

  informe(resultados);

  if (save) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
    fs.writeFileSync(OUT, JSON.stringify({
      _doc: 'PROPUESTAS de código REGCON para fichas del censo que no lo tienen. Generado por scripts/detector/regcon-codigos.js. NO ratificado: antes de copiar un código al censo hay que abrir la ficha en REGCON y comprobar que es el convenio correcto (ojo Industria del Metal vs Comercio del Metal).',
      generado: new Date().toISOString(),
      fichas: resultados,
    }, null, 2) + '\n');
    console.log(dim(`\n   Guardado en ${path.relative(ROOT, OUT)}`));
  }
}

function informe(res) {
  const claros = res.filter((r) => r.candidatos.length === 1);
  const dudosos = res.filter((r) => r.candidatos.length > 1);
  const vacios = res.filter((r) => !r.candidatos.length);

  const linea = (cand) => {
    const col = cand.score >= 85 ? green : cand.score >= 70 ? yellow : dim;
    const corte = cand.confirmadoPorDenominacion ? '' : cyan(' ✂');  // nombre truncado por REGCON
    return `${col(cand.codigo)} ${dim(`(${cand.score})`)} ${cand.denominacion.slice(0, 52)}${corte}` +
           dim(cand.vigenciaHasta ? ` · hasta ${cand.vigenciaHasta}` : '');
  };

  console.log(bold(green(`  ✓ CANDIDATO ÚNICO (${claros.length})`)) + dim(' — el más probable, aun así hay que ratificarlo'));
  for (const r of claros) console.log(`      ${r.slug.padEnd(30)} ${linea(r.candidatos[0])}`);
  console.log('');

  console.log(bold(yellow(`  ? VARIOS CANDIDATOS (${dudosos.length})`)) + dim(' — elegir a mano'));
  for (const r of dudosos) {
    console.log(`      ${bold(r.slug)}`);
    for (const cand of r.candidatos) console.log(`         · ${linea(cand)}`);
  }
  console.log('');

  if (vacios.length) {
    console.log(bold(red(`  ✗ SIN CANDIDATO (${vacios.length})`)));
    for (const r of vacios) console.log(`      ${r.slug.padEnd(30)} ${dim(r.error || 'la búsqueda no devolvió nada que encaje')}`);
    console.log('');
  }

  /* El subproducto más útil: donde el candidato es bueno pero su fin de
   * vigencia no cuadra con el del censo, o hay convenio nuevo que la ficha no
   * recoge, o la fecha del censo está mal. Las dos cosas hay que mirarlas.  */
  const desfases = res
    .map((r) => ({ r, cand: r.candidatos[0] }))
    .filter(({ r, cand }) => cand && r.vigenciaFin && cand.vigenciaHasta && r.vigenciaFin !== cand.vigenciaHasta)
    .sort((a, b) => String(b.cand.vigenciaHasta).localeCompare(String(a.cand.vigenciaHasta)));

  if (desfases.length) {
    console.log(bold(cyan(`  ⚡ VIGENCIA QUE NO CUADRA CON EL CENSO (${desfases.length})`)));
    console.log(dim('    O hay convenio posterior que la ficha no recoge, o la fecha del censo está mal.\n'));
    for (const { r, cand } of desfases) {
      const nuevo = cand.vigenciaHasta > r.vigenciaFin ? red(' ← REGCON va por delante') : '';
      console.log(`      ${r.slug.padEnd(30)} censo ${r.vigenciaFin} · REGCON ${bold(cand.vigenciaHasta)}${nuevo}`);
    }
    console.log('');
  }
  console.log(dim('  Ningún código se copia al censo automáticamente: son propuestas.'));
  console.log(dim('  Verificar en REGCON antes de ratificar, sobre todo donde conviven dos convenios del mismo sector.\n'));
}

main().catch((e) => { console.error(red(`\nFallo: ${e.message}`)); process.exit(1); });
