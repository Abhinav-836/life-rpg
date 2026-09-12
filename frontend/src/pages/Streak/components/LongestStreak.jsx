export default function LongestStreak({ longest }) {
  return (
    <div className="card p-6 text-center">
      <p className="text-xs uppercase tracking-wide text-ink-faint mb-2">Best streak</p>
      <p className="font-display text-3xl text-ink">{longest}</p>
      <p className="text-xs text-ink-muted mt-1">{longest === 1 ? 'day' : 'days'}</p>
    </div>
  );
}
