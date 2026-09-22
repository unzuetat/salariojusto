/**
 * regcon-lib.js — cliente de la consulta pública de REGCON.
 *
 * Registro de Convenios y Acuerdos Colectivos del Mº de Trabajo. La consulta
 * pública no pide identificación y responde a un POST de formulario normal
 * (Spring MVC, no JSF). Lo usan regcon-adapter.js y regcon-codigos.js.
 *
 * DOS DETALLES SIN LOS CUALES NO FUNCIONA, descubiertos a base de sondear:
 *   1. `_buscar` es el botón del formulario. Si no va en el cuerpo, el servidor
 *      responde 200 con el formulario en blanco y sin ningún aviso de error.
 *   2. `consulta_token_value_id` es un anti-doble-submit (el JS original le mete
 *      un Date.now()), no un CSRF. Vale cualquier timestamp, pero vacío falla.
 *
 * Se consulta de una en una y con pausa entre peticiones: es la web de un
 * ministerio, no una API pensada para que la barran.
 */
const ENDPOINT = 'https://expinterweb.mites.gob.es/regcon/pub/consultaPublicaEstatal';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

/* ── Catálogos del formulario (values reales del <select>) ─────────────── */
const AUTORIDAD = {
  'Álava': 1, 'Albacete': 2, 'Alicante': 3, 'Almería': 4, 'Ávila': 5, 'Badajoz': 6,
  'Illes Balears': 7, 'Barcelona': 8, 'Burgos': 9, 'Cáceres': 10, 'Cádiz': 11,
  'Castellón': 12, 'Ciudad Real': 13, 'Córdoba': 14, 'A Coruña': 15, 'Cuenca': 16,
  'Girona': 17, 'Granada': 18, 'Guadalajara': 19, 'Gipuzkoa': 20, 'Huelva': 21,
  'Huesca': 22, 'Jaén': 23, 'León': 24, 'Lleida': 25, 'La Rioja': 26, 'Lugo': 27,
  'Madrid': 28, 'Málaga': 29, 'Murcia': 30, 'Navarra': 31, 'Ourense': 32,
  'Asturias': 33, 'Palencia': 34, 'Las Palmas': 35, 'Pontevedra': 36,
  'Salamanca': 37, 'Tenerife': 38, 'Cantabria': 39, 'Segovia': 40, 'Sevilla': 41,
  'Soria': 42, 'Tarragona': 43, 'Teruel': 44, 'Toledo': 45, 'Valencia': 46,
  'Valladolid': 47, 'Bizkaia': 48, 'Zamora': 49, 'Zaragoza': 50, 'Ceuta': 51,
  'Melilla': 52,
  // autonómicas y estatal
  'Andalucía': 53, 'Aragón': 54, 'Canarias': 55, 'Castilla y León': 56,
  'Castilla-La Mancha': 57, 'Catalunya': 58, 'Comunitat Valenciana': 59,
  'Extremadura': 60, 'Galicia': 61, 'País Vasco': 62, 'Estatal': 63,
  'Tierras del Ebro': 65,
};

const AMBITO_FUNCIONAL = {
  franja: 1, centros: 2, empresa: 3, grupo: 4,
  inferiorProvincia: 5,   // comarcal, local (p. ej. Maresme)
  sectorProvincial: 6,    // sector igual o superior a la provincia ← lo nuestro
};

const NATURALEZA = { convenioColectivo: 1, acuerdoMarco: 8, extension: 6 };

/* ── HTTP ──────────────────────────────────────────────────────────────── */
function crearJar() {
  const store = new Map();
  return {
    header: () => [...store].map(([k, v]) => `${k}=${v}`).join('; '),
    absorb(res) {
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

async function abrirSesion() {
  const jar = crearJar();
  const res = await fetch(ENDPOINT, { headers: { 'User-Agent': UA, Accept: 'text/html' } });
  jar.absorb(res);
  await res.text();
  if (!res.ok) throw new Error(`REGCON no abre sesión: HTTP ${res.status}`);
  return jar;
}

/**
 * Lanza una búsqueda. `filtros` acepta las claves del formulario:
 *   codigoConvenio, denominacion, tipoBusquedaDenominacion ('AND'|'OR'),
 *   autoridadLaboral, idAmbFuncionalConsPublica, idNaturalezaConsPublica,
 *   idTipoTramiteConsPublica, fhIncripcionPublicacionDesde/Hasta (dd/mm/aaaa)
 */
async function buscar(jar, filtros) {
  const campos = { esNuevaBusqueda: 'true', _esNuevaBusqueda: '1', consulta_token_value_id: String(Date.now()), _buscar: 'Buscar' };
  for (const [k, v] of Object.entries(filtros)) if (v !== undefined && v !== null && v !== '') campos[k] = String(v);
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'User-Agent': UA, 'Content-Type': 'application/x-www-form-urlencoded',
      Referer: ENDPOINT, Origin: 'https://expinterweb.mites.gob.es', Cookie: jar.header(),
    },
    body: new URLSearchParams(campos),
  });
  jar.absorb(res);
  const html = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return html;
}

/** Páginas siguientes de la última búsqueda: van por GET sobre la misma sesión. */
async function paginaN(jar, n) {
  const res = await fetch(`${ENDPOINT}?pagina=${n}`, {
    headers: { 'User-Agent': UA, Referer: ENDPOINT, Cookie: jar.header() },
  });
  jar.absorb(res);
  const html = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status} en página ${n}`);
  return html;
}

/* ── Parseo ────────────────────────────────────────────────────────────── */
const ENTIDADES = {
  '&nbsp;': ' ', '&amp;': '&', '&quot;': '"', '&#39;': "'",
  '&aacute;': 'á', '&eacute;': 'é', '&iacute;': 'í', '&oacute;': 'ó', '&uacute;': 'ú',
  '&Aacute;': 'Á', '&Eacute;': 'É', '&Iacute;': 'Í', '&Oacute;': 'Ó', '&Uacute;': 'Ú',
  '&ntilde;': 'ñ', '&Ntilde;': 'Ñ', '&uuml;': 'ü', '&ordf;': 'ª', '&ordm;': 'º',
};
const limpia = (s) => s
  .replace(/<[^>]+>/g, ' ')
  .replace(/&[a-zA-Z#0-9]+;/g, (e) => ENTIDADES[e] ?? ' ')
  .replace(/\s+/g, ' ').trim();

const isoDe = (f) => {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(f || '');
  return m ? `${m[3]}-${m[2]}-${m[1]}` : null;
};

/** "Resultados1 - 15 de 216" → 216 */
function totalResultados(html) {
  const m = /Resultados\s*\d+\s*-\s*\d+\D{0,12}?(\d+)/i.exec(limpia(html));
  return m ? Number(m[1]) : null;
}

/** Filas de la tabla de resultados. Una fila = un TRÁMITE, no un convenio. */
function parseFilas(html) {
  const tabla = /<table[\s\S]*?<\/table>/i.exec(html);
  if (!tabla) return [];
  const out = [];
  for (const fila of tabla[0].match(/<tr[\s\S]*?<\/tr>/gi) || []) {
    const celdas = (fila.match(/<td[\s\S]*?<\/td>/gi) || []).map(limpia);
    if (celdas.length < 5) continue;
    const [codigo, denominacion, tramite, autoridad, publicacion, desde, hasta] = celdas;
    if (!/^\d{14}$/.test(codigo || '')) continue;
    out.push({
      codigo, denominacion, tramite, autoridad,
      publicacion: isoDe(publicacion), vigenciaDesde: isoDe(desde), vigenciaHasta: isoDe(hasta),
    });
  }
  return out;
}

/** Busca y recorre hasta `maxPaginas` páginas. Devuelve {total, filas}. */
async function buscarTodo(jar, filtros, { maxPaginas = 1, delay = 1200 } = {}) {
  const primera = await buscar(jar, filtros);
  const total = totalResultados(primera);
  const filas = parseFilas(primera);
  const paginas = Math.min(maxPaginas, total ? Math.ceil(total / 15) : 1);
  for (let p = 2; p <= paginas; p++) {
    await new Promise((r) => setTimeout(r, delay));
    filas.push(...parseFilas(await paginaN(jar, p)));
  }
  return { total, filas };
}

/** Agrupa filas por código de convenio, conservando el trámite más reciente. */
function agrupaPorConvenio(filas) {
  const m = new Map();
  for (const f of filas) {
    const cur = m.get(f.codigo);
    if (!cur) m.set(f.codigo, { codigo: f.codigo, denominacion: f.denominacion, autoridad: f.autoridad, tramites: [f] });
    else cur.tramites.push(f);
  }
  for (const v of m.values()) {
    v.tramites.sort((a, b) => String(b.publicacion).localeCompare(String(a.publicacion)));
    v.ultimo = v.tramites[0];
    v.vigenciaHasta = v.ultimo.vigenciaHasta;
  }
  return [...m.values()];
}

module.exports = {
  ENDPOINT, UA, AUTORIDAD, AMBITO_FUNCIONAL, NATURALEZA,
  abrirSesion, buscar, paginaN, buscarTodo,
  parseFilas, totalResultados, agrupaPorConvenio, limpia, isoDe,
};
