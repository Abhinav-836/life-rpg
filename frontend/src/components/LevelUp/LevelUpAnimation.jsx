// Small decorative burst rendered behind the LevelUpModal content.
// Kept separate so LevelUpModal stays focused on layout/content.
export default function LevelUpAnimation() {
  const rays = Array.from({ length: 10 });
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="relative h-40 w-40">
        {rays.map((_, i) => (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 h-20 w-1 origin-bottom rounded-full bg-gradient-to-t from-gold/0 to-gold/70 animate-pop"
            style={{ transform: `translate(-50%, -100%) rotate(${(360 / rays.length) * i}deg)`, animationDelay: `${i * 20}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
