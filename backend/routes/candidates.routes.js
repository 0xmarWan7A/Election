import express from "express";
import {
  getAllCandidates,
  createCandidate,
  deleteCandidate,
  getCandidateByPosition,
} from "../controller/candidates.controller.js";
import { adminAuth, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Make these routes public (no authentication needed)
router.get("/", getAllCandidates); // Remove protect middleware
router.get("/:position", getCandidateByPosition); // Already public

// Keep these protected (admin only)
router.post("/", protect, adminAuth, createCandidate);
router.delete("/:id", protect, adminAuth, deleteCandidate);

export default router;
