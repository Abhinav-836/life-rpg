export default function CharacterAvatar({ name, level }) {
  const initial = (name || '?').trim().charAt(0).toUpperCase();
  return (
    <div className="relative shrink-0">
      <div className="h-28 w-28 rounded-2xl bg-gradient-to-br from-purple via-indigo to-purple flex items-center justify-center text-5xl font-display text-white shadow-glow">
        {initial}
      </div>
      <div className="absolute -bottom-2 -right-2 h-9 w-9 rounded-full bg-gold text-void font-display text-sm flex items-center justify-center border-4 border-void">
        {level}
      </div>
    </div>
  );
}
