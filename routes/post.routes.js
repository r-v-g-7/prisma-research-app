const express = require("express");
const { isTokenValid } = require("../middleware/auth");
const { Post } = require("../models/post");
const sendResponse = require("../utils/response");
const mongoose = require("mongoose");


const postRouter = express.Router();

postRouter.post("/create", isTokenValid, async (req, res, next) => {

    try {
        const { title, content, tags } = req.body;
        const author = req.userId;
        if (!title || !content) {
            return sendResponse(res, 400, false, "Respective fields cannot be empty")
        }
        const post = new Post({ title, content, author, tags });
        await post.save()
        sendResponse(res, 201, true, "Posted Succesfully", post);

    } catch (err) {
        sendResponse(res, 500, false, "Post failed")
    }
});





postRouter.get("/feed", async (req, res, next) => {

    try {
        const posts = await Post.find({})
            .populate("author", "name role fieldOfStudy institution")
            .sort({ createdAt: -1 })

        return sendResponse(res, 200, true, "Feed loaded Successfully", posts);
    } catch (err) {
        return sendResponse(res, 500, false, "Failed to load feed");
    }
});




postRouter.get("/:postId", async (req, res, next) => {

    try {
        const postId = req.params.postId;
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return sendResponse(res, 400, false, "Invalid post ID");
        }
        const post = await Post.findById(postId).populate("author", "name role fieldOfStudy institution");
        if (!post) {
            return sendResponse(res, 404, false, "No post exists");
        }
        return sendResponse(res, 200, true, "Post Loaded Succesfully", post);

    } catch (err) {
        return sendResponse(res, 500, false, "Failed to load the post");
    }
});



postRouter.patch("/update/:postId", isTokenValid, async (req, res, next) => {

    try {
        const allowedFields = ["title", "content", "tags"];
        const updateKeys = Object.keys(req.body);
        const isValidToUpdate = updateKeys.every((key) =>
            allowedFields.includes(key)
        );
        if (!isValidToUpdate) {
            return sendResponse(res, 400, false, "Failed to update respective values");
        }
        const postId = req.params.postId;
        const { title, content, tags } = req.body;
        if (!title && !content && !tags) {
            return sendResponse(res, 400, false, "No changes made");
        }

        const userId = req.userId;
        const author = userId;

        const post = await Post.findOneAndUpdate({ _id: mongoose.Types.ObjectId(postId), author: author }, req.body, { new: true });
        if (!post) {
            return sendResponse(res, 404, false, "Post Does NOT exist");
        }
        return sendResponse(res, 200, true, "Post Updated Succesfully");

    } catch (err) {
        return sendResponse(res, 500, false, "Failed to update the post");
    }
});



postRouter.delete("/delete/:postId", isTokenValid, async (req, res, next) => {

    try {
        const postId = req.params.postId;
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return sendResponse(res, 400, false, "Invalid post ID");
        }
        const author = req.userId
        const post = await Post.findOneAndDelete({ author: author, _id: postId });
        if (!post) {
            return sendResponse(res, 404, false, "Post not found or you are not authorized");
        }
        return sendResponse(res, 200, true, "Post Deleted Successfully");
    } catch (err) {
        return sendResponse(res, 500, false, "Failed to delete post");
    }
});



module.exports = postRouter; 