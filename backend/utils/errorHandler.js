// utils/errorHandler.js
const logger = require('./logger');

class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();
    Error.captureStackTrace(this, this.constructor);
  }
}

class ErrorHandler {
  static handleError(error, req, res, next) {
    let statusCode = error.statusCode || 500;
    let message = error.message || 'Internal Server Error';
    let isOperational = error.isOperational || false;

    // Log the error
    logger.error('Error occurred', error, {
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      userId: req.user?.id
    });

    // Development vs Production error responses
    if (process.env.NODE_ENV === 'development') {
      return res.status(statusCode).json({
        success: false,
        error: {
          message,
          statusCode,
          stack: error.stack,
          isOperational
        }
      });
    }

    // Production - don't leak error details
    if (!isOperational) {
      message = 'Something went wrong';
    }

    res.status(statusCode).json({
      success: false,
      error: {
        message,
        statusCode
      }
    });
  }

  static notFound(req, res, next) {
    const error = new AppError(`Route ${req.originalUrl} not found`, 404);
    next(error);
  }

  static asyncHandler(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }
}

module.exports = { ErrorHandler, AppError };