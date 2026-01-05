const sendResponse = require("../utils/response")

const errorHandler = (error, req, res, next) => {

    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal server error";

    if (error.name === "ValidationError") {
        sendResponse(res, 400, false, message);
    }
    else if (error.name === "CastError") {
        sendResponse(res, 400, false, "Invalid ID format");
    }
    else if (error.name === "JsonWebTokenError") {
        sendResponse(res, 401, false, "Invalid token");
    }
    else if (error.name === "TokenExpiredError") {
        sendResponse(res, 401, false, "Token expired");
    }
    else sendResponse(res, statusCode, false, message);

}

module.exports = { errorHandler }; 