export default function RewardCard({ reward, gold, onOpen }) {
  const affordable = gold >= reward.price;
  return (
    <li className="card p-5 flex flex-col hover:border-purple/40 transition-all">
      <div className="h-16 w-16 rounded-lg bg-surface-2/40 backdrop-blur-sm border border-white/15 flex items-center justify-center text-2xl mb-3 shadow-inner" aria-hidden="true">
        ⛁
      </div>
      <h3 className="text-white font-medium mb-1 drop-shadow-sm">{reward.name}</h3>
      <p className="text-xs text-gray-200 mb-4 flex-1 drop-shadow-sm">{reward.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gold font-semibold drop-shadow-sm">{reward.price}g</span>
        <button
          type="button"
          onClick={() => onOpen(reward)}
          className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
            affordable ? 'border-purple/50 bg-purple/30 text-white hover:bg-purple/50 backdrop-blur-sm shadow-sm' : 'border-white/10 bg-black/20 text-gray-400 cursor-default'
          }`}
          disabled={!affordable}
        >
          {affordable ? 'View' : 'Need more gold'}
        </button>
      </div>
    </li>
  );
}
