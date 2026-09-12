export default function AccountStats({ character }) {
  if (!character) return null;
  return (
    <div className="grid grid-cols-3 gap-3 mt-6">
      <div className="card p-4 text-center">
        <p className="text-xs text-ink-faint mb-1">Level</p>
        <p className="font-display text-lg text-ink">{character.level}</p>
      </div>
      <div className="card p-4 text-center">
        <p className="text-xs text-ink-faint mb-1">Total XP</p>
        <p className="font-display text-lg text-ink">{character.totalXP}</p>
      </div>
      <div className="card p-4 text-center">
        <p className="text-xs text-ink-faint mb-1">Gold</p>
        <p className="font-display text-lg text-gold">{character.gold}</p>
      </div>
    </div>
  );
}
