const router = require('express').Router();
const { requireAuth } = require('../middleware/auth.middleware');
const { getMyStreak } = require('../controllers/streak.controller');

router.get('/me', requireAuth, getMyStreak);

module.exports = router;
