const { failure } = require('../utils/response');

// Generic runner: pass it a validator function (see src/validators/*),
// it runs the checks and either calls next() or returns a 422 with details.
function validate(validatorFn) {
  return (req, res, next) => {
    const errors = validatorFn(req.body);
    if (errors.length > 0) {
      return failure(res, 'Validation failed', 422, errors);
    }
    next();
  };
}

module.exports = { validate };
