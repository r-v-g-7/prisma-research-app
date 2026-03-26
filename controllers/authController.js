const bcrypt = require("bcrypt")
const User = require("../models/user")
const jwt = require("jsonwebtoken");

const signUpAuth = async ({ name, email, password, role, fieldOfStudy, institution }) => {
    if (!name || !email || !password || !role || !fieldOfStudy) {
        const err = new Error("Missing required fields");
        err.statusCode = 400;
        throw err;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
        name,
        email,
        password: hashedPassword,
        role,
        fieldOfStudy,
        institution
    });
    try {
        console.log("Incoming signup data:", { name, email, password, role, fieldOfStudy, institution });
        await user.save();
        return user;
    } catch (err) {
        if (err.code === 11000) {
            const error = new Error("Email already exists");
            error.statusCode = 400;
            throw error;
        }
        throw err;
    }
};

const loginAuth = async ({ email, password }) => {
    if (!email || !password) {
        const err = new Error("Email or Password cannot be empty");
        err.statusCode = 400;
        throw err;
    }
    try {
        const user = await User.findOne({ email: email }).select("+password");
        if (!user) {
            const err = new Error("User NOT found");
            err.statusCode = 404;
            throw err;
        }
        const hashPassword = user.password;
        const isPasswordValid = await bcrypt.compare(password, hashPassword);
        if (!isPasswordValid) {
            throw new Error("Invalid password or Email");
        }

        return user

    } catch (err) {
        console.error("Error: ", err.message);
        throw err;
    }
}

module.exports = { signUpAuth, loginAuth }  