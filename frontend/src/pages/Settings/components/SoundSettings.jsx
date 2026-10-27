export default function SoundSettings({ enabled, onToggle }) {
  return (
    <div className="card p-6">
      <h2 className="font-display text-ink text-base mb-4">Sound</h2>
      <label className="flex items-start justify-between gap-4 cursor-pointer">
        <span>
          <span className="block text-sm text-ink">Sound effects</span>
          <span className="block text-xs text-ink-muted">Play a sound when you complete a quest, level up or buy something.</span>
        </span>
        <input
          type="checkbox"
          checked={enabled !== false}
          onChange={onToggle}
          className="mt-1 h-4 w-4 accent-purple shrink-0"
        />
      </label>
    </div>
  );
}