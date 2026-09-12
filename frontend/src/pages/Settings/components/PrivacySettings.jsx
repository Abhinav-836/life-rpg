export default function PrivacySettings({ privacy, onToggle }) {
  return (
    <div className="card p-6">
      <h2 className="font-display text-ink text-base mb-4">Privacy</h2>
      <label className="flex items-start justify-between gap-4 cursor-pointer">
        <span>
          <span className="block text-sm text-ink">Public profile</span>
          <span className="block text-xs text-ink-muted">Let other players see your level and badges.</span>
        </span>
        <input
          type="checkbox"
          checked={!!privacy?.publicProfile}
          onChange={() => onToggle('publicProfile')}
          className="mt-1 h-4 w-4 accent-purple shrink-0"
        />
      </label>
    </div>
  );
}
