const express = require("express");

const router = express.Router();

const {createTag,getTags,updateTag,deleteTag} = require("../controllers/tagController");

const { adminOnly } = require("../middlewares/authMiddleware");


// Create tag

router.post("/",adminOnly,createTag);


// Get all tags

router.get("/",getTags);


// Update tag

router.put("/:id",adminOnly,updateTag);


// Delete tag

router.delete("/:id",adminOnly,deleteTag);

module.exports = router;
