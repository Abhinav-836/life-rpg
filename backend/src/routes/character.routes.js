const router = require('express').Router();
const { requireAuth } = require('../middleware/auth.middleware');
const { getMyCharacter } = require('../controllers/character.controller');

router.get('/me', requireAuth, getMyCharacter);

module.exports = router;
