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

    const savedData = await (await blogModel.create(data))
    res.status(201).send({ data: savedData })
  }
  catch (err) {
    return res.status(500).send({ status: false, data: err.message })
  }
}


const getBlog = async function (req, res) {
  try {

    let data = req.query;
    let filter = {
      // DELETE BLOG POINT NUMBER 1
      isDeleted: false,
      isPublished: true,
      ...data
    }

    const { authorId, category, tags, subcategory } = data
    if (category) {
      let verifyCategory = await blogModel.find({ category: category })
      if (!verifyCategory) {
        return res.status(400).send({ status: false, msg: "No Blogs In This Category Exist" })
      }
    }
    if (tags) {
      let verifyTag = await blogModel.findOne({ tags: tags })
      if (!verifyTag) {
        return res.status(400).send({ status: false, msg: "No Blogs In This Tags Exist" })
      }
    }
    if (subcategory) {
      let verifySubcategory = await blogModel.findOne({ subcategory: subcategory })
      if (!verifySubcategory) {
        return res.status(400).send({ status: false, msg: "No Blogs In This SubCategory Exist" })
      }
    }

    // BOTH DOING SAME THING
    if (authorId) {
      let verifyauthorId = await blogModel.find({ authorId: authorId })
      if (!verifyauthorId) {
        return res.status(400).send({ status: false, msg: "No Blogs In This authorId Exist" })
      }
    }
    // if (authorId) {
    //   if (!mongoose.isValidObjectId(authorId))
    //     return res.status(400).send({ status: false, msg: "Invalid AuthorId" })
    // }

    let getRecord = await blogModel.find(filter).populate("authorId")


    if (getRecord.length == 0) {
      return res.status(404).send({
        data: "Data Not Found"
      })
    }

    return res.status(200).send({ status: true,msg:"get", data: getRecord })
  }
  catch (err) {
    res.status(500).send({ msg: err.name })
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
      let category = req.body.category
      let subcategory = req.body.subcategory
      let date1 = new Date()
  
      const updateZBlog = await blogModel.findOneAndUpdate({ _id: BlogId, isDeleted: false },
        {
          $set: {
            title: title, body: body, tags: tags, category:category,subcategory: subcategory, isPublished: true,
            publishedAt: date1
          }
        }, { new: true });
  
  
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

    // WHEN WE PROVIDE WRONG ID
    if (!Blog) {
      return res.status(404).send({ status: false, msg: "BlogId Not Exist In DB" })
    }
    let check = await blogModel.findOneAndUpdate(
      { _id: BlogId },
      { $set: { isDeleted: true, deletedAt: date } },
      { new: true })

    //IF THE BLOG IS ALREADY DELETED   ???? BY TA ????
    if ( !check ) {
      return res.status(404).send({ status: false, msg: "ALREADY DELETED" })
    }

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

    if (!blogs.length == 0) {
      return res.status(404).send({ status: false, msg: " Already Deleted" })
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