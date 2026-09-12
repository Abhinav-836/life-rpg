import { QUEST_CATEGORIES } from '../../../config/constants.js';
import { formatRelative } from '../../../utils/formatDate.js';
import EmptyState from '../../../components/common/EmptyState.jsx';

export default function AttributeHistory({ quests }) {
  const rows = (quests || [])
    .filter((q) => q.status === 'completed')
    .sort((a, b) => (a.completedAt < b.completedAt ? 1 : -1))
    .slice(0, 8)
    .map((q) => ({ quest: q, cat: QUEST_CATEGORIES.find((c) => c.id === q.category) }));

  return (
    <div className="card p-5">
      <h2 className="font-display text-ink text-base mb-4">Attribute contributions</h2>
      {rows.length === 0 ? (
        <EmptyState icon="◈" title="No history yet" description="Complete a few quests to see where your growth is coming from." />
      ) : (
        <ul className="space-y-2.5">
          {rows.map(({ quest, cat }) => (
            <li key={quest.id} className="flex items-center justify-between text-sm">
              <span className="text-ink-muted truncate">{quest.title}</span>
              <span className="text-xs shrink-0 ml-3" style={{ color: cat?.color }}>
                +{Math.max(1, Math.round(quest.xp / 12))} {cat?.attribute} · {formatRelative(quest.completedAt)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
