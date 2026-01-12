const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: [String],
    comments: [commentSchema],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

blogSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Blog", blogSchema);
