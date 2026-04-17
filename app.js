const express = require("express");
const cors = require("cors");

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

const authorSubscriptionRoutes =
  require(
    "./routes/authorSubscriptionRoutes"
  );  

const notificationRoutes =
  require("./routes/notificationRoutes");

const app = express();

/* =========================
   GLOBAL MIDDLEWARES
========================= */

app.use(cors());

/* Parse JSON */

app.use(express.json());

/* Parse form data */

app.use(
  express.urlencoded({
    extended: true
  })
);

/* Serve uploaded images */

app.use(
  "/uploads",
  express.static("uploads")
);

/* =========================
   ROUTES
========================= */

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/categories",
  categoryRoutes
);

app.use(
  "/api/posts",
  postRoutes
);

app.use(
  "/api/tags",
  tagRoutes
);

app.use(
  "/api/comments",
  commentRoutes
);

app.use(
  "/api/category-subscriptions",
  categorySubscriptionRoutes
);


app.use(
  "/api/author-subscriptions",
  authorSubscriptionRoutes
);

app.use(
  "/api/subscriptions",
  subscriptionRoutes
);

app.use(
  "/api/notifications",
  notificationRoutes
);

module.exports = app;
