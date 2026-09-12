import { useState } from 'react';
import { QUEST_CATEGORIES, QUEST_PRIORITIES } from '../../../config/constants.js';
import { formatRelative } from '../../../utils/formatDate.js';

const PRIORITY_DOT = { low: '#4ADE80', medium: '#F4C95D', high: '#F87171' };

export default function QuestCard({ quest, onComplete, onEdit, onDelete, completing }) {
  const [justCompleted, setJustCompleted] = useState(false);
  const cat = QUEST_CATEGORIES.find((c) => c.id === quest.category);
  const priority = QUEST_PRIORITIES.find((p) => p.id === quest.priority);
  const isDone = quest.status === 'completed';

  async function handleCompleteClick() {
    setJustCompleted(true);
    await onComplete(quest);
  }

  return (
    <li
      className={`card p-4 flex items-start gap-3.5 transition-all ${isDone ? 'opacity-60' : 'hover:border-purple/40'} ${
        justCompleted ? 'animate-pop' : ''
      }`}
    >
      <button
        type="button"
        onClick={handleCompleteClick}
        disabled={isDone || completing}
        aria-label={isDone ? `${quest.title} completed` : `Complete ${quest.title}`}
        className={`mt-0.5 h-5 w-5 rounded-full border-2 shrink-0 transition-colors disabled:cursor-default ${
          isDone ? 'bg-ok border-ok' : 'border-purple/60 hover:bg-purple/20'
        }`}
      >
        {isDone && <span className="text-void text-xs leading-none block">✓</span>}
      </button>

      <div className="min-w-0 flex-1">
        <p className={`text-sm text-ink ${isDone ? 'line-through decoration-ink-faint' : ''}`}>{quest.title}</p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-ink-muted">
          <span style={{ color: cat?.color }}>{cat?.label}</span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: PRIORITY_DOT[quest.priority] }} aria-hidden="true" />
            {priority?.label}
          </span>
          <span>{isDone ? `Completed ${formatRelative(quest.completedAt)}` : `Due ${formatRelative(quest.dueDate)}`}</span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 shrink-0">
        <div className="text-xs text-right">
          <span className="text-gold">+{quest.xp} XP</span>
          <span className="text-ink-faint"> · +{quest.gold}g</span>
        </div>
        {!isDone && (
          <div className="flex gap-2">
            <button type="button" onClick={() => onEdit(quest)} className="text-xs text-ink-faint hover:text-ink">Edit</button>
            <button type="button" onClick={() => onDelete(quest)} className="text-xs text-ink-faint hover:text-danger">Delete</button>
          </div>
        )}
      </div>
    </li>
  );
}
