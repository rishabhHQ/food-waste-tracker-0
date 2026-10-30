import { useAlerts } from '../hooks/useAlerts';
import AlertItem from '../components/cards/AlertItem';
import Skeleton from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import Badge from '../components/ui/Badge';
import { useState } from 'react';
import { Bell } from 'lucide-react';

const TYPE_FILTERS = ['All', 'High Waste', 'Food Nearing Expiry', 'Stock Running Low'];

const typeBadge = {
  'High Waste':           'tomato',
  'Food Nearing Expiry':  'mustard',
  'Stock Running Low':    'olive',
};

export default function Alerts() {
  const { alerts, unreadCount, loading, error, markAlertRead, dismissAlert } = useAlerts();
  const [typeFilter, setTypeFilter] = useState('All');
  const [showRead, setShowRead]     = useState(false);

  const filtered = alerts.filter(a => {
    if (typeFilter !== 'All' && a.type !== typeFilter) return false;
    if (!showRead && a.read) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-ink">Alerts & Notifications</h1>
          <p className="text-sm text-muted mt-1">
            Stay on top of high-waste events, expiring stock, and low inventory.
          </p>
        </div>
        {unreadCount > 0 && (
          <div className="flex items-center gap-2 bg-tomato-light rounded-xl px-3 py-2">
            <Bell className="w-4 h-4 text-tomato" />
            <span className="text-sm font-semibold text-tomato">{unreadCount} unread</span>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {TYPE_FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setTypeFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all focus-ring ${
              typeFilter === f
                ? 'bg-ink text-cream border-ink'
                : 'bg-paper text-muted border-border hover:border-muted'
            }`}
          >
            {f}
          </button>
        ))}

        <label className="ml-auto flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showRead}
            onChange={e => setShowRead(e.target.checked)}
            className="w-4 h-4 rounded accent-clay"
          />
          <span className="text-xs text-muted">Show read</span>
        </label>
      </div>

      {/* Alert list */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
      ) : error ? (
        <ErrorState message={error} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No alerts here"
          description={showRead ? 'No alerts match your filter.' : 'All caught up! No unread alerts.'}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map(alert => (
            <AlertItem
              key={alert.id}
              alert={alert}
              onMarkRead={markAlertRead}
              onDismiss={dismissAlert}
            />
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="bg-paper border border-border rounded-2xl p-4 flex flex-wrap gap-4">
        <p className="text-xs font-medium text-muted w-full">Severity guide:</p>
        {[
          { label: 'Critical', variant: 'tomato', desc: 'Immediate action required' },
          { label: 'Warning',  variant: 'mustard', desc: 'Review soon' },
          { label: 'Info',     variant: 'olive',   desc: 'Informational' },
        ].map(({ label, variant, desc }) => (
          <div key={label} className="flex items-center gap-2">
            <Badge variant={variant}>{label}</Badge>
            <span className="text-xs text-muted">{desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
