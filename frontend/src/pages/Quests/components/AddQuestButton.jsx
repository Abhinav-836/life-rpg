export default function AddQuestButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Add a new quest"
      className="md:hidden fixed bottom-20 right-4 z-40 h-14 w-14 rounded-full bg-purple text-white text-2xl leading-none shadow-glow active:scale-95 transition-transform"
    >
      +
    </button>
  );
}
