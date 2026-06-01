const Notification =
  require("../models/Notification");

// GET MY NOTIFICATIONS

exports.getMyNotifications =
  async (req, res) => {

    try {

      const notifications =
        await Notification.find({
          recipient:
            req.user._id
        })
          .sort({
            createdAt: -1
          })
          .limit(20);

      res.json({
        total:
          notifications.length,
        notifications
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          error.message
      });

    }

};

// MARK AS READ

exports.markAsRead =
  async (req, res) => {

    try {

      const notification =
        await Notification.findOneAndUpdate(
          {
            _id: req.params.id,
            recipient:
              req.user._id
          },
          {
            isRead: true
          },
          {
            new: true
          }
        );

      if (!notification) {

        return res
          .status(404)
          .json({
            message:
              "Notification not found"
          });

      }

      res.json({
        message:
          "Notification marked as read",
        notification
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          error.message
      });

    }

};