/**
 * Blog Service
 * Handles all blog-related business logic
 */

const Blog = require('../models/Blog');
const { validateBlogForm, validateCommentText } = require('../validators');
const { isAuthor, parseSortQuery } = require('../utils');
const { API_MESSAGES, HTTP_STATUS } = require('../constants/messages');

/**
 * Create a new blog
 * @param {string} userId - User ID
 * @param {object} blogData - Blog data { title, description, tags }
 * @returns {Promise<object>} Created blog
 */
exports.createBlog = async (userId, blogData) => {
  // Validate input
  const validation = validateBlogForm(blogData);
  if (!validation.isValid) {
    const error = new Error(API_MESSAGES.VALIDATION_ERROR);
    error.status = HTTP_STATUS.BAD_REQUEST;
    error.errors = validation.errors;
    throw error;
  }

  const { title, description, tags } = blogData;

  const blog = new Blog({
    title,
    description,
    tags: Array.isArray(tags) ? tags : tags ? tags.split(',').map(t => t.trim()) : [],
    author: userId,
  });

  await blog.save();

  // Populate author information
  await blog.populate('author', 'name email');

  return blog;
};

/**
 * Get all blogs with optional filters
 * @param {object} filters - Filter options { tag, sort, search }
 * @returns {Promise<array>} Blogs array
 */
exports.getAllBlogs = async (filters = {}) => {
  const query = {};

  // Filter by tag
  if (filters.tag) {
    query.tags = filters.tag;
  }

  // Search in title or description
  if (filters.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: 'i' } },
      { description: { $regex: filters.search, $options: 'i' } },
    ];
  }

  // Parse sort
  const sort = parseSortQuery(filters.sort);

  const blogs = await Blog.find(query)
    .populate('author', 'name email')
    .sort(sort)
    .lean();

  return blogs;
};

/**
 * Get blog by ID
 * @param {string} blogId - Blog ID
 * @returns {Promise<object>} Blog document
 */
exports.getBlogById = async (blogId) => {
  const blog = await Blog.findById(blogId)
    .populate('author', 'name email')
    .populate('comments.user', 'name email');

  if (!blog) {
    const error = new Error(API_MESSAGES.BLOG_NOT_FOUND);
    error.status = HTTP_STATUS.NOT_FOUND;
    throw error;
  }

  return blog;
};

/**
 * Update blog
 * @param {string} userId - User ID
 * @param {string} blogId - Blog ID
 * @param {object} updateData - Update data { title, description, tags }
 * @returns {Promise<object>} Updated blog
 */
exports.updateBlog = async (userId, blogId, updateData) => {
  const blog = await Blog.findById(blogId);

  if (!blog) {
    const error = new Error(API_MESSAGES.BLOG_NOT_FOUND);
    error.status = HTTP_STATUS.NOT_FOUND;
    throw error;
  }

  // Check if user is author
  if (!isAuthor(userId, blog.author)) {
    const error = new Error(API_MESSAGES.BLOG_UNAUTHORIZED);
    error.status = HTTP_STATUS.FORBIDDEN;
    throw error;
  }

  // Validate input
  const validation = validateBlogForm(updateData);
  if (!validation.isValid) {
    const error = new Error(API_MESSAGES.VALIDATION_ERROR);
    error.status = HTTP_STATUS.BAD_REQUEST;
    error.errors = validation.errors;
    throw error;
  }

  // Update fields
  blog.title = updateData.title;
  blog.description = updateData.description;
  blog.tags = Array.isArray(updateData.tags)
    ? updateData.tags
    : updateData.tags ? updateData.tags.split(',').map(t => t.trim()) : [];

  await blog.save();

  // Populate author information
  await blog.populate('author', 'name email');

  return blog;
};

/**
 * Delete blog
 * @param {string} userId - User ID
 * @param {string} blogId - Blog ID
 * @returns {Promise<void>}
 */
exports.deleteBlog = async (userId, blogId) => {
  const blog = await Blog.findById(blogId);

  if (!blog) {
    const error = new Error(API_MESSAGES.BLOG_NOT_FOUND);
    error.status = HTTP_STATUS.NOT_FOUND;
    throw error;
  }

  // Check if user is author
  if (!isAuthor(userId, blog.author)) {
    const error = new Error(API_MESSAGES.BLOG_UNAUTHORIZED);
    error.status = HTTP_STATUS.FORBIDDEN;
    throw error;
  }

  await Blog.findByIdAndDelete(blogId);
};

/**
 * Add comment to blog
 * @param {string} userId - User ID
 * @param {string} blogId - Blog ID
 * @param {string} text - Comment text
 * @returns {Promise<object>} Updated blog
 */
exports.addComment = async (userId, blogId, text) => {
  // Validate comment text
  const validation = validateCommentText(text);
  if (!validation.isValid) {
    const error = new Error(validation.error);
    error.status = HTTP_STATUS.BAD_REQUEST;
    throw error;
  }

  const blog = await Blog.findById(blogId);

  if (!blog) {
    const error = new Error(API_MESSAGES.BLOG_NOT_FOUND);
    error.status = HTTP_STATUS.NOT_FOUND;
    throw error;
  }

  // Add comment
  blog.comments.push({
    user: userId,
    text,
  });

  await blog.save();

  // Populate for response
  await blog.populate('author', 'name email');
  await blog.populate('comments.user', 'name email');

  return blog;
};

/**
 * Delete comment from blog
 * @param {string} userId - User ID
 * @param {string} blogId - Blog ID
 * @param {string} commentId - Comment ID
 * @returns {Promise<object>} Updated blog
 */
exports.deleteComment = async (userId, blogId, commentId) => {
  const blog = await Blog.findById(blogId);

  if (!blog) {
    const error = new Error(API_MESSAGES.BLOG_NOT_FOUND);
    error.status = HTTP_STATUS.NOT_FOUND;
    throw error;
  }

  // Find comment
  const comment = blog.comments.id(commentId);
  if (!comment) {
    const error = new Error(API_MESSAGES.COMMENT_NOT_FOUND);
    error.status = HTTP_STATUS.NOT_FOUND;
    throw error;
  }

  // Check if user is comment author
  if (!isAuthor(userId, comment.user)) {
    const error = new Error(API_MESSAGES.BLOG_UNAUTHORIZED);
    error.status = HTTP_STATUS.FORBIDDEN;
    throw error;
  }

  // Delete comment
  blog.comments.id(commentId).remove();
  await blog.save();

  // Populate for response
  await blog.populate('author', 'name email');
  await blog.populate('comments.user', 'name email');

  return blog;
};

/**
 * Like blog
 * @param {string} userId - User ID
 * @param {string} blogId - Blog ID
 * @returns {Promise<object>} Updated blog
 */
exports.likeBlog = async (userId, blogId) => {
  const blog = await Blog.findById(blogId);

  if (!blog) {
    const error = new Error(API_MESSAGES.BLOG_NOT_FOUND);
    error.status = HTTP_STATUS.NOT_FOUND;
    throw error;
  }

  // Check if already liked
  if (!blog.likes.includes(userId)) {
    blog.likes.push(userId);
    await blog.save();
  }

  // Populate for response
  await blog.populate('author', 'name email');
  await blog.populate('comments.user', 'name email');

  return blog;
};

/**
 * Unlike blog
 * @param {string} userId - User ID
 * @param {string} blogId - Blog ID
 * @returns {Promise<object>} Updated blog
 */
exports.unlikeBlog = async (userId, blogId) => {
  const blog = await Blog.findById(blogId);

  if (!blog) {
    const error = new Error(API_MESSAGES.BLOG_NOT_FOUND);
    error.status = HTTP_STATUS.NOT_FOUND;
    throw error;
  }

  // Remove like
  blog.likes = blog.likes.filter(id => !isAuthor(userId, id));
  await blog.save();

  // Populate for response
  await blog.populate('author', 'name email');
  await blog.populate('comments.user', 'name email');

  return blog;
};
