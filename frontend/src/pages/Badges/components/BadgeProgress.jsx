export default function BadgeProgress({ progress, target }) {
  const pct = target ? Math.min(100, Math.round((progress / target) * 100)) : 0;
  return (
    <div className="mt-2">
      <div className="h-1.5 rounded-full bg-surface-3 overflow-hidden">
        <div className="h-full rounded-full bg-purple" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-[11px] text-ink-faint mt-1">{progress}/{target}</p>
    </div>
  );
}
