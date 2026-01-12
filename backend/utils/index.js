/**
 * Backend Utilities
 * Helper functions for common operations
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { JWT_CONFIG, PASSWORD_CONFIG, API_MESSAGES, HTTP_STATUS } = require('../constants/messages');

/**
 * Generate JWT token
 * @param {string} userId - User ID
 * @returns {string} JWT token
 */
exports.generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_CONFIG.SECRET, {
    expiresIn: JWT_CONFIG.EXPIRES_IN,
  });
};

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {object|null} Decoded token or null if invalid
 */
exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_CONFIG.SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Hash password
 * @param {string} password - Password to hash
 * @returns {Promise<string>} Hashed password
 */
exports.hashPassword = async (password) => {
  return await bcrypt.hash(password, PASSWORD_CONFIG.SALT_ROUNDS);
};

/**
 * Compare password with hash
 * @param {string} password - Plain password
 * @param {string} hash - Password hash
 * @returns {Promise<boolean>} True if passwords match
 */
exports.comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

/**
 * Create successful API response
 * @param {number} statusCode - HTTP status code
 * @param {*} data - Response data
 * @param {string} message - Response message
 * @returns {object} Response object
 */
exports.successResponse = (statusCode, data, message = 'Success') => {
  return {
    status: statusCode,
    message,
    data,
    success: true,
  };
};

/**
 * Create error API response
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {*} errors - Error details (optional)
 * @returns {object} Response object
 */
exports.errorResponse = (statusCode, message, errors = null) => {
  return {
    status: statusCode,
    message,
    errors,
    success: false,
  };
};

/**
 * Format blog data for response
 * @param {object} blog - Blog document
 * @returns {object} Formatted blog
 */
exports.formatBlogResponse = (blog) => {
  if (!blog) return null;
  
  return {
    _id: blog._id,
    title: blog.title,
    description: blog.description,
    author: blog.author ? {
      _id: blog.author._id,
      name: blog.author.name,
      email: blog.author.email,
    } : null,
    tags: blog.tags || [],
    likes: blog.likes ? blog.likes.length : 0,
    comments: blog.comments ? blog.comments.length : 0,
    createdAt: blog.createdAt,
    updatedAt: blog.updatedAt,
  };
};

/**
 * Format user data for response (hide sensitive data)
 * @param {object} user - User document
 * @returns {object} Formatted user
 */
exports.formatUserResponse = (user) => {
  if (!user) return null;
  
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
};

/**
 * Extract token from Authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} Token or null
 */
exports.extractToken = (authHeader) => {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  
  return parts[1];
};

/**
 * Check if user owns document
 * @param {string} userId - User ID
 * @param {string} authorId - Author ID
 * @returns {boolean} True if user is author
 */
exports.isAuthor = (userId, authorId) => {
  return userId.toString() === authorId.toString();
};

/**
 * Calculate pagination
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {object} { skip, limit }
 */
exports.calculatePagination = (page = 1, limit = 10) => {
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.max(1, parseInt(limit) || 10);
  const skip = (pageNum - 1) * limitNum;
  
  return { skip, limit: limitNum, page: pageNum };
};

/**
 * Parse sort query string
 * @param {string} sortStr - Sort string (e.g., "createdAt:desc")
 * @returns {object} Mongoose sort object
 */
exports.parseSortQuery = (sortStr) => {
  if (!sortStr) return { createdAt: -1 };
  
  const [field, direction] = sortStr.split(':');
  const sortOrder = direction === 'asc' ? 1 : -1;
  
  return { [field || 'createdAt']: sortOrder };
};

/**
 * Filter object by allowed keys
 * @param {object} obj - Object to filter
 * @param {array} allowedKeys - Allowed keys
 * @returns {object} Filtered object
 */
exports.filterObject = (obj, allowedKeys) => {
  const filtered = {};
  allowedKeys.forEach(key => {
    if (key in obj) {
      filtered[key] = obj[key];
    }
  });
  return filtered;
};

/**
 * Sanitize user input
 * @param {string} input - User input
 * @returns {string} Sanitized input
 */
exports.sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};

/**
 * Create pagination metadata
 * @param {number} total - Total items
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {object} Pagination metadata
 */
exports.createPaginationMeta = (total, page, limit) => {
  return {
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
    hasMore: page * limit < total,
  };
};
