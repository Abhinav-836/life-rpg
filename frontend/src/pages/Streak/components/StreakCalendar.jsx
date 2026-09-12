export default function StreakCalendar({ history }) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = firstDay.getDay();
  const todayStr = now.toISOString().slice(0, 10);

  const cells = [...Array(startOffset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  return (
    <div className="card p-6">
      <h2 className="font-display text-ink text-base mb-4">
        {now.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
      </h2>
      <div className="grid grid-cols-7 gap-1.5 text-center">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <span key={i} className="text-[10px] text-ink-faint">{d}</span>
        ))}
        {cells.map((day, i) => {
          if (!day) return <span key={`empty-${i}`} />;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const active = !!history?.[dateStr];
          const isToday = dateStr === todayStr;
          return (
            <span
              key={dateStr}
              className={`h-7 w-7 mx-auto rounded-md flex items-center justify-center text-[11px] ${
                active ? 'bg-purple/25 text-ink' : 'text-ink-faint'
              } ${isToday ? 'ring-1 ring-gold' : ''}`}
            >
              {day}
            </span>
          );
        })}
      </div>
    </div>
  );
}
