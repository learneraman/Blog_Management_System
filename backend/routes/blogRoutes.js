const express = require("express");
const { body } = require("express-validator");
const blogController = require("../controllers/blogController");
const auth = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/blogs", blogController.getAll);
router.get("/blogs/:id", blogController.getById);

router.post(
  "/blogs",
  auth,
  [
    body("title").notEmpty().withMessage("Title required"),
    body("description").notEmpty().withMessage("Description required"),
  ],
  blogController.createBlog
);

router.put("/blogs/:id", auth, blogController.updateBlog);
router.delete("/blogs/:id", auth, blogController.deleteBlog);

// Comments
router.post("/blogs/:id/comments", auth, blogController.addComment);
router.delete("/blogs/:id/comments/:commentId", auth, blogController.deleteComment);

// Likes
router.post("/blogs/:id/like", auth, blogController.likeBlog);
router.post("/blogs/:id/unlike", auth, blogController.unlikeBlog);

module.exports = router;
