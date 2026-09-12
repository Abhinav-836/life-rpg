import InventoryItem from './InventoryItem.jsx';
import EmptyState from '../../../components/common/EmptyState.jsx';
import Skeleton from '../../../components/common/Skeleton.jsx';

export default function InventoryGrid({ items, isLoading, onEquip, onUnequip, loading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-40 w-full" />)}
      </div>
    );
  }

  if (!items.length) {
    return (
      <EmptyState
        icon="⛁"
        title="Your inventory is empty"
        description="Buy something from the shop below to see it here."
      />
    );
  }

  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <InventoryItem key={item.id} item={item} onEquip={onEquip} onUnequip={onUnequip} loading={loading} />
      ))}
    </ul>
  );
}
