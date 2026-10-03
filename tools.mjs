import { fluidRemoval, treatmentEnd, lbToKg, kgToLb, fToC, cToF, mlToOz, ozToMl } from './dialysis/calc.mjs';
const tool = document.querySelector('[data-tool]').dataset.tool;
const field = id => document.getElementById(id);
const output = text => { field('result').textContent = text; };
if (tool === 'fluid') {
  const update = () => {
    const r = fluidRemoval(field('pre').value, field('target').value, field('hours').value);
    if (!r) return output('Enter positive weights in kg and a positive run time in decimal hours.');
    output(r.belowDry ? `Pre-weight is ${-r.kg} kg below target. No removal recommendation is made.` : `${r.kg} kg difference = ${r.ml} mL water-equivalent; ${r.mlPerHour} mL/hr over the entered run time.`);
  };
  for (const id of ['pre', 'target', 'hours']) field(id).addEventListener('input', update);
  update();
} else if (tool === 'end') {
  const update = () => {
    const h = Number(field('hours').value), m = Number(field('minutes').value);
    const r = field('hours').value !== '' && field('minutes').value !== '' && Number.isInteger(h) && Number.isInteger(m) && m <= 59 ? treatmentEnd(field('start').value, h, m) : null;
    if (!r) return output('Enter a start time, non-negative whole hours and 0–59 minutes, with a positive total duration.');
    const [startH, startM] = field('start').value.split(':').map(Number);
    const days = Math.floor((startH * 60 + startM + r.totalMinutes) / 1440);
    output(`Planned end: ${r.end}${days ? days === 1 ? ' (next day)' : ` (${days} days later)` : ''}. Clock arithmetic only; pauses and clock changes are not included.`);
  };
  for (const id of ['start', 'hours', 'minutes']) field(id).addEventListener('input', update);
  update();
} else if (tool === 'units') {
  for (const [a, b, ab, ba] of [['lb', 'kg', lbToKg, kgToLb], ['f', 'c', fToC, cToF], ['ml', 'oz', mlToOz, ozToMl]]) {
    for (const [from, to, convert] of [[a, b, ab], [b, a, ba]]) field(from).addEventListener('input', () => {
      const value = convert(field(from).value);
      field(to).value = value === null ? '' : value;
      const name = document.querySelector(`label[for="${to}"]`).firstChild.textContent;
      output(value === null ? 'Enter a number to convert.' : `${name}: ${value}`);
    });
  }
}
