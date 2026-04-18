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

    const {
      name,
      bio,
      profilePicture,
      socialLinks
    } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,

      {
        name,
        bio,
        profilePicture,
        socialLinks
      },

      {
        returnDocument: "after"
      }

    ).select("-password");

    res.json({
      message: "Profile updated successfully",
      user
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
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
      profilePicture:
        imagePath
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};



exports.getAuthorPage = async (req, res) => {
  try {

    const authorId = req.params.id;

    console.log("AUTHOR ID:", authorId);

    const author = await User.findById(
      authorId
    ).select("-password");

    if (!author) {
      return res.status(404).json({
        message: "Author not found"
      });
    }

    const posts = await Post.find({
      author: authorId
    })
      .populate("category", "name")
      .populate("tags", "name")
      .sort({ createdAt: -1 });

    res.json({
      author,
      totalPosts: posts.length,
      posts
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};
