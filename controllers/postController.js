const Post = require("../models/Post");
<<<<<<< HEAD
=======
const Notification = require("../models/Notification");
>>>>>>> main
const User = require("../models/User");


// 1️⃣ CREATE POST

exports.createPost = async (req, res) => {
  try {
    let {
      title,
      content,
      category,
      tags,
      status
    } = req.body;

    // Ensure tags is always array
    if (typeof tags === "string") {
      tags = [tags];
    }

    const post = await Post.create({
      title,
      content,
      category,
      tags,
      status,
      author: req.user._id
    });


   // NOTIFICATION LOGIC

const subscribers = await User.find({
  subscriptions: req.user._id
});

for (const subscriber of subscribers) {

  await Notification.create({
    recipient: subscriber._id,
    sender: req.user._id,
    post: post._id,
    message: "New post from user you subscribed"
  });

} 

    res.status(201).json({
      message: "Post created",
      post
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};



// 2️⃣ GET ALL POSTS

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("category", "name")
      .populate("tags", "name")
      .populate("author", "name");

    res.json(posts);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};



// 3️⃣ GET SINGLE POST

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("category", "name")
      .populate("tags", "name")
      .populate("author", "name");

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    res.json(post);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};



// 4️⃣ UPDATE POST (Owner OR Admin)

exports.updatePost = async (req, res) => {
  try {
    let {
      title,
      content,
      category,
      tags,
      status
    } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    // Permission check
    if (
      post.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Not authorized to update this post"
      });
    }

    // Ensure tags array
    if (typeof tags === "string") {
      tags = [tags];
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        category,
        tags,
        status
      },
      {
        returnDocument: "after"
      }
    );

    res.json({
      message: "Post updated",
      post: updatedPost
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};



// 5️⃣ DELETE POST (Owner OR Admin)

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    // Permission check
    if (
      post.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Not authorized to delete this post"
      });
    }

    await post.deleteOne();

    res.json({
      message: "Post deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

//increment views

exports.incrementPostViews = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $inc: { views: 1 }
      },
      {
        returnDocument: "after"
      }
    );

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    res.json({
      message: "View counted",
      views: post.views
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

//likes views

exports.likePost = async (req, res) => {
  try {

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    // Check if already liked

    if (post.likes.includes(req.user._id)) {
      return res.status(400).json({
        message: "You already liked this post"
      });
    }

    post.likes.push(req.user._id);

    await post.save();

    res.json({
      message: "Post liked",
      totalLikes: post.likes.length
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

//unlike post

exports.unlikePost = async (req, res) => {
  try {

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    post.likes = post.likes.filter(
      (userId) =>
        userId.toString() !== req.user._id.toString()
    );

    await post.save();

    res.json({
      message: "Post unliked",
      totalLikes: post.likes.length
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

//get likes count

exports.getLikesCount = async (req, res) => {
  try {

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    res.json({
      totalLikes: post.likes.length
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
exports.addBookmark = async (req, res) => {
  try {

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // check post exists

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    // already bookmarked

    if (user.bookmarks.includes(req.params.id)) {
      return res.status(400).json({
        message: "Post already bookmarked"
      });
    }

    user.bookmarks.push(req.params.id);

    await user.save();

    res.json({
      message: "Post bookmarked successfully",
      totalBookmarks: user.bookmarks.length
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.removeBookmark = async (req, res) => {
  try {

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const beforeCount = user.bookmarks.length;

    user.bookmarks = user.bookmarks.filter(
      (postId) =>
        postId.toString() !== req.params.id
    );

    await user.save();

    if (beforeCount === user.bookmarks.length) {
      return res.status(400).json({
        message: "Bookmark not found"
      });
    }

    res.json({
      message: "Bookmark removed",
      totalBookmarks: user.bookmarks.length
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.getMyBookmarks = async (req, res) => {
  try {

    const user = await User.findById(req.user._id)
      .populate({
        path: "bookmarks",
        model: "Post",   // IMPORTANT
        populate: [
          {
            path: "category",
            model: "Category",
            select: "name"
          },
          {
            path: "author",
            model: "User",
            select: "name email"
          },
          {
            path: "tags",
            model: "Tag",
            select: "name"
          }
        ]
      });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      total: user.bookmarks.length,
      bookmarks: user.bookmarks
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// SEARCH POSTS

exports.searchPosts = async (req, res) => {
  try {

    const keyword = req.query.keyword;

    // If no keyword

    if (!keyword) {
      return res.status(400).json({
        message: "Please provide search keyword"
      });
    }

    const posts = await Post.find({
      $or: [
        {
          title: {
            $regex: keyword,
            $options: "i"
          }
        },
        {
          content: {
            $regex: keyword,
            $options: "i"
          }
        }
      ]
    })
      .populate("category", "name")
      .populate("tags", "name")
      .populate("author", "name");

    res.json({
      total: posts.length,
      posts
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};