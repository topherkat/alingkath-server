const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },

    contactNumber: {
        type: String,
        required: true
    },
    facebookLink: {
        type: String,
        required: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

// Create the user model
const User = mongoose.model('User', userSchema);

module.exports = User;
