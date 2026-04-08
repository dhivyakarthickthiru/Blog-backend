const express = require("express");

const router = express.Router();

const {
  subscribeUser,
  unsubscribeUser,
  getMySubscriptions,
  getMySubscribers
} = require("../controllers/subscriptionController");

const {
  protect
} = require("../middlewares/authMiddleware");

// Subscribe

router.post("/:userId", protect, subscribeUser);

// Unsubscribe

router.delete("/:userId", protect, unsubscribeUser);

// Get my subscriptions

router.get("/my", protect, getMySubscriptions);

// Get my subscribers

router.get("/subscribers", protect, getMySubscribers);

module.exports = router;
