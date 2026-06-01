const express = require("express");

const router =
  express.Router();

const {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  changePassword,
  forgotPassword,
  resetPassword,
  updateProfile,
  getMyProfile,
   uploadProfilePicture,
    savePost,
    getSavedPosts,
   


  
} = require(
  "../controllers/authController"
);

const upload =
require("../middlewares/uploadMiddleware");
 

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
  changePassword,
  
  
);

router.post(
  "/forgot-password",
  forgotPassword
);


router.put(
  "/reset-password/:token",
  resetPassword
);



// GET PROFILE

router.get(
  "/profile",
  protect,
  getMyProfile
);

// UPDATE PROFILE

router.put(
  "/profile",
  protect,
  upload.single("profileImage"),
  updateProfile
);

router.put(
  "/upload-profile-picture",
  protect,
  upload.single("profileImage"),
  uploadProfilePicture
);


router.post(
  "/save/:id",
  protect,
  savePost
);

router.get(
  "/saved-posts",
  protect,
  getSavedPosts
);



module.exports = router;
