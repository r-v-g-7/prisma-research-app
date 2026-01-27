const express = require("express")
const { signUpAuth, loginAuth } = require("../controllers/authController")
const jwt = require("jsonwebtoken")
const sendResponse = require("../utils/response")
const { isTokenValid } = require("../middleware/auth.js")

const authRouter = express.Router();

authRouter.post("/register", async (req, res, next) => {

    try {
        const user = await signUpAuth(req.body);
        sendResponse(res, 201, true, "Registration Successfull", user);

    } catch (err) {
        next(err);
    }
});

authRouter.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await loginAuth({ email, password });
        if (!user) {
            const err = new Error("Wrong email or password");
            err.statusCode = 401;
            return next(err);
        }
        const { _id, role } = user;
        const token = jwt.sign({ userId: _id, userRole: role }, process.env.JWT_KEY, { expiresIn: '1y' });
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
        });
        console.log("User Login successfully", user);
        sendResponse(res, 200, true, "Login Successfull", user);
    } catch (err) {
        next(err);
    }
});

authRouter.post("/me", isTokenValid, (req, res, next) => {
    res.send("Yes the token is valid")
});

module.exports = authRouter;