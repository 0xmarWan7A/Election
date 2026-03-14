import express from "express";
import {
  vote,
  listUsersWithVotingInfo,
  clearUserVote,
} from "../controller/vote.controller.js";
import { adminAuth, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Voting requires authentication
router.post("/", protect, vote);

// Admin only routes
router.get("/", protect, adminAuth, listUsersWithVotingInfo);
router.delete("/:id", protect, adminAuth, clearUserVote);

export default router;
