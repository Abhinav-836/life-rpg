const router = require('express').Router();
const { requireAuth } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { validateCreateTask, validateUpdateTask } = require('../validators/task.validator');
const {
  listTasks, createTask, updateTask, deleteTask, completeTask,
} = require('../controllers/task.controller');

router.use(requireAuth); // every quest route requires a logged-in user

router.get('/', listTasks);
router.post('/', validate(validateCreateTask), createTask);
router.patch('/:id', validate(validateUpdateTask), updateTask);
router.delete('/:id', deleteTask);
router.post('/:id/complete', completeTask);

module.exports = router;