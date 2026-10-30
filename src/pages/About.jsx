import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

/**
 * About page — contains the "Feedback Loop" visual showing the 3-step
 * model improvement cycle: New data → Retrain → Better predictions.
 */

function LoopStep({ number, title, description, color = 'clay' }) {
  const colorMap = {
    clay:    { ring: 'border-clay   bg-clay-light   text-clay',   dot: 'bg-clay'    },
    olive:   { ring: 'border-olive  bg-olive-light  text-olive',  dot: 'bg-olive'   },
    mustard: { ring: 'border-mustard bg-mustard-light text-mustard', dot: 'bg-mustard' },
  };
  const c = colorMap[color] ?? colorMap.clay;
  return (
    <div className="flex flex-col items-center text-center gap-3 flex-1 min-w-[160px]">
      <div className={`w-16 h-16 rounded-2xl border-2 ${c.ring} flex items-center justify-center`}>
        <span className="font-serif text-2xl font-bold">{number}</span>
      </div>
      <div>
        <p className="font-serif font-semibold text-ink">{title}</p>
        <p className="text-xs text-muted mt-1 leading-relaxed max-w-[160px]">{description}</p>
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <div className="hidden md:flex items-center self-start mt-7 text-muted">
      <ArrowRight className="w-6 h-6" />
    </div>
  );
}

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      {/* Page header */}
      <div>
        <h1 className="font-serif text-2xl font-semibold text-ink">About FoodWise</h1>
        <p className="text-sm text-muted mt-1">
          How the Smart Food Wastage Tracking & Prediction System works.
        </p>
      </div>

      {/* Tagline card */}
      <div className="bg-paper border border-border rounded-2xl p-6 shadow-card text-center">
        <p className="font-serif text-3xl font-semibold text-ink mb-2">
          Track · Analyze · Predict · Reduce
        </p>
        <p className="text-sm text-muted max-w-lg mx-auto">
          FoodWise helps food service teams cut waste by combining daily data
          logging with machine-learning predictions — telling you exactly how
          much to prepare before you cook.
        </p>
      </div>

      {/* ── Feedback Loop visual ─────────────────────────────────── */}
      <div className="bg-paper border border-border rounded-2xl p-6 md:p-8 shadow-card">
        <div className="mb-6">
          <span className="text-xs font-semibold text-clay uppercase tracking-wide">How the AI improves over time</span>
          <h2 className="font-serif text-xl font-semibold text-ink mt-1">The Feedback Loop</h2>
          <p className="text-sm text-muted mt-1">
            Every meal you log makes the next prediction sharper. Here's how the cycle works:
          </p>
        </div>

        {/* Loop diagram */}
        <div className="flex flex-col md:flex-row items-start md:items-stretch gap-6 md:gap-2 mb-8">
          <LoopStep
            number="1"
            title="New Data from Daily Usage"
            description="Log each meal — quantities prepared, consumed, and wasted — via the Log Entry form."
            color="clay"
          />
          <Arrow />
          <LoopStep
            number="2"
            title="Retrain the Model"
            description="The backend retrains the prediction model nightly using the latest 90 days of meal records."
            color="mustard"
          />
          <Arrow />
          <LoopStep
            number="3"
            title="Better Predictions"
            description="Next day's recommended prep quantity is more accurate, reducing over-preparation and waste."
            color="olive"
          />
        </div>

        {/* Cycle arrow back */}
        <div className="flex items-center gap-3 bg-cream rounded-xl px-4 py-3">
          <div className="flex-shrink-0 w-2 h-2 rounded-full bg-clay animate-pulse" />
          <p className="text-xs text-muted">
            The loop repeats daily — each new log feeds the next prediction,
            creating a continuous improvement cycle. Over 30 days, waste rates
            typically improve by <span className="text-olive font-semibold">3–7 percentage points</span>.
          </p>
        </div>
      </div>

      {/* How data flows */}
      <div className="bg-paper border border-border rounded-2xl p-6 shadow-card space-y-4">
        <h2 className="font-serif text-xl font-semibold text-ink">How Your Data Flows</h2>
        <div className="space-y-3">
          {[
            { step: 'Log Entry',         desc: 'Admin enters daily meal quantities, headcount, and waste figures.',        color: 'bg-clay-light    text-clay' },
            { step: 'Data Context',      desc: 'New entries propagate instantly across Dashboard, Reports, and Analytics.', color: 'bg-mustard-light text-mustard' },
            { step: 'Service Layer',     desc: 'api.js abstracts all data access — swap mock JSON for real API with one line change per function.', color: 'bg-olive-light   text-olive' },
            { step: 'Prediction Engine', desc: '(Backend) Trained model returns a recommended prep quantity per meal and confidence score.', color: 'bg-cream-dark    text-muted' },
          ].map(({ step, desc, color }) => (
            <div key={step} className="flex gap-3">
              <div className={`flex-shrink-0 mt-0.5 px-2 py-0.5 rounded-md text-xs font-semibold ${color}`}>
                {step}
              </div>
              <p className="text-sm text-muted">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA row */}
      <div className="flex flex-wrap gap-3">
        <Button variant="clay" onClick={() => navigate('/input')}>
          Start Logging Data
        </Button>
        <Button variant="ghost" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
