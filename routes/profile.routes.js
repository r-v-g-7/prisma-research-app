const express = require("express")
const isTokenValid = require("../middleware/auth");
const useFindUserByUserId = require("../utils/useFindUserWithUserId");
const sendResponse = require("../utils/response");
const User = require("../models/user");

const profileRouter = express.Router();

profileRouter.get("/show", isTokenValid, async (req, res, next) => {

    try {
        const user = await useFindUserByUserId(req.userId)
        if (!user) {
            sendResponse(res, 401, false, "User NOT found, kindly login again");
            return
        }
        const { name, fieldOfStudy, institution, role } = user;
        sendResponse(res, 201, true, "Profile fetched Successfully", { name, role, fieldOfStudy, institution });
    } catch (err) {
        sendResponse(res, 400, false, "Something went wrong, User NOT found");
    }
})

profileRouter.patch("/update", isTokenValid, async (req, res, next) => {

    try {
        const allowedFields = ["name", "fieldOfStudy", "institution"];
        const toUpdateObject = req.body;
        const toUpdateKeys = Object.keys(toUpdateObject);
        console.log(toUpdateKeys);

        const isValidToUpdate = toUpdateKeys.every((key) =>
            allowedFields.includes(key)
        );

        if (!isValidToUpdate) {
            sendResponse(res, 401, false, "Respective value cannot be changed")
            return;
        }
        const user = await useFindUserByUserId(req.userId);
        if (!user) {
            sendResponse(res, 401, false, "User NOT found, kindly login again");
            return
        }

        toUpdateKeys.forEach((key) =>
            user[key] = req.body[key]
        )

        await user.save();

        sendResponse(res, 200, true, "User Updated Succesfully", user);

    } catch (err) {
        sendResponse(res, 400, false, "Something went wrong")
    }
});


module.exports = profileRouter;