import BadgeProgress from './BadgeProgress.jsx';

const RARITY_COLOR = { common: '#A7B0C5', rare: '#6366F1', epic: '#8B5CF6', legendary: '#F4C95D' };

export default function BadgeCard({ badge, onOpen }) {
  const color = RARITY_COLOR[badge.rarity];
  return (
    <li>
      <button
        type="button"
        onClick={() => onOpen(badge)}
        className={`card p-5 w-full text-left transition-all hover:border-purple/40 ${badge.earned ? '' : 'opacity-65'}`}
      >
        <div
          className="h-12 w-12 rounded-lg flex items-center justify-center text-xl mb-3 border border-white/15 backdrop-blur-sm shadow-inner"
          style={{ backgroundColor: `${color}26`, color }}
          aria-hidden="true"
        >
          ☖
        </div>
        <p className="text-sm text-white font-medium drop-shadow-sm">{badge.name}</p>
        <p className="text-[11px] uppercase tracking-wide mt-1 font-semibold drop-shadow-sm" style={{ color }}>{badge.rarity}</p>
        {!badge.earned && badge.target && <BadgeProgress progress={badge.progress} target={badge.target} />}
      </button>
    </li>
  );
}
