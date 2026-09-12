const prisma = require('../config/database');

// --- The non-linear leveling curve -----------------------------------
// Each level costs more XP than the last. Tune these two numbers to
// change pacing; nothing else needs to change.
const XP_BASE = 100;
const XP_EXPONENT = 1.5;

function xpRequiredForLevel(level) {
  return Math.floor(XP_BASE * Math.pow(level, XP_EXPONENT));
}

// Applies XP to the character, rolling over into as many level-ups as
// the XP amount earns (handles big XP dumps, not just +1 level at a time).
// This is intentionally the ONLY place level-up math happens - the
// frontend never sends a level or xp value, only "task X was completed".
async function applyXpToCharacter(characterId, xpGained, goldGained = 0) {
  const character = await prisma.character.findUnique({ where: { id: characterId } });
  if (!character) throw new Error('Character not found');

  let { level, xp } = character;
  xp += xpGained;
  let leveledUp = false;

  while (xp >= xpRequiredForLevel(level)) {
    xp -= xpRequiredForLevel(level);
    level += 1;
    leveledUp = true;
  }

  const updated = await prisma.character.update({
    where: { id: characterId },
    data: {
      level,
      xp,
      gold: { increment: goldGained },
    },
  });

  return { character: updated, leveledUp, xpToNextLevel: xpRequiredForLevel(level) };
}

// Attributes (Intellect, Strength, ...) level up on the same curve,
// independently of the character's overall level.
async function applyXpToAttribute(characterId, attributeName, xpGained) {
  const attribute = await prisma.attribute.upsert({
    where: { characterId_name: { characterId, name: attributeName } },
    update: {},
    create: { characterId, name: attributeName, level: 1, xp: 0 },
  });

  let { level, xp } = attribute;
  xp += xpGained;

  while (xp >= xpRequiredForLevel(level)) {
    xp -= xpRequiredForLevel(level);
    level += 1;
  }

  return prisma.attribute.update({
    where: { id: attribute.id },
    data: { level, xp },
  });
}

module.exports = { xpRequiredForLevel, applyXpToCharacter, applyXpToAttribute };
