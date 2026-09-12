const prisma = require('../config/database');
const { xpRequiredForLevel } = require('../services/xp.service');
const { success } = require('../utils/response');
const { asyncHandler } = require('../middleware/error.middleware');

const getMyCharacter = asyncHandler(async (req, res) => {
  const character = await prisma.character.findUnique({
    where: { userId: req.user.id },
    include: { attributes: true },
  });
  return success(res, { ...character, xpToNextLevel: xpRequiredForLevel(character.level) });
});

module.exports = { getMyCharacter };
