import { ATTRIBUTES } from '../../../config/constants.js';

export default function CharacterStats({ attributes }) {
  return (
    <div className="card p-6">
      <h2 className="font-display text-ink text-base mb-4">Attributes</h2>
      <div className="grid grid-cols-2 gap-4">
        {ATTRIBUTES.map((attr) => (
          <div key={attr.id} className="rounded-lg border border-border p-4">
            <p className="text-xs text-ink-faint mb-1">{attr.label}</p>
            <p className="font-display text-2xl" style={{ color: attr.color }}>{attributes?.[attr.id] ?? 0}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
