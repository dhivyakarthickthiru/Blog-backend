const Notification = require("../models/Notification");


// GET MY NOTIFICATIONS

exports.getMyNotifications = async (req, res) => {
  try {

    const notifications =
      await Notification.find({
        recipient: req.user._id
      })
        .populate("sender", "name")
        .populate("post", "title")
        .sort({ createdAt: -1 });

    res.json({
      total: notifications.length,
      notifications
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


// MARK AS READ

exports.markAsRead = async (req, res) => {
  try {

    const notification =
      await Notification.findByIdAndUpdate(
        req.params.id,
        { isRead: true },
        { returnDocument: "after" }
      );

    res.json({
      message: "Notification marked as read",
      notification
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};
