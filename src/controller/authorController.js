const mongoose = require("mongoose")
const authorModel = require("../model/authorModel")
const blogModel = require("../model/blogModel")
const jwt = require("jsonwebtoken")




// make a function for validation for the fname,lname,title in the author
// By TA
const isValid = function (value) {
  if (typeof value === "undefined" || value === Number || value === null) return false
  if (typeof value === "string" && value.trim().length === 0) return false
  return true
}

// function to validate empty spaces
// By TA
const space = function (str) {
  return /^\s*$/.test(str);
}


// CREATE AUTHOR
const createAuthor = async function (req, res) {
  try {
    let data = req.body

    // ALL THE EDGE CASES ARE HERE FOR THE CREATE AUTHOR

    if (!isValid(data.fname)) {
      return res.status(400).send({ status: false, msg: "please Enter Valid fName" })
    }
    else if (space(data.fname) == true) {
      return res
        .status(400)
        .send({ status: false, msg: "fname cannot be a empty" });
    }

    if (!isValid(data.lname)) {
      return res.status(400).send({ status: false, msg: "please Enter Valid lName" })
    }
    else if (space(data.fname) == true) {
      return res
        .status(400)
        .send({ status: false, msg: "lname cannot be a empty" });
    }

    if (!isValid(data.title)) {
      return res.status(400).send({ status: false, msg: "please Enter Valid Title" })
    }
    else if (space(data.fname) == true) {
      return res
        .status(400)
        .send({ status: false, msg: "Title cannot be a empty" });
    }


    // EMAIL DUPLICAY AND SYNTAX OF IT

    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email))) {
      return res.status(400).send({ status: false, msg: "please Enter Valid Email" })
    }

    const isEmailPresent = await authorModel.findOne({ email: data.email })

    if (isEmailPresent) {
      return res.status(400).send({ status: false, msg: "EmailId Is Already Exist In DB" })
    }

    // AUTHOR CREATED HERE

    const savedData = await authorModel.create(data)
    return res.status(200).send({ data: savedData })
  }

  catch (err) {
    return res.status(500).send({ status: false, data: err.message })
  }

}


// CREATE BLOG
const createBlog = async function (req, res) {
  let data = req.body
  if (!data.authorId) { return res.status(400).send("author Id Is Not Valid") }
  const savedData = await blogModel.create(data)
  res.status(201).send({ data: savedData }) //ALL GOOD... //status(201)- OK

}
  try{
  let data = req.body
  if (!data.authorId) { return res.status(400).send("author Id Is Not Valid") }
  const savedData =  blogModel.create(data)
  res.status(201).send({ data: savedData })
  }catch(error){
    res.status(500).send({msg:error.message})
  try {
    let data = req.body
    if (!data.authorId) { return res.status(400).send("author Id Is Not Valid") }
    const savedData =  blogModel.create(data)
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
  catch (error) {
    res.status(500).send({ msg: "Data not found" })
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


// LOGIN USER OR AUTHOR ==========================
// AUTHENTICATION PART ===========================  
const loginAuthor = async function (req, res) {
  try {
    let username = req.body.emailId;
    let password = req.body.password;


  
  

    // AUTHENTICATION PART============================  
    const loginAuthor = async function(req, res){
      let username = req.body.emailId;
      let password = req.body.password;
    let user = await authorModel.findOne({ emailId: username, password: password });
    if (!user) return res.send({ status: false, msg: " username or password is incorrect " });

    // edges cases
    if (!username) {
      return res.status(400).send({ status: false, msg: " please Enter Username" })
    }

    if (!password) {
      return res.status(400).send({ status: false, msg: " please Enter password" })
    }

    let user = await authorModel.findOne({
      emailId: username,
      password: password
    });

    if (!user) return res.status(400).send({
      status: false,
      msg: " username or password is incorrect "
    });



    // AUTHENTICATION BEGINS HERE===================

    let token = jwt.sign({
      // provide the things which are unique like object id
      authorId: user._id.toString(),
    },
      // secret key 
      "project_1"
    );

    res.status(200).send({
      status: true,
      token: "You Are Now Login In The App",
      data: { token: token }
    });
  }

  catch (err) {
    return res.status(500).send({ status: false, data: err.message })
  }
};



      // AUTHENTICATION BEGINS HERE===================
      let token = jwt.sign(
        {
          authorId: user._id.toString()
        },
        "project_1" //==========> secret key
      );
      res.setHeaders("x-auth-token", token);
      res.send({ status:true, token: token });
    };


module.exports.createAuthor = createAuthor
module.exports.createBlog = createBlog
module.exports.updateBlog = updateBlog
module.exports.getBlog = getBlog
module.exports.deleteBlog = deleteBlog
module.exports.deleteBlogByParams=deleteBlogByParams
// new 
// authentication and authorisation
module.exports.loginAuthor = loginAuthor