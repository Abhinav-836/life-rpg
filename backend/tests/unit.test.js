// Fast tests with no database: game math, validation and date helpers.
// Run: npm test
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-test-secret-test-secret';

const test = require('node:test');
const assert = require('node:assert/strict');

const { addXp, xpRequiredForLevel } = require('../src/services/xp.service');
const { validateCreateTask, validateUpdateTask } = require('../src/validators/task.validator');
const { validateSignup } = require('../src/validators/auth.validator');
const { validateSettingsPatch, mergeSettings } = require('../src/services/settings.service');
const { localDateKey, calendarDaysBetween, isValidTimeZone } = require('../src/utils/time');
const { effectiveStreak } = require('../src/services/streak.service');

test('level curve grows and carries XP over multiple levels', () => {
  assert.equal(xpRequiredForLevel(1), 100);
  assert.equal(xpRequiredForLevel(2), 282);
  assert.deepEqual(addXp(1, 0, 50), { level: 1, xp: 50, leveledUp: false });
  assert.deepEqual(addXp(1, 90, 10), { level: 2, xp: 0, leveledUp: true });
  // 100 (L1) + 282 (L2) = 382 -> level 3 with 18 left over
  assert.deepEqual(addXp(1, 0, 400), { level: 3, xp: 18, leveledUp: true });
});

test('quest rewards must stay inside the difficulty range', () => {
  const base = { title: 'Run', category: 'fitness' };
  assert.deepEqual(validateCreateTask({ ...base, difficulty: 'easy', xp: 50, gold: 15 }), []);
  assert.match(validateCreateTask({ ...base, difficulty: 'easy', xp: 999999999 }).join(), /xp for an easy quest must be between 5 and 50/);
  assert.match(validateCreateTask({ ...base, difficulty: 'hard', gold: -5 }).join(), /gold for a hard quest/);
  assert.match(validateCreateTask({ ...base, xp: 'lots' }).join(), /xp must be a number/);
});

test('quest text, category and date are validated', () => {
  assert.match(validateCreateTask({ title: ' ', category: 'fitness' }).join(), /title is required/);
  assert.match(validateCreateTask({ title: 'x'.repeat(121), category: 'fitness' }).join(), /at most 120/);
  assert.match(validateCreateTask({ title: 'Run', category: 'partying' }).join(), /category must be one of/);
  assert.match(validateCreateTask({ title: 'Run', category: 'fitness', dueDate: 'soon' }).join(), /valid date/);
  assert.deepEqual(validateUpdateTask({ title: 'New name' }), []);
  assert.match(validateUpdateTask({ difficulty: 'easy', xp: 500 }).join(), /between 5 and 50/);
});

test('signup requires an 8+ character password and a sane name', () => {
  assert.deepEqual(validateSignup({ name: 'Abhinav', email: 'a@b.co', password: 'longenough' }), []);
  assert.match(validateSignup({ name: 'A', email: 'a@b.co', password: 'longenough' }).join(), /name/);
  assert.match(validateSignup({ name: 'Abhinav', email: 'a@b.co', password: 'short' }).join(), /8 characters/);
});

test('settings accept only known keys and booleans', () => {
  assert.deepEqual(validateSettingsPatch({ soundEnabled: false, notifications: { streakWarning: false } }), []);
  assert.deepEqual(validateSettingsPatch({ timezone: 'Asia/Kolkata' }), []);
  assert.match(validateSettingsPatch({ isAdmin: true }).join(), /unknown setting: isAdmin/);
  assert.match(validateSettingsPatch({ notifications: { streakWarning: 'yes' } }).join(), /must be true or false/);
  assert.match(validateSettingsPatch({ notifications: { weeklyDigest: true } }).join(), /unknown notifications setting/);
  assert.match(validateSettingsPatch({ timezone: 'Mars/Olympus' }).join(), /valid IANA timezone/);
  assert.equal(mergeSettings({ soundEnabled: false }).notifications.streakWarning, true);
});

test('calendar days follow the user timezone, not UTC', () => {
  assert.equal(isValidTimeZone('Asia/Kolkata'), true);
  assert.equal(isValidTimeZone('Nowhere/City'), false);

  // 20:00 UTC is already the next morning (01:30) in India.
  const evening = new Date('2026-10-26T20:00:00Z');
  assert.equal(localDateKey(evening, 'UTC'), '2026-10-26');
  assert.equal(localDateKey(evening, 'Asia/Kolkata'), '2026-10-27');

  // 23:00 IST and 01:00 IST the next day: UTC calls it the same day,
  // but for the player it is the next day.
  const lateNight = new Date('2026-10-26T17:30:00Z');  // 23:00 IST
  const earlyMorning = new Date('2026-10-26T19:30:00Z'); // 01:00 IST, next day
  assert.equal(calendarDaysBetween(lateNight, earlyMorning, 'UTC'), 0);
  assert.equal(calendarDaysBetween(lateNight, earlyMorning, 'Asia/Kolkata'), 1);
});

test('a streak that was not continued shows as 0, not the stale number', () => {
  const now = new Date('2026-10-26T12:00:00Z');
  const streak = { currentStreak: 9, longestStreak: 12, lastCompletedDate: new Date('2026-10-23T12:00:00Z') };
  assert.equal(effectiveStreak(streak, 'UTC', now).currentStreak, 0);
  assert.equal(effectiveStreak(streak, 'UTC', now).longestStreak, 12);

  const yesterday = { ...streak, lastCompletedDate: new Date('2026-10-25T12:00:00Z') };
  assert.equal(effectiveStreak(yesterday, 'UTC', now).currentStreak, 9);
  assert.equal(effectiveStreak(yesterday, 'UTC', now).activeToday, false);
});