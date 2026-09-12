import { request, getToken } from './api.js';

// FIX: the backend only tells you WHICH badges exist (GET /badges) and
// WHICH ones you own (GET /badges/mine) - it doesn't compute progress
// toward locked ones. BadgeCard/BadgeDetails need `earned`, `progress`,
// and `target` per badge to draw the in-progress bar. We compute that
// here from the same stats the backend's own badge.service.js checks
// against (tasks completed, longest streak, character level).
export async function listBadges() {
  const token = getToken();
  const [allBadges, owned, tasks, streak, character] = await Promise.all([
    request('/badges', { token }),
    request('/badges/mine', { token }),
    request('/tasks?completed=true', { token }),
    request('/streak/me', { token }),
    request('/character/me', { token }),
  ]);

  const ownedMap = new Map(owned.map((o) => [o.badgeId, o.earnedAt]));
  const currentValueByType = {
    tasks_completed: tasks.length,
    streak_days: streak.longestStreak,
    level_reached: character.level,
  };

  return allBadges.map((badge) => ({
    id: badge.id,
    name: badge.name,
    description: badge.description,
    rarity: 'rare', // backend has no rarity field yet - a reasonable default until it does
    earned: ownedMap.has(badge.id),
    earnedAt: ownedMap.get(badge.id) || null,
    progress: Math.min(currentValueByType[badge.criteriaType] ?? 0, badge.criteriaValue),
    target: badge.criteriaValue,
  }));
}
