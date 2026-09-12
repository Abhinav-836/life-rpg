import BadgeCard from './BadgeCard.jsx';
import Skeleton from '../../../components/common/Skeleton.jsx';

export default function BadgeGrid({ badges, isLoading, onOpen }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
      </div>
    );
  }
  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {badges.map((b) => <BadgeCard key={b.id} badge={b} onOpen={onOpen} />)}
    </ul>
  );
}
