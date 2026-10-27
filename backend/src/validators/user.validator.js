const { TEXT_LIMITS } = require('../config/game');
const { EMAIL_RE } = require('./auth.validator');
const { validateSettingsPatch } = require('../services/settings.service');

function validateUpdateProfile(body) {
  const errors = [];
  if (body.name !== undefined) {
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    if (name.length < 2) errors.push('name must be at least 2 characters');
    else if (name.length > TEXT_LIMITS.name) errors.push(`name must be at most ${TEXT_LIMITS.name} characters`);
  }
  if (body.email !== undefined && (typeof body.email !== 'string' || !EMAIL_RE.test(body.email.trim()))) {
    errors.push('a valid email is required');
  }
  return errors;
}

function validateChangePassword(body) {
  const errors = [];
  if (!body.currentPassword) errors.push('currentPassword is required');
  if (typeof body.newPassword !== 'string' || body.newPassword.length < 8) {
    errors.push('newPassword must be at least 8 characters');
  } else if (body.newPassword.length > 128) {
    errors.push('newPassword must be at most 128 characters');
  }
  return errors;
}

module.exports = { validateUpdateProfile, validateChangePassword, validateSettings: validateSettingsPatch };