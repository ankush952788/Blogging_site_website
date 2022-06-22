const { ObjectId, ObjectID } = require("bson")
const mongoose = require("mongoose")
// const jwt = require("jsonwebtoken")
const authorModel = require("../model/authorModel")
const blogModel = require("../model/blogModel")


const createAuthor = async function (req, res) {
  let data = req.body
  const savedData = await authorModel.create(data)
  res.status(200).send({ data: savedData }) //ALL GOOD... //status(200)- OK
}

const createBlog = async function (req, res) {
    let data = req.body
    if(!data.authorId) {return res.send("author Id Is Not Valid")}
    const savedData = await blogModel.create(data)
    res.status(201).send({ data: savedData }) //ALL GOOD... //status(201)- OK
}





module.exports.createAuthor = createAuthor
module.exports.createBlog = createBlog
