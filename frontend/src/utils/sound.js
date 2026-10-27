// Best-effort sound effects. Respects the "Sound effects" setting, and
// fails silently if a file is missing or the browser blocks autoplay.
const SOUND_FILES = {
  questComplete: '/assets/sounds/quest-complete.mp3',
  levelUp: '/assets/sounds/level-up.mp3',
  purchase: '/assets/sounds/purchase.mp3',
};

let soundEnabled = true;

// Called by MainLayout whenever the player's settings load or change.
export function setSoundEnabled(enabled) {
  soundEnabled = enabled !== false;
}

export function playSound(name) {
  if (!soundEnabled) return;
  const src = SOUND_FILES[name];
  if (!src) return;
  try {
    const audio = new Audio(src);
    audio.volume = 0.5;
    audio.play().catch(() => {});
  } catch {
    // Sound is a nice-to-have, never a blocker.
  }
}