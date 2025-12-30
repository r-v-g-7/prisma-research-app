const express = require("express");
const { isTokenValid } = require("../middleware/auth");
const sendResponse = require("../utils/response");
const Comment = require("../models/comment");
const { findById } = require("../models/user");
const { Post } = require("../models/post");

const commentRouter = express.Router();

commentRouter.post("/create/:postId", isTokenValid, async (req, res) => {

    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId);
        console.log(post);
        if (!post) {
            return sendResponse(res, 404, false, "Post not found")
        }
        const author = req.userId;
        const { content } = req.body
        if (!content) {
            return sendResponse(res, 400, false, "Comment cannot be empty")
        }

        const comment = new Comment({ content: content, author: author, post: postId });

        await comment.save();

        return sendResponse(res, 201, true, "Comment Posted Successfully", comment);

    } catch (err) {
        return sendResponse(res, 500, false, "Error posting the comment");
    }
});


module.exports = { commentRouter };