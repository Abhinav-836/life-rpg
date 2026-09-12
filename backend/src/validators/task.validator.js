const VALID_DIFFICULTIES = ['easy', 'normal', 'hard'];

function validateCreateTask(body) {
  const errors = [];
  if (!body.title || body.title.trim().length === 0) {
    errors.push('title is required');
  }
  if (!body.category || body.category.trim().length === 0) {
    errors.push('category is required (e.g. Coding, Fitness, Reading)');
  }
  if (body.difficulty && !VALID_DIFFICULTIES.includes(body.difficulty)) {
    errors.push(`difficulty must be one of: ${VALID_DIFFICULTIES.join(', ')}`);
  }
  return errors;
}

module.exports = { validateCreateTask };
