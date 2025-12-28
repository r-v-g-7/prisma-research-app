const express = require("express");
const { isTokenValid } = require("../middleware/auth");
const { Post } = require("../models/post");
const sendResponse = require("../utils/response");
const User = require("../models/user");


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
        sendResponse(res, 400, false, "Post failed")
    }
});


postRouter.get("/feed", async (req, res, next) => {

    try {
        const posts = await Post.find({})
            .populate("author", "name role fieldOfStudy institution")
            .sort({ createdAt: -1 })

        return sendResponse(res, 200, true, "Post loaded Successfully", posts);
    } catch (err) {
        return sendResponse(res, 500, false, "Failed to load feed");
    }
});

module.exports = postRouter; 