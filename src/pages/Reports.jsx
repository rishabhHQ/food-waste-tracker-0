import { useState, useMemo } from 'react';
import { useRecords } from '../hooks/useRecords';
import ChartCard from '../components/charts/ChartCard';
import WasteTrendChart from '../components/charts/WasteTrendChart';
import ConsumptionBarChart from '../components/charts/ConsumptionBarChart';
import MealTypeDoughnut from '../components/charts/MealTypeDoughnut';
import Skeleton from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import { groupByDate, groupByMealType } from '../utils/calculations';
import { wastePercent } from '../utils/calculations';
import { formatDate, formatKg, formatPercent } from '../utils/formatters';
import { exportToCsv, flattenRecord } from '../utils/csvExport';
import { Download, Filter } from 'lucide-react';

const TABS = ['Daily', 'Weekly', 'Monthly'];
const MEAL_TYPES = ['all', 'breakfast', 'lunch', 'dinner'];

function getDaysRange(tab) {
  if (tab === 'Daily')   return 7;
  if (tab === 'Weekly')  return 30;
  return 90; // Monthly
}

function groupByWeek(byDate) {
  const weeks = [];
  for (let i = 0; i < byDate.length; i += 7) {
    const chunk = byDate.slice(i, i + 7);
    const prepared = chunk.reduce((s, d) => s + d.prepared, 0);
    const wasted   = chunk.reduce((s, d) => s + d.wasted, 0);
    const consumed = chunk.reduce((s, d) => s + d.consumed, 0);
    weeks.push({
      date:         chunk[0].date,
      prepared:     +prepared.toFixed(1),
      wasted:       +wasted.toFixed(1),
      consumed:     +consumed.toFixed(1),
      wastePercent: +wastePercent(wasted, prepared).toFixed(1),
    });
  }
  return weeks;
}

function groupByMonth(byDate) {
  const map = {};
  for (const d of byDate) {
    const key = d.date.slice(0, 7); // YYYY-MM
    if (!map[key]) map[key] = { date: key + '-01', prepared: 0, wasted: 0, consumed: 0 };
    map[key].prepared += d.prepared;
    map[key].wasted   += d.wasted;
    map[key].consumed += d.consumed;
  }
  return Object.values(map).map(m => ({
    ...m,
    prepared:     +m.prepared.toFixed(1),
    wasted:       +m.wasted.toFixed(1),
    consumed:     +m.consumed.toFixed(1),
    wastePercent: +wastePercent(m.wasted, m.prepared).toFixed(1),
  }));
}

export default function Reports() {
  const { records, loading, error, refetch } = useRecords();
  const [tab, setTab]         = useState('Daily');
  const [mealFilter, setMealFilter] = useState('all');
  const [startDate, setStartDate]   = useState('');
  const [endDate, setEndDate]       = useState('');

  // Filter records
  const filtered = useMemo(() => {
    return records.filter(r => {
      if (mealFilter !== 'all' && r.mealType !== mealFilter) return false;
      if (startDate && r.date < startDate) return false;
      if (endDate   && r.date > endDate)   return false;
      return true;
    });
  }, [records, mealFilter, startDate, endDate]);

  // Chart data based on tab
  const days     = getDaysRange(tab);
  const byDate   = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const slice = filtered.filter(r => new Date(r.date) >= cutoff);
    return groupByDate(slice);
  }, [filtered, days]);

  const chartData = useMemo(() => {
    if (tab === 'Weekly') return groupByWeek(byDate);
    if (tab === 'Monthly') return groupByMonth(byDate);
    return byDate;
  }, [tab, byDate]);

  // Chart data with predicted
  const chartDataWithPred = useMemo(() => {
    return chartData.map(d => ({
      ...d,
      predicted: +(d.prepared * 0.93).toFixed(1),
    }));
  }, [chartData]);

  const mealTypeData = useMemo(() => groupByMealType(filtered), [filtered]);

  function handleDownload() {
    const rows = filtered.map(flattenRecord);
    exportToCsv(`foodwise-records-${tab.toLowerCase()}.csv`, rows);
  }

  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      {/* Header + tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-ink">Reports</h1>
          <p className="text-sm text-muted mt-0.5">Analyse trends across daily, weekly and monthly timeframes.</p>
        </div>
        <div className="sm:ml-auto flex gap-2 bg-cream-dark rounded-xl p-1">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                tab === t ? 'bg-paper shadow-card text-ink' : 'text-muted hover:text-ink'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Filters bar */}
      <div className="bg-paper border border-border rounded-2xl p-4 flex flex-wrap gap-3 items-end shadow-card">
        <Filter className="w-4 h-4 text-muted mt-6 hidden sm:block" />
        <Select
          label="Meal Type"
          id="mealFilter"
          value={mealFilter}
          onChange={e => setMealFilter(e.target.value)}
          className="min-w-[130px]"
        >
          {MEAL_TYPES.map(m => (
            <option key={m} value={m}>{m === 'all' ? 'All Meals' : m.charAt(0).toUpperCase() + m.slice(1)}</option>
          ))}
        </Select>

        <div className="flex flex-col gap-1">
          <label htmlFor="startDate" className="text-sm font-medium text-ink">From</label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="px-3 py-2 rounded-xl border border-border text-sm text-ink bg-paper hover:border-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-1"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="endDate" className="text-sm font-medium text-ink">To</label>
          <input
            id="endDate"
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="px-3 py-2 rounded-xl border border-border text-sm text-ink bg-paper hover:border-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-1"
          />
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => { setMealFilter('all'); setStartDate(''); setEndDate(''); }}
          className="self-end"
        >
          Clear
        </Button>

        <Button
          variant="clay"
          size="sm"
          onClick={handleDownload}
          className="self-end ml-auto"
          disabled={filtered.length === 0}
        >
          <Download className="w-3.5 h-3.5" />
          Download CSV
        </Button>
      </div>

      {/* Charts row */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2"><Skeleton className="h-72 w-full" /></div>
          <Skeleton className="h-72 w-full" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No records match your filters" description="Try adjusting the date range or meal type filter." />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Waste trend */}
            <ChartCard
              title="Waste % Trend"
              subtitle={`${tab} view — percentage of food wasted`}
              className="lg:col-span-2"
            >
              <WasteTrendChart data={chartData} />
            </ChartCard>

            {/* Meal type doughnut */}
            <ChartCard
              title="Waste by Meal Type"
              subtitle="Total kg wasted, filtered period"
            >
              <MealTypeDoughnut data={mealTypeData} />
            </ChartCard>
          </div>

          {/* Consumption vs prediction bar */}
          <ChartCard
            title="Consumption vs Prepared vs Predicted"
            subtitle="Grouped view — identify over-preparation patterns"
          >
            <ConsumptionBarChart data={chartDataWithPred} showPredicted />
          </ChartCard>
        </>
      )}

      {/* Records table */}
      <div className="bg-paper border border-border rounded-2xl p-5 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif font-semibold text-ink">
            Records{' '}
            <span className="text-muted font-sans text-sm font-normal">({filtered.length})</span>
          </h2>
        </div>

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState title="No records" description="Adjust filters or log entries via the Log Entry page." />
        ) : (
          <div className="table-scroll">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="border-b border-border">
                  {['Date', 'Meal', 'Prepared', 'Consumed', 'Wasted', 'Waste %', 'People', 'Predicted', 'Notes'].map(h => (
                    <th key={h} className="text-left pb-2 px-2 text-xs font-semibold text-muted uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.slice().reverse().slice(0, 50).map((r, i) => {
                  const wp = wastePercent(r.wastedKg, r.preparedKg);
                  return (
                    <tr key={r.id ?? i} className="border-b border-border last:border-0 hover:bg-cream transition-colors">
                      <td className="py-2.5 px-2 text-ink whitespace-nowrap">{formatDate(r.date)}</td>
                      <td className="py-2.5 px-2 capitalize text-ink">{r.mealType}</td>
                      <td className="py-2.5 px-2 text-ink">{formatKg(r.preparedKg)}</td>
                      <td className="py-2.5 px-2 text-olive">{formatKg(r.consumedKg)}</td>
                      <td className="py-2.5 px-2 text-tomato">{formatKg(r.wastedKg)}</td>
                      <td className={`py-2.5 px-2 font-semibold ${wp > 15 ? 'text-tomato' : wp > 8 ? 'text-mustard' : 'text-olive'}`}>
                        {formatPercent(wp)}
                      </td>
                      <td className="py-2.5 px-2 text-muted">{r.people}</td>
                      <td className="py-2.5 px-2 text-muted">{formatKg(r.predictedKg)}</td>
                      <td className="py-2.5 px-2 text-muted max-w-[160px] truncate">{r.notes || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length > 50 && (
              <p className="text-xs text-muted text-center pt-3">Showing 50 of {filtered.length} records. Download CSV for full data.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
