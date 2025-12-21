const jwt = require("jsonwebtoken");
const sendResponse = require("../utils/response");

const isTokenValid = (req, res) => {
    const { token } = req.cookies;
    try {
        if (!token) {
            sendResponse(res, 401, false, "Token not found")
            return
        }

        const decoded = jwt.verify(token, process.env.JWT_KEY)
        console.log(decoded);

        next();

    } catch (err) {
        throw err
    }

};

module.exports = isTokenValid;