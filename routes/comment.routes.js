const express = require("express");
const { isTokenValid } = require("../middleware/auth");
const sendResponse = require("../utils/response");
const Comment = require("../models/comment");
const { Post } = require("../models/post");

const commentRouter = express.Router({ mergeParams: true });

commentRouter.post("/create", isTokenValid, async (req, res) => {

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


commentRouter.get("/view", isTokenValid, async (req, res) => {

    try {
        const postId = req.params.postId;
        const comments = await Comment.find({ post: postId }).populate("author", "name role fieldOfStudy institution");
        if (comments.length === 0) {
            return sendResponse(res, 200, "No comments yet", []);
        }
        return sendResponse(res, 200, true, "Comments fetched Succesfully", comments)

    } catch (err) {
        return sendResponse(res, 500, false, "Comments failed to load");
    }
});


module.exports = { commentRouter };