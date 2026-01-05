const express = require("express");
const { isTokenValid } = require("../middleware/auth");
const { Post } = require("../models/post");
const sendResponse = require("../utils/response");
const mongoose = require("mongoose");
const { commentRouter } = require("./comment.routes");
const { workspaceRouter } = require("./workspace.routes");


const postRouter = express.Router();


postRouter.patch("/update/:postId", isTokenValid, async (req, res, next) => {

    try {
        const allowedFields = ["title", "content", "tags"];
        const updateKeys = Object.keys(req.body);
        const isValidToUpdate = updateKeys.every((key) =>
            allowedFields.includes(key)
        );
        if (!isValidToUpdate) {
            const err = new Error("Failed to updated respective values");
            err.statusCode = 400;
            return next(err);
        }
        const postId = req.params.postId;
        const { title, content, tags } = req.body;
        if (!title && !content && !tags) {
            const err = new Error("No changes made");
            err.statusCode = 400;
            return next(err);
        }

        const userId = req.userId;
        const author = userId;

        const post = await Post.findOneAndUpdate({ _id: postId, author: author }, req.body, { new: true });
        if (!post) {
            const err = new Error("Post does not exist");
            err.statusCode = 404;
            return next(err);
        }
        return sendResponse(res, 200, true, "Post Updated Succesfully", post);

    } catch (err) {
        next(err);
    }
});

postRouter.post("/create", isTokenValid, async (req, res, next) => {

    try {
        const { title, content, tags } = req.body;
        const author = req.userId;
        if (!title || !content) {
            const err = new Error("Respective fields cannot be empty");
            err.statusCode = 400;
            return next(err);
        }
        const post = new Post({ title, content, author, tags });
        await post.save()
        sendResponse(res, 201, true, "Posted Succesfully", post);

    } catch (err) {
        next(err);
    }
});

postRouter.get("/feed", async (req, res, next) => {

    try {
        const posts = await Post.find({})
            .populate("author", "name role fieldOfStudy institution")
            .sort({ createdAt: -1 })

        return sendResponse(res, 200, true, "Feed loaded Successfully", posts);
    } catch (err) {
        next(err);
    }
});

postRouter.get("/view/:postId", async (req, res, next) => {

    try {
        const postId = req.params.postId;
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            const err = new Error("Invalid post ID");
            err.statusCode = 400;
            return next(err);
        }
        const post = await Post.findById(postId).populate("author", "name role fieldOfStudy institution");
        if (!post) {
            const err = new Error("Post does not exist");
            err.statusCode = 404;
            return next(err);
        }
        return sendResponse(res, 200, true, "Post Loaded Succesfully", post);

    } catch (err) {
        next(err);
    }
});

postRouter.delete("/delete/:postId", isTokenValid, async (req, res, next) => {

    try {
        const postId = req.params.postId;
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            const err = new Error("Invalid post ID");
            err.statusCode = 400;
            return next(err);
        }
        const author = req.userId
        const post = await Post.findOneAndDelete({ author: author, _id: postId });
        if (!post) {
            const err = new Error("Post not found or user not authorized");
            err.statusCode = 404;
            return next(err);
        }
        return sendResponse(res, 204, true, "Post Deleted Successfully");
    } catch (err) {
        next(err);
    }
});


postRouter.use("/:postId/comment", commentRouter);
postRouter.use("/workspace", workspaceRouter);

module.exports = postRouter; 