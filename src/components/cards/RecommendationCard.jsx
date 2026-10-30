import { Scale, UtensilsCrossed, Share2, Clock, CalendarDays } from 'lucide-react';
import Badge from '../ui/Badge';
import { formatKg, formatINR } from '../../utils/formatters';

const categoryConfig = {
  Quantity:       { variant: 'clay',    icon: Scale         },
  Menu:           { variant: 'mustard', icon: UtensilsCrossed },
  Redistribution: { variant: 'olive',   icon: Share2        },
  Expiry:         { variant: 'tomato',  icon: Clock         },
  Scheduling:     { variant: 'muted',   icon: CalendarDays  },
};

const priorityConfig = {
  high:   { label: 'High Priority',   dot: 'bg-tomato'   },
  medium: { label: 'Medium Priority', dot: 'bg-mustard'  },
  low:    { label: 'Low Priority',    dot: 'bg-olive'    },
};

/**
 * RecommendationCard — displays a single smart recommendation.
 */
export default function RecommendationCard({ rec }) {
  const { category, title, reasoning, expectedSavingKg, expectedSavingCost, currency, priority } = rec;
  const cat  = categoryConfig[category] ?? categoryConfig.Quantity;
  const Icon = cat.icon;
  const pri  = priorityConfig[priority] ?? priorityConfig.medium;

  return (
    <div className="bg-paper border border-border rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-shadow duration-200 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-cream-dark`}>
            <Icon className="w-4 h-4 text-muted" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Badge variant={cat.variant}>{category}</Badge>
              <span className="flex items-center gap-1 text-xs text-muted">
                <span className={`w-1.5 h-1.5 rounded-full ${pri.dot}`} />
                {pri.label}
              </span>
            </div>
            <h3 className="font-serif font-semibold text-ink leading-snug">{title}</h3>
          </div>
        </div>
      </div>

      {/* Reasoning */}
      <p className="text-sm text-muted leading-relaxed">{reasoning}</p>

      {/* Impact metrics */}
      <div className="flex items-center gap-4 pt-1 border-t border-border">
        <div>
          <p className="text-xs text-muted">Food saved</p>
          <p className="font-serif font-semibold text-olive">{formatKg(expectedSavingKg)}</p>
        </div>
        <div className="w-px h-8 bg-border" />
        <div>
          <p className="text-xs text-muted">Cost saved</p>
          <p className="font-serif font-semibold text-olive">
            {currency === 'INR' ? formatINR(expectedSavingCost) : `$${expectedSavingCost}`}
          </p>
        </div>
      </div>
    </div>
  );
}
