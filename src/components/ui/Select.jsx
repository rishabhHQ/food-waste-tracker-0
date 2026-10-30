/**
 * Select — labeled dropdown with inline error support.
 */
export default function Select({
  label,
  id,
  error,
  hint,
  children,
  className = '',
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`
          w-full px-3 py-2 rounded-xl border text-sm text-ink bg-paper
          transition-colors duration-150
          focus:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-1
          ${error ? 'border-tomato bg-tomato-light' : 'border-border hover:border-muted'}
        `}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        aria-invalid={error ? 'true' : undefined}
        {...props}
      >
        {children}
      </select>
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-muted">{hint}</p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs text-tomato" role="alert">{error}</p>
      )}
    </div>
  );
}
