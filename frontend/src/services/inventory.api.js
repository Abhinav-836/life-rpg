import { request, getToken } from './api.js';

export async function listInventory() {
  const owned = await request('/inventory/mine', { token: getToken() });

  return owned.map((entry) => ({
    id: entry.item.id,
    name: entry.item.name,
    description: entry.item.description,
    rarity: entry.item.rarity,
    category: entry.item.type,
    quantity: entry.quantity,
    acquiredAt: entry.acquiredAt,
    equipped: entry.equipped,
  }));
}

// Equipped state is saved on the server. Equipping an item puts away any
// other equipped item of the same type.
export async function equipItem(id) {
  const owned = await request(`/inventory/${id}/equip`, { method: 'POST', token: getToken() });
  return { id, equipped: owned.equipped };
}

export async function unequipItem(id) {
  const owned = await request(`/inventory/${id}/unequip`, { method: 'POST', token: getToken() });
  return { id, equipped: owned.equipped };
}

// The shop catalog: every purchasable item, owned or not.
export async function listShopItems() {
  return request('/inventory', { token: getToken() });
}

// Gold check, deduction and the inventory write happen in one server-side
// transaction, so gold is never spent without the item arriving.
export async function purchaseItem(id) {
  const result = await request('/inventory/purchase', {
    method: 'POST',
    token: getToken(),
    body: { itemId: id },
  });
  return { item: result.owned.item, goldRemaining: result.character.gold };
}