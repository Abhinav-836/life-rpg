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

app.use(cors({ origin: clientOrigin }));
app.use(express.json());
app.use(apiLimiter);

// Health check - deploy this route FIRST and confirm it works in
// production before building anything else. It proves the API is
// reachable and the database connection is alive.
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
