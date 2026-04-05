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



const app=express();

app.use(express.json());


app.use("/api/auth",authRoutes);


app.use("/api/categories",categoryRoutes);

app.use("/api/posts",postRoutes);

app.use("/api/tags",tagRoutes);

app.use("/api/comments",commentRoutes);


module.exports=app;
