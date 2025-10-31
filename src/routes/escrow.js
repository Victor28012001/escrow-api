// import express from "express";
// import { protect } from "../middleware/authMiddleware.js";
// import {
//   createBooking,
//   releasePayment,
//   refundCustomer,
//   getBalance,
//   getArtisanDetails,
//   getEscrowStatus,
//   createAccount
// } from "../utils/starknetClient.js";

// const router = express.Router();

// // Create booking (customer initiates escrow)
// router.post("/booking", protect, async (req, res) => {
//   try {
//     const { artisanAddress, amount, privateKey } = req.body;
//     const customerAddress = req.user.walletAddress;
    
//     const account = createAccount(privateKey, customerAddress);
//     const result = await createBooking(account, artisanAddress, amount);
    
//     res.json({ 
//       message: "Booking created successfully", 
//       transactionHash: result.transaction_hash 
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Release payment (customer releases funds to artisan)
// router.post("/release", protect, async (req, res) => {
//   try {
//     const { artisanAddress, privateKey } = req.body;
//     const customerAddress = req.user.walletAddress;
    
//     const account = createAccount(privateKey, customerAddress);
//     const result = await releasePayment(account, artisanAddress, customerAddress);
    
//     res.json({ 
//       message: "Payment released successfully", 
//       transactionHash: result.transaction_hash 
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Refund customer (artisan refunds funds)
// router.post("/refund", protect, async (req, res) => {
//   try {
//     const { customerAddress, privateKey } = req.body;
//     const artisanAddress = req.user.walletAddress;
    
//     const account = createAccount(privateKey, artisanAddress);
//     const result = await refundCustomer(account, artisanAddress, customerAddress);
    
//     res.json({ 
//       message: "Refund processed successfully", 
//       transactionHash: result.transaction_hash 
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get user balance
// router.get("/balance/:address", async (req, res) => {
//   try {
//     const balance = await getBalance(req.params.address);
//     res.json({ balance: balance.toString() });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get artisan details from blockchain
// router.get("/artisan/:address", async (req, res) => {
//   try {
//     const details = await getArtisanDetails(req.params.address);
//     res.json(details);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get escrow status
// router.get("/status/:artisanAddress/:customerAddress", async (req, res) => {
//   try {
//     const status = await getEscrowStatus(req.params.artisanAddress, req.params.customerAddress);
//     res.json({ status: status.toString() });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// export default router;
import express from "express";
import {
  createBooking,
  releasePayment,
  refundCustomer,
  getBalance,
  getArtisanDetails,
  getEscrowStatus,
  getEscrowBalance,
  addBalance,
  createAccount,
  isStarkNetAvailable
} from "../utils/starknetClient.js";

const router = express.Router();

// Health check
router.get("/health", (req, res) => {
  res.json({ 
    starknet: isStarkNetAvailable() ? "Available" : "Unavailable",
    contract: process.env.CONTRACT_ADDRESS || "Not set",
    message: "Blockchain-only escrow API"
  });
});

// Add balance to user (for testing)
router.post("/add-balance", async (req, res) => {
  try {
    const { userAddress, amount, privateKey } = req.body;
    
    const account = createAccount(privateKey, userAddress);
    const result = await addBalance(account, userAddress, amount);
    
    res.json({ 
      message: "Balance added successfully", 
      transactionHash: result.transaction_hash 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create booking (customer initiates escrow)
router.post("/booking", async (req, res) => {
  try {
    const { artisanAddress, amount, privateKey, customerAddress } = req.body;
    
    const account = createAccount(privateKey, customerAddress);
    const result = await createBooking(account, artisanAddress, amount);
    
    res.json({ 
      message: "Booking created successfully on blockchain", 
      transactionHash: result.transaction_hash 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Release payment (customer releases funds to artisan)
router.post("/release", async (req, res) => {
  try {
    const { artisanAddress, privateKey, customerAddress } = req.body;
    
    const account = createAccount(privateKey, customerAddress);
    const result = await releasePayment(account, artisanAddress, customerAddress);
    
    res.json({ 
      message: "Payment released successfully on blockchain", 
      transactionHash: result.transaction_hash 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Refund customer (artisan refunds funds)
router.post("/refund", async (req, res) => {
  try {
    const { customerAddress, privateKey, artisanAddress } = req.body;
    
    const account = createAccount(privateKey, artisanAddress);
    const result = await refundCustomer(account, artisanAddress, customerAddress);
    
    res.json({ 
      message: "Refund processed successfully on blockchain", 
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
    res.json({ 
      address: req.params.address,
      balance: balance.toString(),
      source: "blockchain" 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get artisan details from blockchain
router.get("/artisan/:address", async (req, res) => {
  try {
    const details = await getArtisanDetails(req.params.address);
    res.json({
      address: req.params.address,
      ...details,
      source: "blockchain"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get escrow status
router.get("/status/:artisanAddress/:customerAddress", async (req, res) => {
  try {
    const status = await getEscrowStatus(req.params.artisanAddress, req.params.customerAddress);
    res.json({ 
      artisanAddress: req.params.artisanAddress,
      customerAddress: req.params.customerAddress,
      status: status.toString(),
      source: "blockchain"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get escrow balance
router.get("/escrow-balance/:artisanAddress/:customerAddress", async (req, res) => {
  try {
    const balance = await getEscrowBalance(req.params.artisanAddress, req.params.customerAddress);
    res.json({ 
      artisanAddress: req.params.artisanAddress,
      customerAddress: req.params.customerAddress,
      balance: balance.toString(),
      source: "blockchain"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;