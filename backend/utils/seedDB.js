const User = require("../models/User");
const Blog = require("../models/Blog");
const bcrypt = require("bcrypt");

module.exports = async () => {
  const usersCount = await User.countDocuments();
  const blogsCount = await Blog.countDocuments();

  if (usersCount === 0) {
    const DEFAULT_USER_EMAIL =
      process.env.DEFAULT_USER_EMAIL || "admin@example.com";
    const DEFAULT_PASSWORD = process.env.DEFAULT_USER_PASSWORD || "admin123";
    const DEFAULT_USER_NAME = process.env.DEFAULT_USER_NAME || "admin";

    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
    const user = new User({
      name: DEFAULT_USER_NAME,
      email: DEFAULT_USER_EMAIL,
      passwordHash,
    });
    await user.save();
    console.log("Admin is created:", DEFAULT_USER_EMAIL);

    // create a sample blog
    const blog = new Blog({
      title: "Welcome to the blog",
      description: "This is the first default post.",
      author: user._id,
      tags: ["welcome", "first"],
    });
    await blog.save();
    console.log("First blog created");
  } else if (blogsCount === 0) {
    // If users exist but no blogs
    const user = await User.findOne();
    const blog = new Blog({
      title: "Welcome to the blog",
      description: "This is the first default post.",
      author: user._id,
      tags: ["welcome", "first"],
    });
    await blog.save();
    console.log("First blog created (no blogs existed)");
  } else {
    // nothing to do
  }
};
