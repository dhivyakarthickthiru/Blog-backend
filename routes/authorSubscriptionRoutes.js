const express = require("express");

const router =
  express.Router();

const {
  subscribeAuthor,
  unsubscribeAuthor,
  getMyAuthorSubscriptions
} = require(
  "../controllers/authorSubscriptionController"
);

const {
  protect
} = require(
  "../middlewares/authMiddleware"
);

router.post(
  "/:authorId",
  protect,
  subscribeAuthor
);

router.delete(
  "/:authorId",
  protect,
  unsubscribeAuthor
);

router.get(
  "/my",
  protect,
  getMyAuthorSubscriptions
);

module.exports = router;