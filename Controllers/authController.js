const UserModel = require('../Models/userModel');
const CustomError = require('../Utils/CustomError');
const asyncErrorHandler = require('../Utils/asyncErrorHandler');
const jwt = require('jsonwebtoken')

const signToken = (payloadToken) => {
    return jwt.sign(payloadToken, process.env.SECRET_KEY, {
        expiresIn: "10h"
    })
}

exports.signup = asyncErrorHandler(
    async (req,res,next) => {
        const user = await UserModel.create(req.body)

        const token = signToken({id: user._id}, process.env.SECRET_KEY)

        res.status(201).json({
            status: "success",
            token,
            data: user
        })
    }
)

exports.login = asyncErrorHandler(
    async (req,res,next) => {

        const email = req.body.email;
        const password = req.body.password;

        const user = await UserModel.findOne({email}).select('+password')


        if(!user || !(await user.comparePasswordFromDB(password, user.password))) {
            const error = new CustomError('Please provide a valid email or password', 400);
            return next(error)
        }

        const token = signToken({id: user._id}, process.env.SECRET_KEY)

        res.status(201).json({
            status: "success",
            token,
            data: user
        })
    }
)

exports.protect = asyncErrorHandler(
    async (req,res,next) => {

        const headerToken = req.headers.authorization;

        let token = ""

        if(headerToken && headerToken.startsWith('Bearer')) {
            token = headerToken.split(' ')[1]
        }

        if(!token) {
            const error = new CustomError('You are not authorized', 401)
           return  next(error)
        }

        const decodeToken = jwt.verify(token, process.env.SECRET_KEY)

        const user = await UserModel.findById(decodeToken.id)

        if(!user) {
            const error = new CustomError('This user is not authorize', 401)
           return  next(error)
        }

        req.user = user

        next()
    }
)