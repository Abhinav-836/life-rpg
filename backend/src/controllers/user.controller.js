const prisma = require('../config/database');
const { hashPassword, comparePassword } = require('../utils/password');
const { success, failure } = require('../utils/response');
const { asyncHandler } = require('../middleware/error.middleware');
const { normalizeEmail } = require('../services/auth.service');
const settingsService = require('../services/settings.service');

const PUBLIC_USER_FIELDS = { id: true, name: true, email: true, isGuest: true, timezone: true, createdAt: true };

// req.user.id comes only from a verified JWT, so every route here can
// only ever read or change the logged-in user's own record.
const getMe = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id }, select: PUBLIC_USER_FIELDS });
  if (!user) return failure(res, 'Account not found', 404);
  return success(res, user);
});

async function rejectGuest(req, res) {
  const user = await prisma.user.findUnique({ where: { id: req.user.id }, select: { isGuest: true } });
  if (user?.isGuest) {
    failure(res, 'Demo accounts can\'t change their email or password. Sign up to keep your progress.', 403);
    return true;
  }
  return false;
}

const updateMe = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  const data = {};
  if (name !== undefined) data.name = name.trim();

  if (email !== undefined) {
    if (await rejectGuest(req, res)) return undefined;
    const normalized = normalizeEmail(email);
    const existing = await prisma.user.findFirst({
      where: { email: { equals: normalized, mode: 'insensitive' }, NOT: { id: req.user.id } },
      select: { id: true },
    });
    if (existing) return failure(res, 'That email is already in use', 409);
    data.email = normalized;
  }

  const user = await prisma.user.update({ where: { id: req.user.id }, data, select: PUBLIC_USER_FIELDS });
  return success(res, user);
});

const changePassword = asyncHandler(async (req, res) => {
  if (await rejectGuest(req, res)) return undefined;
  const { currentPassword, newPassword } = req.body;

  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  const valid = await comparePassword(currentPassword, user.passwordHash);
  if (!valid) return failure(res, 'Current password is incorrect', 401);

  const passwordHash = await hashPassword(newPassword);
  await prisma.user.update({ where: { id: req.user.id }, data: { passwordHash } });
  return success(res, { ok: true });
});

const getSettings = asyncHandler(async (req, res) => {
  return success(res, await settingsService.getSettings(req.user.id));
});

const updateSettings = asyncHandler(async (req, res) => {
  return success(res, await settingsService.updateSettings(req.user.id, req.body));
});

// Permanently deletes the account and everything that belongs to it
// (quests, character, streak, inventory, badges - all cascade).
const deleteMe = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user) return failure(res, 'Account not found', 404);

  if (!user.isGuest) {
    const valid = await comparePassword(req.body?.password || '', user.passwordHash);
    if (!valid) return failure(res, 'Password is incorrect', 401);
  }

  await prisma.user.delete({ where: { id: req.user.id } });
  return success(res, { deleted: true });
});

module.exports = { getMe, updateMe, changePassword, getSettings, updateSettings, deleteMe };