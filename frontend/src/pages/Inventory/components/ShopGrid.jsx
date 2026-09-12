import ShopItem from './ShopItem.jsx';
import Skeleton from '../../../components/common/Skeleton.jsx';

// NEW: the purchasable catalog (GET /inventory) shown alongside what the
// user already owns (GET /inventory/mine) - this is what was missing
// before: there was no way to actually ACQUIRE an inventory item anywhere
// in the app, so the inventory page could only ever be empty.
export default function ShopGrid({ items, ownedIds, gold, isLoading, onBuy, loading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-40 w-full" />)}
      </div>
    );
  }

  if (!items.length) return null;

  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <ShopItem
          key={item.id}
          item={item}
          gold={gold}
          owned={ownedIds.has(item.id)}
          onBuy={onBuy}
          loading={loading}
        />
      ))}
    </ul>
  );
}
