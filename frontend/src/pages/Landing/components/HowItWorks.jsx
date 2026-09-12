const STEPS = [
  { step: 1, title: 'Log a quest', body: 'Add the thing you actually need to do. Set its category and how much it matters.' },
  { step: 2, title: 'Do the work', body: 'Nothing changes about the task itself — it\u2019s still the gym, the report, the errand.' },
  { step: 3, title: 'Complete it', body: 'One tap. XP and gold land immediately, and your streak keeps going.' },
  { step: 4, title: 'Watch yourself grow', body: 'Level up, unlock rewards, and see which attributes your habits are actually building.' },
];

export default function HowItWorks() {
  return (
    <section className="px-6 py-20 border-t border-white/10">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-display text-2xl sm:text-3xl text-white text-center mb-12 drop-shadow-md">How it works</h2>
        <ol className="grid sm:grid-cols-4 gap-6">
          {STEPS.map((s) => (
            <li key={s.step} className="text-center sm:text-left p-4 rounded-xl bg-surface/25 backdrop-blur-md border border-white/10 shadow-lg">
              <div className="h-9 w-9 rounded-full bg-purple/30 border border-purple/50 text-white font-display flex items-center justify-center mx-auto sm:mx-0 mb-3 shadow-sm">
                {s.step}
              </div>
              <h3 className="text-white font-medium mb-1.5 drop-shadow-sm">{s.title}</h3>
              <p className="text-sm text-gray-200 leading-relaxed drop-shadow-sm">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
