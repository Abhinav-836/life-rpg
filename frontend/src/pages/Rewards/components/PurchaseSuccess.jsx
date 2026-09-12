export default function PurchaseSuccess({ reward }) {
  return (
    <div className="text-center py-4">
      <p className="text-3xl mb-3" aria-hidden="true">✓</p>
      <p className="font-display text-lg text-ink mb-1">{reward.name} acquired</p>
      <p className="text-sm text-ink-muted">Find it in your Inventory to equip it.</p>
    </div>
  );
}
