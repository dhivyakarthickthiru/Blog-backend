const express = require("express");

const router = express.Router();

const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  incrementPostViews


} = require("../controllers/postController");

const {
  protect
} = require("../middlewares/authMiddleware");

const {
  likePost,
  unlikePost,
  getLikesCount
} = require("../controllers/postController");


// Create Post

router.post("/",protect,createPost);


// Get Posts

router.get("/",getPosts);


// Get Single Post

router.get("/:id", getPostById);


// Update Post

router.put("/:id", protect, updatePost);


// Delete Post

router.delete("/:id", protect, deletePost);

// increment views route

router.put("/:id/view",incrementPostViews);


// Like post

router.post("/:id/like",protect,likePost);

// Unlike post

router.delete("/:id/unlike",protect,unlikePost);

// Get likes count

router.get("/:id/likes",getLikesCount);

module.exports = router;
