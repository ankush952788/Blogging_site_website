const mongoose = require("mongoose")
const jwt = require("jsonwebtoken");
const blogModel = require("../model/blogModel");
const authorModel = require("../model/authorModel");

const createBlog = async function (req, res) {
  try 
  {
    let data = req.body
    if(!data.authorId) {return res.status(400).send ("author Id is not valid")}
    const savedData = await (await blogModel.create(data))
    res.status(201).send({ data : savedData })
  }
  catch (err) 
  {
    return res.status(500).send({ status: false, data: err.message })
  }
}

// const getBlog = async function (req, res) {
//   try 
//   {
//     let inputData = req.query.authorId
//     if(inputData){
//         // let categorySelected = req.query.category
//         // let isDeleted =req.query.isDeleted
//         let container = []
//         let authorBlogs = await blogModel.find({ authorId : inputData })
//         // if(!authorBlogs) return res.status(404).send({msg: "no data found"})

//         authorBlogs.filter(afterFilter => {
//           // afterFilter.category = categorySelected
//           if(afterFilter.isDeleted == false && afterFilter.isPublished == false)
//               container.push(afterFilter)
//         })
//         return res.status(200).send({ data: container})
//     }

//   }
//   catch (err) 
//   {
//     return res.status(500).send({ status: false, data: err.message })
//   }
// }

module.exports.createBlog = createBlog
//module.exports.getBlog = getBlog
