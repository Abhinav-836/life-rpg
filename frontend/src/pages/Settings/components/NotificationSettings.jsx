const OPTIONS = [
  { id: 'dailyReminder', label: 'Daily quest reminder', hint: 'A nudge if you have pending quests by evening.' },
  { id: 'streakWarning', label: 'Streak at risk warning', hint: 'Alert when your streak is about to break.' },
  { id: 'weeklyDigest', label: 'Weekly progress digest', hint: 'A summary of XP, gold, and quests completed.' },
];

export default function NotificationSettings({ notifications, onToggle }) {
  return (
    <div className="card p-6">
      <h2 className="font-display text-ink text-base mb-4">Notifications</h2>
      <div className="space-y-4">
        {OPTIONS.map((opt) => (
          <label key={opt.id} className="flex items-start justify-between gap-4 cursor-pointer">
            <span>
              <span className="block text-sm text-ink">{opt.label}</span>
              <span className="block text-xs text-ink-muted">{opt.hint}</span>
            </span>
            <input
              type="checkbox"
              checked={!!notifications?.[opt.id]}
              onChange={() => onToggle(opt.id)}
              className="mt-1 h-4 w-4 accent-purple shrink-0"
            />
          </label>
        ))}
      </div>
    </div>
  );
}
