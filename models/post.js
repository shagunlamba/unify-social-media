const mongoose = require ("mongoose");
// Setting up a Post schema
const postSchema = new mongoose.Schema({
    // postContent
    content: { 
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // including the ids of all the comments
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
},{
    timestamps: true
});

// Setting up a post model
const Post = new mongoose.model('Post', postSchema);
module.exports = Post;