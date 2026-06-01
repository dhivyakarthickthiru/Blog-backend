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
      

   
   resetPasswordToken: {
  type: String
},

resetPasswordExpire: {
  type: Date
}, 
   
    
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },


    
   

     
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
],

authorSubscriptions: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
],
bio: {
  type: String,
  default: ""
},

profilePicture: {
  type: String,
  default: ""
},

socialLinks: {
  facebook: {
    type: String,
    default: ""
  },
  twitter: {
    type: String,
    default: ""
  },
  linkedin: {
    type: String,
    default: ""
  },
  instagram: {
    type: String,
    default: ""
  }
},


 notifications: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Notification"
  }
],
 
 savedPosts: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post"
  }
]


  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "User",
  userSchema
);
