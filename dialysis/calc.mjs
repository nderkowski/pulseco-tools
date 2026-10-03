// Plain arithmetic for the dialysis staff tools page. No clinical decisions; every function returns null on bad input.
const num = v => (typeof v === 'number' && Number.isFinite(v) ? v : (typeof v === 'string' && v.trim() !== '' && Number.isFinite(Number(v)) ? Number(v) : null));
const round = (n, d = 2) => {
  const result = Math.round(n * 10 ** d) / 10 ** d;
  return Number.isFinite(result) ? result : null;
};

export function parseTime(text) {
  const m = /^(\d{1,2}):(\d{2})$/.exec(String(text ?? '').trim());
  if (!m) return null;
  const h = Number(m[1]), min = Number(m[2]);
  return h > 23 || min > 59 ? null : h * 60 + min;
}

export function formatTime(totalMinutes) {
  if (!Number.isFinite(totalMinutes)) return null;
  const t = ((Math.round(totalMinutes) % 1440) + 1440) % 1440;
  return String(Math.floor(t / 60)).padStart(2, '0') + ':' + String(t % 60).padStart(2, '0');
}

// Evenly spaced breaks across a shift: n breaks split the shift into n+1 equal stretches.
export function breakSchedule(start, lengthHours, breaks, breakMinutes = 30) {
  const s = parseTime(start), len = num(lengthHours), n = num(breaks), bm = num(breakMinutes);
  if (s === null || len === null || n === null || bm === null) return null;
  if (len <= 0 || len > 24 || !Number.isInteger(n) || n < 1 || n > 10 || bm < 0) return null;
  const stretch = (len * 60) / (n + 1);
  if (bm >= stretch) return null;
  return Array.from({ length: n }, (_, i) => {
    const at = s + stretch * (i + 1) - bm / 2;
    return { number: i + 1, from: formatTime(at), to: formatTime(at + bm) };
  });
}

export const lbToKg = v => (num(v) === null ? null : round(num(v) * 0.45359237, 3));
export const kgToLb = v => (num(v) === null ? null : round(num(v) / 0.45359237, 3));
export const fToC = v => (num(v) === null ? null : round(((num(v) - 32) * 5) / 9, 2));
export const cToF = v => (num(v) === null ? null : round((num(v) * 9) / 5 + 32, 2));
export const mlToOz = v => (num(v) === null ? null : round(num(v) / 29.5735295625, 3));
export const ozToMl = v => (num(v) === null ? null : round(num(v) * 29.5735295625, 2));
export const inToCm = v => (num(v) === null ? null : round(num(v) * 2.54, 2));
export const cmToIn = v => (num(v) === null ? null : round(num(v) / 2.54, 2));

// Pre-weight minus dry weight, in kg, shown as mL (1 kg = 1000 mL) and as mL/hr over the run time.
export function fluidRemoval(preKg, dryKg, runHours) {
  const pre = num(preKg), dry = num(dryKg), hrs = num(runHours);
  if (pre === null || dry === null || hrs === null || pre <= 0 || dry <= 0 || hrs <= 0) return null;
  const kg = round(pre - dry, 3);
  if (kg === null) return null;
  const ml = round(kg * 1000, 0), mlPerHour = round((kg * 1000) / hrs, 0);
  return ml === null || mlPerHour === null ? null : { kg, ml, mlPerHour, belowDry: kg < 0 };
}

// Treatment end time from start time and run length.
export function treatmentEnd(start, runHours, runMinutes = 0) {
  const s = parseTime(start), h = num(runHours), m = num(runMinutes);
  if (s === null || h === null || m === null || h < 0 || m < 0 || h + m <= 0) return null;
  const total = Math.round(h * 60 + m);
  if (!Number.isFinite(total) || !Number.isFinite(s + total)) return null;
  const startDate = new Date();
  startDate.setHours(Math.floor(s / 60), s % 60, 0, 0);
  if (!Number.isFinite(new Date(startDate.getTime() + total * 60000).getTime())) return null;
  const end = formatTime(s + total);
  return end === null ? null : { end, nextDay: s + total >= 1440, totalMinutes: total };
}

// Minutes remaining from `now` (minutes since midnight) to an end time, treating a past end as tomorrow.
export function minutesRemaining(endTime, nowMinutes) {
  const e = parseTime(endTime), n = num(nowMinutes);
  if (e === null || n === null) return null;
  return (((e - n) % 1440) + 1440) % 1440;
}
