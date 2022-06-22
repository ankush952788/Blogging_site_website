const express = require('express');
const router = express.Router();
const authors = require("../controller/authorController")

router.get("/me", function (req, res) {
    res.send("My first ever api!")
}) 

router.post("/createAuthor", authors.createAuthor)
router.post("/createBlog", authors.createBlog)
router.get("/getBlog/:authorId", authors.getBlog)
router.put("/blogs/:blogId", authors.Updateblog)
router.delete("/blogs/:blogId", authors.deleteBlog)



module.exports = router;