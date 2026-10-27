const inventoryService = require('../services/inventory.service');
const { success, failure } = require('../utils/response');
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
  if (!req.body?.itemId) return failure(res, 'itemId is required', 422);
  const result = await inventoryService.purchaseItem(req.user.id, req.body.itemId);
  return success(res, result, 201);
});

const equipItem = asyncHandler(async (req, res) => {
  const owned = await inventoryService.setEquipped(req.user.id, req.params.itemId, true);
  return success(res, owned);
});

const unequipItem = asyncHandler(async (req, res) => {
  const owned = await inventoryService.setEquipped(req.user.id, req.params.itemId, false);
  return success(res, owned);
});

module.exports = { listItems, myInventory, purchaseItem, equipItem, unequipItem };