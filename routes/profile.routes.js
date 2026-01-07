const express = require("express")
const { isTokenValid } = require("../middleware/auth");
const { showProfile, updateProfile } = require("../controllers/profile.controller");

const profileRouter = express.Router();

profileRouter.get("/show", isTokenValid, showProfile);

profileRouter.patch("/update", isTokenValid, updateProfile);


module.exports = profileRouter;