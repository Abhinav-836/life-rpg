export const QUEST_CATEGORIES = [
  { id: 'coding', label: 'Coding', attribute: 'intellect', color: '#6366F1' },
  { id: 'fitness', label: 'Fitness', attribute: 'strength', color: '#F87171' },
  { id: 'wellness', label: 'Wellness', attribute: 'health', color: '#4ADE80' },
  { id: 'study', label: 'Study', attribute: 'intellect', color: '#8B5CF6' },
  { id: 'chores', label: 'Chores', attribute: 'discipline', color: '#F4C95D' },
  { id: 'creative', label: 'Creative', attribute: 'intellect', color: '#F4C95D' },
];

export const QUEST_PRIORITIES = [
  { id: 'low', label: 'Low', weight: 1 },
  { id: 'medium', label: 'Medium', weight: 2 },
  { id: 'high', label: 'High', weight: 3 },
];

// Priority (this frontend's concept) maps onto difficulty (the backend's
// concept) - the backend has no separate priority column, so we store/
// read priority through the difficulty field one-to-one.
export const PRIORITY_TO_DIFFICULTY = { low: 'easy', medium: 'normal', high: 'hard' };
export const DIFFICULTY_TO_PRIORITY = { easy: 'low', normal: 'medium', hard: 'high' };

export const ATTRIBUTES = [
  { id: 'strength', label: 'Strength', color: '#F87171' },
  { id: 'intellect', label: 'Intellect', color: '#6366F1' },
  { id: 'health', label: 'Health', color: '#4ADE80' },
  { id: 'discipline', label: 'Discipline', color: '#F4C95D' },
];

export const BADGE_RARITY = ['common', 'rare', 'epic', 'legendary'];

// FIX: this used to be `Math.round(80 * Math.pow(level, 1.35) + 40)` - a
// DIFFERENT curve than the real backend uses (src/services/xp.service.js
// on the backend: `Math.floor(100 * Math.pow(level, 1.5))`). That mismatch
// meant this "preview" would show XP requirements that don't match what
// actually happens server-side when a character levels up. Now identical
// to the backend so the two can never drift apart.
export function xpForLevel(level) {
  return Math.floor(100 * Math.pow(level, 1.5));
}
