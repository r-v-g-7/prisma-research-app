const jwt = require("jsonwebtoken");
const sendResponse = require("../utils/response");

const isTokenValid = (req, res, next) => {
    const { token } = req.cookies;
    try {
        if (!token) {
            sendResponse(res, 401, false, "Token not found")
            return
        }
        const decoded = jwt.verify(token, process.env.JWT_KEY)
        const { userId } = decoded;
        req.userId = userId;
        next();

    } catch (err) {
        sendResponse(res, 400, false, "User Not Verified")
    }

};

module.exports = isTokenValid;