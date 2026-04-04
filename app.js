const express=require('express');
const authRoutes =
  require("./routes/authRoutes");
const categoryRoutes =
  require("./routes/categoryRoutes");  

const tagRoutes =
  require("./routes/tagRoutes");


const app=express();

app.use(express.json());


app.use("/api/auth",authRoutes);


app.use("/api/categories",categoryRoutes);

app.use("/api/tags",tagRoutes);


module.exports=app;
