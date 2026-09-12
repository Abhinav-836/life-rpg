export default function CurrentStreak({ current }) {
  return (
    <div className="card-raised p-8 text-center">
      <p className="text-xs uppercase tracking-wide text-ink-faint mb-2">Current streak</p>
      <p className="font-display text-5xl text-gold mb-1">{current}</p>
      <p className="text-sm text-ink-muted">{current === 1 ? 'day' : 'days'} and counting</p>
    </div>
  );
}
