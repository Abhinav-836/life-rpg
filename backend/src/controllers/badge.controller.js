const prisma = require('../config/database');
const { success } = require('../utils/response');
const { asyncHandler } = require('../middleware/error.middleware');

const listAllBadges = asyncHandler(async (req, res) => {
  const badges = await prisma.badge.findMany();
  return success(res, badges);
});

const getMyBadges = asyncHandler(async (req, res) => {
  const owned = await prisma.userBadge.findMany({
    where: { userId: req.user.id },
    include: { badge: true },
    orderBy: { earnedAt: 'desc' },
  });
  return success(res, owned);
});

module.exports = { listAllBadges, getMyBadges };
