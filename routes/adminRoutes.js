const express = require("express");

const router = express.Router();

const {
  protect,
  adminOnly
} = require("../middlewares/authMiddleware");

router.get(
  "/dashboard",
  protect,
  adminOnly,
  (req, res) => {

    res.json({
      message: "Admin dashboard access granted"
    });

  }
);

module.exports = router;