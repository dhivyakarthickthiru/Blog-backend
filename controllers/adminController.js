const User = require("../models/User");
const Post = require("../models/Post");

// ============================
// GET ALL POSTS (ADMIN)
// ============================

exports.getAllPosts = async (
  req,
  res
) => {

  try {

    const posts =
      await Post.find()
        .populate(
          "author",
          "name email"
        )
        .sort({
          createdAt: -1
        });

    res.json(posts);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};



// ============================
// DELETE ANY POST (ADMIN)
// ============================

exports.deletePostByAdmin =
  async (req, res) => {

  try {

    const post =
      await Post.findById(
        req.params.id
      );

    if (!post) {

      return res.status(404).json({
        message:
          "Post not found"
      });

    }

    await post.deleteOne();

    res.json({
      message:
        "Post deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      message:
        error.message
    });

  }

};



// ============================
// GET ALL USERS (ADMIN)
// ============================

exports.getAllUsers =
  async (req, res) => {

  try {

    const users =
      await User.find()
        .select("-password");

    res.json(users);

  } catch (error) {

    res.status(500).json({
      message:
        error.message
    });

  }

};



// ============================
// DELETE USER (ADMIN)
// ============================

exports.deleteUser =
  async (req, res) => {

  try {

    const user =
      await User.findById(
        req.params.id
      );

    if (!user) {

      return res.status(404).json({
        message:
          "User not found"
      });

    }

    await user.deleteOne();

    res.json({
      message:
        "User deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      message:
        error.message
    });

  }

};

exports.getMostViewedPosts =
  async (req, res) => {

  try {

    const posts =
      await Post.find()
        .populate("author", "name")
        .sort({ views: -1 })
        .limit(5);

    res.json(posts);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};