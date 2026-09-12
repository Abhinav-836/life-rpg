import { QUEST_CATEGORIES } from '../../../config/constants.js';

const STATUS_OPTIONS = [
  { id: 'pending', label: 'Pending' },
  { id: 'completed', label: 'Completed' },
  { id: 'all', label: 'All' },
];

export default function QuestFilter({ status, onStatusChange, category, onCategoryChange, sort, onSortChange }) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <div className="flex rounded-lg border border-white/20 bg-surface-2/40 backdrop-blur-md overflow-hidden" role="group" aria-label="Filter by status">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onStatusChange(opt.id)}
            aria-pressed={status === opt.id}
            className={`px-3 py-2 text-xs transition-colors ${
              status === opt.id ? 'bg-purple/40 text-white font-medium shadow-sm' : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        aria-label="Filter by category"
        className="bg-surface-2/40 backdrop-blur-md border border-white/20 rounded-lg px-3 py-2 text-xs text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple/60"
      >
        <option value="all" className="bg-surface-2 text-white">All categories</option>
        {QUEST_CATEGORIES.map((c) => (
          <option key={c.id} value={c.id} className="bg-surface-2 text-white">{c.label}</option>
        ))}
      </select>

      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        aria-label="Sort quests"
        className="bg-surface-2/40 backdrop-blur-md border border-white/20 rounded-lg px-3 py-2 text-xs text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple/60"
      >
        <option value="dueDate" className="bg-surface-2 text-white">Sort: Due date</option>
        <option value="xp" className="bg-surface-2 text-white">Sort: XP reward</option>
        <option value="priority" className="bg-surface-2 text-white">Sort: Priority</option>
      </select>
    </div>
  );
}
