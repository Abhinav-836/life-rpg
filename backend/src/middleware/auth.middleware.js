const { verifyToken } = require('../utils/jwt');
const { failure } = require('../utils/response');
const { isValidTimeZone } = require('../utils/time');

// Verifies the JWT and attaches req.user = { id, email }.
// Every route that touches user-owned data uses this middleware and
// filters every query by req.user.id, so a user can only ever read or
// change their own data.
//
// The frontend also sends the browser's timezone (X-Timezone header),
// which is used to decide when a streak day starts and ends.
function requireAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return failure(res, 'Missing or malformed Authorization header', 401);
  }

  const token = header.split(' ')[1];

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.id, email: payload.email };
  } catch (err) {
    return failure(res, 'Invalid or expired token', 401);
  }

  const tz = req.headers['x-timezone'];
  req.timeZone = isValidTimeZone(tz) ? tz : undefined;
  next();
}

module.exports = { requireAuth };