import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { addReview, getReviews } from "../controllers/reviewController.js";

const router = express.Router();
router.post("/", protect, addReview);
router.get("/:artisanId", getReviews);

export default router;
