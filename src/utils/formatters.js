/**
 * Formatting helpers — locale-aware, no external dependencies.
 */

/** Format a date string to "Mon, 29 Oct 2026" */
export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  });
}

/** Short date "29 Oct" */
export function formatDateShort(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

/** Format kg with 1 decimal: "42.3 kg" */
export function formatKg(kg) {
  if (kg === null || kg === undefined) return '—';
  return `${Number(kg).toFixed(1)} kg`;
}

/** Format percentage: "12.4%" */
export function formatPercent(val) {
  if (val === null || val === undefined) return '—';
  return `${Number(val).toFixed(1)}%`;
}

/** Format INR currency: "₹1,28,000" */
export function formatINR(amount) {
  if (amount === null || amount === undefined) return '—';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

/** Capitalise first letter */
export function capitalise(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Get day-of-week label from date string */
export function dayOfWeek(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', { weekday: 'short' });
}
