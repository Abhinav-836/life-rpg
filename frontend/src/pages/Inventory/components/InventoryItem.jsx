import EquipButton from './EquipButton.jsx';
import UnequipButton from './UnequipButton.jsx';
import ItemDetails from './ItemDetails.jsx';

export default function InventoryItem({ item, onEquip, onUnequip, loading }) {
  return (
    <li className={`card p-4 transition-all ${item.equipped ? 'border-purple/60 bg-purple/20 shadow-glow' : 'hover:border-purple/40'}`}>
      <div className="h-14 w-14 rounded-lg bg-surface-2/40 backdrop-blur-sm border border-white/15 flex items-center justify-center text-xl mb-3 shadow-inner" aria-hidden="true">
        ⛁
      </div>
      <p className="text-sm text-white font-medium mb-1 drop-shadow-sm">{item.name}</p>
      <ItemDetails item={item} />
      <div className="mt-3">
        {item.equipped ? (
          <UnequipButton onClick={() => onUnequip(item.id)} loading={loading} />
        ) : (
          <EquipButton onClick={() => onEquip(item.id)} loading={loading} />
        )}
      </div>
    </li>
  );
}
