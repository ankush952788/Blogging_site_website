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
    else if (space(data.lname) == true) {
      return res
        .status(400)
        .send({ status: false, msg: "lname cannot be a empty" });
    }

    if (!isValid(data.title)) {
      return res.status(400).send({ status: false, msg: "please Enter Valid Title" })
    }
    else if (space(data.title) == true) {
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

    // end of edge cases
    // create author
    const savedData = await authorModel.create(data)
    return res.status(200).send({ data: savedData })
  }
  catch (err) {
    return res.status(500).send({ status: false, data: err.message })
  }

}




// AUTHENTICATION PART============================  

const loginAuthor = async function (req, res) {
  try {
    let username = req.body.emailId;
    let password = req.body.password;
    let user = await authorModel.findOne({ emailId: username, password: password });
    if (!user) return res.send({ status: false, msg: " username or password is incorrect " });

    

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
      token: "You Are Login In The App",
      data: { token: token }
    });
  }
  



  catch (err) {
  return res.status(500).send({ status: false, data: err.message })
}
};



module.exports.createAuthor = createAuthor

// new 
// authentication and authorisation
module.exports.loginAuthor = loginAuthor