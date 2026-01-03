const express = require("express");
const { isTokenValid } = require("../middleware/auth");
const { createWorkspace, joinWorkspace, workspaceInfo } = require("../controllers/workspace.controller");

const workspaceRouter = express.Router({ mergeParams: true });

workspaceRouter.post("/:postId/create", isTokenValid, createWorkspace);

workspaceRouter.post("/join/:workspaceId", isTokenValid, joinWorkspace);

workspaceRouter.get("/info/:workspaceId", isTokenValid, workspaceInfo);

module.exports = { workspaceRouter }; 