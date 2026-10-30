/**
 * Badge — small colored tag for categories and severities.
 * Variants: 'clay', 'olive', 'mustard', 'tomato', 'muted', 'ink'
 */
const variants = {
  clay:    'bg-clay-light   text-clay   border-clay/20',
  olive:   'bg-olive-light  text-olive  border-olive/20',
  mustard: 'bg-mustard-light text-mustard border-mustard/20',
  tomato:  'bg-tomato-light text-tomato  border-tomato/20',
  muted:   'bg-cream-dark   text-muted   border-border',
  ink:     'bg-cream-dark   text-ink     border-border',
};

export default function Badge({ children, variant = 'muted', className = '' }) {
  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border
        ${variants[variant] ?? variants.muted}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
