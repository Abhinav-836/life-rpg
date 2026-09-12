import { formatRelative } from '../../../utils/formatDate.js';
import EmptyState from '../../../components/common/EmptyState.jsx';

export default function RecentActivity({ quests }) {
  const recent = (quests || [])
    .filter((q) => q.status === 'completed')
    .sort((a, b) => (a.completedAt < b.completedAt ? 1 : -1))
    .slice(0, 5);

  return (
    <div className="card p-5">
      <h2 className="font-display text-ink text-base mb-4">Recent activity</h2>
      {recent.length === 0 ? (
        <EmptyState icon="⟡" title="Nothing yet" description="Completed quests will show up here." />
      ) : (
        <ul className="space-y-3">
          {recent.map((q) => (
            <li key={q.id} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="h-1.5 w-1.5 rounded-full bg-ok shrink-0" aria-hidden="true" />
                <span className="text-ink-muted truncate">{q.title}</span>
              </div>
              <span className="text-xs text-ink-faint shrink-0 ml-2">{formatRelative(q.completedAt)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
