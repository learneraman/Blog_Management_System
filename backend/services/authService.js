/**
 * Authentication Service
 * Handles all authentication-related business logic
 */

const User = require('../models/User');
const { hashPassword, comparePassword, generateToken } = require('../utils');
const { validateRegisterForm, validateLoginForm } = require('../validators');
const { API_MESSAGES, HTTP_STATUS } = require('../constants/messages');

/**
 * Register a new user
 * @param {object} userData - User data { name, email, password }
 * @returns {Promise<object>} { token, user }
 */
exports.register = async (userData) => {
  // Validate input
  const validation = validateRegisterForm(userData);
  if (!validation.isValid) {
    const error = new Error(API_MESSAGES.VALIDATION_ERROR);
    error.status = HTTP_STATUS.BAD_REQUEST;
    error.errors = validation.errors;
    throw error;
  }

  const { name, email, password } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error(API_MESSAGES.AUTH_EMAIL_EXISTS);
    error.status = HTTP_STATUS.CONFLICT;
    throw error;
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create new user
  const user = new User({
    name,
    email,
    passwordHash,
  });

  await user.save();

  // Generate token
  const token = generateToken(user._id);

  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      userId: user._id,
    },
  };
};

/**
 * Login user
 * @param {object} credentials - Login credentials { email, password }
 * @returns {Promise<object>} { token, user }
 */
exports.login = async (credentials) => {
  // Validate input
  const validation = validateLoginForm(credentials);
  if (!validation.isValid) {
    const error = new Error(API_MESSAGES.VALIDATION_ERROR);
    error.status = HTTP_STATUS.BAD_REQUEST;
    error.errors = validation.errors;
    throw error;
  }

  const { email, password } = credentials;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error(API_MESSAGES.AUTH_INVALID_CREDENTIALS);
    error.status = HTTP_STATUS.UNAUTHORIZED;
    throw error;
  }

  // Compare passwords
  const passwordMatch = await comparePassword(password, user.passwordHash);
  if (!passwordMatch) {
    const error = new Error(API_MESSAGES.AUTH_INVALID_CREDENTIALS);
    error.status = HTTP_STATUS.UNAUTHORIZED;
    throw error;
  }

  // Generate token
  const token = generateToken(user._id);

  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      userId: user._id,
    },
  };
};
