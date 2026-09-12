import { useMemo, useState } from 'react';
import { useQuests, useCreateQuest, useUpdateQuest, useDeleteQuest, useCompleteQuest } from '../../hooks/useTasks.js';
import { useToast } from '../../components/common/Toast.jsx';
import { playSound } from '../../utils/sound.js';
import LevelUpModal from '../../components/LevelUp/LevelUpModal.jsx';
import QuestHeader from './components/QuestHeader.jsx';
import QuestSearch from './components/QuestSearch.jsx';
import QuestFilter from './components/QuestFilter.jsx';
import QuestList from './components/QuestList.jsx';
import AddQuestModal from './components/AddQuestModal.jsx';
import EditQuestModal from './components/EditQuestModal.jsx';
import DeleteQuestModal from './components/DeleteQuestModal.jsx';
import AddQuestButton from './components/AddQuestButton.jsx';
import questBanner from '../../assets/images/quest-banner.png';
import './quests.css';

export default function Quests() {
  const { data: quests, isLoading, isError, refetch } = useQuests();
  const createQuest = useCreateQuest();
  const updateQuest = useUpdateQuest();
  const deleteQuest = useDeleteQuest();
  const completeQuest = useCompleteQuest();
  const toast = useToast();

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('pending');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('dueDate');

  const [addOpen, setAddOpen] = useState(false);
  const [editingQuest, setEditingQuest] = useState(null);
  const [deletingQuest, setDeletingQuest] = useState(null);
  const [levelUp, setLevelUp] = useState(null);

  const filtered = useMemo(() => {
    let list = quests || [];
    if (status !== 'all') list = list.filter((q) => q.status === status);
    if (category !== 'all') list = list.filter((q) => q.category === category);
    if (search.trim()) list = list.filter((q) => q.title.toLowerCase().includes(search.trim().toLowerCase()));
    const sorted = [...list].sort((a, b) => {
      if (sort === 'xp') return b.xp - a.xp;
      if (sort === 'priority') {
        const weight = { high: 3, medium: 2, low: 1 };
        return weight[b.priority] - weight[a.priority];
      }
      return a.dueDate < b.dueDate ? -1 : 1;
    });
    return sorted;
  }, [quests, status, category, search, sort]);

  async function handleComplete(quest) {
    try {
      const result = await completeQuest.mutateAsync(quest.id);
      toast(`${quest.title} complete — +${quest.xp} XP, +${quest.gold} gold`, 'success');
      playSound('questComplete');
      if (result.progression?.leveledUp) {
        setLevelUp(result.progression.newLevel);
        playSound('levelUp');
      }
    } catch {
      toast('Could not complete that quest — try again.', 'error');
    }
  }

  async function handleDelete(id) {
    try {
      await deleteQuest.mutateAsync(id);
      toast('Quest removed.', 'info');
    } catch {
      toast('Could not delete that quest.', 'error');
    }
  }

  return (
    <div>
      <QuestHeader onAddQuest={() => setAddOpen(true)} />

      <div className="flex flex-wrap gap-3 mb-5">
        <QuestSearch value={search} onChange={setSearch} />
        <QuestFilter status={status} onStatusChange={setStatus} category={category} onCategoryChange={setCategory} sort={sort} onSortChange={setSort} />
      </div>

      <QuestList
        quests={filtered}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        onComplete={handleComplete}
        onEdit={setEditingQuest}
        onDelete={setDeletingQuest}
        onAddQuest={() => setAddOpen(true)}
        completing={completeQuest.isPending}
      />

      {/* Motivational Quest Banner */}
      <div className="mt-8 w-full overflow-hidden rounded-xl border border-white/20 shadow-xl backdrop-blur-md">
        <img
          src={questBanner}
          alt="More Quests. More Rewards. A Better You. Effort today. A brighter tomorrow."
          className="quest-bottom-banner"
        />
      </div>

      <AddQuestButton onClick={() => setAddOpen(true)} />

      <AddQuestModal open={addOpen} onClose={() => setAddOpen(false)} onCreate={(data) => createQuest.mutateAsync(data)} />
      <EditQuestModal
        open={!!editingQuest}
        quest={editingQuest}
        onClose={() => setEditingQuest(null)}
        onSave={(id, data) => updateQuest.mutateAsync({ id, data })}
      />
      <DeleteQuestModal open={!!deletingQuest} quest={deletingQuest} onClose={() => setDeletingQuest(null)} onConfirm={handleDelete} />
      <LevelUpModal open={!!levelUp} level={levelUp} onClose={() => setLevelUp(null)} />
    </div>
  );
}
