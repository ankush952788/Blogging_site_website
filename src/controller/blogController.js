const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const blogModel = require("../model/blogModel");
const authorModel = require("../model/authorModel");
const { findOne } = require("../model/authorModel");

const createBlog = async function (req, res) {
  try {
    let data = req.body

    if (Object.keys(data).length == 0) {
      return res.status(400).send({ status: false, msg: "Please provide blog details" })
    }

    // destructure from params
    const { title, body, authorId, tags, category } = data;

    if (!authorId) { return res.status(400).send(" Blog Author Id is not valid") }

    if (!body) { return res.status(400).send(" Blog  Body is required") }

    if (!title) { return res.status(400).send(" Blog Title is required") }

    if (!tags) { return res.status(400).send(" tags are not valid") }

    if (!category) { return res.status(400).send(" category is required") }

    const createAuthor = await authorModel.findById(authorId)

    if (!createAuthor) { return res.status(400).send({ msg: "author is not valid" }) }

    const savedData = await blogModel.create(data)
    res.status(201).send({ data: savedData })
  }
  catch (err) {
    return res.status(500).send({ status: false, data: err.message })
  }
}


const getBlog = async function (req, res) {
  try 
  {
    let inputData = req.query.authorId
    if(inputData){
        // let categorySelected = req.query.category
        // let isDeleted =req.query.isDeleted
        let container = []
        let authorBlogs = await blogModel.find({ authorId : inputData })
        // if(!authorBlogs) return res.status(404).send({msg: "no data found"})

        authorBlogs.filter(afterFilter => {
          // afterFilter.category = categorySelected
          if(afterFilter.isDeleted == false && afterFilter.isPublished == false)
              container.push(afterFilter)
        })
        return res.status(200).send({ data: container})
    }

  }
  catch (err) 
  {
    return res.status(500).send({ status: false, data: err.message })
  }
}
  


const updateBlog = async function (req, res) {
  try {
    let data = req.body
    let BlogId = req.params.blogId;
    if (Object.keys(data).length == 0) {
      return res.status(400).send({ status: false, msg: "Please provide blog details" })
    }
    let title = req.body.title
    let body = req.body.body
    let tags = req.body.tags
    let subcategory = req.body.subcategory
    let date1 = new Date()

    const updateZBlog = await blogModel.findOneAndUpdate({ _id: BlogId, isDeleted: false },
      { $set: {title: title, body: body, tags: tags, subcategory: subcategory, isPublished: true,publishedAt: date1}}, { new: true });

    // res.status(200).send({ status: true, data:  updateZBlog })

    const blogdata = updateZBlog ?? "BLog not found"
    res.status(200).send({ status: true, data: blogdata })

    // console.log(updateblog)
    // blogid exist ka bar m TA se dicuss
    // if do not provide the blog id

  } catch (err) {
    res.status(500).send({ msg: err.name })
  }
}


// delete blogs ===================================================
const deleteBlog = async function (req, res) {
  try {
    let BlogId = req.params.blogId
    let date = new Date()
    let Blog = await blogModel.findById(BlogId)
    let check = await blogModel.findOne(
      { _id: BlogId },
      {
        isDeleted: 1,
        _id: 0,
      });

    //IF THE BLOG IS ALREADY DELETED   ???? BY TA ????
    if (ch) {
      return res.status(404).send({ status: false, msg: "ALREADY DELETED" })
    }

    // WHEN WE PROVIDE WRONG ID
    if (!Blog) {
      return res.status(404).send({ status: false, msg: "BlogId Not Exist In DB" })
    }
    let find = await blogModel.findOneAndUpdate(
      { _id: BlogId },
      { $set: { isDeleted: true, deletedAt: date } },
      { new: true })

    //IF THE BLOG IS ALREADY DELETED   ???? BY TA ????
    // if (check && check.isDeleted) {
    //   return res.status(404).send({ status: false, msg: "ALREADY DELETED" })
    // }

    return res.status(200).send({ status: true, msg: " DATA IS DELETED ", data: check })
  }

  catch (error) {
    return res.status(500).send({ status: false, data: error.name })
  }
}

 
//deleteby params are not get understand

const deleteBlogsQueryParams = async function (req, res) {
  try {

    let Inuser = req.authorId
    // console.log(Inuser)
    let queryparms = req.query;
    // console.log(queryparms)
    let data2 = new Date()
    if (Object.keys(queryparms).length == 0) {
      return res.status(400).send({ status: false, msg: "Please provide key value details" })
    }

    const blogs = await blogModel.find({ ...queryparms, isDeleted: false, authorId: Inuser })
    // console.log(blogs)

    if (blogs.length == 0) {
      return res.status(404).send({ status: false, msg: "blogs does not exists" })
    }

    const deleteBlog = await blogModel.updateMany({ _id: { $in: blogs } }, { $set: { isDeleted: true, deletedAt: data2 } })

    res.status(200).send({ status: true, msg: "Data is Deleted By Query", data: deleteBlog })
  }
  catch (err) {
    return res.status(500).send({ status: false, data: err.name })
  }
}


module.exports.createBlog = createBlog
module.exports.getBlog = getBlog
module.exports.deleteBlog = deleteBlog 
module.exports.updateBlog = updateBlog
module.exports.deleteBlogsQueryParams = deleteBlogsQueryParams