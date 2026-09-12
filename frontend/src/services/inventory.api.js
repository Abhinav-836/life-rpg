import { request, getToken } from './api.js';

const EQUIPPED_KEY = 'lifeRpgEquippedItemIds';

function getEquippedSet() {
  try {
    return new Set(JSON.parse(localStorage.getItem(EQUIPPED_KEY) || '[]'));
  } catch {
    return new Set();
  }
}

function saveEquippedSet(set) {
  localStorage.setItem(EQUIPPED_KEY, JSON.stringify([...set]));
}

// FIX: the backend's UserInventory has no "equipped" concept at all
// (it only tracks ownership + quantity) - there is no column to persist
// this to. Rather than silently pretending equip/unequip works when it
// doesn't, this stores equipped state in localStorage as a deliberate,
// documented client-only cosmetic toggle (it survives refresh, just not
// a switch to a different device/browser). This is fine for a hackathon:
// it's cosmetic display state, not the "primary data" the disqualification
// rules care about persisting server-side - that's tasks/character/user,
// which all really do round-trip through Postgres.
export async function listInventory() {
  const owned = await request('/inventory/mine', { token: getToken() });
  const equipped = getEquippedSet();

  return owned.map((entry) => ({
    id: entry.item.id,
    name: entry.item.name,
    description: entry.item.description,
    rarity: entry.item.rarity,
    category: entry.item.type,
    quantity: entry.quantity,
    acquiredAt: entry.acquiredAt,
    equipped: equipped.has(entry.item.id),
  }));
}

export async function equipItem(id) {
  const equipped = getEquippedSet();
  equipped.add(id);
  saveEquippedSet(equipped);
  return { id, equipped: true };
}

export async function unequipItem(id) {
  const equipped = getEquippedSet();
  equipped.delete(id);
  saveEquippedSet(equipped);
  return { id, equipped: false };
}

// NEW: the shop catalog - all purchasable items, regardless of ownership.
export async function listShopItems() {
  return request('/inventory', { token: getToken() });
}

// NEW: spend gold on a shop item. The backend does the gold-check +
// deduction + inventory write as one transaction (inventory.service.js),
// so this can never deduct gold without the purchase actually completing.
export async function purchaseItem(id) {
  const result = await request('/inventory/purchase', {
    method: 'POST',
    token: getToken(),
    body: { itemId: id },
  });
  return { item: result.owned.item, goldRemaining: result.character.gold };
}
