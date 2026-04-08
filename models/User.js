const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true
    },

    avatar: {
      type: String,
      default: ""
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },

<<<<<<< HEAD
   bookmarks: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post"
  }
     ], 
=======
    subscriptions: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
],

  subscribers: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
],

categorySubscriptions: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  }
]
>>>>>>> main
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "User",
  userSchema
);
