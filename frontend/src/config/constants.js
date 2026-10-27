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

// The UI calls it "priority"; the API calls it "difficulty". They map
// one-to-one.
export const PRIORITY_TO_DIFFICULTY = { low: 'easy', medium: 'normal', high: 'hard' };
export const DIFFICULTY_TO_PRIORITY = { easy: 'low', normal: 'medium', hard: 'high' };

// Allowed XP/gold per quest difficulty. Must match
// backend/src/config/game.js, which enforces the same limits.
export const REWARD_LIMITS = {
  easy:   { xp: { min: 5,  max: 50 },  gold: { min: 0, max: 15 }, defaultXp: 20, defaultGold: 5 },
  normal: { xp: { min: 10, max: 100 }, gold: { min: 0, max: 30 }, defaultXp: 30, defaultGold: 8 },
  hard:   { xp: { min: 20, max: 200 }, gold: { min: 0, max: 60 }, defaultXp: 50, defaultGold: 13 },
};

export const ATTRIBUTES = [
  { id: 'strength', label: 'Strength', color: '#F87171' },
  { id: 'intellect', label: 'Intellect', color: '#6366F1' },
  { id: 'health', label: 'Health', color: '#4ADE80' },
  { id: 'discipline', label: 'Discipline', color: '#F4C95D' },
];

export const BADGE_RARITY = ['common', 'rare', 'epic', 'legendary'];

// Same curve as the API (backend/src/services/xp.service.js), so level
// previews here always match what the server does.
export function xpForLevel(level) {
  return Math.floor(100 * Math.pow(level, 1.5));
}