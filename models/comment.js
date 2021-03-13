const mongoose = require ("mongoose");
// Setting up a Comment schema
const commentSchema = new mongoose.Schema({
    // commentContent
    content: { 
        type: String,
        required: true
    },
    // which user commented
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // which user posted
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }
},{
    timestamps: true
});

// Setting up a post model
const Comment = new mongoose.model('Comment', commentSchema);
module.exports = Comment;