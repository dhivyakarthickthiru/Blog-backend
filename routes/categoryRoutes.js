const express = require("express");

const router = express.Router();

const {createCategory,getCategories,deleteCategory} = require( "../controllers/categoryController");

const {protect} = require("../middlewares/authMiddleware");


// Create category

router.post( "/",protect,createCategory);
 


// Get all categories

router.get("/",getCategories);


// Delete category

router.delete("/:id",protect,deleteCategory);

module.exports = router;
