export default function QuestSearch({ value, onChange }) {
  return (
    <div className="relative flex-1 min-w-[180px]">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint text-sm" aria-hidden="true">⌕</span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search quests…"
        aria-label="Search quests"
        className="w-full bg-surface-2/40 backdrop-blur-md border border-white/20 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple/60 focus:bg-surface-2/60"
      />
    </div>
  );
}
