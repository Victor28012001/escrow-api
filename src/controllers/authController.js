import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { ethers } from "ethers";
import crypto from "crypto";

export const getNonce = async (req, res) => {
  const { walletAddress } = req.body;
  if (!walletAddress) return res.status(400).json({ message: "Wallet address required" });

  let user = await User.findOne({ walletAddress });
  const nonce = crypto.randomBytes(16).toString("hex");

  if (!user) user = await User.create({ walletAddress, nonce });
  else {
    user.nonce = nonce;
    await user.save();
  }

  res.json({ nonce });
};

export const verifySignature = async (req, res) => {
  const { walletAddress, signature } = req.body;
  if (!walletAddress || !signature)
    return res.status(400).json({ message: "Missing parameters" });

  const user = await User.findOne({ walletAddress });
  if (!user) return res.status(400).json({ message: "User not found" });

  const message = `Login with nonce: ${user.nonce}`;
  const recoveredAddress = ethers.verifyMessage(message, signature);

  if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
    return res.status(401).json({ message: "Invalid signature" });
  }

  const token = jwt.sign(
    { id: user._id, walletAddress: user.walletAddress, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  user.nonce = crypto.randomBytes(16).toString("hex");
  await user.save();

  res.json({ token, user });
};
