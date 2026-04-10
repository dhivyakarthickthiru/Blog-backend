const express=require('express');
const authRoutes =
  require("./routes/authRoutes");
const categoryRoutes =
  require("./routes/categoryRoutes");  
const postRoutes =
  require("./routes/postRoutes");  

const tagRoutes =
  require("./routes/tagRoutes");

const commentRoutes =
  require("./routes/commentRoutes");

const categorySubscriptionRoutes =
  require(
    "./routes/categorySubscriptionRoutes"
  ); 

const subscriptionRoutes =
  require("./routes/subscriptionRoutes");

const notificationRoutes =
  require("./routes/notificationRoutes");  



const app=express();

app.use(express.json());


app.use("/api/auth",authRoutes);


app.use("/api/categories",categoryRoutes);

app.use("/api/posts",postRoutes);

app.use("/api/tags",tagRoutes);

app.use("/api/comments",commentRoutes);

app.use("/api/category-subscriptions",categorySubscriptionRoutes);

app.use("/api/subscriptions",subscriptionRoutes);


app.use("/api/notifications",notificationRoutes);

app.use("/uploads",express.static("uploads"));


module.exports=app;
