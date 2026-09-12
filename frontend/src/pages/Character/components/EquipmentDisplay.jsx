import { Link } from 'react-router-dom';
import EmptyState from '../../../components/common/EmptyState.jsx';

export default function EquipmentDisplay({ equippedItems }) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-ink text-base">Equipped</h2>
        <Link to="/app/inventory" className="text-xs text-purple hover:text-ink">Inventory →</Link>
      </div>
      {equippedItems.length === 0 ? (
        <EmptyState icon="⛁" title="Nothing equipped" description="Redeem rewards and equip them to show off here." />
      ) : (
        <ul className="grid grid-cols-2 gap-3">
          {equippedItems.map((item) => (
            <li key={item.id} className="rounded-lg border border-purple/30 bg-purple/5 p-3 text-sm text-ink">
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
