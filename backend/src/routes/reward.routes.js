const router = require('express').Router();
const { requireAuth } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { validateRedeem } = require('../validators/reward.validator');
const { listRewards, myRedemptions, redeemReward } = require('../controllers/reward.controller');

router.get('/', requireAuth, listRewards);
router.get('/mine', requireAuth, myRedemptions);
router.post('/redeem', requireAuth, validate(validateRedeem), redeemReward);

module.exports = router;
