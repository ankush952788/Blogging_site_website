const mongoose = require('mongoose');

const author = new mongoose.Schema({

    fname:{
        type: String,
        required: true,
        trim:true
    },
    lname:{
        type: String,
        required: true,
        trim:true
    },
    title:{
        type: String,
        required: true,
        trim:true,
        enum: ["Mr", "Mrs", "Miss"]
    },
    email:{
        type: String,
        unique: true,
        required: true,
        trim:true
    },
    password:{
        type: String,
        trim:true,
        required: true
    },
    
}, { timestamps: true } );

module.exports = mongoose.model('authorProject', author) // AuthorProjects