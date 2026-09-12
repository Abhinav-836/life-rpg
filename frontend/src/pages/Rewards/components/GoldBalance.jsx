import { formatGold } from '../../../utils/formatGold.js';

export default function GoldBalance({ gold }) {
  return (
    <div className="card-raised px-5 py-3 flex items-center gap-2.5 w-fit shadow-xl">
      <span className="text-gold text-lg drop-shadow-sm" aria-hidden="true">⛁</span>
      <span className="font-display text-white text-lg drop-shadow-sm">{formatGold(gold)}</span>
      <span className="text-xs text-gray-300 drop-shadow-sm">gold</span>
    </div>
  );
}
