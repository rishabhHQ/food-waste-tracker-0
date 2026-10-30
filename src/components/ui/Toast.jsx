import { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

/**
 * Toast — auto-dismissing notification.
 * type: 'success' | 'error'
 */
export default function Toast({ message, type = 'success', onClose, duration = 4000 }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // wait for fade-out
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const isSuccess = type === 'success';

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`
        fixed bottom-6 right-6 z-[100] flex items-start gap-3 max-w-sm
        bg-paper border rounded-2xl shadow-card-hover px-4 py-3
        transition-all duration-300
        ${isSuccess ? 'border-olive/30' : 'border-tomato/30'}
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
      `}
    >
      {isSuccess
        ? <CheckCircle className="w-5 h-5 text-olive flex-shrink-0 mt-0.5" />
        : <AlertCircle  className="w-5 h-5 text-tomato flex-shrink-0 mt-0.5" />
      }
      <p className="text-sm text-ink flex-1">{message}</p>
      <button
        onClick={() => { setVisible(false); setTimeout(onClose, 300); }}
        className="p-0.5 rounded-lg hover:bg-cream-dark text-muted focus-ring flex-shrink-0"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
