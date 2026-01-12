/**
 * Validation Utilities
 * Reusable validation functions
 */

import { VALIDATION_RULES, AUTH_ERRORS, BLOG_ERRORS, COMMENT_ERRORS } from './constants';

/**
 * Validate email
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export const validateEmail = (email) => {
  return VALIDATION_RULES.EMAIL_REGEX.test(email);
};

/**
 * Validate password
 * @param {string} password - Password to validate
 * @returns {object} { isValid: boolean, error: string }
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  if (password.length < VALIDATION_RULES.MIN_PASSWORD_LENGTH) {
    return { isValid: false, error: AUTH_ERRORS.PASSWORD_TOO_SHORT };
  }
  return { isValid: true, error: '' };
};

/**
 * Validate password match
 * @param {string} password - Password
 * @param {string} confirmPassword - Confirm password
 * @returns {object} { isValid: boolean, error: string }
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return { isValid: false, error: AUTH_ERRORS.PASSWORD_MISMATCH };
  }
  return { isValid: true, error: '' };
};

/**
 * Validate name
 * @param {string} name - Name to validate
 * @returns {object} { isValid: boolean, error: string }
 */
export const validateName = (name) => {
  if (!name || !name.trim()) {
    return { isValid: false, error: 'Full name is required' };
  }
  if (name.trim().length < VALIDATION_RULES.MIN_NAME_LENGTH) {
    return { isValid: false, error: AUTH_ERRORS.NAME_TOO_SHORT };
  }
  return { isValid: true, error: '' };
};

/**
 * Validate login form
 * @param {object} formData - Form data { email, password }
 * @returns {object} { isValid: boolean, errors: object }
 */
export const validateLoginForm = (formData) => {
  const errors = {};

  if (!formData.email.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(formData.email)) {
    errors.email = AUTH_ERRORS.INVALID_EMAIL;
  }

  if (!formData.password) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate register form
 * @param {object} formData - Form data { name, email, password, confirmPassword }
 * @returns {object} { isValid: boolean, errors: object }
 */
export const validateRegisterForm = (formData) => {
  const errors = {};

  const nameValidation = validateName(formData.name);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.error;
  }

  if (!formData.email.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(formData.email)) {
    errors.email = AUTH_ERRORS.INVALID_EMAIL;
  }

  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error;
  } else {
    const matchValidation = validatePasswordMatch(formData.password, formData.confirmPassword);
    if (!matchValidation.isValid) {
      errors.confirmPassword = matchValidation.error;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate blog title
 * @param {string} title - Title to validate
 * @returns {object} { isValid: boolean, error: string }
 */
export const validateTitle = (title) => {
  if (!title.trim()) {
    return { isValid: false, error: BLOG_ERRORS.TITLE_REQUIRED };
  }
  if (title.trim().length < VALIDATION_RULES.MIN_TITLE_LENGTH) {
    return { isValid: false, error: BLOG_ERRORS.TITLE_TOO_SHORT };
  }
  return { isValid: true, error: '' };
};

/**
 * Validate blog description
 * @param {string} description - Description to validate
 * @returns {object} { isValid: boolean, error: string }
 */
export const validateDescription = (description) => {
  if (!description.trim()) {
    return { isValid: false, error: BLOG_ERRORS.DESCRIPTION_REQUIRED };
  }
  if (description.trim().length < VALIDATION_RULES.MIN_DESCRIPTION_LENGTH) {
    return { isValid: false, error: BLOG_ERRORS.DESCRIPTION_TOO_SHORT };
  }
  return { isValid: true, error: '' };
};

/**
 * Validate blog form
 * @param {object} formData - Form data { title, description, tags }
 * @returns {object} { isValid: boolean, errors: object }
 */
export const validateBlogForm = (formData) => {
  const errors = {};

  const titleValidation = validateTitle(formData.title);
  if (!titleValidation.isValid) {
    errors.title = titleValidation.error;
  }

  const descriptionValidation = validateDescription(formData.description);
  if (!descriptionValidation.isValid) {
    errors.description = descriptionValidation.error;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate comment
 * @param {string} comment - Comment to validate
 * @returns {object} { isValid: boolean, error: string }
 */
export const validateComment = (comment) => {
  if (!comment || !comment.trim()) {
    return { isValid: false, error: COMMENT_ERRORS.COMMENT_REQUIRED };
  }
  return { isValid: true, error: '' };
};
