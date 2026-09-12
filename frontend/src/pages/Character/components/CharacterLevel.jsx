export default function CharacterLevel({ level, title }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-gold mb-1">{title}</p>
      <p className="font-display text-2xl text-ink">Level {level}</p>
    </div>
  );
}
