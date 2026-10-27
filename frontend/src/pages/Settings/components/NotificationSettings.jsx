export default function NotificationSettings({ notifications, onToggle }) {
  return (
    <div className="card p-6">
      <h2 className="font-display text-ink text-base mb-4">Reminders</h2>
      <label className="flex items-start justify-between gap-4 cursor-pointer">
        <span>
          <span className="block text-sm text-ink">Streak at risk warning</span>
          <span className="block text-xs text-ink-muted">
            Show a banner on your dashboard when you haven't completed a quest yet today and your streak could break.
          </span>
        </span>
        <input
          type="checkbox"
          checked={notifications?.streakWarning !== false}
          onChange={() => onToggle('streakWarning')}
          className="mt-1 h-4 w-4 accent-purple shrink-0"
        />
      </label>
    </div>
  );
}