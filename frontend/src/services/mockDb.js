// In-memory mock backend. Lives for the lifetime of the tab (no localStorage,
// per the project's "no fake persistence" spirit) and is the single source
// of truth every mock service reads/writes. When the real Express/Supabase
// backend is ready, each service file's exported function signatures should
// stay the same — only the implementation inside swaps to `request()` calls.
import { xpForLevel } from '../config/constants.js';

function delay(ms = 350) {
  return new Promise((res) => setTimeout(res, ms));
}

function uid(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function todayStr(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

const db = {
  user: {
    id: 'user_1',
    name: 'Aria Voss',
    email: 'aria@example.com',
    avatarSeed: 'aria-voss',
    createdAt: '2026-06-01T00:00:00.000Z',
  },
  character: {
    level: 7,
    totalXP: 2140,
    xpIntoLevel: 260,
    gold: 845,
    attributes: { strength: 34, intellect: 58, health: 41, discipline: 47 },
    title: 'Apprentice of the Long Road',
  },
  streak: {
    current: 6,
    longest: 19,
    lastActiveDate: todayStr(-1),
    history: Object.fromEntries(
      Array.from({ length: 35 }).map((_, i) => [todayStr(-34 + i), Math.random() > 0.28])
    ),
  },
  quests: [
    { id: uid('q'), title: 'Ship the auth screen', category: 'coding', priority: 'high', xp: 60, gold: 18, dueDate: todayStr(1), status: 'pending', createdAt: todayStr(-2) },
    { id: uid('q'), title: 'Morning run — 5k', category: 'fitness', priority: 'medium', xp: 35, gold: 10, dueDate: todayStr(0), status: 'pending', createdAt: todayStr(-1) },
    { id: uid('q'), title: 'Read 20 pages', category: 'study', priority: 'low', xp: 20, gold: 5, dueDate: todayStr(0), status: 'pending', createdAt: todayStr(-3) },
    { id: uid('q'), title: 'Meal prep for the week', category: 'chores', priority: 'medium', xp: 30, gold: 12, dueDate: todayStr(2), status: 'pending', createdAt: todayStr(-1) },
    { id: uid('q'), title: 'Meditate 10 minutes', category: 'wellness', priority: 'low', xp: 15, gold: 4, dueDate: todayStr(0), status: 'completed', createdAt: todayStr(-4), completedAt: todayStr(-1) },
    { id: uid('q'), title: 'Refactor progression service', category: 'coding', priority: 'high', xp: 55, gold: 20, dueDate: todayStr(-1), status: 'completed', createdAt: todayStr(-5), completedAt: todayStr(-2) },
  ],
  rewards: [
    { id: uid('r'), name: 'Ember Cloak', category: 'cosmetic', description: 'A cloak that flickers like dying coals.', price: 220, image: 'cloak' },
    { id: uid('r'), name: 'Dawnlight Theme', category: 'theme', description: 'Swap the interface into a warm dawn palette.', price: 150, image: 'theme' },
    { id: uid('r'), name: 'Longcoat Badge Frame', category: 'cosmetic', description: 'Ornate frame for your badge case.', price: 90, image: 'frame' },
    { id: uid('r'), name: 'Extra Quest Slot', category: 'utility', description: 'Track one more active quest at a time.', price: 300, image: 'slot' },
    { id: uid('r'), name: 'Streak Shield', category: 'utility', description: 'Protects your streak through one missed day.', price: 400, image: 'shield' },
  ],
  inventory: [],
  badges: [
    { id: uid('b'), name: 'First Steps', description: 'Complete your first quest.', rarity: 'common', earned: true, earnedAt: todayStr(-30) },
    { id: uid('b'), name: 'Week One', description: 'Reach a 7-day streak.', rarity: 'rare', earned: false, progress: 6, target: 7 },
    { id: uid('b'), name: 'Scholar', description: 'Complete 20 Study quests.', rarity: 'rare', earned: false, progress: 12, target: 20 },
    { id: uid('b'), name: 'Iron Will', description: 'Reach a 30-day streak.', rarity: 'epic', earned: false, progress: 6, target: 30 },
    { id: uid('b'), name: 'Ascendant', description: 'Reach character level 20.', rarity: 'legendary', earned: false, progress: 7, target: 20 },
  ],
  settings: {
    theme: 'dark-fantasy',
    soundEnabled: true,
    notifications: { dailyReminder: true, streakWarning: true, weeklyDigest: false },
    privacy: { publicProfile: false },
  },
};

export function applyXPAndGold({ xp, gold }) {
  const c = db.character;
  c.gold += gold;
  c.totalXP += xp;
  c.xpIntoLevel += xp;
  const leveledUpFrom = c.level;
  let needed = xpForLevel(c.level);
  const levelsGained = [];
  while (c.xpIntoLevel >= needed) {
    c.xpIntoLevel -= needed;
    c.level += 1;
    levelsGained.push(c.level);
    needed = xpForLevel(c.level);
  }
  return {
    leveledUp: c.level > leveledUpFrom,
    newLevel: c.level,
    levelsGained,
    xpIntoLevel: c.xpIntoLevel,
    xpForNext: needed,
  };
}

export function bumpAttribute(attribute, amount) {
  if (db.character.attributes[attribute] == null) db.character.attributes[attribute] = 0;
  db.character.attributes[attribute] += amount;
}

export function registerActivityToday() {
  const today = todayStr(0);
  const s = db.streak;
  if (s.lastActiveDate === today) return { changed: false, current: s.current };
  const yesterday = todayStr(-1);
  s.current = s.lastActiveDate === yesterday ? s.current + 1 : 1;
  s.longest = Math.max(s.longest, s.current);
  s.lastActiveDate = today;
  s.history[today] = true;
  return { changed: true, current: s.current };
}

export { db, delay, uid, todayStr };
