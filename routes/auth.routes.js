const express = require("express")
const { signUpAuth, loginAuth } = require("../controllers/authController")

const authRouter = express.Router();

authRouter.post("/register", async (req, res, next) => {
    try {
        await signUpAuth(req.body);
        res.status(201).send("signup auth is meant to work");
    } catch (err) {
        res.status(400).send("ERROR: " + err.message)
    }
})

authRouter.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;
        await loginAuth({ email, password });
        res.status(201).send("login auth is meant to work")
    } catch (err) {
        res.status(400).send("ERROR: " + err.message)
    }
})

module.exports = authRouter;