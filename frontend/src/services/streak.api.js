import { request, getToken } from './api.js';

// FIX: the backend only stores { currentStreak, longestStreak,
// lastCompletedDate } - it doesn't keep a day-by-day activity log, but
// StreakCalendar / ActivityHeatmap need a `history` map of
// "YYYY-MM-DD" -> boolean to render the calendar. We reconstruct that
// here from the real completed-tasks list (any day with >=1 completed
// task counts as active) rather than the backend needing a new table.
export async function getStreak() {
  const token = getToken();
  const [streak, tasks] = await Promise.all([
    request('/streak/me', { token }),
    request('/tasks?completed=true', { token }),
  ]);

  const history = {};
  for (const task of tasks) {
    if (task.completedAt) history[task.completedAt.slice(0, 10)] = true;
  }

  return {
    current: streak.currentStreak,
    longest: streak.longestStreak,
    lastActiveDate: streak.lastCompletedDate ? streak.lastCompletedDate.slice(0, 10) : null,
    history,
  };
}
