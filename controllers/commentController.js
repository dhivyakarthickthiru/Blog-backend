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
      post: req.params.postId
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
      await Comment.findByIdAndUpdate(
        req.params.id,
        { text: req.body.text },
        {
          returnDocument: "after"
        }
      );

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
    await Comment.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Comment deleted"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
