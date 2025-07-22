import express from "express";
import { login, logout, purchases, signup } from "../controllers/user.controller.js";
import userMiddleware from "../middlewares/user.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/purchases", userMiddleware, purchases);

export default router;
