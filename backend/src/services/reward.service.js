const prisma = require('../config/database');
const { spendGold } = require('./wallet.service');
const { TX_OPTIONS } = require('../config/transaction');

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

// Gold deduction and the redemption record commit together or not at all.
async function redeemReward(userId, rewardId) {
  return prisma.$transaction(async (tx) => {
    const reward = await tx.reward.findUnique({ where: { id: rewardId } });
    if (!reward) {
      const err = new Error('Reward not found');
      err.status = 404;
      throw err;
    }

    const character = await spendGold(tx, userId, reward.cost, 'Not enough gold to redeem this reward');
    const redemption = await tx.userReward.create({
      data: { userId, rewardId },
      include: { reward: true },
    });

    return { redemption, character };
  }, TX_OPTIONS);
}

module.exports = { listRewards, listRedeemedByUser, redeemReward };