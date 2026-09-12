import { xpForLevel } from '../config/constants.js';

// Exposes the leveling curve to the UI (e.g. for a "next 5 levels" preview
// on the Character/Stats pages) without duplicating the math.
export async function getLevelCurve(fromLevel = 1, count = 10) {
  return Array.from({ length: count }).map((_, i) => {
    const level = fromLevel + i;
    return { level, xpRequired: xpForLevel(level) };
  });
}
