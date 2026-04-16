const Post = require("../models/Post");
const Notification = require("../models/Notification");
const User = require("../models/User");
const Comment = require("../models/Comment");



// 1️⃣ CREATE POST

exports.createPost = async (req, res) => {
  try {

    console.log("USER:", req.user);
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    let {
      title,
      content,
      category,
      tags,
      status
    } = req.body;

    // =========================
    // VALIDATION
    // =========================

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content required"
      });
    }

    // =========================
    // DEFAULT VALUES
    // =========================

    if (!category) {
      category = null;
    }

    if (!tags) {
      tags = [];
    }

    if (typeof tags === "string") {
      tags = [tags];
    }

    if (!status) {
      status = "draft";
    }

    // =========================
    // IMAGE HANDLING
    // =========================

    const image =
      req.file
        ? req.file.filename
        : "";

    // =========================
    // CREATE POST
    // =========================

    const post =
      await Post.create({

        title,
        content,
        category,
        tags,
        status,
        image,
        author:
          req.user._id

      });

    // =========================
    // NOTIFICATION LOGIC
    // =========================

    const subscribers =
      await User.find({
        subscriptions:
          req.user._id
      });

    const notifications =
      subscribers
        .filter(
          (subscriber) =>
            subscriber._id.toString() !==
            req.user._id.toString()
        )
        .map(
          (subscriber) => ({

            recipient:
              subscriber._id,

            sender:
              req.user._id,

            post:
              post._id,

            message:
              "New post from user you subscribed"

          })
        );

    if (
      notifications.length > 0
    ) {

      await Notification.insertMany(
        notifications
      );

    }

    // =========================
    // RESPONSE
    // =========================

    res.status(201).json({

      message:
        "Post created successfully",

      post

    });

  } catch (error) {

    console.log(
      "CREATE POST ERROR:"
    );

    console.log(error);

    res.status(500).json({

      message:
        error.message

    });

  }
};


// GET MY POSTS

exports.getMyPosts = async (req, res) => {

  try {

    const posts =
      await Post.find({

        author: req.user._id

      })
        .populate(
          "category",
          "name"
        )
        .populate(
          "author",
          "name"
        );

    res.json(posts);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};
// 2️⃣ GET ALL POSTS
// 2️⃣ GET ALL POSTS WITH CATEGORY FILTER
exports.getPosts = async (req, res) => {
  try {

    const { category } = req.query;

    let filter = {};

    if (category) {
      filter.category = category;
    }

    // user optional (safety)

    let user = null;

    if (req.user) {
      user = await User.findById(req.user._id);
    
    }
     console.log("USER BOOKMARKS:", user?.bookmarks); 

    const posts =
      await Post.find(filter)
        .populate("category", "name")
        .populate("tags", "name")
        .populate("author", "name")
        .sort({ createdAt: -1 })
        .lean();

    // SINGLE LOOP (optimized)

    for (let post of posts) {

      // comments count

      const count =
        await Comment.countDocuments({
          post: post._id
        });

      post.commentsCount = count;

      // bookmarked check

      if (user) {

        const isBookmarked =
          user.bookmarks.some(
            (id) =>
              id.toString() ===
              post._id.toString()
          );

        post.bookmarked = isBookmarked;

      } else {

        post.bookmarked = false;

      }

    }

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

    const post = await Post.findById(
      req.params.id
    );

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    // Permission check

    if (
      post.author.toString() !==
        req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message:
          "Not authorized to update this post"
      });
    }

    // Ensure tags array

    if (typeof tags === "string") {
      tags = [tags];
    }

    // Update post

    const updatedPost =
      await Post.findByIdAndUpdate(
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

    // =========================
    // NOTIFICATION LOGIC
    // =========================

    const subscribers =
      await User.find({
        subscriptions:
          updatedPost.author
      });

    const notifications =
      subscribers
        .filter(
          (subscriber) =>
            subscriber._id.toString() !==
            req.user._id.toString()
        )
        .map((subscriber) => ({
          recipient:
            subscriber._id,
          sender: req.user._id,
          post: updatedPost._id,
          message:
            "Post updated by subscribed user"
        }));

    if (notifications.length > 0) {
      await Notification.insertMany(
        notifications
      );
    }

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


exports.getMostViewedPosts =
  async (req, res) => {

  try {

    const posts =
      await Post.find()

        .sort({
          views: -1
        })

        .limit(5)

        .populate(
          "author",
          "name"
        )

        .select(
          "title views image author"
        );

    res.json({
      success: true,
      count: posts.length,
      posts
    });

  } catch (error) {

    console.log(
      "Most viewed error:",
      error
    );

    res.status(500).json({
      message: error.message
    });

  }

};

//likes views

exports.likePost =
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

    const userId =
      req.user._id.toString();

    const alreadyLiked =
      post.likes.some(
        (id) =>
          id.toString() === userId
      );

    // If already liked
    if (alreadyLiked) {

      return res.json({
        message:
          "Already liked",
        totalLikes:
          post.likes.length
      });

    }

    // Add like

    post.likes.push(
      req.user._id
    );

    await post.save();

    res.json({

      message:
        "Post liked",

      totalLikes:
        post.likes.length

    });

  } catch (error) {

    res.status(500).json({
      message:
        error.message
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
      const alreadyBookmarked =
      user.bookmarks.some(
        (id) => id.toString() === req.params.id
      );

        if (alreadyBookmarked) {
      return res.status(200).json({
        message: "Already bookmarked"
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

// GET POST ANALYTICS

exports.getPostAnalytics =
  async (req, res) => {

  try {

    const postId =
      req.params.id;

    const post =
      await Post.findById(
        postId
      );

    if (!post) {

      return res.status(404).json({
        message:
          "Post not found"
      });

    }

    // ======================
    // COUNT COMMENTS
    // ======================

    const commentsCount =
      await Comment.countDocuments({
        post: postId
      });

    // ======================
    // RESPONSE
    // ======================

    res.json({

      views:
        post.views || 0,

      likes:
        post.likes?.length || 0,

      comments:
        commentsCount || 0,

      shares:
        post.shares || 0

    });

  } catch (error) {

    console.log(
      "Analytics error:",
      error
    );

    res.status(500).json({
      message:
        error.message
    });

  }

};
// INCREMENT SHARE COUNT

exports.incrementShare =
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

    post.shares += 1;

    await post.save();

    res.json({

      totalShares:
        post.shares

    });

  } catch (error) {

    res.status(500).json({
      message:
        error.message
    });

  }

};