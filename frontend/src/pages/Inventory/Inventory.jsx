import { useInventory, useEquipItem, useUnequipItem, useShopItems, usePurchaseItem } from '../../hooks/useInventory.js';
import { useCharacter } from '../../hooks/useCharacter.js';
import { useToast } from '../../components/common/Toast.jsx';
import { getErrorMessage } from '../../utils/errorHandler.js';
import InventoryHeader from './components/InventoryHeader.jsx';
import InventoryGrid from './components/InventoryGrid.jsx';
import ShopGrid from './components/ShopGrid.jsx';

export default function Inventory() {
  const { data: items, isLoading } = useInventory();
  const { data: character } = useCharacter();
  const { data: shopItems, isLoading: shopLoading } = useShopItems();
  const equip = useEquipItem();
  const unequip = useUnequipItem();
  const purchase = usePurchaseItem();
  const toast = useToast();

  async function handleEquip(id) {
    await equip.mutateAsync(id);
    toast('Item equipped.', 'success');
  }

  async function handleUnequip(id) {
    await unequip.mutateAsync(id);
    toast('Item unequipped.', 'info');
  }

  async function handleBuy(id) {
    try {
      await purchase.mutateAsync(id);
      toast('Item purchased — check your inventory below.', 'success');
    } catch (err) {
      toast(getErrorMessage(err), 'error');
    }
  }

  const ownedIds = new Set((items || []).map((i) => i.id));

  return (
    <div>
      <InventoryHeader />

      <InventoryGrid
        items={items || []}
        isLoading={isLoading}
        onEquip={handleEquip}
        onUnequip={handleUnequip}
        loading={equip.isPending || unequip.isPending}
      />

      <div className="mt-10">
        <h2 className="font-display text-lg text-white mb-4">Shop</h2>
        <ShopGrid
          items={shopItems || []}
          ownedIds={ownedIds}
          gold={character?.gold ?? 0}
          isLoading={shopLoading}
          onBuy={handleBuy}
          loading={purchase.isPending}
        />
      </div>
    </div>
  );
}
