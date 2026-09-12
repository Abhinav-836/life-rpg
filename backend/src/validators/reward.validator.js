function validateRedeem(body) {
  const errors = [];
  if (!body.rewardId) {
    errors.push('rewardId is required');
  }
  return errors;
}

module.exports = { validateRedeem };
