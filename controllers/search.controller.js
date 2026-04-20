import User from "../models/user";
import { Post } from "../models/post";
import Workspace from "../models/workspace";

export const search = async (req, res, next) => {
    try {
        const { q, type, entity } = req.query;

        // 1. Validate query
        if (!q || q.trim() === "") {
            const err = new Error("Search query is required");
            err.statusCode = 400;
            throw err;
        }

        const regex = new RegExp(q, "i");

        // 2. Prepare result containers
        let users = [];
        let workspaces = [];
        let posts = [];

        // 3. ENTITY-BASED SEARCH (important)
        if (entity === "users") {
            users = await User.find({
                $or: [{ name: regex }, { email: regex }],
            }).select("name email _id");

        } else if (entity === "workspaces") {
            workspaces = await Workspace.find({
                $or: [{ name: regex }, { description: regex }],
            }).select("name description _id");

        } else if (entity === "posts") {
            posts = await Post.find({
                content: regex,
                ...(type ? { type } : {}),
            })
                .select("content type author workspace _id")
                .populate("author", "name")
                .populate("workspace", "name");

        } else {
            // 🔥 DEFAULT: search EVERYTHING (parallel)
            [users, workspaces, posts] = await Promise.all([
                User.find({
                    $or: [{ name: regex }, { email: regex }],
                }).select("name email _id"),

                Workspace.find({
                    $or: [{ name: regex }, { description: regex }],
                }).select("name description _id"),

                Post.find({
                    content: regex,
                    ...(type ? { type } : {}),
                })
                    .select("content type author workspace _id")
                    .populate("author", "name")
                    .populate("workspace", "name"),
            ]);
        }

        // 4. Send response
        return res.status(200).json({
            success: true,
            data: {
                users,
                workspaces,
                posts,
            },
        });
    } catch (err) {
        next(err);
    }
};