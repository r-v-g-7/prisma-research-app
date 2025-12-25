const bcrypt = require("bcrypt")
const User = require("../models/user")

const signUpAuth = async ({ name, email, password, role, fieldOfStudy, institution }) => {
    const user = new User({ name, email, password, role, fieldOfStudy, institution });
    try {
        await user.save()
        return user
    } catch (err) {
        console.error("Something went wrong in signing up the user");
        throw err;
    }
};

const loginAuth = async ({ email, password }) => {
    try {
        const user = await User.findOne({ email: email }).select("+password");
        if (!user) {
            throw new Error("Error 404 User NOT FOUND");
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