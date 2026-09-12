import { request, getToken } from './api.js';
import { xpForLevel, QUEST_CATEGORIES, ATTRIBUTES } from '../config/constants.js';

// Total XP a level+xp-into-level pair represents, cumulative from level 1.
// Used for both the character's overall total and each attribute's score.
function cumulativeXp(level, xpIntoLevel) {
  let total = xpIntoLevel;
  for (let l = 1; l < level; l++) total += xpForLevel(l);
  return total;
}

// FIX: the backend models attributes as a growing list of independent
// {name, level, xp} records - one per task CATEGORY you've ever completed
// (e.g. "coding", "fitness", "study" - six possible categories). This
// frontend's Character/Stats pages expect a flat object with exactly the
// FOUR canonical stats: { strength, intellect, health, discipline }
// (see src/config/constants.js ATTRIBUTES). QUEST_CATEGORIES already
// defines which of the 4 stats each of the 6 categories feeds into - this
// buckets the backend's per-category rows into that shape.
function bucketAttributes(rawAttributes) {
  const buckets = Object.fromEntries(ATTRIBUTES.map((a) => [a.id, 0]));

  for (const attr of rawAttributes) {
    const categoryMeta = QUEST_CATEGORIES.find((c) => c.id === attr.name);
    const bucket = categoryMeta?.attribute;
    if (!bucket) continue; // a category outside the known list - ignore rather than crash
    buckets[bucket] += cumulativeXp(attr.level, attr.xp);
  }

  return buckets;
}

export async function getCharacter() {
  const token = getToken();
  const [character, user] = await Promise.all([
    request('/character/me', { token }),
    request('/users/me', { token }),
  ]);

  return {
    level: character.level,
    gold: character.gold,
    title: character.title,
    xpIntoLevel: character.xp,
    xpForNext: character.xpToNextLevel,
    totalXP: cumulativeXp(character.level, character.xp),
    attributes: bucketAttributes(character.attributes),
    user,
  };
}
