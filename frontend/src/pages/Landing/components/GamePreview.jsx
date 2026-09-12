export default function GamePreview() {
  return (
    <section className="px-6 py-20 border-t border-white/10">
      <div className="max-w-4xl mx-auto p-6 sm:p-10 rounded-2xl bg-surface-2/35 backdrop-blur-lg border border-white/15 shadow-2xl">
        <div className="grid sm:grid-cols-[auto_1fr] gap-6 items-center">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-purple to-indigo flex items-center justify-center font-display text-2xl text-white shadow-glow mx-auto sm:mx-0">
            7
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gold mb-1 font-semibold drop-shadow-sm">Apprentice of the Long Road</p>
            <p className="font-display text-xl text-white mb-3 drop-shadow-sm">Level 7</p>
            <div className="h-2.5 rounded-full bg-surface-3/60 backdrop-blur-sm overflow-hidden max-w-sm border border-white/10">
              <div className="h-full rounded-full bg-purple w-[62%]" />
            </div>
            <p className="text-xs text-gray-200 mt-2 drop-shadow-sm">2,140 XP earned · 845 gold on hand</p>
          </div>
        </div>
      </div>
    </section>
  );
}
