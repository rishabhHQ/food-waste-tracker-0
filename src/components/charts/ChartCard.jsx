/**
 * ChartCard — wrapper card for any chart, with title, subtitle and optional action.
 */
export default function ChartCard({ title, subtitle, action, children, className = '' }) {
  return (
    <div className={`bg-paper border border-border rounded-2xl p-5 shadow-card ${className}`}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          {title && <h3 className="font-serif font-semibold text-ink">{title}</h3>}
          {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}
