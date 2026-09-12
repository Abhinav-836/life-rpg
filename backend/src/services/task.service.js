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

function createTask(userId, data) {
  const difficultyMultiplier = { easy: 1, normal: 1.5, hard: 2.5 };
  const mult = difficultyMultiplier[data.difficulty] || 1.5;

  return prisma.task.create({
    data: {
      userId,
      title: data.title,
      description: data.description || null,
      category: data.category,
      difficulty: data.difficulty || 'normal',
      xpReward: Math.round(20 * mult),
      goldReward: Math.round(5 * mult),
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
    },
  });
}

async function deleteTask(userId, taskId) {
  await getOwnedTaskOrThrow(userId, taskId);
  return prisma.task.delete({ where: { id: taskId } });
}

// The core "game loop" moment: task completion fans out into
// XP + gold + attribute XP + streak + badge checks, all server-side.
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
