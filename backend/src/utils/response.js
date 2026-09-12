// Small helpers so every controller returns the same JSON shape.
function success(res, data, status = 200) {
  return res.status(status).json({ success: true, data });
}

function failure(res, message, status = 400, details = undefined) {
  return res.status(status).json({ success: false, message, details });
}

module.exports = { success, failure };
