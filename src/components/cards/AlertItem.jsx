import { AlertTriangle, Package, Thermometer, CheckCheck, X } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import Badge from '../ui/Badge';

const typeConfig = {
  'High Waste':           { icon: AlertTriangle, badgeVariant: 'tomato'  },
  'Food Nearing Expiry':  { icon: Thermometer,   badgeVariant: 'mustard' },
  'Stock Running Low':    { icon: Package,        badgeVariant: 'olive'   },
};

const severityBg = {
  critical: 'border-l-tomato  bg-tomato-light/40',
  warning:  'border-l-mustard bg-mustard-light/40',
  info:     'border-l-olive   bg-olive-light/40',
};

/**
 * AlertItem — a single alert row.
 */
export default function AlertItem({ alert, onMarkRead, onDismiss }) {
  const { id, type, severity, title, description, date, read } = alert;
  const cfg  = typeConfig[type] ?? typeConfig['High Waste'];
  const Icon = cfg.icon;

  return (
    <div
      className={`
        relative flex gap-4 p-4 rounded-2xl border border-border border-l-4
        transition-all duration-150
        ${severityBg[severity] ?? severityBg.warning}
        ${read ? 'opacity-70' : ''}
      `}
    >
      {/* Unread dot */}
      {!read && (
        <span className="absolute top-3 right-10 w-2 h-2 rounded-full bg-clay" aria-label="Unread" />
      )}

      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
        severity === 'critical' ? 'bg-tomato-light text-tomato' :
        severity === 'warning'  ? 'bg-mustard-light text-mustard' :
                                  'bg-olive-light text-olive'
      }`}>
        <Icon className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <Badge variant={cfg.badgeVariant}>{type}</Badge>
          <span className="text-xs text-muted">{formatDate(date)}</span>
        </div>
        <p className="text-sm font-medium text-ink">{title}</p>
        <p className="text-xs text-muted mt-0.5 leading-relaxed">{description}</p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-1 flex-shrink-0">
        {!read && (
          <button
            onClick={() => onMarkRead(id)}
            className="p-1.5 rounded-lg hover:bg-cream-dark text-muted focus-ring"
            aria-label="Mark as read"
            title="Mark as read"
          >
            <CheckCheck className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          onClick={() => onDismiss(id)}
          className="p-1.5 rounded-lg hover:bg-cream-dark text-muted focus-ring"
          aria-label="Dismiss alert"
          title="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
