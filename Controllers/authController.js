const UserModel = require('../Models/userModel');
const CustomError = require('../Utils/CustomError');
const asyncErrorHandler = require('../Utils/asyncErrorHandler');
const jwt = require('jsonwebtoken');
const sendMail = require('../Utils/emailSend')
const crypto = require('crypto');
const { error } = require('console');

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

exports.restrict = (role) => {
    return (req, res, next) => {
        if(req.user.role !== role) {
            const error = new CustomError('This user have no permission for this action', 403)
            return next(error)
        }
        next()
    }
}

exports.forgotPassword = asyncErrorHandler(
    async (req,res,next) => {

        const user = await UserModel.findOne({ email: req.body.email });

        if(!user) {
            const error = new CustomError('There is no user with this email', 400);
            return next(error)
        }

        const resetPassword = await user.createPasswordToken();

        await user.save({ validateBeforeSave: false });

        const resetUrl = process.env.FRONT_URL + '/resetpassword/' + resetPassword

        try {
            await sendMail(user.email, `<b>Hello mr ${user.name} </b>
            <br> 
            <a href="${resetUrl}">Please click on this link to reset your password</a>`)

            res.status(200).json({
                status: 'success',
                message: 'Email sent'
            })
        } catch (error) {
            user.passwordResetToken = undefined;
            user.passwordResetTokenExpiresDate = undefined;

            await user.save({ validateBeforeSave: false });

            const errorMail = new CustomError('Error on sending reset password email', 500)
            return next(errorMail)
        }
    }
)

exports.resetPassword = asyncErrorHandler(
    async (req,res,next) => {
        const resetToken = req.params.token;

        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        const dateNow = new Date(Date.now() + 1 * 60 * 60* 1000)
        const user = await UserModel.findOne({ passwordResetToken: hashedToken, passwordResetTokenExpiresDate: { $gt: dateNow } })

        if(!user) {
            const error = new CustomError('no user found on database', 400)
            return next(error)
        }

        user.password = req.body.password;
        user.confirmPassword = req.body.confirmPassword;
        user.passwordResetToken = undefined
        user.passwordResetTokenExpiresDate = undefined

        try {
            await user.save();

            const token = signToken({id: user._id}, process.env.SECRET_KEY);

            res.status(200).json({
                status: 'success',
                token
            })
        } catch (error) {
            const errorSaving = new CustomError(error.message, 400)
            return next(errorSaving)
        }
    }
)
