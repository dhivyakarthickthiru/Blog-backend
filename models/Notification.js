const mongoose = require("mongoose");

const notificationSchema =
  new mongoose.Schema(
    {
      recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },

      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },

      post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
      },

      type: {
        type: String,
        enum: [
          "new_post",
          "update_post",
          "comment",
          "subscribe"
        ]
      },

      message: {
        type: String
      },

      isRead: {
        type: Boolean,
        default: false
      }
    },
    {
      timestamps: true
    }
  );
module.exports =
  mongoose.model(
    "Notification",
    notificationSchema
  );