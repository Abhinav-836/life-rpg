const { failure } = require('../utils/response');

// Catch-all error handler. Wire this up LAST in app.js.
// Prevents unhandled exceptions from crashing the process or
// returning a blank response (the "console/runtime crash" zero-tolerance rule).
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

  return failure(res, 'Something went wrong on our end', 500);
}

// Wrap any async controller with this so thrown errors reach errorHandler
// instead of crashing the request.
function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

module.exports = { errorHandler, asyncHandler };
