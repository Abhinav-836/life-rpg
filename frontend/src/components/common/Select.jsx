import { forwardRef, useId } from 'react';

const Select = forwardRef(function Select({ label, options = [], id, className = '', ...rest }, ref) {
  const autoId = useId();
  const selectId = id || autoId;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-gray-200 drop-shadow-sm">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={`bg-surface-2/40 backdrop-blur-md border border-white/20 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple/60 focus:border-purple/80 ${className}`}
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.id ?? opt.value} value={opt.id ?? opt.value} className="bg-surface-2 text-white">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
});

export default Select;
