const express = require("express");

const router = express.Router();

const {createCategory,getCategories,updateCategory,deleteCategory} = require( "../controllers/categoryController");

const {protect} = require("../middlewares/authMiddleware");


// Create category

router.post( "/",protect,createCategory);
 


// Get all categories

router.get("/",getCategories);

//update categories

router.put("/:id",protect,updateCategory);


// Delete category

router.delete("/:id",protect,deleteCategory);

module.exports = router;
