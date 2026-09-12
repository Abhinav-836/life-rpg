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

  // Create the user together with a fresh Character and Streak row so the
  // frontend can immediately load a dashboard with real (zeroed) data -
  // no "character not found" edge case right after signup.
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

module.exports = { signup, login };
