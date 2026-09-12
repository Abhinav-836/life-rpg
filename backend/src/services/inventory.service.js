const prisma = require('../config/database');

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

// Same transactional pattern as rewards: gold check + deduction +
// inventory write must all succeed together or not at all.
async function purchaseItem(userId, itemId) {
  return prisma.$transaction(async (tx) => {
    const [character, item] = await Promise.all([
      tx.character.findUnique({ where: { userId } }),
      tx.inventoryItem.findUnique({ where: { id: itemId } }),
    ]);

    if (!item) {
      const err = new Error('Item not found');
      err.status = 404;
      throw err;
    }
    if (character.gold < item.cost) {
      const err = new Error('Not enough gold to buy this item');
      err.status = 400;
      throw err;
    }

    const updatedCharacter = await tx.character.update({
      where: { userId },
      data: { gold: { decrement: item.cost } },
    });

    const owned = await tx.userInventory.upsert({
      where: { userId_itemId: { userId, itemId } },
      update: { quantity: { increment: 1 } },
      create: { userId, itemId, quantity: 1 },
      include: { item: true },
    });

    return { owned, character: updatedCharacter };
  });
}

module.exports = { listItems, listOwnedByUser, purchaseItem };
