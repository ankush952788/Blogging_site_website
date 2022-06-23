const mongoose = require("mongoose")
const jwt = require("jsonwebtoken");
const blogModel = require("../model/blogModel")


// CREATE BLOG
const createBlog = async function (req, res) {
    try {
        let data = req.body
        if (!data.authorId) { return res.status(400).send("author Id Is Not Valid") }
        const savedData = await blogModel.create(data)
        res.status(201).send({ data: savedData })
    }
    catch (error) {
        res.status(500).send({ msg: error.message })
    }
}



// GET BLOG
const getBlog = async function (req, res) {
    try {
        let data = req.query.authorId
        let mainData = []
        let blogData = await blogModel.find({ authorId: data }).populate("authorId")

        if (!blogData) return res.status(404).send({ status: false, msg: "No Such User Found" })

        blogData.filter(afterFilter => {
            if (afterFilter.isDeleted == false)
                mainData.push(afterFilter)
        })
        res.status(200).send({ status: true, data: mainData })
    }

    catch (error) {
        res.status(500).send({ status: false, msg: "No Document Is Found" })
    }
}


// UPDATE BLOG
const updateBlog = async function (req, res) {

    try {
        let title = req.body.title
        let body = req.body.body
        let category = req.body.category
        let tag = req.body.tag
        let date = new Date().toLocaleString();
        let Id = req.params.blogId

        const blogs = await blogModel.findOneAndUpdate({ _id: Id }, {
            $set: {
                title: title, body: body
                , category: category, tag: tag, isPublished: true, publishedAt: date
            }
        }, { new: true, upsert: true })
        res.status(200).send({ msg: blogs })

    }
    catch (err) {
        return res.status(500).send({status:false,  data:err.message})
    }
}

// DELETE BLOG
const deleteBlog = async function (req, res) {
    try {
        let data = req.params.blogId
        let date = new Date().toLocaleString();
        let blogsDelete = await blogModel.findOneAndUpdate({ _id: data, isDeleted: false },
            { $set: { isDeleted: true, deletedAt: date } }, { new: true })

        if (!blogsDelete) return res.status(404).send({ msg: "Data Not Found" })

        res.status(200).send({ status: true, msg: blogsDelete })
    } catch {
        res.status(500).send({ msg: "server error" })
    }
}



// /DELETE BLOG BY PARAMS
const deleteBlogByParams = async function (req, res) {
    try {
        let category = req.query.category
        let authorId = req.query.authorId
        let tag = req.query.tag
        let subcategory = req.query.subcategory
        let published = req.query.isPublished
        let date = Date.now()


        const blogs = await blogModel.findOneAndUpdate({ $or: [{ authorId: authorId }, { category: category }, { tag: tag }, { subcategory: subcategory }, { isPublished: published }] },
            { $set: { isDeleted: true, deletedAt: date } }, { new: true })

        if (!blogs) return res.status(404).send({ status: false, msg: "Please input Data in Params" })

        res.status(200).send({ msg: blogs })

    }
    catch (error) {
        res.status(500).send({ msg: "Blog Document Is Not Exist" })
    }
}



module.exports.createBlog = createBlog
module.exports.updateBlog = updateBlog
module.exports.getBlog = getBlog
module.exports.deleteBlog = deleteBlog
module.exports.deleteBlogByParams = deleteBlogByParams
