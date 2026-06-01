const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Post = require("../models/Post");
const crypto = require("crypto");



// REGISTER

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } =
      req.body;

    const userExists =
      await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "User registered",
      user
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};



// LOGIN

exports.loginUser = async (req, res) => {

  try {

    const { email, password } =
      req.body;

    const user =
      await User.findOne({ email });

    if (!user) {

      return res.status(400).json({
        message: "Invalid email"
      });

    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {

      return res.status(400).json({
        message: "Invalid password"
      });

    }

    const token =
      jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

    // IMPORTANT — return role

    res.json({

      message:
        "Login successful",

      token,

      user: {

        _id: user._id,

        name: user.name,

        email: user.email,

        role: user.role

      }

    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

// LOGOUT

exports.logoutUser = async (req, res) => {
  try {
    res.json({
      message: "User logged out successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};



// GET CURRENT USER

exports.getMe = async (req, res) => {
  try {
    const user =
      await User.findById(
        req.user._id
      ).select("-password");

    res.json(user);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};



// CHANGE PASSWORD  ✅ separate function

exports.changePassword =
  async (req, res) => {

  try {

    const {
      oldPassword,
      newPassword
    } = req.body;

    const user =
      await User.findById(
        req.user._id
      );

    if (!user) {

      return res.status(404).json({
        message:
          "User not found"
      });

    }

    if (
      oldPassword === newPassword
    ) {

      return res.status(400).json({
        message:
          "New password must be different"
      });

    }

    if (
      newPassword.length < 6
    ) {

      return res.status(400).json({
        message:
          "Password must be at least 6 characters"
      });

    }

    const isMatch =
      await bcrypt.compare(
        oldPassword,
        user.password
      );

    if (!isMatch) {

      return res.status(400).json({
        message:
          "Old password is incorrect"
      });

    }

    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        10
      );

    user.password =
      hashedPassword;

    await user.save();

    res.json({

      message:
        "Password changed successfully"

    });

  } catch (error) {

    res.status(500).json({

      message:
        error.message

    });

  }

};


exports.forgotPassword = async (req, res) => {

  try {

    const { email } = req.body;

    const user =
      await User.findOne({ email });

    if (!user) {

      return res.status(404).json({
        message: "User not found"
      });

    }

    const resetToken =
      crypto.randomBytes(20)
      .toString("hex");

    user.resetPasswordToken =
      resetToken;

    user.resetPasswordExpire =
      Date.now() +
      10 * 60 * 1000;

    await user.save();

    res.json({

      message:
        "Reset token generated",

      token: resetToken

    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


exports.resetPassword = async (req, res) => {

  try {

    const { token } =
      req.params;

    const { password } =
      req.body;

    const user =
      await User.findOne({

        resetPasswordToken:
          token,

        resetPasswordExpire: {
          $gt: Date.now()
        }

      });

    if (!user) {

      return res.status(400).json({
        message:
          "Token expired"
      });

    }

    const bcrypt =
      require("bcryptjs");

    user.password =
      await bcrypt.hash(
        password,
        10
      );

    user.resetPasswordToken =
      undefined;

    user.resetPasswordExpire =
      undefined;

    await user.save();

    res.json({
      message:
        "Password reset successful"
    });

  } catch (error) {

    res.status(500).json({
      message:
        error.message
    });

  }

};


// UPDATE PROFILE

exports.updateProfile = async (req, res) => {

  try {

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const user =
      await User.findById(
        req.user._id
      );

    if (!user) {

      return res.status(404).json({
        message: "User not found"
      });

    }

    // NAME

    if (req.body?.name) {

      user.name =
        req.body.name;

    }

    // BIO

    if (req.body?.bio) {

      user.bio =
        req.body.bio;

    }

    // SOCIAL LINKS

    let socialLinks = {};

    if (req.body?.socialLinks) {

      try {

        socialLinks =
          typeof req.body.socialLinks === "string"
            ? JSON.parse(
                req.body.socialLinks
              )
            : req.body.socialLinks;

      } catch {

        socialLinks = {};

      }

    }

    user.socialLinks = socialLinks;

    // PROFILE IMAGE

    if (req.file) {

      const baseUrl =
        process.env.BASE_URL ||
        `${req.protocol}://${req.get("host")}`;

      user.profilePicture =
  `${baseUrl}/uploads/${req.file.filename}`;
      

    }

    await user.save();

    res.json({

      message:
        "Profile updated",

      user:user

    });

  } catch (error) {

    console.log(
      "PROFILE UPDATE ERROR:",
      error
    );

    res.status(500).json({

      message:
        error.message

    });

  }

};
// GET MY PROFILE


exports.getMyProfile = async (req, res) => {
  try {

    const user = await User.findById(
      req.user._id
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // DEBUG
    console.log("FULL USER:", user);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
     
      profilePicture: user.profilePicture,
      socialLinks: user.socialLinks
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

const fs = require("fs");
const path = require("path");

exports.uploadProfilePicture = async (req, res) => {

  try {

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded"
      });
    }

    // Find user
    const user = await User.findById(
      req.user._id
    );

    // DELETE OLD IMAGE (if exists)

    
    if (user.profilePicture) {

      const oldPath = path.join(
        __dirname,
        "..",
        "uploads",
        path.basename(user.profilePicture)
      );

      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }

    }

    // SAVE NEW IMAGE PATH

    const imagePath =
      "/uploads/" +
      req.file.filename;

    user.profilePicture =
      imagePath;

    await user.save();

    res.json({
      message:
        "Profile picture updated",
      profileImage:
        imagePath
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};



exports.savePost = async (req, res) => {

  try {

    const userId = req.user.id;

    const postId = req.params.id;

    const user =
      await User.findById(userId);

    const alreadySaved =
      user.savedPosts.some(
        (id) =>
          id.toString() === postId
      );

    if (alreadySaved) {

      return res.status(400).json({
        message: "Already saved"
      });

    }

    user.savedPosts.push(postId);

    await user.save();

    res.json({
      message:
        "Post saved successfully"
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

};
exports.getSavedPosts = async (req, res) => {
  try {

    const user =
      await User.findById(req.user.id)
      .populate("savedPosts");

    res.json(user.savedPosts);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
};



