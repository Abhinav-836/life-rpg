export default function ThemeSettings({ theme, onChange }) {
  return (
    <div className="card p-6">
      <h2 className="font-display text-ink text-base mb-1">Theme</h2>
      <p className="text-sm text-ink-muted mb-4">Dark Fantasy is the only theme in this build — more are on the way.</p>
      <div className="flex gap-3">
        <label className="flex items-center gap-2 text-sm text-ink cursor-pointer">
          <input
            type="radio"
            name="theme"
            checked={theme === 'dark-fantasy'}
            onChange={() => onChange('dark-fantasy')}
            className="accent-purple"
          />
          Dark Fantasy
        </label>
      </div>
    </div>
  );
}
