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

    let image = "";

    if (req.file) {

      const baseUrl =
        process.env.BASE_URL ||
        `${req.protocol}://${req.get("host")}`;

      image =
        `${baseUrl}/uploads/${req.file.filename}`;

    }

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
        author: req.user._id

      });

    // =========================
    // NOTIFICATION LOGIC
    // =========================

    const subscribers =
      await User.find({
        authorSubscriptions:
          req.user._id
      });

    // LOOP subscribers

    for (let subscriber of subscribers) {

      // skip self

      if (
        subscriber._id.toString() !==
        req.user._id.toString()
      ) {

        // check duplicate notification

        const exists =
          await Notification.findOne({

            recipient:
              subscriber._id,

            post:
              post._id,

            type:
              "new_post"

          });

        // create notification only if not exists

        if (!exists) {

          await Notification.create({

            recipient:
              subscriber._id,

            sender:
              req.user._id,

            post:
              post._id,

            message:
              "New post from user you subscribed",

            type:
              "new_post"

          });

        }

      }

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

    let filter = {
      status: "published"
    };

    if (category) {
      filter.category = category;
    }

    let user = null;

    if (req.user?._id) {
      user = await User
        .findById(req.user._id)
        .lean();
    }

    const posts =
      await Post.find(filter)
        .populate("category", "name")
        
        .populate(
          "author",
          "name profilePicture"
        )
        .sort({
          createdAt: -1
        })
        .lean();

    for (let post of posts) {

      const count =
        await Comment.countDocuments({
          post: post._id
        });

      post.commentsCount = count;

      post.bookmarked =
        user?.bookmarks?.some(
          (id) =>
            id.toString() ===
            post._id.toString()
        ) || false;

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

    const post =
      await Post.findByIdAndUpdate(

        req.params.id,

        {
          $inc: {
            views: 1
          }
        },

        {
          new: true
        }

      )

        .populate(
          "category",
          "name"
        )

        

        .populate(
          "author",
          "name profileImage"
        );

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

    // =========================
    // UPDATE POST
    // =========================

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
          new: true
        }
      );

    // =========================
    // NOTIFICATION LOGIC
    // =========================

    const subscribers =
      await User.find({
        authorSubscriptions:
          updatedPost.author
      });

    // LOOP subscribers

    for (let subscriber of subscribers) {

      // Skip self

      if (
        subscriber._id.toString() !==
        req.user._id.toString()
      ) {

        // Check duplicate notification

        const exists =
          await Notification.findOne({

            recipient:
              subscriber._id,

            post:
              updatedPost._id,

            type:
              "update_post"

          });

        // Create notification only if not exists

        if (!exists) {

          await Notification.create({

            recipient:
              subscriber._id,

            sender:
              req.user._id,

            post:
              updatedPost._id,

            message:
              "Post updated by subscribed user",

            type:
              "update_post"

          });

        }

      }

    }

    // =========================
    // RESPONSE
    // =========================

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
//add bookmark

exports.addBookmark = async (req, res) => {
  try {

    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const post = await Post.findById(
      req.params.id
    );

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    // SAFETY
    if (!user.bookmarks) {
      user.bookmarks = [];
    }

    const alreadyBookmarked =
      user.bookmarks.some(
        (id) =>
          id.toString() ===
          req.params.id.toString()
      );

    if (alreadyBookmarked) {
      return res.status(200).json({
        message: "Already bookmarked",
        totalBookmarks:
          user.bookmarks.length
      });
    }

    user.bookmarks.push(
      req.params.id
    );

    await user.save();

    res.json({
      message:
        "Post bookmarked successfully",
      totalBookmarks:
        user.bookmarks.length
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message
    });

  }
};

//remove bookmark
exports.removeBookmark = async (req, res) => {
  try {

    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (!user.bookmarks) {
      user.bookmarks = [];
    }

    const beforeCount =
      user.bookmarks.length;

    user.bookmarks =
      user.bookmarks.filter(
        (postId) =>
          postId.toString() !==
          req.params.id.toString()
      );

    await user.save();

    if (
      beforeCount ===
      user.bookmarks.length
    ) {
      return res.status(400).json({
        message: "Bookmark not found"
      });
    }

    res.json({
      message: "Bookmark removed",
      totalBookmarks:
        user.bookmarks.length
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message
    });

  }
};

//getbookmarks

exports.getMyBookmarks = async (req, res) => {
  try {

    const user = await User.findById(
      req.user._id
    ).populate({
      path: "bookmarks",
      model: "Post",
      populate: [
        {
          path: "category",
          select: "name"
        },
        {
          path: "author",
          select:
            "name email profilePicture"
        },
        {
          path: "tags",
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
      total:
        user.bookmarks?.length || 0,
      bookmarks:
        user.bookmarks || []
    });

  } catch (error) {

    console.log(error);

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


//get author page

const mongoose = require("mongoose");

exports.getAuthorPage = async (req, res) => {

  try {

    console.log("=== AUTHOR PAGE API HIT ===");

    const authorId = req.params.id;

    console.log("AUTHOR ID:", authorId);

    // =========================
    // FIND AUTHOR
    // =========================

    const author = await User.findById(
      authorId
    ).select("-password");

    if (!author) {

      return res.status(404).json({
        message: "Author not found"
      });

    }

    // =========================
    // FIND POSTS
    // =========================

    const posts = await Post.find({

      author:
        new mongoose.Types.ObjectId(
          authorId
        )

    })

      .populate(
        "category",
        "name"
      )

     

      .populate(
        "author",
        "name email profilePicture"
      )

      .sort({
        createdAt: -1
      });

    console.log(
      "FOUND POSTS:",
      posts.length
    );

    // =========================
    // TOTAL LIKES
    // =========================

    const totalLikes =
      posts.reduce(

        (acc, post) =>

          acc +
          (post.likes?.length || 0),

        0

      );

    // =========================
    // TOTAL VIEWS
    // =========================

    const totalViews =
      posts.reduce(

        (acc, post) =>

          acc +
          (post.views || 0),

        0

      );

    // =========================
    // TOTAL SHARES
    // =========================

    const totalShares =
      posts.reduce(

        (acc, post) =>

          acc +
          (post.shares || 0),

        0

      );

    // =========================
    // TOTAL COMMENTS
    // =========================

    let totalComments = 0;

    for (let post of posts) {

      const commentsCount =
        await Comment.countDocuments({

          post: post._id

        });

      // ADD COMMENT COUNT
      totalComments += commentsCount;

      // OPTIONAL
      // FRONTEND POST CARD USE

      post._doc.commentsCount =
        commentsCount;

    }

    // =========================
    // RESPONSE
    // =========================

    res.json({

      author: {

        ...author.toObject(),

        totalLikes,
        totalViews,
        totalComments,
        totalShares

      },

      totalPosts:
        posts.length,

      totalViews,

      posts

    });

  } catch (error) {

    console.log(
      "AUTHOR PAGE ERROR:"
    );

    console.log(error);

    res.status(500).json({

      message:
        error.message

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
exports.getDraftPosts = async (req, res) => {
  try {

    console.log("REQ USER:", req.user);
    console.log("USER ID:", req.user._id);

    const drafts = await Post.find({
      author: req.user._id,
      status: "draft"
    })
    .populate("category", "name")
    
    .populate("author", "name")
    .sort({ createdAt: -1 });

    console.log("DRAFT COUNT:", drafts.length);

    res.json(drafts);

  } catch (error) {

    console.log("DRAFT ERROR:", error);

    res.status(500).json({
      message: error.message
    });

  }
};


exports.publishPost = async (req, res) => {
  try {

    const post = await Post.findById(
      req.params.id
    );

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    // Change status

    post.status = "published";

    await post.save();

    res.json({
      message: "Post published successfully",
      post
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

exports.savePost =
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user._id
        );

      if (!user) {

        return res.status(404).json({
          message: "User not found"
        });

      }

      // SAFETY

      if (!user.savedPosts) {

        user.savedPosts = [];

      }

      const postId =
        req.params.id;

      const alreadySaved =
        user.savedPosts.some(

          (id) =>

            id.toString() ===
            postId.toString()

        );

      if (alreadySaved) {

        return res.status(400).json({

          message:
            "Post already saved"

        });

      }

      user.savedPosts.push(
        postId
      );

      await user.save();

      res.json({

        message:
          "Post saved successfully"

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          error.message

      });

    }

  };

 exports.getSavedPosts =
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user._id
        ).populate(
          "savedPosts"
        );

      if (!user) {

        return res.status(404).json({
          message: "User not found"
        });

      }

      res.json(
        user.savedPosts || []
      );

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          error.message

      });

    }

  }; 