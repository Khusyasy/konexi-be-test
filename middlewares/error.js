const { formatRes } = require('../utils/response');

/** @type {import("express").ErrorRequestHandler} */
module.exports = function (err, req, res, next) {
  console.error(err);
  res.status(500).json(
    formatRes(
      {
        error: err,
      },
      'error',
      err.message || err
    )
  );
};
