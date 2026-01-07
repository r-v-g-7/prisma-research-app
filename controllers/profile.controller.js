const useFindUserByUserId = require("../utils/useFindUserWithUserId");
const sendResponse = require("../utils/response");


const showProfile = async (req, res, next) => {
    try {
        const user = await useFindUserByUserId(req.userId)
        if (!user) {
            sendResponse(res, 401, false, "User NOT found, kindly login again");
            return
        }
        const { name, fieldOfStudy, institution, role } = user;
        sendResponse(res, 200, true, "Profile fetched Successfully", { name, role, fieldOfStudy, institution });
    } catch (err) {
        next(err);
    }
}

const updateProfile = async (req, res, next) => {
    try {
        const allowedFields = ["name", "fieldOfStudy", "institution"];
        const updateKeys = Object.keys(req.body);

        if (updateKeys.length === 0) {
            const err = new Error("No fields provided to update");
            err.statusCode = 400;
            return next(err);
        }

        const isValidToUpdate = updateKeys.every(key =>
            allowedFields.includes(key)
        );

        if (!isValidToUpdate) {
            const err = new Error("Invalid field(s) in update request");
            err.statusCode = 400;
            return next(err);
        }

        const user = await useFindUserByUserId(req.userId);

        if (!user) {
            const err = new Error("User not found");
            err.statusCode = 404;
            return next(err);
        }

        updateKeys.forEach(key => {
            user[key] = req.body[key];
        });

        await user.save();

        const { name, fieldOfStudy, institution } = user;

        return sendResponse(res, 200, true, "Profile updated successfully", { name, fieldOfStudy, institution }
        );

    } catch (err) {
        next(err);
    }
}

module.exports = { showProfile, updateProfile }; 