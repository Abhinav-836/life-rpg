const MILESTONES = [7, 14, 30, 60, 100];

export default function StreakRewards({ current }) {
  return (
    <div className="card p-6">
      <h2 className="font-display text-ink text-base mb-4">Milestones</h2>
      <ul className="space-y-3">
        {MILESTONES.map((m) => {
          const reached = current >= m;
          return (
            <li key={m} className="flex items-center gap-3 text-sm">
              <span
                className={`h-6 w-6 rounded-full flex items-center justify-center text-xs shrink-0 ${
                  reached ? 'bg-gold text-void' : 'bg-surface-2 text-ink-faint border border-border'
                }`}
                aria-hidden="true"
              >
                {reached ? '✓' : m}
              </span>
              <span className={reached ? 'text-ink' : 'text-ink-muted'}>{m}-day streak</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
