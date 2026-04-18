const express =
  require("express");

const router =
  express.Router();

const {
  protect,
  adminOnly
} = require(
  "../middlewares/authMiddleware"
);

const {
  getAllPosts,
  deletePostByAdmin,
  getAllUsers,
  deleteUser,
  getMostViewedPosts

} = require(
  "../controllers/adminController"
);


// ============================
// GET ALL POSTS
// ============================

router.get(
  "/posts",
  protect,
  adminOnly,
  getAllPosts
);


// ============================
// DELETE POST
// ============================

router.delete(
  "/post/:id",
  protect,
  adminOnly,
  deletePostByAdmin
);


// ============================
// GET ALL USERS
// ============================

router.get(
  "/users",
  protect,
  adminOnly,
  getAllUsers

);


// ============================
// DELETE USER
// ============================

router.delete(
  "/user/:id",
  protect,
  adminOnly,
  deleteUser
);

router.get(
  "/most-viewed",
  protect,
  adminOnly,
  getMostViewedPosts
);


module.exports = router;