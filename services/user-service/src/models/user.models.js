const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    email: {
        type: String, 
        required: true, 
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: 'Invalid Email',
        }
    },
    password: {type: String, required: true},
    name: {type: String, required: true},
    role: {type: String, enum: ['user', 'admin'], default: 'user'},
});

userSchema.methods.toJSON = function() {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

module.exports = mongoose.model('User', userSchema);