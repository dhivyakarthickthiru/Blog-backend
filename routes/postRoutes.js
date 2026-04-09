const express = require("express");

const router = express.Router();

const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  incrementPostViews,
  addBookmark,
  removeBookmark,
  getMyBookmarks,
  searchPosts,
  likePost,
  unlikePost,
  getLikesCount,
  getPostAnalytics,
  incrementShare
} = require("../controllers/postController");

const {
  protect
} = require("../middlewares/authMiddleware");


// =============================
// SPECIAL ROUTES FIRST
// =============================

// Search posts

router.get("/search", searchPosts);

// Get my bookmarks

router.get("/my/bookmarks", protect, getMyBookmarks);


// =============================
// BASIC CRUD
// =============================

// Create Post

router.post("/", protect, createPost);

// Get all posts

router.get("/", getPosts);

router.get("/:id/analytics",getPostAnalytics);


// SHARE POST //

router.put("/:id/share",incrementShare);


// Get single post

router.get("/:id", getPostById);

// Update post

router.put("/:id", protect, updatePost);

// Delete post

router.delete("/:id", protect, deletePost);


// =============================
// EXTRA FEATURES
// =============================

// Increment views

router.put("/:id/view", incrementPostViews);

// Like post

router.post("/:id/like", protect, likePost);

// Unlike post

router.delete("/:id/unlike", protect, unlikePost);

// Get likes count

router.get("/:id/likes", getLikesCount);

// Add bookmark

router.post("/:id/bookmark", protect, addBookmark);

// Remove bookmark

router.delete("/:id/bookmark", protect, removeBookmark);



module.exports = router;
