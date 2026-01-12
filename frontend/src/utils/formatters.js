/**
 * Formatter Utilities
 * Reusable functions for formatting data
 */

import { BLOG_CONFIG } from './constants';

/**
 * Format date to readable format
 * @param {string|Date} date - Date to format
 * @param {object} options - Formatting options
 * @returns {string} Formatted date
 */
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };

  return new Date(date).toLocaleDateString('en-US', defaultOptions);
};

/**
 * Format date and time
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date and time
 */
export const formatDateTime = (date) => {
  return formatDate(date, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Calculate reading time
 * @param {string} text - Text content
 * @returns {number} Reading time in minutes
 */
export const calculateReadingTime = (text) => {
  if (!text) return 0;
  const words = text.length / BLOG_CONFIG.READING_TIME_CHARS_PER_MINUTE;
  return Math.ceil(words);
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} length - Max length
 * @returns {string} Truncated text with ellipsis
 */
export const truncateText = (text, length = BLOG_CONFIG.EXCERPT_LENGTH) => {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
};

/**
 * Format blog excerpt
 * @param {string} text - Blog text
 * @returns {string} Formatted excerpt
 */
export const formatExcerpt = (text) => {
  return truncateText(text, BLOG_CONFIG.EXCERPT_LENGTH);
};

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Capitalize first letter
 * @param {string} text - Text to capitalize
 * @returns {string} Capitalized text
 */
export const capitalizeFirst = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
};

/**
 * Format plural text
 * @param {number} count - Count
 * @param {string} singular - Singular form
 * @param {string} plural - Plural form
 * @returns {string} Formatted plural text
 */
export const formatPlural = (count, singular, plural) => {
  return count === 1 ? singular : plural;
};

/**
 * Get initials from name
 * @param {string} name - Full name
 * @returns {string} Initials
 */
export const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
