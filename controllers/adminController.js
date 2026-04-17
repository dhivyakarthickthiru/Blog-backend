const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Category = require("../models/Category");


// ===============================
// GET ADMIN DASHBOARD STATS
// ===============================

exports.getAdminStats = async (
  req,
  res
) => {

  try {

    // Count users

    const totalUsers =
      await User.countDocuments();

    // Count posts

    const totalPosts =
      await Post.countDocuments();

    // Count comments

    const totalComments =
      await Comment.countDocuments();

    // Count categories

    const totalCategories =
      await Category.countDocuments();

    // Send response

    res.json({

      totalUsers,

      totalPosts,

      totalComments,

      totalCategories

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      message:
        error.message

    });

  }

};



// ===============================
// DELETE ANY POST (ADMIN)
// ===============================

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
        "Post deleted by admin"

    });

  } catch (error) {

    res.status(500).json({

      message:
        error.message

    });

  }

};