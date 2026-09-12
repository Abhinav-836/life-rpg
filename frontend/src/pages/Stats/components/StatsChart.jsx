function lastNDays(n) {
  return Array.from({ length: n }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (n - 1 - i));
    return d.toISOString().slice(0, 10);
  });
}

export default function StatsChart({ quests, days = 7 }) {
  const range = lastNDays(days);
  const counts = range.map(
    (day) => (quests || []).filter((q) => q.status === 'completed' && q.completedAt === day).length
  );
  const max = Math.max(...counts, 1);

  return (
    <div className="card p-5">
      <h2 className="font-display text-ink text-base mb-4">Last {days} days</h2>
      <div className="flex items-end gap-2 h-32" role="img" aria-label={`Quests completed over the last ${days} days`}>
        {counts.map((count, i) => (
          <div key={range[i]} className="flex-1 flex flex-col items-center gap-1.5">
            <div
              className="w-full rounded-t bg-purple/70 min-h-[3px] transition-all"
              style={{ height: `${(count / max) * 100}%`, backgroundColor: count === 0 ? '#1F2542' : '#8B5CF6' }}
            />
            <span className="text-[10px] text-ink-faint">
              {new Date(range[i]).toLocaleDateString(undefined, { weekday: 'narrow' })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
