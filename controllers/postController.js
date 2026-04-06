const Post = require("../models/Post");


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
