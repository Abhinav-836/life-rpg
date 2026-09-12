import RewardCard from './RewardCard.jsx';
import Skeleton from '../../../components/common/Skeleton.jsx';
import EmptyState from '../../../components/common/EmptyState.jsx';

export default function RewardGrid({ rewards, gold, isLoading, onOpen }) {
  if (isLoading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-44 w-full" />)}
      </div>
    );
  }

  if (!rewards.length) {
    return <EmptyState icon="⛃" title="No rewards here" description="Try a different category." />;
  }

  return (
    <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {rewards.map((r) => (
        <RewardCard key={r.id} reward={r} gold={gold} onOpen={onOpen} />
      ))}
    </ul>
  );
}
