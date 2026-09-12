export default function RewardDetails({ reward }) {
  return (
    <div className="flex items-start gap-4 mb-6">
      <div className="h-16 w-16 rounded-lg bg-surface-2 border border-border flex items-center justify-center text-2xl shrink-0" aria-hidden="true">
        ⛁
      </div>
      <div>
        <p className="text-ink font-medium">{reward.name}</p>
        <p className="text-sm text-ink-muted mt-1">{reward.description}</p>
        <p className="text-sm text-gold mt-2">{reward.price}g</p>
      </div>
    </div>
  );
}
