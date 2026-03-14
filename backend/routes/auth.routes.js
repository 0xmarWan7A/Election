import express from "express";
import {
  login,
  logOut,
  register,
  getProfile,
  refreshToken,
} from "../controller/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js"; // Add this import

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logOut);
router.post("/refresh-token", refreshToken);
router.get("/profile", protect, getProfile); // Add protect middleware

export default router;
