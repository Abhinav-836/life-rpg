export default function ProfileAvatar({ name }) {
  const initial = (name || '?').trim().charAt(0).toUpperCase();
  return (
    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple to-indigo flex items-center justify-center text-2xl font-display text-white shrink-0">
      {initial}
    </div>
  );
}
