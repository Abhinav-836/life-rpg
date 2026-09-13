const { failure } = require('../utils/response');

// Catch-all error handler. Wire this up LAST in app.js.
function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.code === 'P2002') {
    // Prisma unique constraint violation
    return failure(res, 'A record with that value already exists', 409);
  }
  if (err.code === 'P2025') {
    // Prisma "record not found"
    return failure(res, 'Resource not found', 404);
  }

  // FIX: services throughout this app deliberately set `err.status` +
  // a specific message on intentional rejections (wrong password -> 401,
  // task not found -> 404, insufficient gold -> 400, duplicate email -> 409,
  // etc). This handler was ignoring that entirely and always returning a
  // generic 500 - so every one of those specific errors reached the client
  // as an unhelpful "something went wrong", even though the server-side
  // log correctly showed the real reason and status. Now it respects
  // whatever status/message the throwing code actually set, and only
  // falls back to a real 500 for genuinely unexpected errors.
  if (err.status) {
    return failure(res, err.message, err.status);
  }

  return failure(res, 'Something went wrong on our end', 500);
}

// Wrap any async controller with this so thrown errors reach errorHandler
// instead of crashing the request.
function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

module.exports = { errorHandler, asyncHandler };