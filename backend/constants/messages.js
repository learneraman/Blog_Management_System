/**
 * Backend Constants
 * Centralized constants for the entire backend
 */

// JWT Configuration
exports.JWT_CONFIG = {
  SECRET: process.env.JWT_SECRET || 'secret',
  EXPIRES_IN: '7d',
};

// Database Configuration
exports.DB_CONFIG = {
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/blog-app',
};

// Password Configuration
exports.PASSWORD_CONFIG = {
  SALT_ROUNDS: 10,
  MIN_LENGTH: 6,
};

// API Response Messages
exports.API_MESSAGES = {
  // Authentication
  AUTH_REGISTER_SUCCESS: 'User registered successfully',
  AUTH_LOGIN_SUCCESS: 'Login successful',
  AUTH_INVALID_CREDENTIALS: 'Invalid credentials',
  AUTH_EMAIL_EXISTS: 'Email already in use',
  AUTH_USER_NOT_FOUND: 'User not found',
  
  // Blogs
  BLOG_CREATE_SUCCESS: 'Blog created successfully',
  BLOG_UPDATE_SUCCESS: 'Blog updated successfully',
  BLOG_DELETE_SUCCESS: 'Blog deleted successfully',
  BLOG_NOT_FOUND: 'Blog not found',
  BLOG_UNAUTHORIZED: 'You are not authorized to perform this action',
  
  // Comments
  COMMENT_ADD_SUCCESS: 'Comment added successfully',
  COMMENT_DELETE_SUCCESS: 'Comment deleted successfully',
  COMMENT_NOT_FOUND: 'Comment not found',
  
  // Likes
  LIKE_SUCCESS: 'Blog liked successfully',
  UNLIKE_SUCCESS: 'Blog unliked successfully',
  
  // Validation
  VALIDATION_ERROR: 'Validation error',
  VALIDATION_INVALID_EMAIL: 'Please provide a valid email address',
  VALIDATION_PASSWORD_SHORT: 'Password must be at least 6 characters long',
  VALIDATION_NAME_SHORT: 'Name must be at least 2 characters long',
  VALIDATION_TITLE_REQUIRED: 'Blog title is required',
  VALIDATION_DESCRIPTION_REQUIRED: 'Blog description is required',
  VALIDATION_COMMENT_REQUIRED: 'Comment text is required',
  
  // Server Errors
  SERVER_ERROR: 'Something went wrong. Please try again later.',
  INTERNAL_ERROR: 'Internal server error',
  
  // Authentication Errors
  AUTH_TOKEN_MISSING: 'Authorization token is missing',
  AUTH_TOKEN_INVALID: 'Invalid or expired token',
  AUTH_REQUIRED: 'Authentication is required',
};

// HTTP Status Codes
exports.HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// Validation Rules
exports.VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MIN_NAME_LENGTH: 2,
  MIN_PASSWORD_LENGTH: 6,
  MIN_TITLE_LENGTH: 3,
  MIN_DESCRIPTION_LENGTH: 10,
  MIN_COMMENT_LENGTH: 1,
  MAX_TAGS: 10,
};

// API Routes
exports.API_ROUTES = {
  AUTH_REGISTER: '/auth/register',
  AUTH_LOGIN: '/auth/login',
  BLOGS: '/blogs',
  BLOG_BY_ID: '/blogs/:id',
  BLOG_COMMENTS: '/blogs/:id/comments',
  BLOG_COMMENT_DELETE: '/blogs/:id/comments/:commentId',
  BLOG_LIKE: '/blogs/:id/like',
  BLOG_UNLIKE: '/blogs/:id/unlike',
};

// Error Types
exports.ERROR_TYPES = {
  VALIDATION_ERROR: 'ValidationError',
  AUTHENTICATION_ERROR: 'AuthenticationError',
  AUTHORIZATION_ERROR: 'AuthorizationError',
  NOT_FOUND_ERROR: 'NotFoundError',
  DUPLICATE_ERROR: 'DuplicateError',
  DATABASE_ERROR: 'DatabaseError',
  SERVER_ERROR: 'ServerError',
};

// Query Defaults
exports.QUERY_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
  SORT_BY: 'createdAt',
  SORT_ORDER: -1, // -1 for descending, 1 for ascending
};
