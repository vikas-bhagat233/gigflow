// gig.routes.js
import express from "express";
import { getGigs, getGigById, createGig } from "../controllers/gig.controller.js";
import { protect } from "../middleware/auth.middleware.js";
const router = express.Router();
router.get("/", getGigs);
router.get("/:id", getGigById);
router.post("/", protect, createGig);
export default router;
