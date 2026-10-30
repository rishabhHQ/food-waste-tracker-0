import { useState, useEffect } from 'react';
import { getRecommendations } from '../services/api';
import RecommendationCard from '../components/cards/RecommendationCard';
import Skeleton from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import Badge from '../components/ui/Badge';

const CATEGORIES = ['All', 'Quantity', 'Menu', 'Redistribution', 'Expiry', 'Scheduling'];
const PRIORITIES  = ['all', 'high', 'medium', 'low'];

const catVariant = {
  Quantity:       'clay',
  Menu:           'mustard',
  Redistribution: 'olive',
  Expiry:         'tomato',
  Scheduling:     'muted',
};

export default function Recommendations() {
  const [recs, setRecs]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [category, setCategory]   = useState('All');
  const [priority, setPriority]   = useState('all');

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const data = await getRecommendations();
      setRecs(data);
    } catch (err) {
      setError(err.message ?? 'Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const filtered = recs.filter(r => {
    if (category !== 'All' && r.category !== category) return false;
    if (priority  !== 'all' && r.priority  !== priority)  return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="font-serif text-2xl font-semibold text-ink">Smart Recommendations</h1>
        <p className="text-sm text-muted mt-1">
          AI-generated suggestions based on your food service patterns. Review and act on these to reduce waste.
        </p>
      </div>

      {/* Category filter chips */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all focus-ring ${
              category === cat
                ? 'bg-ink text-cream border-ink'
                : 'bg-paper text-muted border-border hover:border-muted'
            }`}
          >
            {cat}
          </button>
        ))}

        {/* Priority filter */}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-muted">Priority:</span>
          {PRIORITIES.map(p => (
            <button
              key={p}
              onClick={() => setPriority(p)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all focus-ring ${
                priority === p
                  ? 'bg-clay text-white border-clay'
                  : 'bg-paper text-muted border-border hover:border-muted'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-paper border border-border rounded-2xl p-5 space-y-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No recommendations match"
          description="Try a different category or priority filter."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(rec => (
            <RecommendationCard key={rec.id} rec={rec} />
          ))}
        </div>
      )}

      {/* Summary footer */}
      {!loading && !error && filtered.length > 0 && (
        <div className="bg-olive-light rounded-2xl px-5 py-4 flex flex-wrap gap-4">
          <div>
            <p className="text-xs text-olive font-medium">Total potential savings</p>
            <p className="font-serif text-xl font-semibold text-olive">
              {filtered.reduce((s, r) => s + (r.expectedSavingKg ?? 0), 0).toFixed(1)} kg / month
            </p>
          </div>
          <div className="w-px bg-olive/20" />
          <div>
            <p className="text-xs text-olive font-medium">Estimated cost reduction</p>
            <p className="font-serif text-xl font-semibold text-olive">
              ₹{filtered.reduce((s, r) => s + (r.expectedSavingCost ?? 0), 0).toLocaleString('en-IN')} / month
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
