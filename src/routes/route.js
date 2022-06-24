const express = require('express');
const router = express.Router();
const authors = require("../controller/authorController");
const middleware = require("../middleware/middleware");


router.get("/me", function (req, res) {
    res.send("My first ever api!")
}) 




// AUTHOR CONTROLLER
router.post("/createAuthor",authors.createAuthor)
router.post("/login", authors.loginAuthor)

// BLOG CONTROLLER
// //router.post("/createBlog", middleware.mid1/, blogs.createBlog)
// router.get("/getBlog", middleware.mid1, blogs.getBlog)
//  router.put("/updateBlog/:blogId", middleware.mid1, blogs.updateBlog)
//  router.delete("/deleteBlog/:blogId", middleware.mid1, blogs.deleteBlog)
//  router.delete("/deleteBlogsQueryParams", middleware.mid1, blogs.deleteBlogsQueryParams)

module.exports = router;