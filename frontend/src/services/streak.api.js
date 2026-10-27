import { request, getToken } from './api.js';
import { toLocalDateKey } from '../utils/dates.js';

// The calendar needs a day-by-day "was the player active?" map. It's
// built from the completed quests, using the player's LOCAL date for each
// completion so a quest finished at 1 AM shows on the right day.
export async function getStreak() {
  const token = getToken();
  const [streak, tasks] = await Promise.all([
    request('/streak/me', { token }),
    request('/tasks?completed=true', { token }),
  ]);

  const history = {};
  for (const task of tasks) {
    if (task.completedAt) history[toLocalDateKey(task.completedAt)] = true;
  }

  return {
    current: streak.currentStreak,
    longest: streak.longestStreak,
    activeToday: Boolean(streak.activeToday),
    lastActiveDate: streak.lastCompletedDate ? toLocalDateKey(streak.lastCompletedDate) : null,
    history,
  };
}