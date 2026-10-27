// --- The non-linear leveling curve -----------------------------------
// Each level costs more XP than the last. Tune these two numbers to
// change pacing; nothing else needs to change.
const XP_BASE = 100;
const XP_EXPONENT = 1.5;

function xpRequiredForLevel(level) {
  return Math.floor(XP_BASE * Math.pow(level, XP_EXPONENT));
}

// Pure level-up math: rolls XP over into as many levels as it pays for.
function addXp(level, xp, xpGained) {
  let newLevel = level;
  let newXp = xp + xpGained;
  while (newXp >= xpRequiredForLevel(newLevel)) {
    newXp -= xpRequiredForLevel(newLevel);
    newLevel += 1;
  }
  return { level: newLevel, xp: newXp, leveledUp: newLevel > level };
}

// Locks the user's character row until the surrounding transaction ends.
// Every XP/gold change for a user goes through this lock, so two quests
// completed at the same instant are applied one after the other instead
// of both reading the same starting XP and one overwriting the other.
async function lockCharacter(tx, userId) {
  const rows = await tx.$queryRaw`SELECT "id" FROM "Character" WHERE "userId" = ${userId} FOR UPDATE`;
  if (rows.length === 0) {
    const err = new Error('Character not found');
    err.status = 404;
    throw err;
  }
  return tx.character.findUnique({ where: { userId } });
}

// Applies XP + gold to a character that the caller has already locked
// with lockCharacter(). This is the ONLY place character level-up math
// happens - the client never sends a level or XP total.
async function applyXpToCharacter(tx, character, xpGained, goldGained = 0) {
  const result = addXp(character.level, character.xp, xpGained);
  const updated = await tx.character.update({
    where: { id: character.id },
    data: { level: result.level, xp: result.xp, gold: { increment: goldGained } },
  });
  return {
    character: updated,
    leveledUp: result.leveledUp,
    previousLevel: character.level,
    xpToNextLevel: xpRequiredForLevel(result.level),
  };
}

// Attributes level up on the same curve, independently of the character's
// overall level. Safe without its own lock because callers hold the
// character lock, which serializes every progression change for the user.
async function applyXpToAttribute(tx, characterId, attributeName, xpGained) {
  const attribute = await tx.attribute.upsert({
    where: { characterId_name: { characterId, name: attributeName } },
    update: {},
    create: { characterId, name: attributeName, level: 1, xp: 0 },
  });
  const result = addXp(attribute.level, attribute.xp, xpGained);
  return tx.attribute.update({
    where: { id: attribute.id },
    data: { level: result.level, xp: result.xp },
  });
}

module.exports = {
  xpRequiredForLevel,
  addXp,
  lockCharacter,
  applyXpToCharacter,
  applyXpToAttribute,
};