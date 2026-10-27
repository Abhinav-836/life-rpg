const { calendarDaysBetween } = require('../utils/time');

// Records "the user was active today" inside the quest-completion
// transaction. Days are counted in the user's own timezone.
async function recordActivity(tx, userId, timeZone, now = new Date()) {
  const streak = await tx.streak.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });

  if (!streak.lastCompletedDate) {
    return tx.streak.update({
      where: { userId },
      data: { currentStreak: 1, longestStreak: Math.max(1, streak.longestStreak), lastCompletedDate: now },
    });
  }

  const gap = calendarDaysBetween(streak.lastCompletedDate, now, timeZone);

  if (gap <= 0) {
    // Already active today: keep the streak, just remember the latest time.
    return tx.streak.update({ where: { userId }, data: { lastCompletedDate: now } });
  }

  const currentStreak = gap === 1 ? streak.currentStreak + 1 : 1;
  return tx.streak.update({
    where: { userId },
    data: {
      currentStreak,
      longestStreak: Math.max(currentStreak, streak.longestStreak),
      lastCompletedDate: now,
    },
  });
}

// The stored currentStreak only changes when a quest is completed, so a
// player who stopped three days ago would still see their old streak.
// This returns what the streak really is right now.
function effectiveStreak(streak, timeZone, now = new Date()) {
  if (!streak) return { currentStreak: 0, longestStreak: 0, lastCompletedDate: null, activeToday: false };
  if (!streak.lastCompletedDate) return { ...streak, currentStreak: 0, activeToday: false };

  const gap = calendarDaysBetween(streak.lastCompletedDate, now, timeZone);
  return {
    ...streak,
    currentStreak: gap > 1 ? 0 : streak.currentStreak,
    activeToday: gap <= 0,
  };
}

module.exports = { recordActivity, effectiveStreak };