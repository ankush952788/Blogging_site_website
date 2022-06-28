const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const blog = new mongoose.Schema({

    title:{
        type: String,
        required: true,
        trim: true
    },
    body:{
        type: String,
        required: true,
        trim: true
    },
    authorId : {
        type: ObjectId,
        required: true,
        ref : "authorProject",
    },
    tags: {
        type: [String],
        trim: true
    },
    
    category:{
        type: String,
        required: true,
        trim: true
    },
    subcategory:{
        type: [String],
        required: true,
        trim: true
    },
    isDeleted: {
        type: Boolean, 
        default: false,
        trim: true
    },
    deletedAt: {
        type: Date
    },   
    isPublished: {
        type: Boolean ,
        default: false,
        trim: true
    },
     publishedAt: {
        type: Date
    }
    
}, { timestamps: true } );

module.exports = mongoose.model('blogProject', blog) //BlogProjects