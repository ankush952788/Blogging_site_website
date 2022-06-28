const express = require('express');
const router = express.Router();
const authors = require("../controller/authorController");
const blog = require("../controller/blogController");
const middleware = require("../middleware/middleware");


router.get("/me", function (req, res) {
    res.send("My first ever api!")
}) 


// AUTHOR CREATE
router.post("/authors", authors.createAuthor) //no need to enter token

// LOGIN AUTHOR
router.post("/login", authors.loginAuthor) //no need to enter token


// BLOG CONTROLLER
router.post("/createBlog", blog.createBlog)
router.get("/getBlog", middleware.mid1, blog.getBlog)
 router.put("/updateBlog/:blogId", middleware.mid1, blog.updateBlog)
 router.delete("/deleteBlog/:blogId", middleware.mid1, blog.deleteBlog)
 router.delete("/deleteBlogsQueryParams", middleware.mid1, blog.deleteBlogsQueryParams)

module.exports = router;