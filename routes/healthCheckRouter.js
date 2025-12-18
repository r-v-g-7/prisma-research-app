const express = require("express")

const healthRouter = express.Router();

healthRouter.get("/health", (req, res, next) => {
    const jsonData = {
        "hey": "greeting",
        "sir": "salutation"
    }
    res.send(jsonData);
});


module.exports = healthRouter; 
