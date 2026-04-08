const User = require("../models/User");

// SUBSCRIBE

exports.subscribeUser = async (req, res) => {
  try {

    const targetUserId = req.params.userId;

    if (req.user._id.toString() === targetUserId) {
      return res.status(400).json({
        message: "You cannot subscribe yourself"
      });
    }

    const user = await User.findById(req.user._id);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (user.subscriptions.includes(targetUserId)) {
      return res.status(400).json({
        message: "Already subscribed"
      });
    }

    user.subscriptions.push(targetUserId);
    targetUser.subscribers.push(user._id);

    await user.save();
    await targetUser.save();

    res.json({
      message: "Subscribed successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.unsubscribeUser = async (req, res) => {
  try {

    const targetUserId = req.params.userId;

    const user = await User.findById(req.user._id);
    const targetUser = await User.findById(targetUserId);

    user.subscriptions =
      user.subscriptions.filter(
        id => id.toString() !== targetUserId
      );

    targetUser.subscribers =
      targetUser.subscribers.filter(
        id => id.toString() !== req.user._id.toString()
      );

    await user.save();
    await targetUser.save();

    res.json({
      message: "Unsubscribed successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.getMySubscriptions = async (req, res) => {
  try {

    const user = await User.findById(req.user._id)
      .populate("subscriptions", "name email");

    res.json({
      total: user.subscriptions.length,
      subscriptions: user.subscriptions
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


exports.getMySubscribers = async (req, res) => {
  try {

    const user = await User.findById(req.user._id)
      .populate("subscribers", "name email");

    res.json({
      total: user.subscribers.length,
      subscribers: user.subscribers
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
