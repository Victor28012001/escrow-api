import express from "express";
import { registerArtisan, createAccount } from "../utils/starknetClient.js";
import Artisan from "../models/Artisan.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { walletAddress, name, service, location, privateKey } = req.body;
    
    // Save to MongoDB
    const artisan = await Artisan.create({ 
      walletAddress, 
      name, 
      service, 
      location: {
        type: "Point",
        coordinates: [0, 0] // You can update this with actual coordinates
      }
    });
    
    // Register on blockchain
    const account = createAccount(privateKey, walletAddress);
    const tx = await registerArtisan(account, name, service, location);
    
    res.json({ 
      message: "Artisan registered successfully", 
      artisan,
      transactionHash: tx.transaction_hash 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get artisan details (combines MongoDB and blockchain data)
router.get("/:address", async (req, res) => {
  try {
    const { address } = req.params;
    
    // Get from MongoDB
    const artisan = await Artisan.findOne({ walletAddress: address });
    if (!artisan) {
      return res.status(404).json({ message: "Artisan not found" });
    }
    
    // Get from blockchain
    const blockchainDetails = await getArtisanDetails(address);
    
    res.json({
      ...artisan.toObject(),
      blockchainDetails
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;