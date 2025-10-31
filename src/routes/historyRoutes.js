import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { addHistory, getUserHistory, getArtisanHistory } from "../controllers/historyController.js";

const router = express.Router();

// Test route without protection
router.get("/test", (req, res) => {
  res.json({ message: "History routes are working" });
});

// Protected routes
router.post("/", protect, addHistory);
router.get("/user", protect, getUserHistory);
router.get("/artisan/:artisanId", getArtisanHistory);

export default router;