import jwt from 'jsonwebtoken';

/**
 * Generates an encrypted JWT access token for authentication.
 * @param {string} userId - User Identification MongoDB ID 
 */
const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'fallback_secret_for_hackathon';
  const expire = process.env.JWT_EXPIRE || '30d';

  return jwt.sign({ id: userId }, secret, {
    expiresIn: expire,
  });
};

export default generateToken;