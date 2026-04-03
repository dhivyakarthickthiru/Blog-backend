const express = require("express");

const router =
  express.Router();

const {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  changePassword
} = require(
  "../controllers/authController"
);

const {
  protect
} = require(
  "../middlewares/authMiddleware"
);


// Register

router.post(
  "/register",
  registerUser
);


// Login

router.post(
  "/login",
  loginUser
);


// Logout

router.post(
  "/logout",
  logoutUser
);


// Get current user

router.get(
  "/me",
  protect,
  getMe
);

router.put(
  "/change-password",
  protect,
  changePassword
);

module.exports = router;
