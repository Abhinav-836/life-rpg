export default function EmptyState({ icon = '⟡', title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6 rounded-xl border border-dashed border-border">
      <span className="text-3xl text-purple mb-3" aria-hidden="true">{icon}</span>
      <h3 className="font-display text-ink text-lg mb-1">{title}</h3>
      {description && <p className="text-sm text-ink-muted max-w-sm mb-4">{description}</p>}
      {action}
    </div>
  );
}
