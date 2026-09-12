const prisma = require('../config/database');
const { success } = require('../utils/response');
const { asyncHandler } = require('../middleware/error.middleware');

const getMyStreak = asyncHandler(async (req, res) => {
  const streak = await prisma.streak.findUnique({ where: { userId: req.user.id } });
  return success(res, streak);
});

module.exports = { getMyStreak };
