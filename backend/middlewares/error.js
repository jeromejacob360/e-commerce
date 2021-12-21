const ErrorHandler = require('../utils/errorHandler');

module.exports = (err, req, res, next) => {
  // Mongoose cast error
  if (err.name === 'CastError') {
    err = new ErrorHandler('Resource not found at ' + err.path, 404);
  }

  if (err instanceof ErrorHandler) {
    res.status(err.statusCode).json({
      name: err.name,
      type: 'SYNC ERROR',
      success: false,
      statusCode: err.statusCode,
      status: err.status,
      message: err.message,
      // stack: err.stack,
    });
  } else {
    res.status(500).json({
      name: err.name,
      type: 'ASYNC ERROR',
      success: false,
      status: 'error',
      message: err.message,
      // stack: err.stack,
    });
  }
};
