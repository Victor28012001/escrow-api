import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { addHistory, getUserHistory, getArtisanHistory } from "../controllers/historyController.js";

const router = express.Router();
router.post("/", protect, addHistory);
router.get("/user", protect, getUserHistory);
router.get("/artisan/:artisanId", getArtisanHistory);

export default router;
