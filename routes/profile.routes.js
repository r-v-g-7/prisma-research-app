const express = require("express")
const isTokenValid = require("../middleware/auth");
const useFindUserByUserId = require("../utils/useFindUserWithUserId");

const profileRouter = express.Router();

profileRouter.get("/show", isTokenValid, async (req, res, next) => {

    const user = await useFindUserByUserId(req.userId)
    res.send(user)

})

module.exports = profileRouter;