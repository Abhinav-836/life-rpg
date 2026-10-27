import { request, getToken } from './api.js';
import { PRIORITY_TO_DIFFICULTY, DIFFICULTY_TO_PRIORITY } from '../config/constants.js';
import { toLocalDateKey } from '../utils/dates.js';

// Backend <-> frontend field mapping in one place:
//   xpReward/goldReward  -> xp/gold        (renamed)
//   difficulty           -> priority        (see constants.js for the map)
//   isCompleted          -> status          ('pending' | 'completed')
//   dueDate              -> dueDate         (pass-through)
function toQuest(task) {
  return {
    id: task.id,
    title: task.title,
    category: task.category,
    priority: DIFFICULTY_TO_PRIORITY[task.difficulty] || 'medium',
    xp: task.xpReward,
    gold: task.goldReward,
    dueDate: task.dueDate ? task.dueDate.slice(0, 10) : toLocalDateKey(task.createdAt),
    status: task.isCompleted ? 'completed' : 'pending',
    createdAt: task.createdAt,
    completedAt: task.completedAt,
  };
}

export async function listQuests() {
  const tasks = await request('/tasks', { token: getToken() });
  return tasks.map(toQuest).sort((a, b) => (a.dueDate < b.dueDate ? -1 : 1));
}

export async function createQuest(data) {
  if (!data.title?.trim()) throw new Error('Every quest needs a title.');
  const task = await request('/tasks', {
    method: 'POST',
    token: getToken(),
    body: {
      title: data.title.trim(),
      category: data.category,
      difficulty: PRIORITY_TO_DIFFICULTY[data.priority] || 'normal',
      xp: data.xp,
      gold: data.gold,
      dueDate: data.dueDate,
    },
  });
  return toQuest(task);
}

export async function updateQuest(id, data) {
  const task = await request(`/tasks/${id}`, {
    method: 'PATCH',
    token: getToken(),
    body: {
      title: data.title,
      category: data.category,
      difficulty: data.priority ? PRIORITY_TO_DIFFICULTY[data.priority] : undefined,
      dueDate: data.dueDate,
      xp: data.xp,
      gold: data.gold,
    },
  });
  return toQuest(task);
}

export async function deleteQuest(id) {
  await request(`/tasks/${id}`, { method: 'DELETE', token: getToken() });
  return { ok: true };
}

// The API returns a flat completion result; the Quests page reads it as
// { quest, progression, streak }.
export async function completeQuest(id) {
  const result = await request(`/tasks/${id}/complete`, { method: 'POST', token: getToken() });
  return {
    quest: toQuest(result.task),
    progression: {
      leveledUp: result.leveledUp,
      newLevel: result.character.level,
      xpIntoLevel: result.character.xp,
      xpForNext: result.xpToNextLevel,
    },
    streak: result.streak,
    newBadges: result.newBadges,
  };
}