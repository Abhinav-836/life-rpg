const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateUpdateProfile(body) {
  const errors = [];
  if (body.name !== undefined && !body.name.trim()) errors.push('name cannot be empty');
  if (body.email !== undefined && !EMAIL_RE.test(body.email)) errors.push('a valid email is required');
  return errors;
}

function validateChangePassword(body) {
  const errors = [];
  if (!body.currentPassword) errors.push('currentPassword is required');
  if (!body.newPassword || body.newPassword.length < 6) errors.push('newPassword must be at least 6 characters');
  return errors;
}

module.exports = { validateUpdateProfile, validateChangePassword };
