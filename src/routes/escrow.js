import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createBooking,
  releasePayment,
  refundCustomer,
  getBalance,
  getArtisanDetails,
  getEscrowStatus,
  createAccount
} from "../utils/starknetClient.js";

const router = express.Router();

// Create booking (customer initiates escrow)
router.post("/booking", protect, async (req, res) => {
  try {
    const { artisanAddress, amount, privateKey } = req.body;
    const customerAddress = req.user.walletAddress;
    
    const account = createAccount(privateKey, customerAddress);
    const result = await createBooking(account, artisanAddress, amount);
    
    res.json({ 
      message: "Booking created successfully", 
      transactionHash: result.transaction_hash 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Release payment (customer releases funds to artisan)
router.post("/release", protect, async (req, res) => {
  try {
    const { artisanAddress, privateKey } = req.body;
    const customerAddress = req.user.walletAddress;
    
    const account = createAccount(privateKey, customerAddress);
    const result = await releasePayment(account, artisanAddress, customerAddress);
    
    res.json({ 
      message: "Payment released successfully", 
      transactionHash: result.transaction_hash 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Refund customer (artisan refunds funds)
router.post("/refund", protect, async (req, res) => {
  try {
    const { customerAddress, privateKey } = req.body;
    const artisanAddress = req.user.walletAddress;
    
    const account = createAccount(privateKey, artisanAddress);
    const result = await refundCustomer(account, artisanAddress, customerAddress);
    
    res.json({ 
      message: "Refund processed successfully", 
      transactionHash: result.transaction_hash 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user balance
router.get("/balance/:address", async (req, res) => {
  try {
    const balance = await getBalance(req.params.address);
    res.json({ balance: balance.toString() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get artisan details from blockchain
router.get("/artisan/:address", async (req, res) => {
  try {
    const details = await getArtisanDetails(req.params.address);
    res.json(details);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get escrow status
router.get("/status/:artisanAddress/:customerAddress", async (req, res) => {
  try {
    const status = await getEscrowStatus(req.params.artisanAddress, req.params.customerAddress);
    res.json({ status: status.toString() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;