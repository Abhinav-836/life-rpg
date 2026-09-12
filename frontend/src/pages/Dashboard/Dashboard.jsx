import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { useCharacter } from '../../hooks/useCharacter.js';
import { useQuests } from '../../hooks/useTasks.js';
import { useStreak } from '../../hooks/useStreak.js';
import LevelUpModal from '../../components/LevelUp/LevelUpModal.jsx';
import WelcomeHeader from './components/WelcomeHeader.jsx';
import CharacterSummary from './components/CharacterSummary.jsx';
import GoldDisplay from './components/GoldDisplay.jsx';
import DailyStreak from './components/DailyStreak.jsx';
import DailyQuests from './components/DailyQuests.jsx';
import AttributeOverview from './components/AttributeOverview.jsx';
import RecentActivity from './components/RecentActivity.jsx';
import QuickActions from './components/QuickActions.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  const { data: character, isLoading: characterLoading } = useCharacter();
  const { data: quests, isLoading: questsLoading } = useQuests();
  const { data: streak } = useStreak();
  const [levelUp, setLevelUp] = useState(null);

  const completedCount = (quests || []).filter((q) => q.status === 'completed').length;
  const pendingCount = (quests || []).filter((q) => q.status === 'pending').length;

  return (
    <div>
      <WelcomeHeader name={user?.name} />

      <div className="space-y-6">
        <CharacterSummary character={character} isLoading={characterLoading} />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <GoldDisplay gold={character?.gold ?? 0} />
          <DailyStreak current={streak?.current ?? 0} longest={streak?.longest} />
          <div className="card p-5">
            <p className="text-xs uppercase tracking-wide text-ink-faint mb-1">Pending</p>
            <p className="font-display text-xl text-ink">{pendingCount}</p>
          </div>
          <div className="card p-5">
            <p className="text-xs uppercase tracking-wide text-ink-faint mb-1">Completed</p>
            <p className="font-display text-xl text-ink">{completedCount}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <DailyQuests quests={quests} isLoading={questsLoading} onLevelUp={setLevelUp} />
            <RecentActivity quests={quests} />
          </div>
          <div className="space-y-6">
            <AttributeOverview attributes={character?.attributes} />
            <QuickActions />
          </div>
        </div>
      </div>

      <LevelUpModal open={!!levelUp} level={levelUp} onClose={() => setLevelUp(null)} />
    </div>
  );
}
