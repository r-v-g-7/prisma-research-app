const jwt = require("jsonwebtoken");
const sendResponse = require("../utils/response");

const isTokenValid = (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            sendResponse(res, 401, false, "Token not found")
            return
        }
        const decoded = jwt.verify(token, process.env.JWT_KEY)
        const { userId, role } = decoded;
        req.userId = userId;
        req.role = role;
        next();

    } catch (err) {
        sendResponse(res, 400, false, "Kindly Login Again")
    }

};

function isRoleValid(allowedRole) {
    return (req, res, next) => {
        if (!req.role) {
            sendResponse(res, 401, false, "Unautharized Access");
            return
        }
        if (req.role === allowedRole) {
            next();
        } else {
            sendResponse(res, 403, false, "Access Denied");
        }
    }
}


module.exports = { isTokenValid, isRoleValid }