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

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      
      "https://userblog.netlify.app"
    ],
    credentials: true
  })
);

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

// ADD HERE 👇

app.get("/", (req, res) => {

  res.json({

    message:
      "Blog API Running",

    routes: {

      posts:
        "/api/posts",

      auth:
        "/api/auth",

      comments:
        "/api/comments",

      notifications:
        "/api/notifications"

    }

  });

});

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

app.use(
  "/api/admin",
  require("./routes/adminRoutes")
);

module.exports = app;
