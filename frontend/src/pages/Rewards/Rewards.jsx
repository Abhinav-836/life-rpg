import { useMemo, useState } from 'react';
import { useCharacter } from '../../hooks/useCharacter.js';
import { useRewards, useRedeemReward } from '../../hooks/useRewards.js';
import { useToast } from '../../components/common/Toast.jsx';
import RewardsHeader from './components/RewardsHeader.jsx';
import GoldBalance from './components/GoldBalance.jsx';
import RewardCategories from './components/RewardCategories.jsx';
import RewardGrid from './components/RewardGrid.jsx';
import PurchaseModal from './components/PurchaseModal.jsx';
import rewardsBottomBanner from '../../assets/images/rewards-bottom-banner.png';
import './rewards.css';

export default function Rewards() {
  const { data: character } = useCharacter();
  const { data: rewards, isLoading } = useRewards();
  const redeemReward = useRedeemReward();
  const toast = useToast();

  const [category, setCategory] = useState('all');
  const [openReward, setOpenReward] = useState(null);

  const filtered = useMemo(
    () => (rewards || []).filter((r) => category === 'all' || r.category === category),
    [rewards, category]
  );

  async function handleRedeem(id) {
    await redeemReward.mutateAsync(id);
    toast('Reward redeemed — check your Inventory.', 'success');
  }

  return (
    <div>
      <RewardsHeader />
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <RewardCategories value={category} onChange={setCategory} />
        <GoldBalance gold={character?.gold ?? 0} />
      </div>
      <RewardGrid rewards={filtered} gold={character?.gold ?? 0} isLoading={isLoading} onOpen={setOpenReward} />
      <PurchaseModal reward={openReward} gold={character?.gold ?? 0} onClose={() => setOpenReward(null)} onRedeem={handleRedeem} />

      {/* Rewards Bottom Banner */}
      <div className="mt-10 overflow-hidden rounded-xl border border-white/20 shadow-2xl backdrop-blur-md">
        <img
          src={rewardsBottomBanner}
          alt="More Quests. More Rewards. A Better You. Effort today. A brighter tomorrow."
          className="rewards-bottom-banner block"
        />
      </div>
    </div>
  );
}
