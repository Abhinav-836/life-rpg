const prisma = require('../config/database');

function listRewards() {
  return prisma.reward.findMany({ orderBy: { cost: 'asc' } });
}

function listRedeemedByUser(userId) {
  return prisma.userReward.findMany({
    where: { userId },
    include: { reward: true },
    orderBy: { redeemedAt: 'desc' },
  });
}

// Wrapped in a transaction so "check gold, deduct gold, record redemption"
// can never partially apply (e.g. gold deducted but redemption not saved).
async function redeemReward(userId, rewardId) {
  return prisma.$transaction(async (tx) => {
    const [character, reward] = await Promise.all([
      tx.character.findUnique({ where: { userId } }),
      tx.reward.findUnique({ where: { id: rewardId } }),
    ]);

    if (!reward) {
      const err = new Error('Reward not found');
      err.status = 404;
      throw err;
    }
    if (character.gold < reward.cost) {
      const err = new Error('Not enough gold to redeem this reward');
      err.status = 400;
      throw err;
    }

    const updatedCharacter = await tx.character.update({
      where: { userId },
      data: { gold: { decrement: reward.cost } },
    });

    const redemption = await tx.userReward.create({
      data: { userId, rewardId },
      include: { reward: true },
    });

    return { redemption, character: updatedCharacter };
  });
}

module.exports = { listRewards, listRedeemedByUser, redeemReward };
