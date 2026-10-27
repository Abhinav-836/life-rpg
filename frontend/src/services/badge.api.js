import { request, getToken } from './api.js';

// The API returns which badges exist and which you own. Progress toward
// locked badges is worked out here from the same stats the server checks
// (quests completed, longest streak, character level).
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