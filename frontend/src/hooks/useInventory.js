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

// NEW: the purchasable shop catalog, separate from what you already own.
export function useShopItems() {
  return useQuery({ queryKey: ['shopItems'], queryFn: inventoryApi.listShopItems });
}

// NEW: buying spends real gold via the backend - refetch inventory (the
// new item needs to show up as owned) and character (gold went down).
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
