const { Post } = require("../models/post");
const Workspace = require("../models/workspace");
const sendResponse = require("../utils/response");
const mongoose = require("mongoose");

const createWorkspace = async (req, res, next) => {

    try {
        const userId = req.userId;
        const postId = req.params.postId;
        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(postId)) {
            const err = new Error("Invalid post or user")
            err.statusCode = 400;
            throw err;
        }

        const post = await Post.findById(postId);

        if (!post) {
            const err = new Error("Post not found");
            err.statusCode = 404;
            return next(err)
        }
        const existingWorkspace = await Workspace.findOne({ post: postId });
        if (existingWorkspace) {
            return sendResponse(res, 409, false, "Workspace already exists");
        }
        const { name } = req.body;
        if (!name || name.trim() === "") {
            const err = new Error("Workspace name cannot be empty");
            err.statusCode = 400;
            return next(err);
        }
        const workspace = new Workspace({ name, creator: userId, post: postId, members: [userId] });

        await workspace.save();

        return sendResponse(res, 201, true, "Workspace created successfully", workspace);

    } catch (err) {
        next(err);
    }
}

const joinWorkspace = async (req, res, next) => {

    try {
        const userId = req.userId;
        const workspaceId = req.params.workspaceId;

        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(workspaceId)) {
            const err = new Error("Invalid user or workspace")
            err.statusCode = 400;
            throw err;
        }

        const initialWorkspace = await Workspace.findById(workspaceId);

        if (!initialWorkspace) {
            const err = new Error("Workspace not found");
            err.statusCode = 404;
            return next(err);
        }

        if (initialWorkspace.members.some(id => id.toString() === userId)) {
            const err = new Error("You are already in the workspace");
            err.statusCode = 400;
            return next(err);
        }

        await Workspace.findOneAndUpdate({ _id: workspaceId }, { $addToSet: { members: userId } });

        const finalWorkspace = await Workspace.findById(workspaceId);

        return sendResponse(res, 200, true, "Joined the workspace successfully", finalWorkspace);
    } catch (err) {
        next(err);
    }
}

const workspaceInfo = async (req, res, next) => {

    try {
        const userId = req.userId;
        const workspaceId = req.params.workspaceId;

        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(workspaceId)) {
            const err = new Error("Invalid user or workspace")
            err.statusCode = 400;
            throw err;
        }

        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) {
            const err = new Error("Workspace is not found");
            err.statusCode = 404;
            return next(err);
        }
        if (!workspace.members.some(id => id.toString() === userId)) {
            const err = new Error("Access Denied");
            err.statusCode = 403;
            return next(err);
        }

        return sendResponse(res, 200, true, "Workspace info loaded successfully", workspace);


    } catch (err) {
        next(err);
    }
}


module.exports = { createWorkspace, joinWorkspace, workspaceInfo }; 