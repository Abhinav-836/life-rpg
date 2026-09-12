import { request, getToken } from './api.js';
import { PRIORITY_TO_DIFFICULTY, DIFFICULTY_TO_PRIORITY } from '../config/constants.js';

// Backend <-> frontend field mapping in one place:
//   xpReward/goldReward  -> xp/gold        (renamed)
//   difficulty           -> priority        (see constants.js for the map)
//   isCompleted          -> status          ('pending' | 'completed')
//   dueDate              -> dueDate         (pass-through, now that the
//                                             backend has this column)
function toQuest(task) {
  return {
    id: task.id,
    title: task.title,
    category: task.category,
    priority: DIFFICULTY_TO_PRIORITY[task.difficulty] || 'medium',
    xp: task.xpReward,
    gold: task.goldReward,
    dueDate: task.dueDate ? task.dueDate.slice(0, 10) : task.createdAt.slice(0, 10),
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
    },
  });
  return toQuest(task);
}

export async function deleteQuest(id) {
  await request(`/tasks/${id}`, { method: 'DELETE', token: getToken() });
  return { ok: true };
}

// FIX: the backend's completion response is FLAT
// ({ task, character, leveledUp, xpToNextLevel, streak, newBadges }) -
// this reshapes it into the { quest, progression, streak } shape
// Quests.jsx's handleComplete() actually reads
// (`result.progression?.leveledUp`, `result.progression.newLevel`).
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
