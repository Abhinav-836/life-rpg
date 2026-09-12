const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'cosmetic', label: 'Cosmetic' },
  { id: 'theme', label: 'Themes' },
  { id: 'utility', label: 'Utility' },
];

export default function RewardCategories({ value, onChange }) {
  return (
    <div className="flex gap-2 flex-wrap" role="group" aria-label="Filter rewards by category">
      {CATEGORIES.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => onChange(c.id)}
          aria-pressed={value === c.id}
          className={`px-3.5 py-1.5 rounded-lg text-xs border transition-all ${
            value === c.id 
              ? 'bg-purple/40 border-purple/60 text-white font-medium shadow-sm backdrop-blur-md' 
              : 'border-white/20 bg-surface-2/40 backdrop-blur-md text-gray-300 hover:text-white hover:bg-white/10'
          }`}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}
