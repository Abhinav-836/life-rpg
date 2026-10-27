const crypto = require('crypto');
const prisma = require('../config/database');
const { hashPassword, comparePassword } = require('../utils/password');
const { signToken } = require('../utils/jwt');

const SAFE_USER_INCLUDE = { character: true, streak: true };
const GUEST_RETENTION_DAYS = 7;

function httpError(message, status) {
  const err = new Error(message);
  err.status = status;
  return err;
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function toSession(user) {
  const { passwordHash: _omit, ...safeUser } = user;
  return { user: safeUser, token: signToken({ id: user.id, email: user.email }) };
}

// Case-insensitive so "Abhinav@Mail.com" and "abhinav@mail.com" are the
// same account (older accounts may have been stored with capitals).
function findUserByEmail(email) {
  return prisma.user.findFirst({
    where: { email: { equals: normalizeEmail(email), mode: 'insensitive' } },
    include: SAFE_USER_INCLUDE,
  });
}

async function signup({ name, email, password }) {
  if (await findUserByEmail(email)) {
    throw httpError('An account with that email already exists', 409);
  }

  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email: normalizeEmail(email),
      passwordHash: await hashPassword(password),
      character: { create: {} },
      streak: { create: {} },
    },
    include: SAFE_USER_INCLUDE,
  });

  return toSession(user);
}

async function login({ email, password }) {
  const user = await findUserByEmail(email);
  // Same message for "no such user" and "wrong password" so the login form
  // can't be used to find out which emails have accounts.
  if (!user || user.isGuest || !(await comparePassword(password, user.passwordHash))) {
    throw httpError('Invalid email or password', 401);
  }
  return toSession(user);
}

// A few starter quests so a demo visitor lands on a dashboard with
// something to do instead of an empty screen.
function starterQuests() {
  const today = new Date();
  const inDays = (n) => new Date(today.getTime() + n * 86400000);
  return [
    { title: 'Drink a glass of water', category: 'wellness', difficulty: 'easy', xpReward: 20, goldReward: 5, dueDate: today },
    { title: 'Read 10 pages of a book', category: 'study', difficulty: 'normal', xpReward: 30, goldReward: 8, dueDate: today },
    { title: '20-minute workout', category: 'fitness', difficulty: 'normal', xpReward: 30, goldReward: 8, dueDate: inDays(1) },
    { title: 'Ship one small feature', category: 'coding', difficulty: 'hard', xpReward: 50, goldReward: 13, dueDate: inDays(2) },
  ];
}

// "Try the demo": every visitor gets their own private demo account.
//
// A single shared demo account meant every visitor saw (and could edit or
// complete) every other visitor's quests, and anyone could rename it.
// Demo accounts can't log in with a password and are deleted after
// GUEST_RETENTION_DAYS.
async function guestLogin() {
  removeExpiredGuests().catch((err) => console.error('Guest cleanup failed:', err));

  const id = crypto.randomUUID();
  const user = await prisma.user.create({
    data: {
      name: 'Adventurer',
      email: `guest-${id}@guest.liferpg.local`,
      passwordHash: await hashPassword(crypto.randomBytes(32).toString('hex')),
      isGuest: true,
      character: { create: {} },
      streak: { create: {} },
      tasks: { create: starterQuests() },
    },
    include: SAFE_USER_INCLUDE,
  });

  return toSession(user);
}

async function removeExpiredGuests() {
  const cutoff = new Date(Date.now() - GUEST_RETENTION_DAYS * 86400000);
  const { count } = await prisma.user.deleteMany({
    where: { isGuest: true, createdAt: { lt: cutoff } },
  });
  if (count > 0) console.log(`Removed ${count} expired demo account(s)`);
}

module.exports = { signup, login, guestLogin, removeExpiredGuests, normalizeEmail };