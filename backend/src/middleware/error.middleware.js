const { failure } = require('../utils/response');

// Catch-all error handler. Registered LAST in app.js.
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // Malformed JSON body or a body over the size limit: the client's fault.
  if (err.type === 'entity.parse.failed') {
    return failure(res, 'Request body is not valid JSON', 400);
  }
  if (err.type === 'entity.too.large') {
    return failure(res, 'Request body is too large', 413);
  }

  if (err.code === 'P2002') {
    return failure(res, 'A record with that value already exists', 409);
  }
  if (err.code === 'P2025') {
    return failure(res, 'Resource not found', 404);
  }

  // Services throw errors with an explicit status for expected rejections
  // (wrong password, not enough gold, quest not found...). Pass those
  // through with their real message.
  if (err.status && err.status < 500) {
    return failure(res, err.message, err.status);
  }

  console.error(err);
  return failure(res, 'Something went wrong on our end', 500);
}

// Wrap async controllers so thrown errors reach errorHandler instead of
// crashing the request.
function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

module.exports = { errorHandler, asyncHandler };