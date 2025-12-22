const express = require("express")
const isTokenValid = require("../middleware/auth");
const useFindUserByUserId = require("../utils/useFindUserWithUserId");
const sendResponse = require("../utils/response");

const profileRouter = express.Router();

profileRouter.get("/show", isTokenValid, async (req, res, next) => {

    try {
        const user = await useFindUserByUserId(req.userId)
        if (!user) {
            sendResponse(res, 401, false, "User NOT found, kindly login again");
        }
        const { name, fieldOfStudy, institution, role } = user;
        sendResponse(res, 201, true, "Profile fetched Successfully", { name, role, fieldOfStudy, institution });
    } catch (err) {
        sendResponse(res, 400, false, "Something went wrong, User NOT found");
    }
})

profileRouter.patch("/update", isTokenValid, async (req, res, next) => {

    try {
        const user = await useFindUserByUserId();
        if (!user) {
            sendResponse(res, 401, false, "User NOT found, kindly login again");
        }
        const { name, fieldOfStudy, institution } = user;
    } catch (err) {
        sendResponse(res, 400, false, "Something went wrong, User NOT found")
    }


})

module.exports = profileRouter;