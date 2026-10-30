/**
 * Calculation utilities for food waste metrics.
 * All functions are pure – no side effects.
 */

/** Waste percentage from prepared and wasted kg */
export function wastePercent(wastedKg, preparedKg) {
  if (!preparedKg || preparedKg === 0) return 0;
  return (wastedKg / preparedKg) * 100;
}

/** Cost saved assuming a cost per kg of food */
export const COST_PER_KG_INR = 160; // average cost per kg in INR

export function costSaved(savedKg) {
  return savedKg * COST_PER_KG_INR;
}

/** CO2 reduction: 1 kg food waste = approx 2.5 kg CO2 equivalent */
export function co2Reduction(wasteReducedKg) {
  return wasteReducedKg * 2.5;
}

/** Summarise an array of records into dashboard stats */
export function summariseRecords(records) {
  if (!records || records.length === 0) {
    return { totalPrepared: 0, totalConsumed: 0, totalWasted: 0, totalPeople: 0, avgWastePercent: 0, costSavedTotal: 0 };
  }
  const totalPrepared  = records.reduce((s, r) => s + (r.preparedKg  ?? 0), 0);
  const totalConsumed  = records.reduce((s, r) => s + (r.consumedKg  ?? 0), 0);
  const totalWasted    = records.reduce((s, r) => s + (r.wastedKg    ?? 0), 0);
  const totalPeople    = records.reduce((s, r) => s + (r.people      ?? 0), 0);
  const avgWaste       = wastePercent(totalWasted, totalPrepared);
  const saved          = totalPrepared - totalWasted; // consumed portion
  return {
    totalPrepared:    +totalPrepared.toFixed(1),
    totalConsumed:    +totalConsumed.toFixed(1),
    totalWasted:      +totalWasted.toFixed(1),
    totalPeople,
    avgWastePercent:  +avgWaste.toFixed(1),
    costSavedTotal:   +costSaved(totalConsumed).toFixed(0),
  };
}

/** Filter records to the last N days */
export function lastNDays(records, n) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - n);
  return records.filter(r => new Date(r.date) >= cutoff);
}

/** Group records by date → [{ date, wastePercent, wasted, prepared }] */
export function groupByDate(records) {
  const map = {};
  for (const r of records) {
    if (!map[r.date]) map[r.date] = { date: r.date, wasted: 0, prepared: 0, consumed: 0, people: 0, count: 0 };
    map[r.date].wasted   += r.wastedKg   ?? 0;
    map[r.date].prepared += r.preparedKg ?? 0;
    map[r.date].consumed += r.consumedKg ?? 0;
    map[r.date].people   += r.people     ?? 0;
    map[r.date].count++;
  }
  return Object.values(map)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(d => ({ ...d, wastePercent: +wastePercent(d.wasted, d.prepared).toFixed(1) }));
}

/** Group records by mealType → { breakfast: { wasted, prepared }, ... } */
export function groupByMealType(records) {
  const map = {};
  for (const r of records) {
    const mt = r.mealType ?? 'other';
    if (!map[mt]) map[mt] = { wasted: 0, prepared: 0, consumed: 0 };
    map[mt].wasted   += r.wastedKg   ?? 0;
    map[mt].prepared += r.preparedKg ?? 0;
    map[mt].consumed += r.consumedKg ?? 0;
  }
  return map;
}

/** Get week-over-week change in waste % */
export function weekOverWeekChange(records) {
  const byDate = groupByDate(records);
  const len = byDate.length;
  if (len < 14) return null;
  const thisWeek = byDate.slice(len - 7);
  const lastWeek = byDate.slice(len - 14, len - 7);
  const avg = arr => arr.reduce((s, d) => s + d.wastePercent, 0) / arr.length;
  return +(avg(thisWeek) - avg(lastWeek)).toFixed(1);
}
