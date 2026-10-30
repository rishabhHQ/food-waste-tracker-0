import { useEffect, useState } from 'react';
import { getSustainability } from '../services/api';
import ChartCard from '../components/charts/ChartCard';
import Skeleton from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';
import { formatKg, formatINR } from '../utils/formatters';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { Leaf, Banknote, Wind, Trees } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler);

// Palette
const OLIVE   = '#6B8F4E';
const CLAY    = '#C8553D';
const MUSTARD = '#D9A441';
const OLIVE_BG = 'rgba(107,143,78,0.15)';

/** Animated number counter */
function CountUp({ target, suffix = '', decimals = 0 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const steps = 40;
    const increment = target / steps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(start);
    }, 30);
    return () => clearInterval(timer);
  }, [target]);
  return <>{val.toFixed(decimals)}{suffix}</>;
}

/** Impact metric card */
function ImpactCard({ icon: Icon, value, label, sub, color = 'olive' }) {
  const colorMap = {
    olive:   { bg: 'bg-olive-light', text: 'text-olive',   icon: 'text-olive'   },
    clay:    { bg: 'bg-clay-light',  text: 'text-clay',    icon: 'text-clay'    },
    mustard: { bg: 'bg-mustard-light',text: 'text-mustard', icon: 'text-mustard' },
  };
  const c = colorMap[color] ?? colorMap.olive;
  return (
    <div className={`${c.bg} rounded-2xl p-6 flex flex-col gap-2`}>
      <div className={`w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center ${c.icon}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className={`font-serif text-3xl font-bold ${c.text}`}>{value}</p>
      <p className="text-sm font-semibold text-ink">{label}</p>
      {sub && <p className="text-xs text-muted">{sub}</p>}
    </div>
  );
}

export default function Sustainability() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const d = await getSustainability();
      setData(d);
    } catch (err) {
      setError(err.message ?? 'Failed to load sustainability data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-40 w-full" />)}
        </div>
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!data)  return null;

  const { totalFoodSavedKg, totalCostSavedINR, co2ReductionKg, treesEquivalent, monthlyData, beforeAfter } = data;

  // Monthly improvement chart data
  const monthLabels  = monthlyData.map(m => m.month.slice(0, 3) + ' ' + m.month.slice(-4));
  const savedKgData  = monthlyData.map(m => m.foodSavedKg);
  const wastePercData= monthlyData.map(m => m.wastePercent);

  const barData = {
    labels: monthLabels,
    datasets: [{
      label: 'Food Saved (kg)',
      data: savedKgData,
      backgroundColor: OLIVE,
      borderRadius: 6,
      borderSkipped: false,
    }],
  };

  const lineData = {
    labels: monthLabels,
    datasets: [{
      label: 'Waste %',
      data: wastePercData,
      borderColor: CLAY,
      backgroundColor: 'rgba(200,85,61,0.10)',
      pointBackgroundColor: CLAY,
      pointBorderColor: '#FFFDF8',
      pointBorderWidth: 2,
      pointRadius: 5,
      tension: 0.4,
      fill: true,
    }],
  };

  const chartOptions = (yLabel, yCallback) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#2E2A25', titleColor: '#FFFDF8',
        bodyColor: '#E6DCC8', padding: 10, cornerRadius: 10,
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#7A7168', font: { size: 11 } }, border: { display: false } },
      y: {
        grid: { color: '#E6DCC8' },
        ticks: { color: '#7A7168', font: { size: 11 }, callback: yCallback },
        border: { display: false }, min: 0,
      },
    },
  });

  const improvement = {
    wasteReduced: +(beforeAfter.before.wastePercent - beforeAfter.after.wastePercent).toFixed(1),
    kgReduced: +(beforeAfter.before.monthlyWasteKg - beforeAfter.after.monthlyWasteKg).toFixed(1),
    costReduced: beforeAfter.before.monthlyCostINR - beforeAfter.after.monthlyCostINR,
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="font-serif text-2xl font-semibold text-ink">Sustainability Impact</h1>
        <p className="text-sm text-muted mt-1">
          Tracking the real-world difference FoodWise has made since May 2026.
        </p>
      </div>

      {/* Impact metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <ImpactCard
          icon={Leaf}
          value={<><CountUp target={totalFoodSavedKg} decimals={0} /> kg</>}
          label="Total Food Saved"
          sub="Diverted from landfill"
          color="olive"
        />
        <ImpactCard
          icon={Banknote}
          value={<>₹<CountUp target={totalCostSavedINR / 1000} decimals={1} />k</>}
          label="Cost Saved"
          sub="Over 6 months"
          color="mustard"
        />
        <ImpactCard
          icon={Wind}
          value={<><CountUp target={co2ReductionKg} decimals={0} /> kg</>}
          label="CO₂ Reduction"
          sub="2.5 kg CO₂ per kg food"
          color="clay"
        />
        <ImpactCard
          icon={Trees}
          value={<><CountUp target={treesEquivalent} decimals={0} /></>}
          label="Trees Equivalent"
          sub="Annual CO₂ absorption"
          color="olive"
        />
      </div>

      {/* Monthly charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartCard title="Monthly Food Saved" subtitle="Kilograms diverted from waste each month">
          <div style={{ height: 220 }}>
            <Bar data={barData} options={chartOptions('kg', v => `${v} kg`)} />
          </div>
        </ChartCard>

        <ChartCard title="Waste % Improvement" subtitle="Monthly waste percentage — trending down">
          <div style={{ height: 220 }}>
            <Line data={lineData} options={chartOptions('%', v => `${v}%`)} />
          </div>
        </ChartCard>
      </div>

      {/* Before vs After comparison */}
      <div className="bg-paper border border-border rounded-2xl p-6 shadow-card">
        <h2 className="font-serif font-semibold text-ink mb-5">Before vs After FoodWise</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Before column */}
          <div className="bg-tomato-light rounded-2xl p-5">
            <p className="text-xs font-semibold text-tomato uppercase tracking-wide mb-3">Before (May 2026)</p>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted">Waste Rate</p>
                <p className="font-serif text-2xl font-bold text-tomato">{beforeAfter.before.wastePercent}%</p>
              </div>
              <div>
                <p className="text-xs text-muted">Monthly Waste</p>
                <p className="font-serif text-xl font-semibold text-tomato">{formatKg(beforeAfter.before.monthlyWasteKg)}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Monthly Cost</p>
                <p className="font-serif text-xl font-semibold text-tomato">{formatINR(beforeAfter.before.monthlyCostINR)}</p>
              </div>
            </div>
          </div>

          {/* Improvement centre */}
          <div className="flex flex-col items-center justify-center gap-3 py-4">
            <div className="w-12 h-12 rounded-2xl bg-olive-light flex items-center justify-center">
              <Leaf className="w-6 h-6 text-olive" />
            </div>
            <p className="text-center">
              <span className="block font-serif text-3xl font-bold text-olive">−{improvement.wasteReduced}%</span>
              <span className="text-xs text-muted">waste rate reduction</span>
            </p>
            <p className="text-center">
              <span className="block font-serif text-2xl font-semibold text-olive">{formatKg(improvement.kgReduced)}</span>
              <span className="text-xs text-muted">less wasted per month</span>
            </p>
            <p className="text-center">
              <span className="block font-serif text-xl font-semibold text-olive">{formatINR(improvement.costReduced)}</span>
              <span className="text-xs text-muted">saved per month</span>
            </p>
          </div>

          {/* After column */}
          <div className="bg-olive-light rounded-2xl p-5">
            <p className="text-xs font-semibold text-olive uppercase tracking-wide mb-3">After (Oct 2026)</p>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted">Waste Rate</p>
                <p className="font-serif text-2xl font-bold text-olive">{beforeAfter.after.wastePercent}%</p>
              </div>
              <div>
                <p className="text-xs text-muted">Monthly Waste</p>
                <p className="font-serif text-xl font-semibold text-olive">{formatKg(beforeAfter.after.monthlyWasteKg)}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Monthly Cost</p>
                <p className="font-serif text-xl font-semibold text-olive">{formatINR(beforeAfter.after.monthlyCostINR)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Environmental footnote */}
      <p className="text-xs text-muted text-center">
        CO₂ equivalent calculated at 2.5 kg CO₂ per kg of food waste (WRAP UK methodology).
        Tree absorption estimated at 22 kg CO₂/tree/year.
      </p>
    </div>
  );
}
