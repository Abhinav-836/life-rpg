const prisma = require('../config/database');
const { REWARD_LIMITS } = require('../config/game');
const { lockCharacter, applyXpToCharacter, applyXpToAttribute } = require('./xp.service');
const { recordActivity } = require('./streak.service');
const { checkAndAwardBadges } = require('./badge.service');
const { isValidTimeZone } = require('../utils/time');
const { TX_OPTIONS } = require('../config/transaction');

function httpError(message, status) {
  const err = new Error(message);
  err.status = status;
  return err;
}

function listTasks(userId, filters = {}) {
  return prisma.task.findMany({
    where: { userId, ...(filters.isCompleted !== undefined ? { isCompleted: filters.isCompleted } : {}) },
    orderBy: { createdAt: 'desc' },
  });
}

// Players can set their own XP/gold for a quest, within the range for its
// difficulty (src/config/game.js). The validator rejects out-of-range
// values with a clear message; the clamp here is a second line of defence
// so nothing outside the range can ever reach the database.
function resolveRewards(difficulty, xp, gold) {
  const limits = REWARD_LIMITS[difficulty] || REWARD_LIMITS.normal;
  const clamp = (value, { min, max }) => Math.min(max, Math.max(min, Math.round(value)));

  const xpReward = xp === undefined || xp === null || xp === ''
    ? limits.defaultXp
    : clamp(Number(xp), limits.xp);
  const goldReward = gold === undefined || gold === null || gold === ''
    ? limits.defaultGold
    : clamp(Number(gold), limits.gold);

  return { xpReward, goldReward };
}

function createTask(userId, data) {
  const difficulty = data.difficulty || 'normal';
  const { xpReward, goldReward } = resolveRewards(difficulty, data.xp, data.gold);

  return prisma.task.create({
    data: {
      userId,
      title: data.title.trim(),
      description: data.description?.trim() || null,
      category: data.category,
      difficulty,
      xpReward,
      goldReward,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
    },
  });
}

// Ownership check: findFirst scoped to userId means a user can never
// fetch, edit, complete or delete someone else's quest by guessing an id.
async function getOwnedTaskOrThrow(userId, taskId) {
  const task = await prisma.task.findFirst({ where: { id: taskId, userId } });
  if (!task) throw httpError('Quest not found', 404);
  return task;
}

async function updateTask(userId, taskId, data) {
  const task = await getOwnedTaskOrThrow(userId, taskId);
  if (task.isCompleted) throw httpError('Completed quests can no longer be edited', 400);

  const update = {};
  if (data.title !== undefined) update.title = data.title.trim();
  if (data.description !== undefined) update.description = data.description?.trim() || null;
  if (data.category !== undefined) update.category = data.category;
  if (data.dueDate !== undefined) update.dueDate = data.dueDate ? new Date(data.dueDate) : null;

  // Changing difficulty or reward re-checks the reward against the new range.
  if (data.difficulty !== undefined || data.xp !== undefined || data.gold !== undefined) {
    const difficulty = data.difficulty ?? task.difficulty;
    const rewards = resolveRewards(
      difficulty,
      data.xp !== undefined ? data.xp : task.xpReward,
      data.gold !== undefined ? data.gold : task.goldReward,
    );
    update.difficulty = difficulty;
    update.xpReward = rewards.xpReward;
    update.goldReward = rewards.goldReward;
  }

  return prisma.task.update({ where: { id: taskId }, data: update });
}

async function deleteTask(userId, taskId) {
  await getOwnedTaskOrThrow(userId, taskId);
  return prisma.task.delete({ where: { id: taskId } });
}

// The core game-loop moment: completing a quest pays out XP, gold,
// attribute XP and streak progress, all server-side, all in ONE
// transaction.
//
// "Mark complete" is a conditional update (only matches while the quest
// is still open). If two requests arrive together - a double click, two
// tabs - Postgres lets exactly one of them flip the flag; the other
// matches zero rows and is rejected before any reward is paid. The
// payout uses the reward stored on the quest, never anything the client
// sends with this request.
async function completeTask(userId, taskId, { timeZone } = {}) {
  const now = new Date();

  const result = await prisma.$transaction(async (tx) => {
    const claimed = await tx.task.updateMany({
      where: { id: taskId, userId, isCompleted: false },
      data: { isCompleted: true, completedAt: now },
    });

    if (claimed.count === 0) {
      const existing = await tx.task.findFirst({ where: { id: taskId, userId }, select: { id: true } });
      throw existing ? httpError('Quest is already completed', 409) : httpError('Quest not found', 404);
    }

    const task = await tx.task.findUnique({ where: { id: taskId } });
    const character = await lockCharacter(tx, userId);

    const user = await tx.user.findUnique({ where: { id: userId }, select: { timezone: true } });
    let tz = user?.timezone || 'UTC';
    if (isValidTimeZone(timeZone) && timeZone !== tz) {
      tz = timeZone;
      await tx.user.update({ where: { id: userId }, data: { timezone: tz } });
    }

    const xpResult = await applyXpToCharacter(tx, character, task.xpReward, task.goldReward);
    await applyXpToAttribute(tx, character.id, task.category, task.xpReward);
    const streak = await recordActivity(tx, userId, tz, now);

    return { task, xpResult, streak };
  }, TX_OPTIONS);

  // Badges are checked after the payout commits. createMany with
  // skipDuplicates makes this safe even if two checks overlap.
  const newBadges = await checkAndAwardBadges(userId);

  return {
    task: result.task,
    character: result.xpResult.character,
    leveledUp: result.xpResult.leveledUp,
    previousLevel: result.xpResult.previousLevel,
    xpToNextLevel: result.xpResult.xpToNextLevel,
    streak: result.streak,
    newBadges,
  };
}

module.exports = {
  listTasks,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
  getOwnedTaskOrThrow,
  resolveRewards,
};