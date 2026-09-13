const express = require('express');
const cors = require('cors');
const { clientOrigin } = require('./config/env');
const { errorHandler } = require('./middleware/error.middleware');
const { apiLimiter } = require('./middleware/rateLimit.middleware');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const taskRoutes = require('./routes/task.routes');
const characterRoutes = require('./routes/character.routes');
const streakRoutes = require('./routes/streak.routes');
const rewardRoutes = require('./routes/reward.routes');
const inventoryRoutes = require('./routes/inventory.routes');
const badgeRoutes = require('./routes/badge.routes');

const app = express();

// FIX: Render sits behind a reverse proxy, so incoming requests carry an
// X-Forwarded-For header. Express doesn't trust that header by default,
// which made express-rate-limit unable to reliably identify per-visitor
// IPs (the ERR_ERL_UNEXPECTED_X_FORWARDED_FOR warning in the logs).
// Trusting the first proxy hop (Render's own) fixes this without opening
// up IP spoofing risk from arbitrary clients.
app.set('trust proxy', 1);

app.use(cors({ origin: clientOrigin }));
app.use(express.json());
app.use(apiLimiter);

app.get('/health', async (req, res) => {
  const prisma = require('./config/database');
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, db: 'connected' });
  } catch (err) {
    res.status(500).json({ ok: false, db: 'unreachable' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/character', characterRoutes);
app.use('/api/streak', streakRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/badges', badgeRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Must be registered LAST - Express only treats a 4-arg function as an error handler.
app.use(errorHandler);

module.exports = app;