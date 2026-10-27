import { request, getToken } from './api.js';
import { xpForLevel, QUEST_CATEGORIES, ATTRIBUTES } from '../config/constants.js';

// Total XP a level+xp-into-level pair represents, cumulative from level 1.
// Used for both the character's overall total and each attribute's score.
function cumulativeXp(level, xpIntoLevel) {
  let total = xpIntoLevel;
  for (let l = 1; l < level; l++) total += xpForLevel(l);
  return total;
}

// The API stores XP per quest category (coding, fitness, study...). The
// Character and Stats pages show four stats (strength, intellect, health,
// discipline); QUEST_CATEGORIES says which stat each category feeds.
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