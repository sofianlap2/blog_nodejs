const express = require("express");

const router = express.Router();

const authController = require('../Controllers/authController')

// route name == signup
// Route for create a user  ==> POST
router.route('/signup').post(authController.signup)

// route name == login
// Route for create a user  ==> POST
router.route('/login').post(authController.login)

// route name == forgotPassword
// Route for create a new password  ==> POST
router.route('/forgotPassword').post(authController.forgotPassword)

// route name == resetPassword
// Route for create a new password  ==> POST
router.route('/resetPassword/:token').patch(authController.resetPassword)
module.exports = router