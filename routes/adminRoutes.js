const express =
  require("express");

const router =
  express.Router();

const {
  protect,
  adminOnly
} = require(
  "../middlewares/authMiddleware"
);

const {
  getAdminStats,
  deletePostByAdmin
} = require(
  "../controllers/adminController"
);


// ===============================
// GET ADMIN DASHBOARD STATS
// ===============================

router.get(
  "/stats",
  protect,
  adminOnly,
  getAdminStats
);


// ===============================
// DELETE ANY POST
// ===============================

router.delete(
  "/post/:id",
  protect,
  adminOnly,
  deletePostByAdmin
);


module.exports = router;
