const { TEXT_LIMITS } = require('../config/game');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateSignup(body) {
  const errors = [];
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  if (name.length < 2) {
    errors.push('name must be at least 2 characters');
  } else if (name.length > TEXT_LIMITS.name) {
    errors.push(`name must be at most ${TEXT_LIMITS.name} characters`);
  }
  if (typeof body.email !== 'string' || !EMAIL_RE.test(body.email.trim())) {
    errors.push('a valid email is required');
  }
  if (typeof body.password !== 'string' || body.password.length < 8) {
    errors.push('password must be at least 8 characters');
  } else if (body.password.length > 128) {
    errors.push('password must be at most 128 characters');
  }
  return errors;
}

function validateLogin(body) {
  const errors = [];
  if (typeof body.email !== 'string' || !EMAIL_RE.test(body.email.trim())) {
    errors.push('a valid email is required');
  }
  if (typeof body.password !== 'string' || !body.password) {
    errors.push('password is required');
  }
  return errors;
}

module.exports = { validateSignup, validateLogin, EMAIL_RE };