const User = require("../models/User");

// SUBSCRIBE AUTHOR

exports.subscribeAuthor =
  async (req, res) => {

  try {

    const userId =
      req.user._id;

    const authorId =
      req.params.authorId;

    const user =
      await User.findById(userId);

    if (
      user.authorSubscriptions.includes(
        authorId
      )
    ) {

      return res.json({
        message:
          "Already subscribed"
      });

    }

    user.authorSubscriptions.push(
      authorId
    );

    await user.save();

    res.json({
      message:
        "Author subscribed"
    });

  } catch (error) {

    res.status(500).json({
      message:
        error.message
    });

  }

};

// UNSUBSCRIBE AUTHOR

exports.unsubscribeAuthor =
  async (req, res) => {

  try {

    const userId =
      req.user._id;

    const authorId =
      req.params.authorId;

    const user =
      await User.findById(userId);

    user.authorSubscriptions =
      user.authorSubscriptions.filter(
        (id) =>
          id.toString() !==
          authorId
      );

    await user.save();

    res.json({
      message:
        "Author unsubscribed"
    });

  } catch (error) {

    res.status(500).json({
      message:
        error.message
    });

  }

};

// GET MY AUTHOR SUBSCRIPTIONS

exports.getMyAuthorSubscriptions =
  async (req, res) => {

  try {

    const user =
      await User.findById(
        req.user._id
      ).populate(
        "authorSubscriptions",
        "name"
      );

    res.json({
      authors:
        user.authorSubscriptions
    });

  } catch (error) {

    res.status(500).json({
      message:
        error.message
    });

  }

};