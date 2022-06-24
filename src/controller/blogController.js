const mongoose = require("mongoose")
const jwt = require("jsonwebtoken");
const blogModel = require("../model/blogModel");
const authorModel = require("../model/authorModel");

const createBlog = async function (req, res) {
    try {
        let data = req.body
        if (!data.authorId) { return res.status(400).send("author Id is not valid") }
        const savedData = await (await blogModel.create(data))
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

// delete blogs ===================================================
const deleteBlog = async function (req, res) {
    try {
        let BlogId = req.params.blogId
        let date = Date.now()
        let Blog = await blogModel.findById(BlogId)
        // added condition by sahil (isDeleted)
        if (!Blog) {
            return res.status(404).send({ status: false, msg: "No Data Is Found" })
        }

        let afterDeleted = await blogModel.findOneAndUpdate(
            { _id: BlogId },
            { $set: { isDeleted: true, deletedAt: date } },
            { new: true })

        return res.status(200).send({ status: true, msg: "Data Is Deleted", data: { afterDeleted } })
    }
    catch (err) {
        return res.status(500).send({ status: false, data: err.message })
    }
}



//deleteby params are not get understand

const deleteBlogsByQueryParams = async function (req, res) {
    try {
        let BlogId = req.params.blogId
        let Blog = await blogModel.findById(BlogId)
        if (!Blog) {
            return res.status(404).send({ status: false, msg: "No Data Is Found" })
        }

        let hero = await blogModel.findOneAndUpdate(
            { _id: BlogId },
            { $set: { isDeleted: true, deletedAt: date } })

        return res.status(200).send({ status: true, msg: "Data Is Deleted!" })
    }
    catch (err) {
        return res.status(500).send({ status: false, data: err.message })
    }
}



//----------------------------------------------------------------------------------------------------------------------------------------------------

const updateBlog = async function (req, res) {
    try {

        let data = req.body
        let blogId = req.params.blogId;
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ msg: "Please provide blog details" })
        }

        let title = req.body.title
        let body = req.body.body
        let tags = req.body.tags
        let subcategory = req.body.subcategory
        let Data = Date.now()

        const updateblog = await blogModel.findByIdAndUpdate
            ({ _id: blogId, isDeleted: false },
                { $set: { title: title, body: body, tags: tags, subcategory: subcategory, isPublished: true, publishedAt: Data } },
                { new: true })

        console.log(updateblog)
        // blogid exist ka bar m TA se dicuss
        // if do not provide the blog id
        res.status(200).send({ status: true, data: updateblog })

    } catch (err) {
        res.status(500).send({ msg: err.message })
    }
}

//------------------------------------------------------------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------------------------------------------------------------

module.exports.createBlog = createBlog
module.exports.getBlog = getBlog
module.exports.deleteBlog = deleteBlog 
module.exports.deleteBlogsByQueryParams = deleteBlogsByQueryParams
module.exports.updateBlog = updateBlog
