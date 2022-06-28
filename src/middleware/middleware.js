const jwt = require("jsonwebtoken");
const blogModel = require("../model/blogModel");
const mongoose = require("mongoose");

const isValidObjectId = (ObjectId) => {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}

const authentication = async function (req, res, next) {
    try {
        let token = req.headers["x-Api-key"];
        if (!token) token = req.headers["x-api-key"];

        // TOKEN IS NOT PRESENT 
        if (!token)
            return res.status(400).send({
                status: false,
                msg: "Token Is Not Present",
            });
        
        // TOKEN IS INVALID
        let decodedToken = jwt.verify(token, "project_1")
        if (!decodedToken)
            return res.status(401).send({ status: false, msg: "token is invalid" })

        req["x-api-key"] = req.headers["x-api-key"]
        req["authorId"] = decodedToken.authorId

        next();
    }
    catch (err) {
        return res.status(500).send({ status: false, data: err.message })
    }
};

const authorization = async function (req, res, next) {
    try {

        let Inuser = req.authorId

        let authorlogging;

        // if (req.body.hasOwnProperty("authorId")) {
            // original code
        if (req.body.authorId) {

            if (!isValidObjectId(req.body.authorId))
                return res.status(400).send({ msg: "Enter valid authorId" })

            authorlogging = req.body.authorId
        }
        else if (req.params.hasOwnProperty("blogId")) {

            if (!isValidObjectId(req.params.blogId))
                return res.status(400).send({ msg: "Enter valid blogId" })

            let blogData1 = await blogModel.findById(req.params.blogId)

            if (!blogData1) {
                return res.status(404).send({ status: false, msg: "please check id" })
            }
            authorlogging = blogData1.authorId.toString()
        }
        if (!authorlogging)
            return res.status(400).send({ msg: "AuthorId is required" })

        // Authorisation: authorId in token is compared with authorId against blogId
        if (Inuser !== authorlogging) {
            return res.status(403).send({ status: false, msg: "Authorisation Failed!" });
        }
        
        next()
    }
    catch (err) {
        return res.status(500).send({ status: false, data: err.message })
    }
};

module.exports.authentication = authentication
module.exports.authorization = authorization