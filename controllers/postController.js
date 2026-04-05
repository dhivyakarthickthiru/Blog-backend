const Post = require("../models/Post");


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

// GET SINGLE POST

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

// UPDATE POST

exports.updatePost = async (req, res) => {
  try {
    const {
      title,
      content,
      category,
      tags,
      status
    } = req.body;

    const post = await Post.findByIdAndUpdate(
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

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    res.json({
      message: "Post updated",
      post
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// DELETE POST

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(
      req.params.id
    );

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    res.json({
      message: "Post deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
