// import express from "express";
// import { getNonce, verifySignature } from "../controllers/authController.js";

// const router = express.Router();
// router.post("/nonce", getNonce);
// router.post("/verify", verifySignature);

// export default router;
import express from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const router = express.Router();

// Simple in-memory storage (resets on server restart)
const userSessions = new Map();

router.post("/nonce", (req, res) => {
  const { walletAddress } = req.body;
  if (!walletAddress) {
    return res.status(400).json({ message: "Wallet address required" });
  }

  const nonce = crypto.randomBytes(16).toString("hex");
  userSessions.set(walletAddress, { nonce, walletAddress });
  
  res.json({ nonce });
});

router.post("/verify", (req, res) => {
  const { walletAddress, signature } = req.body;
  if (!walletAddress || !signature) {
    return res.status(400).json({ message: "Missing parameters" });
  }

  const userSession = userSessions.get(walletAddress);
  if (!userSession) {
    return res.status(400).json({ message: "Session not found" });
  }

  // For now, accept any signature (you can add proper verification later)
  const token = jwt.sign(
    { walletAddress },
    process.env.JWT_SECRET || "blockchain-secret",
    { expiresIn: "7d" }
  );

  res.json({ 
    token, 
    user: { walletAddress },
    message: "Logged in successfully - Using blockchain storage"
  });
});

export default router;