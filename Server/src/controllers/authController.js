import { validationResult } from 'express-validator';
import User from '../models/User.js'
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import generateToken from '../utils/generateToken.js';

/**
 * Controller managing authorization flows.
 */
class AuthController {
  
  // POST /api/auth/register
  registerUser = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ApiError(400, 'Validation Error', errors.array()));
      }

      const { name, email, password } = req.body;

      // Duplicate user validation check
      const userExists = await User.findOne({ email });
      if (userExists) {
        return next(new ApiError(400, 'User with this email already exists'));
      }

      // Create and save database user
      const user = await User.create({
        name,
        email,
        password
      });

      // Issue cookie containing JWT authorization token
      const token = generateToken(user._id);

      res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 Days expiry
        secure: process.env.NODE_ENV === 'production'
      });

      return res.status(201).json(
        new ApiResponse(210, {
          user: {
            id: user._id,
            name: user.name,
            email: user.email
          },
          token
        }, 'Registration completed successfully!')
      );
    } catch (err) {
      next(err);
    }
  };

  // POST /api/auth/login
  loginUser = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ApiError(400, 'Validation Error', errors.array()));
      }

      const { email, password } = req.body;

      // Query database user checking select password override fields
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return next(new ApiError(401, 'Invalid authentication credentials'));
      }

      // Assert password hashes matches matching true conditions
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return next(new ApiError(401, 'Invalid authentication credentials'));
      }

      const token = generateToken(user._id);

      res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        secure: process.env.NODE_ENV === 'production'
      });

      return res.status(200).json(
        new ApiResponse(200, {
          user: {
            id: user._id,
            name: user.name,
            email: user.email
          },
          token
        }, 'Login succeeded.')
      );
    } catch (err) {
      next(err);
    }
  };

  // GET /api/auth/profile
  getUserProfile = async (req, res, next) => {
    try {
      // Returns current token verified user attached by middleware
      return res.status(200).json(
        new ApiResponse(200, req.user, 'Profile data retrieved.')
      );
    } catch (err) {
      next(err);
    }
  };

  // PUT /api/auth/profile
  updateUserProfile = async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return next(new ApiError(404, 'User profile records not found'));
      }

      // Update name and email fields if supplied
      if (req.body.name) user.name = req.body.name;
      if (req.body.email) user.email = req.body.email;
      if (req.body.password) user.password = req.body.password;

      await user.save();

      return res.status(200).json(
        new ApiResponse(200, {
          id: user._id,
          name: user.name,
          email: user.email
        }, 'User profile details updated successfully.')
      );
    } catch (err) {
      next(err);
    }
  };
}

export default new AuthController();