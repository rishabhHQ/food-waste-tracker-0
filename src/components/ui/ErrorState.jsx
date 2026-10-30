import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button';

/**
 * ErrorState — shown when a data fetch fails.
 */
export default function ErrorState({ message = 'Something went wrong', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-2xl bg-tomato-light flex items-center justify-center mb-4">
        <AlertTriangle className="w-7 h-7 text-tomato" />
      </div>
      <h3 className="font-serif text-lg font-semibold text-ink mb-1">Unable to load data</h3>
      <p className="text-sm text-muted max-w-xs mb-4">{message}</p>
      {onRetry && (
        <Button variant="ghost" size="sm" onClick={onRetry}>
          <RefreshCw className="w-3.5 h-3.5" />
          Try again
        </Button>
      )}
    </div>
  );
}
