const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (
  req,
  res,
  next
) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith(
        "Bearer"
      )
    ) {
      token =
        req.headers.authorization.split(
          " "
        )[1];
    }

    if (!token) {
      return res.status(401).json({
        message:
          "Not authorized"
      });
    }

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    req.user =
      await User.findById(
        decoded.id
      ).select("-password");

    next();

  } catch (error) {
    res.status(401).json({
      message:
        "Token failed"
    });
  }
};

// admin level access

exports.adminOnly = (req, res, next) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Admin access only"
      });
    }

    next();

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};