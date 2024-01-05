const mongoose = require('mongoose')
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto')

const {Schema} = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email adress"]
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minLength: 8,
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, "password is required"],
        validate: {
            validator: function(confPass) {
                return confPass == this.password
            },
            message: "Please enter a confirm password that matches your password"
        }
    },
    role: {
        type: String,
        enum: {
            values: ['user', 'admin'],
            message: "This role is not accepted must be user or admin"
        },
        default: 'user'
    },
    passwordResetToken: String,
    passwordResetTokenExpiresDate: Date
})

// cryptage du mot de passe
userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next()

    this.password = await bcrypt.hash(this.password, 8);
    
    this.confirmPassword = undefined;

    next()
})

//compare password in db
userSchema.methods.comparePasswordFromDB = async function(password, passwordDB) {
    return await bcrypt.compare(password, passwordDB)
}

//compare password in db
userSchema.methods.comparePasswordFromDB = async function(password, passwordDB) {
    return await bcrypt.compare(password, passwordDB)
}

//create token for reset password
userSchema.methods.createPasswordToken = async function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetTokenExpiresDate = Date.now() + 1 * 70 * 60* 1000 ;

    return resetToken
}

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;