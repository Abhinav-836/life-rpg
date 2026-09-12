import { useState } from 'react';
import QuestCard from './QuestCard.jsx';
import Skeleton from '../../../components/common/Skeleton.jsx';
import EmptyState from '../../../components/common/EmptyState.jsx';
import ErrorMessage from '../../../components/common/ErrorMessage.jsx';
import Button from '../../../components/common/Button.jsx';

export default function QuestList({ quests, isLoading, isError, onRetry, onComplete, onEdit, onDelete, onAddQuest, completing }) {
  if (isLoading) {
    return (
      <ul className="space-y-2.5" aria-busy="true">
        {Array.from({ length: 4 }).map((_, i) => (
          <li key={i}><Skeleton className="h-16 w-full" /></li>
        ))}
      </ul>
    );
  }

  if (isError) {
    return <ErrorMessage message="Couldn't load your quests." onRetry={onRetry} />;
  }

  if (!quests.length) {
    return (
      <EmptyState
        icon="⚔"
        title="No quests match"
        description="Try clearing your filters, or start a fresh one."
        action={<Button size="sm" variant="ghost" onClick={onAddQuest}>+ New quest</Button>}
      />
    );
  }

  return (
    <ul className="space-y-2.5">
      {quests.map((quest) => (
        <QuestCard
          key={quest.id}
          quest={quest}
          onComplete={onComplete}
          onEdit={onEdit}
          onDelete={onDelete}
          completing={completing}
        />
      ))}
    </ul>
  );
}
