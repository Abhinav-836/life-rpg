import { useCharacter } from '../../hooks/useCharacter.js';
import { useQuests } from '../../hooks/useTasks.js';
import Loader from '../../components/common/Loader.jsx';
import StatsHeader from './components/StatsHeader.jsx';
import StrengthCard from './components/StrengthCard.jsx';
import IntellectCard from './components/IntellectCard.jsx';
import HealthCard from './components/HealthCard.jsx';
import DisciplineCard from './components/DisciplineCard.jsx';
import StatsChart from './components/StatsChart.jsx';
import AttributeHistory from './components/AttributeHistory.jsx';
import { formatXP } from '../../utils/formatXP.js';
import { formatGold } from '../../utils/formatGold.js';

export default function Stats() {
  const { data: character, isLoading: charLoading } = useCharacter();
  const { data: quests, isLoading: questsLoading } = useQuests();

  if (charLoading || questsLoading) {
    return <Loader label="Tallying the ledger…" size="lg" />;
  }

  const completed = (quests || []).filter((q) => q.status === 'completed');
  const pending = (quests || []).filter((q) => q.status === 'pending');
  const total = completed.length + pending.length;
  const completionPct = total ? Math.round((completed.length / total) * 100) : 0;
  const goldEarned = completed.reduce((sum, q) => sum + q.gold, 0);

  return (
    <div>
      <StatsHeader />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card p-5">
          <p className="text-xs uppercase tracking-wide text-ink-faint mb-1">Total quests</p>
          <p className="font-display text-xl text-ink">{total}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs uppercase tracking-wide text-ink-faint mb-1">Completion rate</p>
          <p className="font-display text-xl text-ink">{completionPct}%</p>
        </div>
        <div className="card p-5">
          <p className="text-xs uppercase tracking-wide text-ink-faint mb-1">XP earned</p>
          <p className="font-display text-xl text-ink">{formatXP(character?.totalXP ?? 0)}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs uppercase tracking-wide text-ink-faint mb-1">Gold earned</p>
          <p className="font-display text-xl text-ink">{formatGold(goldEarned)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StrengthCard value={character?.attributes?.strength ?? 0} />
        <IntellectCard value={character?.attributes?.intellect ?? 0} />
        <HealthCard value={character?.attributes?.health ?? 0} />
        <DisciplineCard value={character?.attributes?.discipline ?? 0} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <StatsChart quests={quests} days={7} />
        <AttributeHistory quests={quests} />
      </div>
    </div>
  );
}
