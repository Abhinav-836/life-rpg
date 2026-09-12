const prisma = require('../config/database');
const { hashPassword, comparePassword } = require('../utils/password');
const { success, failure } = require('../utils/response');
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

// NEW: previously the frontend's Profile page had nothing to call - this
// lets a user update their own name/email. Scoped to req.user.id, same
// as every other route, so no one can edit another user's profile.
const updateMe = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  if (email) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing && existing.id !== req.user.id) {
      return failure(res, 'That email is already in use', 409);
    }
  }

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: { ...(name !== undefined ? { name } : {}), ...(email !== undefined ? { email } : {}) },
    select: { id: true, name: true, email: true, createdAt: true },
  });

  return success(res, user);
});

// NEW: change password - verifies the current password before allowing
// a change, same pattern any real auth flow needs.
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  const valid = await comparePassword(currentPassword, user.passwordHash);
  if (!valid) return failure(res, 'Current password is incorrect', 401);

  const passwordHash = await hashPassword(newPassword);
  await prisma.user.update({ where: { id: req.user.id }, data: { passwordHash } });

  return success(res, { ok: true });
});

module.exports = { getMe, updateMe, changePassword };
