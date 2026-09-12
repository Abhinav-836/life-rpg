import BuyButton from './BuyButton.jsx';

export default function ShopItem({ item, gold, owned, onBuy, loading }) {
  const affordable = gold >= item.cost;

  return (
    <li className={`card p-4 transition-all ${owned ? 'border-purple/40' : 'hover:border-gold/40'}`}>
      <div className="h-14 w-14 rounded-lg bg-surface-2/40 backdrop-blur-sm border border-white/15 flex items-center justify-center text-xl mb-3 shadow-inner" aria-hidden="true">
        ⛁
      </div>
      <p className="text-sm text-white font-medium mb-1 drop-shadow-sm">{item.name}</p>
      <p className="text-xs text-ink-faint mb-1">{item.description}</p>
      <p className="text-xs text-gold font-semibold mb-3">{item.cost}g</p>
      <div>
        {owned ? (
          <p className="text-xs text-ink-faint text-center py-1.5">Already owned</p>
        ) : (
          <BuyButton cost={item.cost} affordable={affordable} onClick={() => onBuy(item.id)} loading={loading} />
        )}
      </div>
    </li>
  );
}
