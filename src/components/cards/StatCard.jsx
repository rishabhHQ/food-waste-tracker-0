import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * StatCard — displays a single KPI metric.
 * Props:
 *   icon: Lucide icon component
 *   label: string
 *   value: string | number (main displayed value)
 *   unit: string (optional, e.g. "kg")
 *   trend: number (positive = up, negative = down, 0/undefined = neutral)
 *   trendLabel: string (e.g. "vs last week")
 *   accentColor: Tailwind color class for icon bg, e.g. 'bg-clay-light text-clay'
 */
export default function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  trend,
  trendLabel,
  accentColor = 'bg-clay-light text-clay',
  invertTrend = false,  // for waste %, going down is good
}) {
  const hasTrend = trend !== null && trend !== undefined;
  const isNeutral = !hasTrend || trend === 0;
  // For waste %, down is good (olive); for savings, up is good (olive)
  const isPositive = invertTrend ? trend < 0 : trend > 0;

  return (
    <div className="bg-paper border border-border rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-shadow duration-200">
      {/* Label + icon row */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-muted">{label}</p>
        {Icon && (
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${accentColor}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Main value */}
      <div className="flex items-baseline gap-1.5">
        <span className="font-serif text-3xl font-semibold text-ink leading-none">
          {value ?? '—'}
        </span>
        {unit && <span className="text-sm text-muted font-medium">{unit}</span>}
      </div>

      {/* Trend indicator */}
      {hasTrend && (
        <div className="flex items-center gap-1 mt-2">
          {isNeutral ? (
            <Minus className="w-3.5 h-3.5 text-muted" />
          ) : isPositive ? (
            <TrendingUp className="w-3.5 h-3.5 text-olive" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 text-tomato" />
          )}
          <span className={`text-xs font-medium ${isNeutral ? 'text-muted' : isPositive ? 'text-olive' : 'text-tomato'}`}>
            {hasTrend && trend !== 0 ? `${trend > 0 ? '+' : ''}${trend}%` : 'No change'}
          </span>
          {trendLabel && <span className="text-xs text-muted">{trendLabel}</span>}
        </div>
      )}
    </div>
  );
}
