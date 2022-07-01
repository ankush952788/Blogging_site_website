const express = require('express');
const router = express.Router();
const authors = require("../controller/authorController")
const blogs = require("../controller/blogController")
const middleware = require("../middleware/middleware")



// AUTHOR CREATE
router.post("/authors", authors.createAuthor) //no need to enter token

// LOGIN AUTHOR
router.post("/login", authors.loginAuthor) //no need to enter token

// BLOG CONTROLLER
router.post("/blogs", blogs.createBlog) //no need to enter token

// GET BLOG
router.get("/blogs", middleware.authentication, blogs.getBlog)

// UPDATE BLOG
router.put("blogs", middleware.authentication,middleware.authorization, blogs.updateBlog)

// DELETE BLOG
router.delete("/deleteBlog/:blogId", middleware.authentication,middleware.authorization, blogs.deleteBlog)

// DELETE BLOG BY PARAMS
router.delete("/blogs",  middleware.authentication,blogs.deleteBlogsQueryParams)




module.exports = router;