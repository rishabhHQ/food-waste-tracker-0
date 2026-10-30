/**
 * CSV export utility.
 * Converts an array of flat objects into a downloadable CSV file.
 */

export function exportToCsv(filename, rows) {
  if (!rows || rows.length === 0) return;

  const headers = Object.keys(rows[0]);
  const csvRows = [
    headers.join(','),
    ...rows.map(row =>
      headers.map(h => {
        const val = row[h] ?? '';
        // Escape commas and quotes
        const str = String(val).replace(/"/g, '""');
        return /[,"\n]/.test(str) ? `"${str}"` : str;
      }).join(',')
    ),
  ];

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href     = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/** Flatten a record for CSV export */
export function flattenRecord(r) {
  return {
    Date:        r.date,
    'Meal Type': r.mealType,
    'Prepared (kg)': r.preparedKg,
    'Consumed (kg)': r.consumedKg,
    'Wasted (kg)':   r.wastedKg,
    'Waste %':       ((r.wastedKg / r.preparedKg) * 100).toFixed(1),
    'People Served': r.people,
    'Predicted (kg)': r.predictedKg,
    Notes:           r.notes ?? '',
  };
}
