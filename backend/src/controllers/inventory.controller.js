const inventoryService = require('../services/inventory.service');
const { success } = require('../utils/response');
const { asyncHandler } = require('../middleware/error.middleware');

const listItems = asyncHandler(async (req, res) => {
  const items = await inventoryService.listItems();
  return success(res, items);
});

const myInventory = asyncHandler(async (req, res) => {
  const owned = await inventoryService.listOwnedByUser(req.user.id);
  return success(res, owned);
});

const purchaseItem = asyncHandler(async (req, res) => {
  const result = await inventoryService.purchaseItem(req.user.id, req.body.itemId);
  return success(res, result, 201);
});

module.exports = { listItems, myInventory, purchaseItem };
