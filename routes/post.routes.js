const express = require("express");
const mongoose = require("mongoose"); // <-- needed for ObjectId check
const { isTokenValid } = require("../middleware/auth");
const { commentRouter } = require("./comment.routes");
const { workspaceRouter } = require("./workspace.routes");
const { updatePost, createPost, getFeed, viewPost, deletePost } = require("../controllers/post.controller");

const postRouter = express.Router();

postRouter.patch("/update/:postId", isTokenValid, updatePost);
postRouter.post("/create", isTokenValid, createPost);
postRouter.get("/feed", getFeed);
postRouter.get("/view/:postId", viewPost);
postRouter.delete("/delete/:postId", isTokenValid, deletePost);

postRouter.use("/:postId/comment", commentRouter);
postRouter.use("/:postId/workspace", workspaceRouter);

module.exports = postRouter;
