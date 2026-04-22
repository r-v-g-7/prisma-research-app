const User = require("../models/user");
const { Post } = require("../models/post");
const Workspace = require("../models/workspace");

const search = async (req, res, next) => {
    try {
        const { q, type, entity } = req.query;   // ✅ THIS LINE IS REQUIRED

        if (!q || q.trim() === "") {
            const err = new Error("Search query is required");
            err.statusCode = 400;
            throw err;
        }
        const regex = new RegExp(q, "i");

        let users = [];
        let workspaces = [];
        let posts = [];

        if (entity === "users") {
            users = await User.find({
                $or: [
                    { name: regex },
                    { email: regex },
                    { fieldOfStudy: regex },
                    { institution: regex }
                ],
            })
                .select("name email fieldOfStudy institution _id")
                .limit(10);

        } else if (entity === "workspaces") {
            workspaces = Workspace.find({
                $or: [
                    { title: regex },
                    { description: regex },
                    { tags: regex }
                ],
            })
                .select("title description tags creator _id")
                .populate("creator", "name")
                .limit(10);

        } else if (entity === "posts") {
            console.log("Searching for:", q);
            posts = Post.find({
                $or: [
                    { title: regex },
                    { content: regex },
                    { tags: { $in: [regex] } }   // ✅ FIXED
                ],
                ...(type ? { type } : {}),
            })
                .select("title content type author _id")
                .populate("author", "name")
                .limit(10)
                .sort({ createdAt: -1 });
            console.log("Posts found:", posts.length);

        } else {
            console.log("Searching for:", q);
            // 🔥 GLOBAL SEARCH (parallel)
            [users, workspaces, posts] = await Promise.all([
                User.find({
                    $or: [
                        { name: regex },
                        { email: regex },
                        { fieldOfStudy: regex },
                        { institution: regex }
                    ],
                })
                    .select("name email fieldOfStudy institution _id")
                    .limit(5),

                Workspace.find({
                    $or: [
                        { title: regex },
                        { description: regex },
                        { tags: regex }
                    ],
                })
                    .select("title description _id")
                    .limit(5),


                Post.find({
                    $or: [
                        { title: regex },
                        { content: regex },
                        { tags: { $in: [regex] } }   // ✅ FIXED
                    ],
                    ...(type ? { type } : {}),
                })
                    .select("title content type author _id")
                    .populate("author", "name")
                    .limit(5)
                    .sort({ createdAt: -1 }),
            ]);
            console.log("Posts found:", posts.length);
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

module.exports = search; 