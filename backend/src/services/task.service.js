const prisma = require('../config/database');
const { applyXpToCharacter, applyXpToAttribute } = require('./xp.service');
const { recordActivity } = require('./streak.service');
const { checkAndAwardBadges } = require('./badge.service');

function listTasks(userId, filters = {}) {
  return prisma.task.findMany({
    where: { userId, ...(filters.isCompleted !== undefined ? { isCompleted: filters.isCompleted } : {}) },
    orderBy: { createdAt: 'desc' },
  });
}

// FIX: this used to always compute xpReward/goldReward from `difficulty`
// and ignore any xp/gold values the client sent - but the frontend's
// quest form lets the user set a custom XP/Gold reward per quest. That's
// safe to allow here (unlike task COMPLETION, where the reward amount
// must never come from the client): the user is only setting the value
// of their OWN quest before it exists, and the value is locked in at
// creation time - completing it later can't be used to claim more than
// what was set here. So: honor a client-provided xp/gold if present,
// otherwise fall back to the difficulty-based default as before.
function createTask(userId, data) {
  const difficultyMultiplier = { easy: 1, normal: 1.5, hard: 2.5 };
  const mult = difficultyMultiplier[data.difficulty] || 1.5;

  const xpReward = Number.isFinite(Number(data.xp)) && data.xp !== undefined
    ? Math.max(1, Math.round(Number(data.xp)))
    : Math.round(20 * mult);
  const goldReward = Number.isFinite(Number(data.gold)) && data.gold !== undefined
    ? Math.max(0, Math.round(Number(data.gold)))
    : Math.round(5 * mult);

  return prisma.task.create({
    data: {
      userId,
      title: data.title,
      description: data.description || null,
      category: data.category,
      difficulty: data.difficulty || 'normal',
      xpReward,
      goldReward,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
    },
  });
}

// Ownership check lives HERE: findFirst scoped to userId means a user
// can never fetch, complete, or delete someone else's task by guessing an id.
async function getOwnedTaskOrThrow(userId, taskId) {
  const task = await prisma.task.findFirst({ where: { id: taskId, userId } });
  if (!task) {
    const err = new Error('Task not found');
    err.status = 404;
    throw err;
  }
  return task;
}

async function updateTask(userId, taskId, data) {
  await getOwnedTaskOrThrow(userId, taskId);
  return prisma.task.update({
    where: { id: taskId },
    data: {
      title: data.title,
      description: data.description,
      category: data.category,
      difficulty: data.difficulty,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    },
  });
}

async function deleteTask(userId, taskId) {
  await getOwnedTaskOrThrow(userId, taskId);
  return prisma.task.delete({ where: { id: taskId } });
}

// The core "game loop" moment: task completion fans out into
// XP + gold + attribute XP + streak + badge checks, all server-side.
// The reward amount used here is ALWAYS task.xpReward/task.goldReward -
// the values locked in at creation - never anything the client sends
// on this call. That's what keeps completion itself un-cheatable even
// though creation now allows custom reward values.
async function completeTask(userId, taskId) {
  const task = await getOwnedTaskOrThrow(userId, taskId);

  if (task.isCompleted) {
    const err = new Error('Task is already completed');
    err.status = 400;
    throw err;
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: { isCompleted: true, completedAt: new Date() },
  });

  const character = await prisma.character.findUnique({ where: { userId } });

  const [xpResult] = await Promise.all([
    applyXpToCharacter(character.id, task.xpReward, task.goldReward),
    applyXpToAttribute(character.id, task.category, task.xpReward),
  ]);

  const streak = await recordActivity(userId);
  const newBadges = await checkAndAwardBadges(userId);

  return {
    task: updatedTask,
    character: xpResult.character,
    leveledUp: xpResult.leveledUp,
    xpToNextLevel: xpResult.xpToNextLevel,
    streak,
    newBadges,
  };
}

module.exports = { listTasks, createTask, updateTask, deleteTask, completeTask, getOwnedTaskOrThrow };
