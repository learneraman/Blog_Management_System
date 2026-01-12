/**
 * Application Constants
 * Centralized constants for the entire application
 */

// API Endpoints
export const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

// Auth Constants
export const AUTH_ERRORS = {
  INVALID_EMAIL: 'Please enter a valid email',
  PASSWORD_TOO_SHORT: 'Password must be at least 6 characters long',
  PASSWORD_MISMATCH: 'Passwords do not match',
  NAME_TOO_SHORT: 'Name must be at least 2 characters long',
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_EXISTS: 'User already exists',
};

export const BLOG_ERRORS = {
  TITLE_REQUIRED: 'Title is required',
  TITLE_TOO_SHORT: 'Title must be at least 3 characters long',
  DESCRIPTION_REQUIRED: 'Description is required',
  DESCRIPTION_TOO_SHORT: 'Description must be at least 10 characters long',
  FETCH_FAILED: 'Failed to fetch blog',
  SAVE_FAILED: 'Failed to save blog',
  DELETE_FAILED: 'Failed to delete blog',
};

export const COMMENT_ERRORS = {
  COMMENT_REQUIRED: 'Please enter a comment',
  ADD_FAILED: 'Failed to add comment',
  DELETE_FAILED: 'Failed to delete comment',
  LOGIN_REQUIRED: 'Please login to comment',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login successful! Redirecting...',
  REGISTER: 'Registration successful! Redirecting to login...',
  BLOG_CREATED: 'Blog created successfully! Redirecting...',
  BLOG_UPDATED: 'Blog updated successfully! Redirecting...',
  BLOG_DELETED: 'Blog deleted successfully',
  COMMENT_ADDED: 'Comment posted!',
  COMMENT_DELETED: 'Comment deleted!',
  BLOG_LIKED: 'Liked!',
};

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MIN_NAME_LENGTH: 2,
  MIN_EMAIL_LENGTH: 5,
  MIN_PASSWORD_LENGTH: 6,
  MIN_TITLE_LENGTH: 3,
  MIN_DESCRIPTION_LENGTH: 10,
  MIN_COMMENT_LENGTH: 1,
  MAX_TAGS_COUNT: 10,
};

// UI Constants
export const UI = {
  TOAST_DURATION: 3000,
  ALERT_DURATION: 2000,
  TRANSITION_DURATION: 300,
  PAGE_LOAD_DELAY: 1500,
};

// Blog Constants
export const BLOG_CONFIG = {
  CARDS_PER_PAGE: 12,
  READING_TIME_CHARS_PER_MINUTE: 200,
  EXCERPT_LENGTH: 120,
  PREVIEW_EXCERPT_LENGTH: 100,
};

// Routes
export const ROUTES = {
  HOME: '/',
  BLOGS: '/blogs',
  BLOG_VIEW: '/blogs/:id',
  BLOG_NEW: '/blogs/new',
  BLOG_EDIT: '/blogs/edit/:id',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
};

// Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER_ID: 'userId',
  USER_EMAIL: 'userEmail',
  THEME: 'theme',
};

// Theme
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
};

// API Response Status
export const API_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};
