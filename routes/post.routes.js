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


module.exports = postRouter; 