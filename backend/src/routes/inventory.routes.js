const router = require('express').Router();
const { requireAuth } = require('../middleware/auth.middleware');
const {
  listItems, myInventory, purchaseItem, equipItem, unequipItem,
} = require('../controllers/inventory.controller');

router.use(requireAuth);

router.get('/', listItems);
router.get('/mine', myInventory);
router.post('/purchase', purchaseItem);
router.post('/:itemId/equip', equipItem);
router.post('/:itemId/unequip', unequipItem);

module.exports = router;