import ApiError from '../utils/ApiError.js';

/**
 * Handles errors and formats JSON responses appropriately.
 */
export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for local backend tracking
  console.error(`[Error Handler Triggered]: ${err.stack || err.message}`);

  // Mongoose Bad ObjectId handler
  if (err.name === 'CastError') {
    const message = `Resource not found with identifier ID: ${err.value}`;
    error = new ApiError(404, message);
  }

  // Mongoose duplicate key creation
  if (err.code === 11000) {
    const message = 'Duplicate field value entered. A unique constraint has failed.';
    error = new ApiError(400, message);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new ApiError(400, message);
  }

  // Check if we are sending a Custom ApiError instance
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Core Error';
  const errorsList = error.errors || [];

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: message,
    errors: errorsList,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};