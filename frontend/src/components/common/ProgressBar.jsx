export default function ProgressBar({ value, max, color = '#8B5CF6', label, showLabel = true, height = 'h-2.5' }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div>
      {showLabel && (
        <div className="flex justify-between text-xs text-ink-muted mb-1.5">
          <span>{label}</span>
          <span>
            {value}/{max}
          </span>
        </div>
      )}
      <div className={`w-full ${height} rounded-full bg-surface-3 overflow-hidden`} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
        <div
          className="h-full rounded-full animate-fill-bar"
          style={{ '--fill': `${pct}%`, backgroundColor: color, boxShadow: `0 0 12px 0 ${color}66` }}
        />
      </div>
    </div>
  );
}
