import { Link } from 'react-router-dom';
import { useCompleteQuest } from '../../../hooks/useTasks.js';
import { useToast } from '../../../components/common/Toast.jsx';
import { playSound } from '../../../utils/sound.js';
import { QUEST_CATEGORIES } from '../../../config/constants.js';
import Skeleton from '../../../components/common/Skeleton.jsx';
import EmptyState from '../../../components/common/EmptyState.jsx';

export default function DailyQuests({ quests, isLoading, onLevelUp }) {
  const completeQuest = useCompleteQuest();
  const toast = useToast();
  const pending = (quests || []).filter((q) => q.status === 'pending').slice(0, 5);

  async function handleComplete(quest) {
    try {
      const result = await completeQuest.mutateAsync(quest.id);
      toast(`${quest.title} complete — +${quest.xp} XP, +${quest.gold} gold`, 'success');
      playSound('questComplete');
      if (result.progression?.leveledUp) {
        onLevelUp?.(result.progression.newLevel);
        playSound('levelUp');
      }
    } catch {
      toast('Could not complete that quest — try again.', 'error');
    }
  }

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-ink text-base">Today's quests</h2>
        <Link to="/app/quests" className="text-xs text-purple hover:text-ink">See all →</Link>
      </div>

      {isLoading && (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      )}

      {!isLoading && pending.length === 0 && (
        <EmptyState icon="✓" title="All clear" description="No pending quests — add one to keep your streak alive." />
      )}

      {!isLoading && pending.length > 0 && (
        <ul className="space-y-2">
          {pending.map((quest) => {
            const cat = QUEST_CATEGORIES.find((c) => c.id === quest.category);
            return (
              <li key={quest.id} className="flex items-center gap-3 rounded-lg border border-border px-3.5 py-3 hover:border-purple/40 transition-colors">
                <button
                  type="button"
                  onClick={() => handleComplete(quest)}
                  disabled={completeQuest.isPending}
                  aria-label={`Complete ${quest.title}`}
                  className="h-5 w-5 rounded-full border-2 border-purple/60 shrink-0 hover:bg-purple/20 disabled:opacity-50 transition-colors"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-ink truncate">{quest.title}</p>
                  <p className="text-xs" style={{ color: cat?.color }}>{cat?.label}</p>
                </div>
                <span className="text-xs text-gold shrink-0">+{quest.xp} XP</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
