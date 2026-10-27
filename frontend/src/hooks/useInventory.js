import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as inventoryApi from '../services/inventory.api.js';

export function useInventory() {
  return useQuery({ queryKey: ['inventory'], queryFn: inventoryApi.listInventory });
}

export function useEquipItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: inventoryApi.equipItem,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['inventory'] }),
  });
}

export function useUnequipItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: inventoryApi.unequipItem,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['inventory'] }),
  });
}

// The purchasable shop catalog, separate from what the player owns.
export function useShopItems() {
  return useQuery({ queryKey: ['shopItems'], queryFn: inventoryApi.listShopItems });
}

// Buying spends gold, so refresh both the inventory (new item) and the
// character (lower gold balance).
export function usePurchaseItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: inventoryApi.purchaseItem,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['inventory'] });
      qc.invalidateQueries({ queryKey: ['character'] });
    },
  });
}