// A small floating "+XP" burst, mounted briefly near a completed quest.
// Kept as a standalone piece so QuestCard's completion logic doesn't also
// have to own animation cleanup/timing.
export default function CompleteQuestAnimation({ xp }) {
  return (
    <span
      className="pointer-events-none absolute -top-2 right-4 text-xs font-medium text-gold"
      style={{ animation: 'xp-float 1s ease-out forwards' }}
      aria-hidden="true"
    >
      +{xp} XP
    </span>
  );
}
