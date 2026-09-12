const router = require('express').Router();
const { requireAuth } = require('../middleware/auth.middleware');
const { listAllBadges, getMyBadges } = require('../controllers/badge.controller');

router.get('/', requireAuth, listAllBadges);
router.get('/mine', requireAuth, getMyBadges);

module.exports = router;
