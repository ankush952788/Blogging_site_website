// const jwt = require ("jsonwebtoken");


// let mid1 =  function (req,res,next) {

//     try
//     {
//         let token = req.headers["x-api-key"];
//         console.log(token)

//         if (!token) token = req.headers["x-api-key"];

//         if (!token) return res.send({ status: false, msg: "token must be present" });
//         // console.log(token)

//         next()
//     }
//     catch(error)
//     {
//         res.status(500).send({msg:" Authentication error "})
//     }
// }



// AUTHORISATION START HERE
//  let mid2 =  function (req,res,next) {

//     try
//     {
//         let decodedToken = jwt.verify(token, "project_1");
//         const userId = req.params.userId
//         const tokenId = decodedToken.userId
//         // console.log(decodedToken)

//         if(tokenId != userId ) {
//             res.send({ status: false, msg: "token is invalid" });
//         }

//         next()
//     }
//     catch(error)
//     {
//         res.status(500).send({msg:"Authorisation error"})
//     }
//  }
// module.exports.mid1 = mid1
// module.exports.mid2 = mid2


// ===========================================================================

const jwt = require("jsonwebtoken");
const blogModel = require("../model/blogModel");
const mongoose = require("mongoose");

const mid1 = async function (req, res, next) {
    try {
        // case insensitivity of HTTP headers
        let token = req.headers["x-Api-key"];
        if (!token) token = req.headers["x-api-key"];

        // if token is not provided
        if (!token)
            return res.status(400).send({
                status: false,
                msg: "Token required! Please login to generate token",
            });

        let decodedToken = jwt.verify(token, "project_1");
        if (!decodedToken)
            return res.status(401).send({ status: false, msg: "token is invalid" });

        // if token is valid
        next();
    } 
    catch (err) {
        return res.status(500).send({ status: false, data: err.message })
      }
};

const mid2 = async function (req, res, next) {
    try {
        // token sent in request header "x-api-key"
        let token = req.headers["x-api-key"];
        console.log(token)

        // decoded token using verify method
        let decodedToken = jwt.verify(token, "project_1");

        // blogId sent through path variable
        let blogId = req.params.blogId;

        // CASE-1: blogId is empty
        if (blogId === ":blogId") {
            return res
                .status(400)
                .send({ status: false, msg: "Please enter blogId to proceed!" });
        }
        // CASE-2: blogId is not an ObjectId
        else if (!mongoose.Types.ObjectId.isValid(blogId)) {
            return res.status(400).send({ status: false, msg: "blogId is invalid!" });
        }
        // CASE-3: blogId is not present in the database
        let blog = await blogModel
            .findOne({ _id: blogId })
            .select({ authorId: 1, _id: 0 });
        // if blog is null => we can't use Object.keys(blog).length to validate, hence, we use !blog to validate
        if (!blog) {
            return res.status(400).send({
                status: false,
                msg: "We are sorry; Given blogId does not exist!",
            });
        }

        // Authorisation: authorId in token is compared with authorId against blogId
        if (decodedToken.authorId !== blog.authorId.toString()) {
            return res
                .status(401)
                .send({ status: false, msg: "Authorisation Failed!" });
        } else if (decodedToken.authorId === blog.authorId.toString()) {
            next();
        }
    } 
    catch (err) {
        return res.status(500).send({ status: false, data: err.message })
      }
};

module.exports = { mid1, mid2 };


