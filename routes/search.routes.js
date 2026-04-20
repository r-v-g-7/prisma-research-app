import express from "express";
import { search } from "../controllers/search.controller.js";
import { isTokenValid } from "../middleware/auth.js";

const searchRouter = express.Router();

searchRouter.get("/", isTokenValid, search);

export default searchRouter;