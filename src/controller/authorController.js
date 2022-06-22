const mongoose = require("mongoose")
const authorModel = require("../model/authorModel")
const blogModel = require("../model/blogModel")


// CREATE AUTHOR
const createAuthor = async function (req, res) {
  let data = req.body
  const savedData = await authorModel.create(data)
  res.status(200).send({ data: savedData }) //ALL GOOD... //status(200)- OK
}

// CREATE BLOG
const createBlog = async function (req, res) {
  let data = req.body
  if (!data.authorId) { return res.status(400).send("author Id Is Not Valid") }
  const savedData = await blogModel.create(data)
  res.status(201).send({ data: savedData }) //ALL GOOD... //status(201)- OK

}

const Updateblog = async function (req, res) {

  try {
    let title = req.body.title
    let body = req.body.body
    let category = req.body.category
    let tag = req.body.tag
    let date = new Date().toLocaleString();
    let Id = req.params.blogId
    const blogs = await blogModel.findOneAndUpdate({ _id: Id }, {
      $set: {
        title: title, body: body,
        category: category, tag: tag, isPublished: true, publishedAt: date
      }},{ new: true, upsert: true })

    res.status(200).send({ msg: blogs })

  } catch (error) {

    res.status(404).send({ msg: "Data not found" })
  }
}


const getBlog = async function (req, res) {
  try {
    let data = req.query.authorId
    let mainData = []
    // if(!data) {return res.send("author Id Is Not Valid")}
    let blogsData = await blogModel.find({ authorId: data })

    blogsData.filter(afterFilter => {

      if (afterFilter.isDeleted == false)
        mainData.push(afterFilter)
    })
    res.status(200).send({ status: true, data: mainData })
  }
  catch (error) {
    res.status(404).send({ status: false, msg: "No Document Is Found" })
  }
}


const deleteBlog = async function (req, res) {
  try {
    let data = req.params.blogId
    let date = new Date().toLocaleString();
    let blogsDelete = await blogModel.findOneAndUpdate({ _id:data }, 
      { $set: { isDeleted: true, deletedAt: date}},{ new: true })

    res.status(200).send({ status: true, msg: blogsDelete })
  }

  catch (error) {
    res.status(404).send({ status: false, msg: "Data Is Not Found" })
  }
}


module.exports.createAuthor=createAuthor
module.exports.createBlog=createBlog
module.exports.Updateblog = Updateblog
module.exports.getBlog = getBlog
module.exports.deleteBlog = deleteBlog




const getBlogs = async function (req, res) {
  try {
    let query = req.query;
    let filter = {
      isdeleted: false,
      isPublished: true,
      ...query
    };
 if(isValidRequestBody(query)){
    const { authorId,category, subcategory, tags } = query

    if (isValid(category)) {
      filter['category']= category.trim()
    
    }
    if (isValid(authorId)){
      filter['authorId']= authorId
    }

    if (isValid(tags) ){
        const tagsArr = tags.trim().split(',').map(tag => tag.trim());
        filter['tags'] ={$all :tagsArr}
    }
    if (isValid(subcategory)) {
      const subcatArr = subcategory.trim().split(',').map(subcat => subcat.trim());
      filter['subcategory'] ={$all : subcatArr}
    }
  } 
    
    let getSpecificBlogs = await blogModel.find(filter);

    if (getSpecificBlogs.length == 0) {
      return res.status(400).send({ status: false, data: "No blogs can be found" });
    } 
    else {
      return res.status(200).send({ status: true, data: getSpecificBlogs });
    }
  }
    catch (error) {
    res.status(500).send({ status: false, err: error.message });
  }
}