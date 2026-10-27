const taskService = require('../services/task.service');
const { success } = require('../utils/response');
const { asyncHandler } = require('../middleware/error.middleware');

const listTasks = asyncHandler(async (req, res) => {
  const { completed } = req.query;
  const filters = {};
  if (completed === 'true') filters.isCompleted = true;
  if (completed === 'false') filters.isCompleted = false;

  const tasks = await taskService.listTasks(req.user.id, filters);
  return success(res, tasks);
});

const createTask = asyncHandler(async (req, res) => {
  const task = await taskService.createTask(req.user.id, req.body);
  return success(res, task, 201);
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await taskService.updateTask(req.user.id, req.params.id, req.body);
  return success(res, task);
});

const deleteTask = asyncHandler(async (req, res) => {
  await taskService.deleteTask(req.user.id, req.params.id);
  return success(res, { deleted: true });
});

// Called when the player ticks a quest off. Returns everything the UI
// needs to animate: level-up, new XP, gold, streak and any new badges.
const completeTask = asyncHandler(async (req, res) => {
  const result = await taskService.completeTask(req.user.id, req.params.id, { timeZone: req.timeZone });
  return success(res, result);
});

module.exports = { listTasks, createTask, updateTask, deleteTask, completeTask };