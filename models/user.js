const mongoose= require("mongoose");
// Setting up a User Schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    gender:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

// Setting up a user model
const User = new mongoose.model('User', userSchema);
module.exports = User;