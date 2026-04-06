const Comment = require("../models/Comment");


// ADD COMMENT

exports.createComment = async (req, res) => {
  try {
    const { text, post } = req.body;

    const comment = await Comment.create({
      text,
      post,
      user: req.user._id
    });

    res.status(201).json({
      message: "Comment added",
      comment
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};



// GET COMMENTS BY POST

exports.getComments = async (req, res) => {
  try {

    const comments = await Comment.find({
      post: req.params.postId,
      isApproved: true
    })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json(comments);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};



// UPDATE COMMENT

exports.updateComment = async (req, res) => {
  try {

    const comment =
      await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found"
      });
    }

    if (
      comment.user.toString() !==
      req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Not authorized"
      });
    }

    comment.text = req.body.text;

    await comment.save();

    res.json({
      message: "Comment updated",
      comment
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// DELETE COMMENT

exports.deleteComment = async (req, res) => {
  try {

    const comment =
      await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found"
      });
    }

    if (
      comment.user.toString() !==
      req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Not authorized"
      });
    }

    await comment.deleteOne();

    res.json({
      message: "Comment deleted"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
//approved admins


exports.approveComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { returnDocument: "after" }
    );

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found"
      });
    }

    res.json({
      message: "Comment approved",
      comment
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};