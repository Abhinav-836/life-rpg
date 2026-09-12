function lastNDays(n) {
  return Array.from({ length: n }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (n - 1 - i));
    return d.toISOString().slice(0, 10);
  });
}

export default function ActivityHeatmap({ history }) {
  const days = lastNDays(35);
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

  return (
    <div className="card p-6">
      <h2 className="font-display text-ink text-base mb-4">Last 5 weeks</h2>
      <div className="flex gap-1.5 justify-between" role="img" aria-label="Activity over the last 5 weeks">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1.5">
            {week.map((day) => {
              const active = !!history?.[day];
              return (
                <span
                  key={day}
                  title={day}
                  className="h-3.5 w-3.5 rounded-sm"
                  style={{ backgroundColor: active ? '#8B5CF6' : '#1F2542' }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
