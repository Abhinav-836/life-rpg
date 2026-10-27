const authService = require('../services/auth.service');
const { success } = require('../utils/response');
const { asyncHandler } = require('../middleware/error.middleware');

const signup = asyncHandler(async (req, res) => {
  const result = await authService.signup(req.body);
  return success(res, result, 201);
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  return success(res, result, 200);
});

// No body needed: creates a fresh, private demo account.
const guestLogin = asyncHandler(async (req, res) => {
  const result = await authService.guestLogin();
  return success(res, result, 201);
});

module.exports = { signup, login, guestLogin };