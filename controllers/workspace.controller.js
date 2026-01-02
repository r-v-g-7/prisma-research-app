const { Post } = require("../models/post");
const Workspace = require("../models/workspace");
const sendResponse = require("../utils/response");

const createWorkspace = async (req, res) => {

    try {
        const userId = req.userId;
        const postId = req.params.postId;
        const post = await Post.findById(postId);
        if (!post) {
            return sendResponse(res, 404, false, "Post not found");
        }
        const existingWorkspace = await Workspace.findOne({ post: postId });
        if (existingWorkspace) {
            return sendResponse(res, 409, false, "Workspace already exists");
        }
        const { name } = req.body;
        const workspace = new Workspace({ name, creator: userId, post: postId, members: [userId] });

        await workspace.save();

        return sendResponse(res, 201, true, "Workspace created successfully", workspace);

    } catch (err) {
        return sendResponse(res, 500, false, "Failed to create the workspace");
    }
}