const prisma = require('../config/database');
const { effectiveStreak } = require('../services/streak.service');
const { success } = require('../utils/response');
const { asyncHandler } = require('../middleware/error.middleware');

const getMyStreak = asyncHandler(async (req, res) => {
  const [streak, user] = await Promise.all([
    prisma.streak.findUnique({ where: { userId: req.user.id } }),
    prisma.user.findUnique({ where: { id: req.user.id }, select: { timezone: true } }),
  ]);
  const tz = req.timeZone || user?.timezone || 'UTC';
  return success(res, { ...effectiveStreak(streak, tz), timezone: tz });
});

module.exports = { getMyStreak };