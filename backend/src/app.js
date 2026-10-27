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

// The API runs behind a hosting proxy that sets X-Forwarded-For. Trusting
// exactly one hop gives the rate limiter the real visitor IP without
// letting clients spoof it.
app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(cors({
  origin: clientOrigin,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Timezone'],
}));
app.use(express.json({ limit: '100kb' }));
app.use(apiLimiter);

app.get('/', (req, res) => {
  res.json({ name: 'Life RPG API', status: 'ok', health: '/health' });
});

app.get('/health', async (req, res) => {
  const prisma = require('./config/database');
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, db: 'connected' });
  } catch (err) {
    res.status(503).json({ ok: false, db: 'unreachable' });
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