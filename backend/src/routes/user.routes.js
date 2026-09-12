const router = require('express').Router();
const { requireAuth } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { validateUpdateProfile, validateChangePassword } = require('../validators/user.validator');
const { getMe, updateMe, changePassword } = require('../controllers/user.controller');

router.get('/me', requireAuth, getMe);
router.patch('/me', requireAuth, validate(validateUpdateProfile), updateMe);
router.post('/me/password', requireAuth, validate(validateChangePassword), changePassword);

module.exports = router;
