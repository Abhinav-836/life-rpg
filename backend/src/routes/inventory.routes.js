const router = require('express').Router();
const { requireAuth } = require('../middleware/auth.middleware');
const { listItems, myInventory, purchaseItem } = require('../controllers/inventory.controller');

router.get('/', requireAuth, listItems);
router.get('/mine', requireAuth, myInventory);
router.post('/purchase', requireAuth, purchaseItem);

module.exports = router;
