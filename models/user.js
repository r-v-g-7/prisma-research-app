const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        select: false,
    },
    role: {
        type: String,
        required: true,
        enum: ["student", "professor"]
    },
    fieldOfStudy: {
        type: String,
        required: true,
        trim: true
    },
    institution: {
        type: String,
        required: true,
        trim: true
    },

}, { timestamps: true });



userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    const saltRounds = parseInt(process.env.SALT_ROUNDS || 10)
    this.password = await bcrypt.hash(this.password, saltRounds);
})



const User = mongoose.model("User", userSchema);

module.exports = User;

