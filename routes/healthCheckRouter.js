const express = require("express")

const healthRouter = express.Router();

healthRouter.get("/health", (req, res, next) => {
    const jsonData = {
        "hey": "greeting",
        "sir": "salutation"
    }
    try {
        res.send(jsonData);
    } catch (err) {
        console.error("ERROR: " + err);
    }
});

module.exports = healthRouter; 
