const { verifyToken } = require('../utils/jwt');
const { failure } = require('../utils/response');

// Verifies the JWT and attaches req.user = { id, email }.
// Every route that touches user-owned data MUST use this middleware,
// then filter every query by req.user.id - that's what satisfies the
// hackathon's "users can only see/modify their own data" requirement.
function requireAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return failure(res, 'Missing or malformed Authorization header', 401);
  }

  const token = header.split(' ')[1];

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.id, email: payload.email };
    next();
  } catch (err) {
    return failure(res, 'Invalid or expired token', 401);
  }
}

module.exports = { requireAuth };
