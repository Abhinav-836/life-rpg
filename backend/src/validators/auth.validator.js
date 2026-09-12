const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateSignup(body) {
  const errors = [];
  if (!body.name || body.name.trim().length < 2) {
    errors.push('name must be at least 2 characters');
  }
  if (!body.email || !EMAIL_RE.test(body.email)) {
    errors.push('a valid email is required');
  }
  if (!body.password || body.password.length < 6) {
    errors.push('password must be at least 6 characters');
  }
  return errors;
}

function validateLogin(body) {
  const errors = [];
  if (!body.email || !EMAIL_RE.test(body.email)) {
    errors.push('a valid email is required');
  }
  if (!body.password) {
    errors.push('password is required');
  }
  return errors;
}

module.exports = { validateSignup, validateLogin };
