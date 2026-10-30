/**
 * Button — reusable button with variant + size support.
 * Variants: 'clay' (primary), 'olive' (positive), 'ghost' (subtle), 'danger'
 * Sizes: 'sm', 'md', 'lg'
 */
const variants = {
  clay:  'bg-clay hover:bg-clay-dark text-white shadow-sm',
  olive: 'bg-olive hover:bg-olive/90 text-white shadow-sm',
  ghost: 'bg-transparent hover:bg-cream-dark text-ink border border-border',
  danger:'bg-tomato hover:bg-tomato/90 text-white shadow-sm',
  outline: 'bg-transparent hover:bg-clay-light text-clay border border-clay',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-4 py-2   text-sm rounded-xl gap-2',
  lg: 'px-6 py-2.5 text-sm rounded-xl gap-2',
};

export default function Button({
  children,
  variant = 'clay',
  size = 'md',
  className = '',
  disabled,
  ...props
}) {
  return (
    <button
      className={`
        inline-flex items-center justify-center font-medium transition-all duration-150
        focus:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant] ?? variants.clay}
        ${sizes[size] ?? sizes.md}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
