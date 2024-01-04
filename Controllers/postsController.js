const postModel = require('../Models/postModel');
const CustomError = require('../Utils/CustomError');
require('dotenv').config()
const asyncErrorHandler = require('../Utils/asyncErrorHandler')

exports.createPosts = asyncErrorHandler(
    async (req,res,next) => {
        const data = req.body
    
        const newPost = new postModel(data)
    
        const savedPost = await newPost.save()
        

        res.status(201).json({
            status: "success",
            data: savedPost
        })
    }
)

exports.getPosts = asyncErrorHandler(
    async (req,res,next) => {
        const posts = await postModel.find();
    
        res.status(201).json({
            status: "success",
            user: req.user,
            data: posts
        })
    } 
)

exports.getPost = asyncErrorHandler(
    async (req,res,next) => {
        const post = await postModel.findById(req.params.id);

        if(!post) {
            const postNotFoundError = new CustomError('There is no post with this id', 400)
            return next(postNotFoundError)
        }
    
        res.status(201).json({
            status: "success",
            data: post
        })
    } 
)

exports.updatePost = asyncErrorHandler(
    async (req,res,next) => {
        const post = await postModel.findByIdAndUpdate(req.params.id, req.body);

        if(!post) {
            const postNotFoundError = new CustomError('There is no post with this id', 400)
            return next(postNotFoundError)
        }

        const postModified = await postModel.findById(req.params.id);
    
        res.status(201).json({
            status: "success",
            data: postModified
        })
    } 
)

exports.deletePost = asyncErrorHandler(
    async (req,res,next) => {
        const post = await postModel.findByIdAndDelete(req.params.id);

        if(!post) {
            const postNotFoundError = new CustomError('There is no post with this id', 400)
            return next(postNotFoundError)
        }
    
        res.status(201).json({
            status: "success",
            data: post
        })
    } 
)