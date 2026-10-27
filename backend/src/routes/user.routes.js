const router = require('express').Router();
const { requireAuth } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { authLimiter } = require('../middleware/rateLimit.middleware');
const {
  validateUpdateProfile, validateChangePassword, validateSettings,
} = require('../validators/user.validator');
const {
  getMe, updateMe, changePassword, getSettings, updateSettings, deleteMe,
} = require('../controllers/user.controller');

router.use(requireAuth);

router.get('/me', getMe);
router.patch('/me', validate(validateUpdateProfile), updateMe);
router.delete('/me', authLimiter, deleteMe);
router.post('/me/password', authLimiter, validate(validateChangePassword), changePassword);
router.get('/me/settings', getSettings);
router.patch('/me/settings', validate(validateSettings), updateSettings);

module.exports = router;