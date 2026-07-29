#!/usr/bin/env node
/**
 * censo-convenios.js — LECTOR del censo único de estado de convenios.
 *
 * Fuente de verdad: data/convenios/censo.json (hand-curated).
 * Este script NO deriva estado del HTML: solo lee el censo, lo contrasta
 * contra los ficheros convenio-*.html del disco y reporta cifras + alertas.
 *
 * Uso:  node scripts/audit/censo-convenios.js
 * Regla: ver memoria feedback_estado_convenios_registro_no_grep.
 *        El estado (vigente/ultraactividad) SOLO sale de aquí.
 *
 * Exit 1 si hay incoherencias (huérfanos, filas sin ficha, o mismatch de canon).
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const CENSO = path.join(ROOT, 'data', 'convenios', 'censo.json');
const HOY = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

const c = (s, code) => `\x1b[${code}m${s}\x1b[0m`;
const red = (s) => c(s, 31), green = (s) => c(s, 32), yellow = (s) => c(s, 33), dim = (s) => c(s, 90);

function main() {
  const censo = JSON.parse(fs.readFileSync(CENSO, 'utf8'));
  const fichas = censo.fichas || [];

  // Ficheros reales en disco
  const disco = fs.readdirSync(ROOT).filter((f) => /^convenio-.*\.html$/.test(f)).sort();
  const enCenso = new Set(fichas.map((f) => f.archivo));
  const enDisco = new Set(disco);

  const problemas = [];

  console.log('\n══ censo-convenios · estado de convenios (fuente: censo.json) ══\n');
  console.log(dim(`  Actualizado: ${censo.actualizado} · hoy: ${HOY}\n`));

  // 1) Coherencia censo <-> disco
  const huerfanos = disco.filter((f) => !enCenso.has(f));       // en disco, sin fila
  const fantasmas = fichas.filter((f) => !enDisco.has(f.archivo)); // fila sin fichero
  if (huerfanos.length) problemas.push(`${huerfanos.length} ficha(s) en disco SIN fila en el censo: ${huerfanos.join(', ')}`);
  if (fantasmas.length) problemas.push(`${fantasmas.length} fila(s) en el censo SIN fichero: ${fantasmas.map((f) => f.archivo).join(', ')}`);

  // 2) Conteos
  const prov = fichas.filter((f) => f.tipo === 'provincial');
  const marcos = fichas.filter((f) => f.tipo === 'marco');
  const ultra = prov.filter((f) => f.estado === 'ultraactividad');
  const vigentes = prov.filter((f) => f.estado === 'vigente');
  const especiales = prov.filter((f) => f.estado === 'especial');
  const otros = prov.filter((f) => !['ultraactividad', 'vigente', 'especial'].includes(f.estado));
  const indexables = fichas.filter((f) => f.indexable);

  console.log('  📐 CIFRAS (desde el censo):');
  console.log(`     ${prov.length} provinciales + ${marcos.length} marcos = ${green(prov.length + marcos.length)} fichas`);
  console.log(`     ${indexables.length} indexables · ${fichas.length - indexables.length} noindex`);
  console.log(`     Estado provinciales: ${red(ultra.length + ' en ultraactividad')} · ${green(vigentes.length + ' vigentes')} · ${yellow(especiales.length + ' especiales')}${otros.length ? ' · ' + red(otros.length + ' sin clasificar') : ''}`);
  console.log('');
  console.log('  🔴 En ultraactividad:');
  ultra.forEach((f) => console.log(`     ${f.ambito.padEnd(18)} ${dim('· ' + f.fuenteEstado)}`));
  console.log('');
  console.log('  🟡 Especiales (continuidad atípica, se vigilan aparte):');
  especiales.forEach((f) => console.log(`     ${f.ambito.padEnd(18)} ${dim('· ' + f.nota)}`));
  console.log('');

  // 3) Canon declarado vs computado
  const canon = censo.canon || {};
  if (canon.provinciales !== prov.length || canon.marcos !== marcos.length) {
    problemas.push(`canon declarado (${canon.provinciales}+${canon.marcos}) ≠ computado (${prov.length}+${marcos.length}) — actualiza el bloque "canon" del censo`);
  } else {
    console.log(green(`  ✅ canon coherente: ${canon.provinciales} provinciales + ${canon.marcos} marcos = ${canon.total}`));
  }

  // 4) Alertas de vigencia vencida sin marcar ultraactividad
  const vencidosSinUltra = prov.filter((f) => f.vigenciaFin && f.vigenciaFin < HOY && f.estado === 'vigente');
  if (vencidosSinUltra.length) {
    console.log('');
    console.log(yellow('  ⚠️  Vigencia vencida pero marcado "vigente" — revisar si entró en ultraactividad o hay convenio nuevo:'));
    vencidosSinUltra.forEach((f) => console.log(`     ${f.ambito} (${f.sector}) · venció ${f.vigenciaFin}`));
  }

  // 5) Backlog de ratificación
  const porRevisar = fichas.filter((f) => f.confianza === 'revisar');
  const sinRatificar = fichas.filter((f) => f.revisado === false);
  console.log('');
  if (porRevisar.length) {
    console.log(yellow(`  📋 ${porRevisar.length} caso(s) marcados "confianza: revisar" (pendientes de ratificar contra boletín):`));
    porRevisar.forEach((f) => console.log(`     ${f.ambito} (${f.sector}) → ${f.estado} · ${dim(f.nota)}`));
  }
  console.log(dim(`\n  ${sinRatificar.length}/${fichas.length} filas con revisado:false (estados propuestos por Claude, sin ratificación humana todavía).`));

  // Verdicto
  console.log('');
  if (problemas.length) {
    console.log(red(`❌ ${problemas.length} incoherencia(s):`));
    problemas.forEach((p) => console.log(red('   · ' + p)));
    process.exit(1);
  }
  console.log(green('✅ censo coherente con el disco · 0 incoherencias estructurales'));
  console.log(dim('   (los estados en "revisar"/revisado:false son de contenido, no bloquean)\n'));
}

main();
