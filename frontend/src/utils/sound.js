// Best-effort sound playback. Wrapped in try/catch and respects the user's
// sound preference from Settings — if a file is missing or autoplay is
// blocked, this fails silently rather than throwing into the UI.
const SOUND_FILES = {
  questComplete: '/assets/sounds/quest-complete.mp3',
  levelUp: '/assets/sounds/level-up.mp3',
  purchase: '/assets/sounds/purchase.mp3',
};

export function playSound(name, enabled = true) {
  if (!enabled) return;
  const src = SOUND_FILES[name];
  if (!src) return;
  try {
    const audio = new Audio(src);
    audio.volume = 0.5;
    audio.play().catch(() => {});
  } catch {
    // Ignore — sound is a nice-to-have, never a blocker.
  }
}
