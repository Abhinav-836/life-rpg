import { Link } from 'react-router-dom';
import { ATTRIBUTES } from '../../../config/constants.js';

export default function AttributeOverview({ attributes }) {
  if (!attributes) return null;
  const max = Math.max(...Object.values(attributes), 1);

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-ink text-base">Attributes</h2>
        <Link to="/app/stats" className="text-xs text-purple hover:text-ink">Details →</Link>
      </div>
      <div className="space-y-3">
        {ATTRIBUTES.map((attr) => {
          const value = attributes[attr.id] ?? 0;
          const pct = Math.round((value / max) * 100);
          return (
            <div key={attr.id}>
              <div className="flex justify-between text-xs text-ink-muted mb-1">
                <span>{attr.label}</span>
                <span>{value}</span>
              </div>
              <div className="h-1.5 rounded-full bg-surface-3 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: attr.color }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
