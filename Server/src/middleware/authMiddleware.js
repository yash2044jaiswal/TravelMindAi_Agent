import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';

/**
 * Express middleware to guard routes and enforce valid JWT authentications.
 */
export const protect = async (req, res, next) => {
  let token;

  // Retrieve token from Authorization header or Cookie stores
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new ApiError(401, 'Access denied. Authorization token is missing.'));
  }

  try {
    // Decode token signature verification
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_for_hackathon');

    // Find user reference in Database
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return next(new ApiError(404, 'No user found linked to current authentication token.'));
    }

    // Attach active user details to Request object
    req.user = user;
    next();
  } catch (error) {
    return next(new ApiError(401, 'Authentication failed. Token is invalid or expired.'));
  }
};