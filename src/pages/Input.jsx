import { useState } from 'react';
import { addRecord as apiAddRecord } from '../services/api';
import { useRecords } from '../hooks/useRecords';
import { useData } from '../context/DataContext';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import Toast from '../components/ui/Toast';
import Skeleton from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';
import { formatDate, formatKg, formatPercent } from '../utils/formatters';
import { wastePercent } from '../utils/calculations';
import { ClipboardList, PlusCircle } from 'lucide-react';

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner'];

const emptyForm = {
  date:      new Date().toISOString().slice(0, 10),
  time:      new Date().toTimeString().slice(0, 5),
  mealType:  'lunch',
  preparedKg:'',
  people:    '',
  wastedKg:  '',
  notes:     '',
};

function validate(form) {
  const errors = {};
  if (!form.date)                                errors.date      = 'Date is required.';
  if (!form.mealType)                            errors.mealType  = 'Meal type is required.';
  if (!form.preparedKg || isNaN(+form.preparedKg) || +form.preparedKg <= 0)
                                                 errors.preparedKg = 'Enter a valid quantity (> 0 kg).';
  if (!form.people || isNaN(+form.people) || +form.people < 1)
                                                 errors.people    = 'Enter the number of people served (≥ 1).';
  if (form.wastedKg && (isNaN(+form.wastedKg) || +form.wastedKg < 0))
                                                 errors.wastedKg  = 'Wasted kg must be a non-negative number.';
  if (form.wastedKg && +form.wastedKg > +form.preparedKg)
                                                 errors.wastedKg  = 'Wasted kg cannot exceed prepared kg.';
  return errors;
}

export default function InputPage() {
  const { records, loading, error, refetch, addRecord } = useRecords();
  const [form, setForm]     = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast]   = useState(null);

  function handleChange(e) {
    const { id, value } = e.target;
    setForm(f => ({ ...f, [id]: value }));
    // Clear field error on change
    if (errors[id]) setErrors(e => ({ ...e, [id]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      const preparedKg  = +parseFloat(form.preparedKg).toFixed(2);
      const wastedKg    = form.wastedKg ? +parseFloat(form.wastedKg).toFixed(2) : 0;
      const consumedKg  = +(preparedKg - wastedKg).toFixed(2);
      // Simulate predictedKg as ~95% of prepared
      const predictedKg = +(preparedKg * 0.95).toFixed(2);

      const newRecord = {
        date:       form.date,
        mealType:   form.mealType,
        preparedKg,
        consumedKg,
        wastedKg,
        people:     +form.people,
        predictedKg,
        notes:      form.notes.trim(),
      };

      const saved = await apiAddRecord(newRecord);
      addRecord({ ...newRecord, id: saved.id });
      setToast({ message: `Entry logged — ${preparedKg} kg ${form.mealType} on ${form.date}`, type: 'success' });
      setForm(emptyForm);
      setErrors({});
    } catch (err) {
      setToast({ message: 'Failed to save entry. Please try again.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  }

  // Recent entries: last 20
  const recent = records.slice(0, 20);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page header */}
      <div>
        <h1 className="font-serif text-2xl font-semibold text-ink">Log Food Entry</h1>
        <p className="text-sm text-muted mt-1">Record daily food preparation and waste data to keep predictions accurate.</p>
      </div>

      {/* Form card */}
      <div className="bg-paper border border-border rounded-2xl p-6 shadow-card">
        <div className="flex items-center gap-2 mb-5">
          <PlusCircle className="w-5 h-5 text-clay" />
          <h2 className="font-serif font-semibold text-ink">New Entry</h2>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Date */}
            <Input
              label="Date"
              id="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              error={errors.date}
              required
            />

            {/* Time */}
            <Input
              label="Time"
              id="time"
              type="time"
              value={form.time}
              onChange={handleChange}
            />

            {/* Meal type */}
            <Select
              label="Meal Type"
              id="mealType"
              value={form.mealType}
              onChange={handleChange}
              error={errors.mealType}
              required
            >
              {MEAL_TYPES.map(m => (
                <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
              ))}
            </Select>

            {/* People */}
            <Input
              label="Number of People Served"
              id="people"
              type="number"
              min="1"
              step="1"
              placeholder="e.g. 140"
              value={form.people}
              onChange={handleChange}
              error={errors.people}
              required
            />

            {/* Prepared kg */}
            <Input
              label="Food Quantity Prepared (kg)"
              id="preparedKg"
              type="number"
              min="0.1"
              step="0.1"
              placeholder="e.g. 65.5"
              value={form.preparedKg}
              onChange={handleChange}
              error={errors.preparedKg}
              hint="Total weight of food prepared before service"
              required
            />

            {/* Wasted kg */}
            <Input
              label="Food Wasted (kg)"
              id="wastedKg"
              type="number"
              min="0"
              step="0.1"
              placeholder="e.g. 4.2"
              value={form.wastedKg}
              onChange={handleChange}
              error={errors.wastedKg}
              hint="Optional — leave blank if not measured"
            />

            {/* Notes */}
            <div className="sm:col-span-2 flex flex-col gap-1">
              <label htmlFor="notes" className="text-sm font-medium text-ink">Notes (optional)</label>
              <textarea
                id="notes"
                rows={2}
                placeholder="e.g. Event catering, special menu, unexpected crowd"
                value={form.notes}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-border text-sm text-ink bg-paper
                  placeholder:text-muted resize-none
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-1
                  hover:border-muted transition-colors"
              />
            </div>
          </div>

          {/* Live waste preview */}
          {form.preparedKg && form.wastedKg && (
            <div className="mt-4 px-4 py-3 bg-cream rounded-xl flex items-center gap-4 text-sm">
              <span className="text-muted">Waste rate preview:</span>
              <span className={`font-semibold ${
                wastePercent(+form.wastedKg, +form.preparedKg) > 15 ? 'text-tomato' :
                wastePercent(+form.wastedKg, +form.preparedKg) > 8  ? 'text-mustard' : 'text-olive'
              }`}>
                {formatPercent(wastePercent(+form.wastedKg, +form.preparedKg))}
              </span>
              <span className="text-muted">
                ({+form.preparedKg - +form.wastedKg} kg consumed)
              </span>
            </div>
          )}

          <div className="mt-5 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => { setForm(emptyForm); setErrors({}); }}>
              Reset
            </Button>
            <Button type="submit" variant="clay" disabled={submitting}>
              {submitting ? 'Saving…' : 'Log Entry'}
            </Button>
          </div>
        </form>
      </div>

      {/* Recent entries table */}
      <div className="bg-paper border border-border rounded-2xl p-5 shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <ClipboardList className="w-4 h-4 text-muted" />
          <h2 className="font-serif font-semibold text-ink">Recent Entries</h2>
        </div>

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : recent.length === 0 ? (
          <p className="text-sm text-muted py-6 text-center">No entries yet. Log your first entry above.</p>
        ) : (
          <div className="table-scroll">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="border-b border-border">
                  {['Date', 'Meal', 'Prepared', 'Consumed', 'Wasted', 'Waste %', 'People', 'Notes'].map(h => (
                    <th key={h} className="text-left pb-2 px-2 text-xs font-semibold text-muted uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map((r, i) => {
                  const wp = wastePercent(r.wastedKg, r.preparedKg);
                  return (
                    <tr key={r.id ?? i} className="border-b border-border last:border-0 hover:bg-cream transition-colors">
                      <td className="py-2.5 px-2 text-ink">{formatDate(r.date)}</td>
                      <td className="py-2.5 px-2 capitalize text-ink">{r.mealType}</td>
                      <td className="py-2.5 px-2 text-ink">{formatKg(r.preparedKg)}</td>
                      <td className="py-2.5 px-2 text-olive">{formatKg(r.consumedKg)}</td>
                      <td className="py-2.5 px-2 text-tomato">{formatKg(r.wastedKg)}</td>
                      <td className={`py-2.5 px-2 font-medium ${
                        wp > 15 ? 'text-tomato' : wp > 8 ? 'text-mustard' : 'text-olive'
                      }`}>{formatPercent(wp)}</td>
                      <td className="py-2.5 px-2 text-muted">{r.people}</td>
                      <td className="py-2.5 px-2 text-muted max-w-[160px] truncate">{r.notes || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}
