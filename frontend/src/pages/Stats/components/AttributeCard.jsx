export default function AttributeCard({ label, value, color }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-2">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />
        <p className="text-xs text-ink-faint">{label}</p>
      </div>
      <p className="font-display text-2xl" style={{ color }}>{value}</p>
    </div>
  );
}
