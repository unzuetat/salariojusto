#!/usr/bin/env node
/**
 * vigilancia-convenios.js — DETECTOR §4.1: calendario de vigilancia priorizada.
 *
 * La propia BBDD (censo.json) es el mejor predictor de qué convenio se va a
 * renegociar: un convenio vencido o en ultraactividad se renegocia pronto.
 * Este script NO rastrea boletines (eso son los adaptadores BOE/BOP). Solo
 * lee el censo y dice QUÉ convenios vigilar y con qué frecuencia, para dirigir
 * las revisiones manuales en vez de barrer a ciegas.
 *
 * Uso:  node scripts/audit/vigilancia-convenios.js
 *
 * Reglas (doc detector §4.1):
 *   - en ultraactividad / especial / vence en < 6 meses → SEMANAL
 *   - vigente y vence en > 6 meses (o sin fecha) → MENSUAL
 * Fuente: data/convenios/censo.json (ver feedback_estado_convenios_registro_no_grep).
 */
const fs = require('fs');
const path = require('path');

const CENSO = path.join(__dirname, '..', '..', 'data', 'convenios', 'censo.json');
const HOY = new Date();
const hoyStr = HOY.toISOString().slice(0, 10);
const SEIS_MESES_MS = 183 * 24 * 60 * 60 * 1000;

const c = (s, code) => `\x1b[${code}m${s}\x1b[0m`;
const red = (s) => c(s, 31), green = (s) => c(s, 32), yellow = (s) => c(s, 33), dim = (s) => c(s, 90), bold = (s) => c(s, 1);

function diasHasta(fin) {
  if (!fin) return null;
  return Math.round((new Date(fin + 'T00:00:00Z') - HOY) / (24 * 60 * 60 * 1000));
}

function prioridad(f) {
  if (f.tipo === 'marco') return null; // los marcos estatales se vigilan vía BOE, no aquí
  if (f.estado === 'ultraactividad') return { nivel: 'SEMANAL', motivo: 'en ultraactividad (renegociación probable)' };
  if (f.estado === 'especial') return { nivel: 'SEMANAL', motivo: 'estado especial (continuidad atípica)' };
  const d = diasHasta(f.vigenciaFin);
  if (d === null) return { nivel: 'MENSUAL', motivo: 'sin fecha de fin en el censo → completar', flag: true };
  if (d < 0) return { nivel: 'SEMANAL', motivo: `vigencia VENCIÓ hace ${-d} días → ¿ultraactividad o convenio nuevo?`, flag: true };
  if (d <= 183) return { nivel: 'SEMANAL', motivo: `vence en ${d} días (< 6 meses)` };
  return { nivel: 'MENSUAL', motivo: `vigente, vence en ${d} días` };
}

function main() {
  const censo = JSON.parse(fs.readFileSync(CENSO, 'utf8'));
  const filas = (censo.fichas || []).map((f) => ({ ...f, p: prioridad(f) })).filter((f) => f.p);

  const semanal = filas.filter((f) => f.p.nivel === 'SEMANAL');
  const mensual = filas.filter((f) => f.p.nivel === 'MENSUAL');
  // ordenar semanal por urgencia: vencidos primero, luego por días hasta vencer
  const urgencia = (f) => { const d = diasHasta(f.vigenciaFin); return d === null ? 9999 : d; };
  semanal.sort((a, b) => urgencia(a) - urgencia(b));

  console.log(`\n══ Vigilancia de convenios · calendario priorizado (hoy: ${hoyStr}) ══`);
  console.log(dim('   Fuente: censo.json · el detector abre candidatos, la confirmación es humana\n'));

  console.log(bold(red(`  🔴 REVISIÓN SEMANAL (${semanal.length})`)) + dim(' — ultraactividad, especiales o vencen pronto'));
  for (const f of semanal) {
    const flag = f.p.flag ? red(' ⚠') : '';
    console.log(`     ${f.ambito.padEnd(16)} ${dim(f.sector.padEnd(12))} ${f.p.motivo}${flag}`);
  }

  console.log('\n' + bold(green(`  🟢 REVISIÓN MENSUAL (${mensual.length})`)) + dim(' — vigentes con recorrido'));
  for (const f of mensual) {
    console.log(`     ${f.ambito.padEnd(16)} ${dim(f.sector.padEnd(12))} ${dim(f.p.motivo)}`);
  }

  const sinFecha = filas.filter((f) => f.p.flag && !f.vigenciaFin);
  const vencidos = filas.filter((f) => { const d = diasHasta(f.vigenciaFin); return d !== null && d < 0 && f.estado !== 'ultraactividad'; });
  console.log('\n' + dim('  ── acciones ──'));
  if (vencidos.length) console.log(yellow(`  ⚠️  ${vencidos.length} con vigencia vencida y NO marcados ultraactividad → revisar estado en el censo`));
  if (sinFecha.length) console.log(yellow(`  ⚠️  ${sinFecha.length} sin vigenciaFin en el censo → completar para afinar la vigilancia`));
  console.log(`  📅 ${semanal.length} a vigilar esta semana · ${mensual.length} este mes.\n`);
}

main();
