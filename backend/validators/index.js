/**
 * Backend Validators
 * Reusable validation functions and middleware
 */

const { VALIDATION_RULES, API_MESSAGES } = require('../constants/messages');

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
exports.isValidEmail = (email) => {
  return VALIDATION_RULES.EMAIL_REGEX.test(email);
};

/**
 * Validate password
 * @param {string} password - Password to validate
 * @returns {object} { isValid, error }
 */
exports.validatePassword = (password) => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  if (password.length < VALIDATION_RULES.MIN_PASSWORD_LENGTH) {
    return { isValid: false, error: API_MESSAGES.VALIDATION_PASSWORD_SHORT };
  }
  return { isValid: true, error: null };
};

/**
 * Validate user name
 * @param {string} name - Name to validate
 * @returns {object} { isValid, error }
 */
exports.validateName = (name) => {
  if (!name || !name.trim()) {
    return { isValid: false, error: 'Name is required' };
  }
  if (name.trim().length < VALIDATION_RULES.MIN_NAME_LENGTH) {
    return { isValid: false, error: API_MESSAGES.VALIDATION_NAME_SHORT };
  }
  return { isValid: true, error: null };
};

/**
 * Validate blog title
 * @param {string} title - Title to validate
 * @returns {object} { isValid, error }
 */
exports.validateBlogTitle = (title) => {
  if (!title || !title.trim()) {
    return { isValid: false, error: API_MESSAGES.VALIDATION_TITLE_REQUIRED };
  }
  if (title.trim().length < VALIDATION_RULES.MIN_TITLE_LENGTH) {
    return { isValid: false, error: 'Title must be at least 3 characters long' };
  }
  return { isValid: true, error: null };
};

/**
 * Validate blog description
 * @param {string} description - Description to validate
 * @returns {object} { isValid, error }
 */
exports.validateBlogDescription = (description) => {
  if (!description || !description.trim()) {
    return { isValid: false, error: API_MESSAGES.VALIDATION_DESCRIPTION_REQUIRED };
  }
  if (description.trim().length < VALIDATION_RULES.MIN_DESCRIPTION_LENGTH) {
    return { isValid: false, error: 'Description must be at least 10 characters long' };
  }
  return { isValid: true, error: null };
};

/**
 * Validate comment text
 * @param {string} text - Comment text to validate
 * @returns {object} { isValid, error }
 */
exports.validateCommentText = (text) => {
  if (!text || !text.trim()) {
    return { isValid: false, error: API_MESSAGES.VALIDATION_COMMENT_REQUIRED };
  }
  return { isValid: true, error: null };
};

/**
 * Validate tags array
 * @param {array} tags - Tags to validate
 * @returns {object} { isValid, error }
 */
exports.validateTags = (tags) => {
  if (!tags) return { isValid: true, error: null };
  
  const tagArray = Array.isArray(tags) ? tags : [tags];
  
  if (tagArray.length > VALIDATION_RULES.MAX_TAGS) {
    return { 
      isValid: false, 
      error: `Maximum ${VALIDATION_RULES.MAX_TAGS} tags allowed` 
    };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validate register form
 * @param {object} formData - Form data { name, email, password }
 * @returns {object} { isValid, errors }
 */
exports.validateRegisterForm = (formData) => {
  const errors = {};

  // Validate name
  const nameValidation = exports.validateName(formData.name);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.error;
  }

  // Validate email
  if (!formData.email || !formData.email.trim()) {
    errors.email = 'Email is required';
  } else if (!exports.isValidEmail(formData.email)) {
    errors.email = API_MESSAGES.VALIDATION_INVALID_EMAIL;
  }

  // Validate password
  const passwordValidation = exports.validatePassword(formData.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate login form
 * @param {object} formData - Form data { email, password }
 * @returns {object} { isValid, errors }
 */
exports.validateLoginForm = (formData) => {
  const errors = {};

  // Validate email
  if (!formData.email || !formData.email.trim()) {
    errors.email = 'Email is required';
  } else if (!exports.isValidEmail(formData.email)) {
    errors.email = API_MESSAGES.VALIDATION_INVALID_EMAIL;
  }

  // Validate password
  if (!formData.password) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate blog creation form
 * @param {object} formData - Form data { title, description, tags }
 * @returns {object} { isValid, errors }
 */
exports.validateBlogForm = (formData) => {
  const errors = {};

  // Validate title
  const titleValidation = exports.validateBlogTitle(formData.title);
  if (!titleValidation.isValid) {
    errors.title = titleValidation.error;
  }

  // Validate description
  const descValidation = exports.validateBlogDescription(formData.description);
  if (!descValidation.isValid) {
    errors.description = descValidation.error;
  }

  // Validate tags
  const tagsValidation = exports.validateTags(formData.tags);
  if (!tagsValidation.isValid) {
    errors.tags = tagsValidation.error;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
