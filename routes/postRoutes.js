const express = require("express");

const router = express.Router();

const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost


} = require("../controllers/postController");

const {
  protect
} = require("../middlewares/authMiddleware");


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

module.exports = router;
