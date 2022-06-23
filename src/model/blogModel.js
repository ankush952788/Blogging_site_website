const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const blog = new mongoose.Schema({

    title:{
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    },
    authorId : {
        type: ObjectId,
        required: true,
        ref : "authorProject"
    },
    tags: {
        type: [String]
    },
    category:{
        type: [String],
        required: true
    },
    subcategory:{
        type: [String],
        required: true
    },
    isDeleted: {
        type: Boolean, 
        default: false
    },
    deletedAt: {
        type: String, 
        default: " "
    },
    isPublished: {
        type: Boolean ,
        default: false
    },
     publishedAt: {
        type: String,
        default: " "
    }
    
}, { timestamps: true } );

module.exports = mongoose.model('blogProject', blog) //BlogProjects