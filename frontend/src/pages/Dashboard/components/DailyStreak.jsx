import StatCard from '../../../components/common/StatCard.jsx';

export default function DailyStreak({ current, longest }) {
  return (
    <StatCard
      label="Streak"
      value={`${current} day${current === 1 ? '' : 's'}`}
      sublabel={longest ? `Best: ${longest} days` : undefined}
      icon="❖"
      accent="#8B5CF6"
    />
  );
}
