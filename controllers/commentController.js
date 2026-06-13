const Comment =
  require("../models/Comment");

const Post =
  require("../models/Post");

const sendEmail =
  require("../utils/mail");  


// CREATE COMMENT

exports.createComment =
  async (req, res) => {

  try {

    console.log(
      "BODY:",
      req.body
    );

    console.log(
      "USER:",
      req.user
    );

    const {
      content,
      post,
       parentComment
    } =
      req.body;

     console.log(
  "PARENT COMMENT:",
  parentComment
);
 

    // VALIDATION

    if (!content) {

      return res.status(400).json({
        message:
          "Comment text required"
      });

    }

    if (!post) {

      return res.status(400).json({
        message:
          "Post id required"
      });

    }

    // CHECK POST

    const postExists =
      await Post.findById(
        post
      ).populate("author");

    if (!postExists) {

      return res.status(404).json({
        message:
          "Post not found"
      });

    }

    // CREATE COMMENT

    const comment =
      await Comment.create({

        text: content,   // IMPORTANT FIX

        post,

        user:
          req.user._id,
          parentComment:
      parentComment || null
  

      });


      const populatedComment =
  await Comment.findById(
    comment._id
  ).populate(
    "user",
    "name"
  );
  
  console.log(
  "COMMENT CREATED"
);

console.log(
  "POPULATED COMMENT:",
  populatedComment
);

      // ADD HERE 👇


   

//await sendEmail(

  // postExists.author.email,

 // "New Comment",

 // "Someone commented 😄"

// );
      

    res.status(201).json(
      populatedComment
    );

  } catch (error) {

    console.log(
      "CREATE COMMENT ERROR:"
    );

    console.log(error);

    res.status(500).json({
      message:
        error.message
    });

  }

};

exports.getComments =
  async (req, res) => {

  try {

    const comments =
      await Comment.find({

        post:
          req.params.postId,

        isApproved: true

      })
      .populate(
        "user",
        "name"
      )
      .sort({
        createdAt: -1
      });

    res.json(
      comments
    );

  } catch (error) {

    res.status(500).json({
      message:
        error.message
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