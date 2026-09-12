export default function StatCard({ label, value, sublabel, accent = '#8B5CF6', icon, size = 'md' }) {
  const isLg = size === 'lg';
  return (
    <div className="card p-5 flex items-start gap-4">
      {icon && (
        <div
          className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0 text-lg"
          style={{ backgroundColor: `${accent}1A`, color: accent }}
          aria-hidden="true"
        >
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-ink-faint mb-1">{label}</p>
        <p className={`font-display text-ink ${isLg ? 'text-3xl' : 'text-xl'}`}>{value}</p>
        {sublabel && <p className="text-xs text-ink-muted mt-1">{sublabel}</p>}
      </div>
    </div>
  );
}
