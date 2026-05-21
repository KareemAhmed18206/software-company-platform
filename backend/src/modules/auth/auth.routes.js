import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware.js";
import { authRateLimiter } from "../../middleware/security.middleware.js";
import { getMe, login, logout, register } from "./auth.controller.js";

const router = Router();

router.post("/register", authRateLimiter, register);
router.post("/login", authRateLimiter, login);
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, getMe);

export default router;
