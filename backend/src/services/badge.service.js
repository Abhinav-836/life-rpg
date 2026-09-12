const prisma = require('../config/database');

// Simple, no-cron-job badge system: whenever the user's stats change,
// call checkAndAwardBadges and it evaluates every badge definition
// against current stats, awarding any newly-earned ones.
async function checkAndAwardBadges(userId) {
  const [badges, alreadyOwned, tasksCompleted, streak, character] = await Promise.all([
    prisma.badge.findMany(),
    prisma.userBadge.findMany({ where: { userId }, select: { badgeId: true } }),
    prisma.task.count({ where: { userId, isCompleted: true } }),
    prisma.streak.findUnique({ where: { userId } }),
    prisma.character.findUnique({ where: { userId } }),
  ]);

  const ownedIds = new Set(alreadyOwned.map((b) => b.badgeId));
  const newlyEarned = [];

  for (const badge of badges) {
    if (ownedIds.has(badge.id)) continue;

    let qualifies = false;
    if (badge.criteriaType === 'tasks_completed') {
      qualifies = tasksCompleted >= badge.criteriaValue;
    } else if (badge.criteriaType === 'streak_days') {
      qualifies = (streak?.longestStreak ?? 0) >= badge.criteriaValue;
    } else if (badge.criteriaType === 'level_reached') {
      qualifies = (character?.level ?? 1) >= badge.criteriaValue;
    }

    if (qualifies) newlyEarned.push(badge.id);
  }

  if (newlyEarned.length > 0) {
    await prisma.userBadge.createMany({
      data: newlyEarned.map((badgeId) => ({ userId, badgeId })),
      skipDuplicates: true,
    });
  }

  return newlyEarned;
}

module.exports = { checkAndAwardBadges };
