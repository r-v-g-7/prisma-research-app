const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        ref: "User"
    },
    post: {
        ref: "Post"
    }
}, { timestamps: true });

const Comment = mongoose.model(commentSchema);

module.exports = Comment; 