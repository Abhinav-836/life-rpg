// Game rules shared by validators and services. Keep in sync with
// frontend/src/config/constants.js (QUEST_CATEGORIES, REWARD_LIMITS).

const QUEST_CATEGORIES = ['coding', 'fitness', 'wellness', 'study', 'chores', 'creative'];

const DIFFICULTIES = ['easy', 'normal', 'hard'];

// Players may set a custom reward for their own quest, but only inside
// the range for its difficulty. Without a ceiling, one quest worth
// 999,999,999 XP would max out a character and buy the whole shop.
const REWARD_LIMITS = {
  easy:   { xp: { min: 5,  max: 50 },  gold: { min: 0, max: 15 }, defaultXp: 20, defaultGold: 5 },
  normal: { xp: { min: 10, max: 100 }, gold: { min: 0, max: 30 }, defaultXp: 30, defaultGold: 8 },
  hard:   { xp: { min: 20, max: 200 }, gold: { min: 0, max: 60 }, defaultXp: 50, defaultGold: 13 },
};

const TEXT_LIMITS = {
  title: 120,
  description: 1000,
  name: 50,
};

module.exports = { QUEST_CATEGORIES, DIFFICULTIES, REWARD_LIMITS, TEXT_LIMITS };