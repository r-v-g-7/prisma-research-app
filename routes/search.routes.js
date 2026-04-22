console.log("✅ search.routes.js loaded");

const express = require("express");
const search = require("../controllers/search.controller");
const { isTokenValid } = require("../middleware/auth");

const searchRouter = express.Router();

searchRouter.get("/", isTokenValid, search);

module.exports = searchRouter;