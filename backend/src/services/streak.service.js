const prisma = require('../config/database');

function startOfUTCDay(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function daysBetween(a, b) {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  return Math.round((startOfUTCDay(b) - startOfUTCDay(a)) / MS_PER_DAY);
}

// Call this once per "activity" (e.g. completing at least one task today).
// Uses UTC dates throughout to avoid timezone drift between server and user.
async function recordActivity(userId) {
  const streak = await prisma.streak.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });

  const today = new Date();

  if (!streak.lastCompletedDate) {
    return prisma.streak.update({
      where: { userId },
      data: { currentStreak: 1, longestStreak: 1, lastCompletedDate: today },
    });
  }

  const gap = daysBetween(streak.lastCompletedDate, today);

  if (gap === 0) {
    // Already logged activity today - no change, just avoids double counting.
    return streak;
  }

  if (gap === 1) {
    const currentStreak = streak.currentStreak + 1;
    return prisma.streak.update({
      where: { userId },
      data: {
        currentStreak,
        longestStreak: Math.max(currentStreak, streak.longestStreak),
        lastCompletedDate: today,
      },
    });
  }

  // gap > 1 means at least one day was missed - streak resets to 1.
  return prisma.streak.update({
    where: { userId },
    data: { currentStreak: 1, lastCompletedDate: today },
  });
}

module.exports = { recordActivity };
