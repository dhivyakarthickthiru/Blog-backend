const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    content: {
      type: String,
      required: true
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag"
      }
    ],

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published"
    },


    views: {
    type: Number,
    default: 0
  },
   
   // NEW FIELD

  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

 
 shares: {
  type: Number,
  default: 0
} 

    
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Post", postSchema);
