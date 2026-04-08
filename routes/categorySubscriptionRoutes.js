const express = require("express");

const router = express.Router();

const {
  subscribeCategory,
  unsubscribeCategory,
  getMyCategorySubscriptions
} = require(
  "../controllers/categorySubscriptionController"
);

const {
  protect
} = require(
  "../middlewares/authMiddleware"
);

router.post(
  "/:categoryId",
  protect,
  subscribeCategory
);

router.delete(
  "/:categoryId",
  protect,
  unsubscribeCategory
);

router.get(
  "/my",
  protect,
  getMyCategorySubscriptions
);

module.exports = router;
