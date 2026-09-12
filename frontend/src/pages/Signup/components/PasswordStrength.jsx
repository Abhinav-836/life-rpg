function scorePassword(pw) {
  let score = 0;
  if (pw.length >= 8) score += 1;
  if (pw.length >= 12) score += 1;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score += 1;
  if (/\d/.test(pw)) score += 1;
  if (/[^A-Za-z0-9]/.test(pw)) score += 1;
  return score;
}

const LEVELS = [
  { label: 'Too weak', color: '#F87171' },
  { label: 'Weak', color: '#F87171' },
  { label: 'Fair', color: '#F4C95D' },
  { label: 'Good', color: '#F4C95D' },
  { label: 'Strong', color: '#4ADE80' },
  { label: 'Very strong', color: '#4ADE80' },
];

export default function PasswordStrength({ password }) {
  if (!password) return null;
  const score = scorePassword(password);
  const level = LEVELS[score];
  return (
    <div className="mt-1.5">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className="h-1 flex-1 rounded-full transition-colors"
            style={{ backgroundColor: i < score ? level.color : '#262C4E' }}
          />
        ))}
      </div>
      <p className="text-xs mt-1" style={{ color: level.color }}>{level.label}</p>
    </div>
  );
}
