const express = require("express");
const { isTokenValid } = require("../middleware/auth");
const { createWorkspace, joinWorkspace, workspaceInfo, getAllWorkspaces, viewWorkspace, leaveWorkspace } = require("../controllers/workspace.controller");

const workspaceRouter = express.Router({ mergeParams: true });


workspaceRouter.get("/all", isTokenValid, getAllWorkspaces);

workspaceRouter.post("/create", isTokenValid, createWorkspace); // "/:postId/create" this was the actuall path, for now it have been modified as we have no post yet

workspaceRouter.post("/join/:workspaceId", isTokenValid, joinWorkspace);

workspaceRouter.post("/leave/:workspaceId", isTokenValid, leaveWorkspace); 

workspaceRouter.get("/info/:workspaceId", isTokenValid, workspaceInfo);

workspaceRouter.get("/view/:workspaceId", isTokenValid, viewWorkspace);



module.exports = { workspaceRouter }; 