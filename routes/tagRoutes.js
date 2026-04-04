const express = require("express");

const router = express.Router();

const {createTag,getTags,updateTag,deleteTag} = require("../controllers/tagController");

const {protect} = require("../middlewares/authMiddleware");


// Create tag

router.post("/",protect,createTag);


// Get all tags

router.get("/",getTags);


// Update tag

router.put("/:id",protect,updateTag);


// Delete tag

router.delete("/:id",protect,deleteTag);

module.exports = router;
