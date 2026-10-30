import { useEffect, useState } from 'react';
import { useRecords } from '../hooks/useRecords';
import { useAlerts } from '../hooks/useAlerts';
import { getTodayRecommendation } from '../services/api';
import StatCard from '../components/cards/StatCard';
import HeroRecommendation from '../components/cards/HeroRecommendation';
import AlertItem from '../components/cards/AlertItem';
import ChartCard from '../components/charts/ChartCard';
import WasteTrendChart from '../components/charts/WasteTrendChart';
import { StatCardSkeletons } from '../components/ui/Skeleton';
import Skeleton from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';
import { summariseRecords, lastNDays, groupByDate } from '../utils/calculations';
import { formatKg, formatINR, formatPercent } from '../utils/formatters';
import { Wheat, Users, Trash2, BadgeDollarSign, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function Dashboard() {
  const { records, loading: recLoading, error: recError, refetch } = useRecords();
  const { alerts, loading: alertLoading, markAlertRead, dismissAlert } = useAlerts();
  const [heroRec, setHeroRec] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getTodayRecommendation().then(setHeroRec).catch(() => {});
  }, []);

  const recentRecords = lastNDays(records, 30);
  const stats         = summariseRecords(recentRecords);
  const last7         = lastNDays(records, 7);
  const trend7        = groupByDate(last7);

  // Top 3 unread / active alerts
  const topAlerts = alerts.filter(a => !a.dismissed).slice(0, 3);

  if (recError) return <ErrorState message={recError} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      {/* ── Stat cards ────────────────────────────────────────────── */}
      {recLoading ? (
        <StatCardSkeletons count={4} />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Wheat}
            label="Food Prepared (30 days)"
            value={+(stats.totalPrepared).toFixed(0)}
            unit="kg"
            accentColor="bg-clay-light text-clay"
          />
          <StatCard
            icon={Users}
            label="People Served"
            value={stats.totalPeople.toLocaleString('en-IN')}
            accentColor="bg-mustard-light text-mustard"
          />
          <StatCard
            icon={Trash2}
            label="Avg Waste Rate"
            value={stats.avgWastePercent}
            unit="%"
            trend={-2.1}
            trendLabel="vs last month"
            invertTrend
            accentColor="bg-tomato-light text-tomato"
          />
          <StatCard
            icon={BadgeDollarSign}
            label="Est. Cost Saved"
            value={formatINR(stats.costSavedTotal).replace('₹', '')}
            unit="₹"
            trend={4.3}
            trendLabel="vs last month"
            accentColor="bg-olive-light text-olive"
          />
        </div>
      )}

      {/* ── Hero recommendation + 7-day chart ─────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Hero card – takes 3/5 */}
        <div className="xl:col-span-3">
          {heroRec ? (
            <HeroRecommendation recommendation={heroRec} />
          ) : (
            <Skeleton className="h-72 w-full" rounded="rounded-3xl" />
          )}
        </div>

        {/* Trend chart – takes 2/5 */}
        <div className="xl:col-span-2">
          <ChartCard
            title="Waste Trend"
            subtitle="Last 7 days — waste percentage per day"
          >
            {recLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <WasteTrendChart data={trend7} />
            )}
          </ChartCard>
        </div>
      </div>

      {/* ── Active alerts preview ──────────────────────────────────── */}
      <div className="bg-paper border border-border rounded-2xl p-5 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif font-semibold text-ink">Active Alerts</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/alerts')}>
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>

        {alertLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
          </div>
        ) : topAlerts.length === 0 ? (
          <p className="text-sm text-muted py-4 text-center">No active alerts. Everything looks good!</p>
        ) : (
          <div className="space-y-3">
            {topAlerts.map(alert => (
              <AlertItem
                key={alert.id}
                alert={alert}
                onMarkRead={markAlertRead}
                onDismiss={dismissAlert}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
