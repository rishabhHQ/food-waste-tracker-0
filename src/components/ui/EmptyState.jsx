import { Inbox } from 'lucide-react';

/**
 * EmptyState — shown when a data-driven view has no results.
 */
export default function EmptyState({ title = 'Nothing here yet', description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-2xl bg-cream-dark flex items-center justify-center mb-4">
        <Inbox className="w-7 h-7 text-muted" />
      </div>
      <h3 className="font-serif text-lg font-semibold text-ink mb-1">{title}</h3>
      {description && <p className="text-sm text-muted max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
