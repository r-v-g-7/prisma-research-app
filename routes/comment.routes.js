const express = require("express");
const { isTokenValid } = require("../middleware/auth");
const sendResponse = require("../utils/response");
const Comment = require("../models/comment");
const { Post } = require("../models/post");

const commentRouter = express.Router({ mergeParams: true });

commentRouter.post("/create", isTokenValid, async (req, res, next) => {

    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId);
        if (!post) {
            const err = new Error("Post not found");
            err.statusCode = 404;
            return next(err);
        }
        const author = req.userId;
        const { content } = req.body
        if (!content) {
            const err = new Error("Comment cannot be empty");
            err.statusCode = 400;
            return next(err);
        }

        const comment = new Comment({ content: content, author: author, post: postId });

        await comment.save();

        return sendResponse(res, 201, true, "Comment Posted Successfully", comment);

    } catch (err) {
        next(err);
    }
});


commentRouter.get("/view", isTokenValid, async (req, res, next) => {

    try {
        const postId = req.params.postId;
        const comments = await Comment.find({ post: postId }).populate("author", "name role fieldOfStudy institution");
        if (comments.length === 0) {
            return sendResponse(res, 200, true, "No comments yet", []);
        }
        return sendResponse(res, 200, true, "Comments fetched Succesfully", comments)

    } catch (err) {
        next(err);
    }
});


module.exports = { commentRouter };