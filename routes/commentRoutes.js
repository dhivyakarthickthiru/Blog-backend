const express = require("express");

const router = express.Router();

const {createComment,getComments,updateComment,deleteComment,approveComment} = require("../controllers/commentController");

const {protect,adminOnly} = require("../middlewares/authMiddleware");


// 1️⃣ Create Comment (User login required)

router.post(
  "/",
  protect,
  createComment
);


// 2️⃣ Get Comments by Post (Public)

router.get(
  "/post/:postId",
  getComments
);


// 3️⃣ Update Comment (Owner OR Admin)

router.put(
  "/:id",
  protect,
  updateComment
);


// 4️⃣ Delete Comment (Owner OR Admin)

router.delete(
  "/:id",
  protect,
  deleteComment
);


// 5️⃣ Approve Comment (Admin only)

router.put(
  "/approve/:id",
  protect,
  adminOnly,
  approveComment
);


module.exports = router;
