const prisma = require('../config/database');
const { spendGold } = require('./wallet.service');
const { TX_OPTIONS } = require('../config/transaction');

function listItems() {
  return prisma.inventoryItem.findMany({ orderBy: { cost: 'asc' } });
}

function listOwnedByUser(userId) {
  return prisma.userInventory.findMany({
    where: { userId },
    include: { item: true },
    orderBy: { acquiredAt: 'desc' },
  });
}

// Gold deduction and the inventory write commit together or not at all.
async function purchaseItem(userId, itemId) {
  return prisma.$transaction(async (tx) => {
    const item = await tx.inventoryItem.findUnique({ where: { id: itemId } });
    if (!item) {
      const err = new Error('Item not found');
      err.status = 404;
      throw err;
    }

    const character = await spendGold(tx, userId, item.cost, 'Not enough gold to buy this item');
    const owned = await tx.userInventory.upsert({
      where: { userId_itemId: { userId, itemId } },
      update: { quantity: { increment: 1 } },
      create: { userId, itemId, quantity: 1 },
      include: { item: true },
    });

    return { owned, character };
  }, TX_OPTIONS);
}

// Equipped state lives in the database, so it follows the player across
// devices. Only one item per type can be equipped at a time (equipping a
// new sword puts the old one away).
async function setEquipped(userId, itemId, equipped) {
  return prisma.$transaction(async (tx) => {
    const owned = await tx.userInventory.findUnique({
      where: { userId_itemId: { userId, itemId } },
      include: { item: true },
    });
    if (!owned) {
      const err = new Error('You do not own this item');
      err.status = 404;
      throw err;
    }

    if (equipped) {
      await tx.userInventory.updateMany({
        where: { userId, equipped: true, item: { type: owned.item.type }, NOT: { itemId } },
        data: { equipped: false },
      });
    }

    return tx.userInventory.update({
      where: { id: owned.id },
      data: { equipped },
      include: { item: true },
    });
  }, TX_OPTIONS);
}

module.exports = { listItems, listOwnedByUser, purchaseItem, setEquipped };