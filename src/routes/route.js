const express = require('express');
const router = express.Router();
const authors = require("../controller/authorController")


router.get("/me", function (req, res) {
    res.send("My first ever api!")
}) 

router.post("/createAuthor", authors.createAuthor)
router.post("/createBlogs", authors.createBlog)
router.get("/getBlog/authorId", authors.getBlog)
router.put("/updateBlogs/:blogId", authors.Updateblog)
router.delete("/deleteBlog/:blogId",authors.deleteBlog)
router.delete("/deleteBlogByParams", authors.deleteBlogByParams)


module.exports = router;