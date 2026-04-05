const express = require("express");

const router = express.Router();

const {createComment,getComments,updateComment,deleteComment} = require("../controllers/commentController");

const {protect} = require("../middlewares/authMiddleware");


// Add comment routes

router.post("/",protect,createComment);


// Get comments by post routes

router.get("/post/:postId",getComments);


// Update comment routes

router.put("/:id",protect,updateComment);


// Delete comment routes

router.delete("/:id",protect,deleteComment);

module.exports = router;
