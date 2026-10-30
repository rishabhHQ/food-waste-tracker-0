import { Sparkles, ArrowRight } from 'lucide-react';
import { formatKg, formatINR } from '../../utils/formatters';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';

/**
 * HeroRecommendation — the most prominent element on the dashboard.
 * Shows today's smart quantity recommendation with expected savings.
 */
export default function HeroRecommendation({ recommendation }) {
  const navigate = useNavigate();

  if (!recommendation) return null;

  const { predictedKg, confidence, date, basedOnDays } = recommendation;
  // Derive a "typical" over-preparation assumption
  const typicalKg    = Math.round(predictedKg * 1.15);
  const savedKg      = +(typicalKg - predictedKg).toFixed(1);
  const savedCost    = savedKg * 160; // ₹160/kg

  return (
    <div className="bg-paper border-2 border-clay/20 rounded-3xl p-6 md:p-8 shadow-card-hover relative overflow-hidden">
      {/* Decorative background blob */}
      <div
        className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-clay-light opacity-40 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-6 right-16 w-24 h-24 rounded-full bg-mustard-light opacity-30 pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-clay flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-clay uppercase tracking-wide">Smart Recommendation</p>
              <h2 className="font-serif text-xl font-semibold text-ink leading-tight">
                Today's Preparation Guide
              </h2>
            </div>
          </div>
          {/* Confidence badge */}
          <div className="flex-shrink-0 text-right">
            <p className="text-xs text-muted">Model confidence</p>
            <p className="font-serif text-2xl font-semibold text-olive">
              {Math.round(confidence * 100)}%
            </p>
          </div>
        </div>

        {/* Main recommendation */}
        <div className="bg-cream rounded-2xl px-5 py-4 mb-5">
          <p className="text-sm text-muted mb-1">Recommended quantity for {date}</p>
          <p className="font-serif text-3xl md:text-4xl font-bold text-ink">
            Prepare <span className="text-clay">{formatKg(predictedKg)}</span>
          </p>
          <p className="text-sm text-muted mt-1">
            instead of the usual {formatKg(typicalKg)} — based on {basedOnDays} days of data
          </p>
        </div>

        {/* Expected savings row */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-olive-light rounded-2xl px-4 py-3">
            <p className="text-xs text-olive font-medium mb-0.5">Food Saved</p>
            <p className="font-serif text-xl font-semibold text-olive">{formatKg(savedKg)}</p>
            <p className="text-xs text-olive/70">less waste expected</p>
          </div>
          <div className="bg-mustard-light rounded-2xl px-4 py-3">
            <p className="text-xs text-mustard font-medium mb-0.5">Cost Savings</p>
            <p className="font-serif text-xl font-semibold text-mustard">{formatINR(savedCost)}</p>
            <p className="text-xs text-mustard/70">at ₹160 per kg</p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/recommendations')}
          className="w-full sm:w-auto"
        >
          View all recommendations <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
