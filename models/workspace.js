const mongoose = require('mongoose');

const workspaceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["research", "study", "lab"],
        required: true
    },
    privacy: {
        type: String,
        enum: ["public", "private"],
        required: true
    },
    tags: [{
        type: String
    }],
    // post: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Post",
    //     required: true
    // },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }],
}, { timestamps: true });


const Workspace = mongoose.model("Workspace", workspaceSchema);

module.exports = Workspace;