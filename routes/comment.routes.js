const express = require("express");
const { isTokenValid } = require("../middleware/auth");
const { createComment, viewComments } = require("../controllers/comment.controller");

const commentRouter = express.Router({ mergeParams: true });

commentRouter.post("/create", isTokenValid, createComment);

commentRouter.get("/view", isTokenValid, viewComments);


module.exports = { commentRouter };