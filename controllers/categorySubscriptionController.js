const User = require("../models/User");

exports.subscribeCategory = async (req, res) => {
  try {

    const user = await User.findById(
      req.user._id
    );

    if (
      user.categorySubscriptions.includes(
        req.params.categoryId
      )
    ) {
      return res.status(400).json({
        message: "Already subscribed"
      });
    }

    user.categorySubscriptions.push(
      req.params.categoryId
    );

    await user.save();

    res.json({
      message: "Category subscribed",
      total:
        user.categorySubscriptions.length
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.unsubscribeCategory = async (
  req,
  res
) => {
  try {

    const user = await User.findById(
      req.user._id
    );

    user.categorySubscriptions =
      user.categorySubscriptions.filter(
        (id) =>
          id.toString() !==
          req.params.categoryId
      );

    await user.save();

    res.json({
      message: "Category unsubscribed"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


exports.getMyCategorySubscriptions =
  async (req, res) => {
    try {

      const user =
        await User.findById(
          req.user._id
        ).populate(
          "categorySubscriptions",
          "name"
        );

      res.json({
        total:
          user.categorySubscriptions.length,
        categories:
          user.categorySubscriptions
      });

    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  };

