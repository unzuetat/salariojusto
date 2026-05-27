/**
 * Generador de tablas comparativas sectoriales para landings de convenios.
 *
 * Lee `analisis/dataset-{sector}.json`, calcula medias y rankings, y reemplaza
 * el bloque entre los marcadores `<!-- CALLOUTS:START -->` y `<!-- CALLOUTS:END -->`
 * en cada landing con una tabla comparativa HTML.
 *
 * Uso: node scripts/generate-callouts.js
 *
 * Cuando se añada una provincia nueva o se actualice un convenio:
 *   1. Editar analisis/dataset-hosteleria.json
 *   2. Correr este script
 *   3. Todas las landings del sector se regeneran automáticamente
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SECTORS = [
  { id: 'hosteleria', label: 'Hostelería', pilarUrl: '/convenio-hosteleria.html' }
];

// Landings BOE remixed con callout editorial enriquecido (categoría reconocible
// + nota explicativa con desglose por clases de establecimiento). NO se
// sobreescriben con el callout autogenerado del dataset.
const MANUAL_OVERRIDE = new Set([
  'convenio-hosteleria-madrid.html',
  'convenio-hosteleria-bizkaia.html',
]);

// `useGrouping: true` explícito: Node 24 cambió el default es-ES a "min2",
// lo que omitía el separador de miles en cifras de 4 dígitos (1100 en vez de 1.100).
const fmtInt = n => new Intl.NumberFormat('es-ES', { useGrouping: true, maximumFractionDigits: 0 }).format(Math.round(n));
const fmtDec2 = n => new Intl.NumberFormat('es-ES', { useGrouping: true, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
const fmtEurMes = n => fmtDec2(n) + ' €/mes';
const fmtEurAnual = n => fmtInt(n) + ' €';

function computeMeans(provincias) {
  const allCount = provincias.length;
  const comparable = provincias.filter(p => p.comparable_salary);
  const comparableCount = comparable.length;
  return {
    allCount,
    comparableCount,
    jornada: provincias.reduce((s, p) => s + p.jornada_anual_h, 0) / allCount,
    camarero: comparable.reduce((s, p) => s + p.camarero_base_eurmes, 0) / comparableCount,
    brutoAnual: comparable.reduce((s, p) => s + p.bruto_anual_camarero_eur, 0) / comparableCount
  };
}

function rankProvincias(provincias, key, opts = {}) {
  const { lowerIsBetter = false } = opts;
  const filtered = provincias.filter(p => p[key] != null);
  const sorted = [...filtered].sort((a, b) =>
    lowerIsBetter ? a[key] - b[key] : b[key] - a[key]
  );
  // Ranking competitivo con manejo de empates: provincias con mismo valor
  // comparten el mismo rango "inicial" (1, 1, 3, ...). Devolvemos también
  // el rango "final" del bloque empatado para poder mostrar "5ª-9ª".
  const ranks = new Map();
  let i = 0;
  while (i < sorted.length) {
    let j = i;
    while (j < sorted.length && sorted[j][key] === sorted[i][key]) j++;
    const startRank = i + 1;
    const endRank = j;
    for (let k = i; k < j; k++) {
      ranks.set(sorted[k].id, { startRank, endRank, tied: j - i > 1 });
    }
    i = j;
  }
  return { ranks, total: filtered.length };
}

function rankLabel(rankInfo, total) {
  if (!rankInfo) return '—';
  return rankInfo.tied
    ? `${rankInfo.startRank}ª-${rankInfo.endRank}ª de ${total}`
    : `${rankInfo.startRank}ª de ${total}`;
}

function posIndicator(rankInfo, total, value, mean) {
  if (rankInfo == null) return { label: '—', tone: 'neutral' };
  const delta = value - mean;
  const pct = (delta / mean) * 100;
  const arrow = delta > 0 ? '↑' : delta < 0 ? '↓' : '→';
  const tone = Math.abs(pct) < 2 ? 'neutral' : (delta > 0 ? 'pos' : 'neg');
  const pctLabel = pct >= 0 ? `+${pct.toFixed(1).replace('.', ',')}%` : `${pct.toFixed(1).replace('.', ',')}%`;
  return {
    label: `${rankLabel(rankInfo, total)} &nbsp; <span class="callout-comp-pos__arrow">${arrow}</span> ${pctLabel}`,
    tone
  };
}

function posIndicatorJornada(rankInfo, total, value, mean) {
  // Para jornada: menor es mejor (favorable al trabajador).
  // Umbral 15h: por debajo de eso (~2 días laborales) la diferencia es
  // demasiado anecdótica para informar una negociación — etiqueta neutral.
  if (rankInfo == null) return { label: '—', tone: 'neutral' };
  const delta = value - mean;
  if (Math.abs(delta) < 15) return { label: `${rankLabel(rankInfo, total)} · en la media`, tone: 'neutral' };
  const arrow = delta < 0 ? '↓' : '↑';
  const tone = delta < 0 ? 'pos' : 'neg';
  const horasLabel = `${Math.abs(Math.round(delta))} h ${delta < 0 ? 'menos' : 'más'}`;
  return {
    label: `${rankLabel(rankInfo, total)} &nbsp; <span class="callout-comp-pos__arrow">${arrow}</span> ${horasLabel}`,
    tone
  };
}

function buildTableHtml(provincia, dataset) {
  const { provincias } = dataset;
  const means = computeMeans(provincias);

  const camareroRanks = rankProvincias(provincias, 'camarero_base_eurmes');
  const brutoRanks = rankProvincias(provincias, 'bruto_anual_camarero_eur');
  const jornadaRanks = rankProvincias(provincias, 'jornada_anual_h', { lowerIsBetter: true });

  const jornadaPos = posIndicatorJornada(
    jornadaRanks.ranks.get(provincia.id),
    jornadaRanks.total,
    provincia.jornada_anual_h,
    means.jornada
  );

  const camareroPos = provincia.comparable_salary
    ? posIndicator(
        camareroRanks.ranks.get(provincia.id),
        camareroRanks.total,
        provincia.camarero_base_eurmes,
        means.camarero
      )
    : { label: 'No comparable', tone: 'neutral' };

  const brutoPos = provincia.comparable_salary
    ? posIndicator(
        brutoRanks.ranks.get(provincia.id),
        brutoRanks.total,
        provincia.bruto_anual_camarero_eur,
        means.brutoAnual
      )
    : { label: 'No comparable', tone: 'neutral' };

  const otrasProvincias = provincias
    .filter(p => p.id !== provincia.id)
    .map(p => p.name)
    .sort()
    .join(', ');

  const excluded = provincias.filter(p => !p.comparable_salary);
  const exclusionNote = excluded.length
    ? ` ${excluded.map(p => p.name).join(', ')} ${excluded.length === 1 ? 'queda fuera' : 'quedan fuera'} del cálculo salarial: ${excluded[0].camarero_origen.toLowerCase()}.`
    : '';

  const updatedDate = new Date(dataset._meta.updatedAt).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  // Salario row solo se renderiza si la provincia tiene cifras comparables.
  // Para provincias no comparables (Bizkaia), la tabla muestra jornada + nota.
  const camareroRow = provincia.comparable_salary
    ? `        <tr>
          <td>Camarero/a base mínimo</td>
          <td class="callout-comp-tabla__own">${fmtEurMes(provincia.camarero_base_eurmes)}</td>
          <td class="callout-comp-tabla__media">${fmtEurMes(means.camarero)}</td>
          <td class="callout-comp-tabla__pos callout-comp-tabla__pos--${camareroPos.tone}">${camareroPos.label}</td>
        </tr>
        <tr>
          <td>Bruto anual Camarero/a</td>
          <td class="callout-comp-tabla__own">${fmtEurAnual(provincia.bruto_anual_camarero_eur)}</td>
          <td class="callout-comp-tabla__media">${fmtEurAnual(means.brutoAnual)}</td>
          <td class="callout-comp-tabla__pos callout-comp-tabla__pos--${brutoPos.tone}">${brutoPos.label}</td>
        </tr>`
    : `        <tr>
          <td colspan="4" class="callout-comp-tabla__nota-row">En el convenio de ${provincia.name} la categoría Camarero/a no aparece como fila propia: ${provincia.camarero_origen}. Por eso no es comparable 1:1 con las cifras de Camarero/a base de las otras provincias del corpus.</td>
        </tr>`;

  return `<h2>${provincia.name} frente a otras provincias del sector</h2>
<p>Comparamos las cifras clave de ${provincia.name} con las ${means.allCount - 1} provincias auditadas en el pilar de Hostelería. Estas referencias son útiles si negocias subida, contrato nuevo o cambias de provincia.</p>
<div class="callout-comp-tabla">
  <div style="overflow-x:auto;">
    <table>
      <thead>
        <tr>
          <th>Dimensión</th>
          <th>${provincia.name}</th>
          <th>Media del corpus</th>
          <th>Posición</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Jornada anual</td>
          <td class="callout-comp-tabla__own">${fmtInt(provincia.jornada_anual_h)} h</td>
          <td class="callout-comp-tabla__media">${fmtDec2(means.jornada)} h</td>
          <td class="callout-comp-tabla__pos callout-comp-tabla__pos--${jornadaPos.tone}">${jornadaPos.label}</td>
        </tr>
        <tr>
          <td>Pagas anuales</td>
          <td class="callout-comp-tabla__own">${provincia.pagas}</td>
          <td class="callout-comp-tabla__media">—</td>
          <td class="callout-comp-tabla__pos">—</td>
        </tr>
${camareroRow}
      </tbody>
    </table>
  </div>
  <p class="callout-comp-tabla__source">Comparado con: ${otrasProvincias}.${exclusionNote} Cuantía Camarero/a en ${provincia.name}: ${provincia.camarero_origen}. Dataset auditado el ${updatedDate}. Ver <a href="/convenio-hosteleria.html">pilar sectorial Hostelería</a> para más detalle.</p>
</div>`;
}

function injectIntoLanding(landingFile, html) {
  const fullPath = path.join(ROOT, landingFile);
  if (!fs.existsSync(fullPath)) {
    console.warn(`  ⚠️  Landing no encontrada: ${landingFile}`);
    return false;
  }
  const content = fs.readFileSync(fullPath, 'utf-8');
  const startMarker = '<!-- CALLOUTS:START -->';
  const endMarker = '<!-- CALLOUTS:END -->';
  const regex = new RegExp(`${startMarker}[\\s\\S]*?${endMarker}`);
  if (!regex.test(content)) {
    console.warn(`  ⚠️  Marcadores no encontrados en ${landingFile} — landing sin tabla comparativa`);
    return false;
  }
  const newContent = content.replace(
    regex,
    `${startMarker}\n${html}\n  ${endMarker}`
  );
  if (newContent === content) {
    return false;
  }
  fs.writeFileSync(fullPath, newContent, 'utf-8');
  return true;
}

function processSector(sector) {
  const datasetPath = path.join(ROOT, 'analisis', `dataset-${sector.id}.json`);
  if (!fs.existsSync(datasetPath)) {
    console.error(`✗ Dataset no encontrado: ${datasetPath}`);
    return;
  }
  const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf-8'));
  console.log(`\n📊 ${sector.label} — ${dataset.provincias.length} provincias en dataset`);

  let updated = 0;
  let skipped = 0;
  for (const provincia of dataset.provincias) {
    if (MANUAL_OVERRIDE.has(provincia.landing)) {
      console.log(`  · ${provincia.name} → ${provincia.landing} (skip — callout editorial manual)`);
      skipped++;
      continue;
    }
    const html = buildTableHtml(provincia, dataset);
    const ok = injectIntoLanding(provincia.landing, html);
    if (ok) {
      updated++;
      console.log(`  ✓ ${provincia.name} → ${provincia.landing}`);
    }
  }
  console.log(`\n${updated}/${dataset.provincias.length - skipped} landings regeneradas (${skipped} con callout manual).`);
}

function main() {
  console.log('Generador de tablas comparativas sectoriales');
  for (const sector of SECTORS) {
    processSector(sector);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main, computeMeans, rankProvincias, buildTableHtml };
