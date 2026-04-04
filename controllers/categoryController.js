const Category = require("../models/Category");


// CREATE CATEGORY

exports.createCategory = async (
  req,
  res
) => {
  try {
    const { name, description } =
      req.body;

    const categoryExists =
      await Category.findOne({
        name
      });

    if (categoryExists) {
      return res.status(400).json({
        message: "Category already exists"
      });
    }

    const category =
      await Category.create({
        name,
        description,
        createdBy: req.user._id
      });

    res.status(201).json({
      message: "Category created",
      category
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};



// GET ALL CATEGORIES

exports.getCategories = async (
  req,
  res
) => {
  try {
    const categories =
      await Category.find().populate("createdBy", "name");

    res.json(categories);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// UPDATE CATEGORY

exports.updateCategory = async (req, res) => {
  try {
    const { name, description } =
      req.body;

    const category =
      await Category.findByIdAndUpdate(
        req.params.id,
        {
          name,
          description
        },
        {
          new: true
        }
      );

    if (!category) {
      return res.status(404).json({
        message: "Category not found"
      });
    }

    res.json({
      message: "Category updated",
      category
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// DELETE CATEGORY

exports.deleteCategory = async (
  req,
  res
) => {
  try {
    const category =
      await Category.findByIdAndDelete(
        req.params.id
      );

    res.json({
      message: "Category deleted"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
