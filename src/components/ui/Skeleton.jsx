/**
 * Skeleton — pulsing placeholder block for loading states.
 * Use className to set width/height, e.g. className="h-24 w-full"
 */
export default function Skeleton({ className = 'h-6 w-full', rounded = 'rounded-xl' }) {
  return (
    <div className={`animate-pulse bg-border ${rounded} ${className}`} aria-hidden="true" />
  );
}

/** Row of skeletons for a stat card group */
export function StatCardSkeletons({ count = 4 }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-paper border border-border rounded-2xl p-5 space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </div>
  );
}
