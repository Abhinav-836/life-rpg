import { request, getToken } from './api.js';

// Backend `type` ('perk' | 'theme' | 'title') -> frontend `category`
// ('cosmetic' | 'theme' | 'utility') so the existing RewardCategories
// filter tabs keep working without changing their hardcoded bucket list.
const TYPE_TO_CATEGORY = { perk: 'utility', theme: 'theme', title: 'cosmetic' };

function toReward(reward) {
  return {
    id: reward.id,
    name: reward.name,
    description: reward.description,
    category: TYPE_TO_CATEGORY[reward.type] || 'utility',
    price: reward.cost, // FIX: backend field is `cost`, frontend reads `.price` everywhere
    image: reward.type,
  };
}

export async function listRewards() {
  const rewards = await request('/rewards', { token: getToken() });
  return rewards.map(toReward);
}

// FIX: reshapes the backend's { redemption, character } into the old
// mock's { reward, item, goldRemaining } shape so PurchaseModal /
// RewardCard (which check `gold`, price affordability, etc. via the
// separate useCharacter() query anyway) keep working, and useRewards.js's
// onSuccess invalidation of ['character'] + ['inventory'] still applies.
export async function redeemReward(id) {
  const result = await request('/rewards/redeem', {
    method: 'POST',
    token: getToken(),
    body: { rewardId: id },
  });
  return {
    reward: toReward(result.redemption.reward),
    goldRemaining: result.character.gold,
  };
}
