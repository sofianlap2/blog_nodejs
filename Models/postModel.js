const mongoose = require('mongoose')
//Destructuration
const { Schema } = mongoose
// library for validation string
//const validator = require('validator')

const postSchema = new Schema({
    title: {
        type: String,
        unique: true,
        //minLength: 3
        minLength: [3, "title must have at least 3 characters"],
        maxLength: [100, "title must have at most 100 characters"],
        required: [true, "title is required"],
        trim: true,
        // validate: {
        //     validator: function(v) {
        //       return validator.isAlpha(v);
        //     },
        //     message: props => `${props.value} is not a valid title must contains only letters (a-zA-Z) !`
        //   },
    },
    description: {
        type: String,
        unique: true,
        minLength: [3, "description must have at least 3 characters"],
        maxLength: [255, "description must have at most 255 characters"],
        required: [true, "description is required"],
        trim: true,
    },
    author: {
        type: String,
    },
    keyWords: {
        type: [String],
        // enum: {
        //     values: ['Digital school', 'tiktok'],
        //     message: "This keyword is not accepted"
        // }
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

const postModel = mongoose.model('Post', postSchema)

module.exports = postModel;