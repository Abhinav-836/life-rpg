import { forwardRef } from 'react';

const VARIANTS = {
  primary: 'bg-purple text-white hover:bg-purple-dim shadow-glow',
  gold: 'bg-gold text-void font-semibold hover:bg-gold-bright shadow-goldglow',
  ghost: 'bg-transparent text-ink border border-border hover:border-purple/60 hover:bg-surface-2',
  danger: 'bg-transparent text-danger border border-danger/40 hover:bg-danger/10',
  subtle: 'bg-surface-2 text-ink-muted hover:text-ink hover:bg-surface-3',
};

const SIZES = {
  sm: 'text-sm px-3 py-1.5 rounded-lg',
  md: 'text-sm px-4 py-2.5 rounded-lg',
  lg: 'text-base px-6 py-3 rounded-xl',
};

const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', loading = false, disabled, className = '', children, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {loading && (
        <span className="h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" aria-hidden="true" />
      )}
      {children}
    </button>
  );
});

export default Button;
