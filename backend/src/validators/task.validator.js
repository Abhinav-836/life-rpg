const { QUEST_CATEGORIES, DIFFICULTIES, REWARD_LIMITS, TEXT_LIMITS } = require('../config/game');

const isBlank = (v) => v === undefined || v === null || v === '';

function checkText(errors, body, field, { required = false, max }) {
  const value = body[field];
  if (isBlank(value)) {
    if (required) errors.push(`${field} is required`);
    return;
  }
  if (typeof value !== 'string') {
    errors.push(`${field} must be text`);
  } else if (required && value.trim().length === 0) {
    errors.push(`${field} is required`);
  } else if (value.trim().length > max) {
    errors.push(`${field} must be at most ${max} characters`);
  }
}

function checkDate(errors, body) {
  if (isBlank(body.dueDate)) return;
  if (Number.isNaN(new Date(body.dueDate).getTime())) errors.push('dueDate must be a valid date');
}

function checkRewards(errors, body, difficulty) {
  const limits = REWARD_LIMITS[difficulty] || REWARD_LIMITS.normal;
  for (const field of ['xp', 'gold']) {
    if (isBlank(body[field])) continue;
    const n = Number(body[field]);
    const { min, max } = limits[field];
    if (!Number.isFinite(n)) {
      errors.push(`${field} must be a number`);
    } else if (n < min || n > max) {
      errors.push(`${field} for ${difficulty === 'easy' ? 'an' : 'a'} ${difficulty} quest must be between ${min} and ${max}`);
    }
  }
}

function validateCreateTask(body) {
  const errors = [];
  checkText(errors, body, 'title', { required: true, max: TEXT_LIMITS.title });
  checkText(errors, body, 'description', { max: TEXT_LIMITS.description });

  if (isBlank(body.category)) {
    errors.push(`category is required (one of: ${QUEST_CATEGORIES.join(', ')})`);
  } else if (!QUEST_CATEGORIES.includes(body.category)) {
    errors.push(`category must be one of: ${QUEST_CATEGORIES.join(', ')}`);
  }

  const difficulty = body.difficulty || 'normal';
  if (!DIFFICULTIES.includes(difficulty)) {
    errors.push(`difficulty must be one of: ${DIFFICULTIES.join(', ')}`);
  } else {
    checkRewards(errors, body, difficulty);
  }

  checkDate(errors, body);
  return errors;
}

// Every field is optional on update; whatever is sent must be valid.
// Reward ranges are re-checked by the service against the quest's
// current difficulty when only xp/gold are sent.
function validateUpdateTask(body) {
  const errors = [];
  if (body.title !== undefined) checkText(errors, body, 'title', { required: true, max: TEXT_LIMITS.title });
  checkText(errors, body, 'description', { max: TEXT_LIMITS.description });

  if (body.category !== undefined && !QUEST_CATEGORIES.includes(body.category)) {
    errors.push(`category must be one of: ${QUEST_CATEGORIES.join(', ')}`);
  }
  if (body.difficulty !== undefined && !DIFFICULTIES.includes(body.difficulty)) {
    errors.push(`difficulty must be one of: ${DIFFICULTIES.join(', ')}`);
  } else if (body.difficulty !== undefined) {
    checkRewards(errors, body, body.difficulty);
  }

  checkDate(errors, body);
  return errors;
}

module.exports = { validateCreateTask, validateUpdateTask };