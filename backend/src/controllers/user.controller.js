const prisma = require('../config/database');
const { success } = require('../utils/response');
const { asyncHandler } = require('../middleware/error.middleware');

// req.user.id comes only from a verified JWT - this route can only ever
// return the logged-in user's own record.
const getMe = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, name: true, email: true, createdAt: true },
  });
  return success(res, user);
});

module.exports = { getMe };
