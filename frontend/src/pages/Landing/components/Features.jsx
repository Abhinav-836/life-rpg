const FEATURES = [
  { title: 'Quests, not to-dos', body: 'Every task carries XP and gold. Finishing one feels like finishing one — with a payoff attached.', icon: '⚔' },
  { title: 'A character that grows', body: 'Tasks feed specific attributes — Coding builds Intellect, training builds Strength — so your effort shows up somewhere.', icon: '☉' },
  { title: 'Streaks that matter', body: 'Consistency is tracked and rewarded, with milestones that compound instead of resetting your motivation to zero.', icon: '❖' },
  { title: 'An economy worth playing', body: 'Spend earned gold on cosmetics, themes, and badges — rewards you chose, not ones assigned to you.', icon: '⛃' },
];

export default function Features() {
  return (
    <section className="px-6 py-20 border-t border-white/10">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-2xl sm:text-3xl text-white text-center mb-12 drop-shadow-md">Built like a game, because that's what works</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="p-6 rounded-xl bg-surface/30 backdrop-blur-md border border-white/15 hover:border-purple/50 hover:bg-surface/40 transition-all shadow-xl">
              <div className="h-10 w-10 rounded-lg bg-purple/25 text-purple flex items-center justify-center text-lg mb-4" aria-hidden="true">
                {f.icon}
              </div>
              <h3 className="font-display text-white text-lg mb-2 drop-shadow-sm">{f.title}</h3>
              <p className="text-sm text-gray-200 leading-relaxed drop-shadow-sm">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
