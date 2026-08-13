const env = require('../config/env');

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode && err.statusCode >= 400 ? err.statusCode : 500;

  const response = {
    success: false,
    message: err.message || 'Internal server error',
    ...(err.details ? { details: err.details } : {}),
  };

  if (env.nodeEnv === 'development') {
    response.stack = err.stack;
  }

  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json(response);
}

module.exports = errorHandler;