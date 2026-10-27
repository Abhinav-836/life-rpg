require('dotenv').config();

const nodeEnv = process.env.NODE_ENV || 'development';
const jwtSecret = process.env.JWT_SECRET;

// Fail at boot instead of on the first login. Without a secret,
// jsonwebtoken throws on every sign/verify and the API looks "up" while
// every authenticated request fails.
if (!jwtSecret) {
  throw new Error('JWT_SECRET is not set. Add a long random string to your environment.');
}
if (jwtSecret.length < 32) {
  console.warn('JWT_SECRET is shorter than 32 characters. Use a longer random value in production.');
}

// CLIENT_ORIGIN accepts a comma-separated list, e.g.
// "https://life-rpg.vercel.app,http://localhost:5173"
const clientOrigin = (process.env.CLIENT_ORIGIN || '*')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv,
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientOrigin: clientOrigin.length === 1 ? clientOrigin[0] : clientOrigin,
};