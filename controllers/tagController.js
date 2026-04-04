const Tag = require("../models/Tag");


// CREATE TAG

exports.createTag = async (req, res) => {
  try {
    const { name } = req.body;

    const tagExists = await Tag.findOne({
      name
    });

    if (tagExists) {
      return res.status(400).json({
        message: "Tag already exists"
      });
    }

    const tag = await Tag.create({
      name,
      createdBy: req.user._id
    });

    res.status(201).json({
      message: "Tag created",
      tag
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};



// GET ALL TAGS

exports.getTags = async (req, res) => {
  try {
    const tags = await Tag.find().populate("createdBy","name");

    res.json(tags);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};



// UPDATE TAG

exports.updateTag = async (req, res) => {
  try {
    const tag =
      await Tag.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    res.json({
      message: "Tag updated",
      tag
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};





// DELETE TAG

exports.deleteTag = async (req, res) => {
  try {
    await Tag.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Tag deleted"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
