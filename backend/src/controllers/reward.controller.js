const rewardService = require('../services/reward.service');
const { success } = require('../utils/response');
const { asyncHandler } = require('../middleware/error.middleware');

const listRewards = asyncHandler(async (req, res) => {
  const rewards = await rewardService.listRewards();
  return success(res, rewards);
});

const myRedemptions = asyncHandler(async (req, res) => {
  const redemptions = await rewardService.listRedeemedByUser(req.user.id);
  return success(res, redemptions);
});

const redeemReward = asyncHandler(async (req, res) => {
  const result = await rewardService.redeemReward(req.user.id, req.body.rewardId);
  return success(res, result, 201);
});

module.exports = { listRewards, myRedemptions, redeemReward };
