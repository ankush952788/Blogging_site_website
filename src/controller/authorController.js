const mongoose = require("mongoose")
const authorModel = require("../model/authorModel")
const jwt = require("jsonwebtoken");


// make a function for validation for the fname,lname,title in the author
// By TA
const isValid = function (value) {
  if (typeof value === "undefined" || value === Number || value === null) return false
  if (typeof value === "string" && value.trim().length === 0) return false
  return true
}


// CREATE AUTHOR
const createAuthor = async function (req, res) {
  try {
    let data = req.body

    // function to validate empty spaces
    // By TA
    function space(str) {
      return /^\s*$/.test(str);
    }
    // ALL THE EDGE CASES ARE HERE FOR THE CREATE AUTHOR

    if (!isValid(data.fname)) {
      return res.status(400).send({ status: false, msg: "please Enter Valid fName" })
    }
    //  discuss TA
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
    // fname >>>>>title krna hai
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
// password Add krna hai
    // password validation
    if (!data.password) {
      return res
        .status(400)
        .send({ status: false, msg: " Please enter password(required field)" });
    } else if (space(data.password) == true) {
      return res
        .status(400)
        .send({ status: false, msg: "password cannot be a empty" });
    }


    // AUTHOR CREATED HERE

    const savedData = await authorModel.create(data)
    return res.status(200).send({ data: savedData })
  }

  catch (err) {
    return res.status(500).send({ status: false, data: err.message })
  }

}

// LOGIN USER OR AUTHOR ==========================
// AUTHENTICATION PART ===========================  
const loginAuthor = async function (req, res) {

  try {
    let username = req.body.emailId;
    let password = req.body.password;

    
    // // edges cases
    // if (!username) {
    //   return res.status(400).send({ status: false, msg: " please Enter valid email" })
    // }
    
    // if (!password) {
    //   return res.status(400).send({ status: false, msg: " please Enter valid password" })
    // }
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


module.exports.loginAuthor = loginAuthor
module.exports.createAuthor = createAuthor