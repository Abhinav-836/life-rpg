const prisma = require('../config/database');
const { hashPassword, comparePassword } = require('../utils/password');
const { signToken } = require('../utils/jwt');

async function signup({ name, email, password }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const err = new Error('An account with that email already exists');
    err.status = 409;
    throw err;
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      character: { create: {} },
      streak: { create: {} },
    },
    include: { character: true, streak: true },
  });

  const token = signToken({ id: user.id, email: user.email });
  const { passwordHash: _omit, ...safeUser } = user;
  return { user: safeUser, token };
}

async function login({ email, password }) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { character: true, streak: true },
  });

  if (!user) {
    const err = new Error('Invalid email or password');
    err.status = 401;
    throw err;
  }

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) {
    const err = new Error('Invalid email or password');
    err.status = 401;
    throw err;
  }

  const token = signToken({ id: user.id, email: user.email });
  const { passwordHash: _omit, ...safeUser } = user;
  return { user: safeUser, token };
}

// NEW: backs the frontend's "Continue as guest" button. That button was
// calling login() with hardcoded credentials (guest@liferpg.app /
// guestguest) that only ever existed in the old mock database - against
// the real database that account never existed, so it 401'd every time
// (surfaced as a 500 until the error-handler fix, but wrong either way).
//
// This makes "guest" a real, idempotent backend concept: find the shared
// demo account, or create it the first time anyone clicks the button.
// Every guest click after the first reuses the same account and its
// accumulated progress - which is a perfectly fine demo experience, and
// means there's nothing hardcoded on the frontend that can drift out of
// sync with what actually exists in the database again.
const GUEST_EMAIL = 'guest@liferpg.app';

async function guestLogin() {
  let user = await prisma.user.findUnique({
    where: { email: GUEST_EMAIL },
    include: { character: true, streak: true },
  });

  if (!user) {
    const passwordHash = await hashPassword(`guest-${Date.now()}-${Math.random()}`);
    user = await prisma.user.create({
      data: {
        name: 'Guest',
        email: GUEST_EMAIL,
        passwordHash,
        character: { create: {} },
        streak: { create: {} },
      },
      include: { character: true, streak: true },
    });
  }

  const token = signToken({ id: user.id, email: user.email });
  const { passwordHash: _omit, ...safeUser } = user;
  return { user: safeUser, token };
}

module.exports = { signup, login, guestLogin };