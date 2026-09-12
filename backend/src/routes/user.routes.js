const router = require('express').Router();
const { requireAuth } = require('../middleware/auth.middleware');
const { getMe } = require('../controllers/user.controller');

router.get('/me', requireAuth, getMe);

module.exports = router;
