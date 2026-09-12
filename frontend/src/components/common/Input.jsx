import { forwardRef, useId } from 'react';

const Input = forwardRef(function Input(
  { label, error, hint, type = 'text', id, className = '', ...rest },
  ref
) {
  const autoId = useId();
  const inputId = id || autoId;
  const errorId = error ? `${inputId}-error` : undefined;
  const hintId = hint ? `${inputId}-hint` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-200 drop-shadow-sm">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        type={type}
        aria-invalid={!!error}
        aria-describedby={[errorId, hintId].filter(Boolean).join(' ') || undefined}
        className={`bg-surface-2/40 backdrop-blur-md border rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-purple/60 focus:bg-surface-2/60 ${
          error ? 'border-danger/80' : 'border-white/20 focus:border-purple/80'
        } ${className}`}
        {...rest}
      />
      {hint && !error && <p id={hintId} className="text-xs text-gray-300 drop-shadow-sm">{hint}</p>}
      {error && <p id={errorId} className="text-xs text-danger drop-shadow-sm">{error}</p>}
    </div>
  );
});

export default Input;
