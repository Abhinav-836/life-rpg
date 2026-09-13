const router = require('express').Router();
const { signup, login, guestLogin } = require('../controllers/auth.controller');
const { validate } = require('../middleware/validation.middleware');
const { validateSignup, validateLogin } = require('../validators/auth.validator');
const { authLimiter } = require('../middleware/rateLimit.middleware');

router.post('/signup', authLimiter, validate(validateSignup), signup);
router.post('/login', authLimiter, validate(validateLogin), login);
router.post('/guest', authLimiter, guestLogin);

module.exports = router;