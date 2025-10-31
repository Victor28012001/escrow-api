import History from "../models/History.js";
import Artisan from "../models/Artisan.js";
import User from "../models/User.js";

export const addHistory = async (req, res) => {
  try {
    const { artisanId, service, amount, status } = req.body;
    
    // Check if artisan exists
    const artisan = await Artisan.findById(artisanId);
    if (!artisan) {
      return res.status(404).json({ message: "Artisan not found" });
    }

    // Check if user exists
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const history = await History.create({
      artisan: artisanId,
      customer: req.user.id,
      service,
      amount,
      status,
    });

    res.json({ 
      message: "History added successfully", 
      history 
    });
  } catch (error) {
    console.error("Error adding history:", error);
    res.status(500).json({ 
      error: "Failed to add history",
      message: error.message 
    });
  }
};

export const getUserHistory = async (req, res) => {
  try {
    const histories = await History.find({ customer: req.user.id })
      .populate("artisan", "walletAddress name service")
      .sort({ createdAt: -1 });

    res.json(histories);
  } catch (error) {
    console.error("Error getting user history:", error);
    res.status(500).json({ 
      error: "Failed to get user history",
      message: error.message 
    });
  }
};

export const getArtisanHistory = async (req, res) => {
  try {
    const { artisanId } = req.params;
    
    // Check if artisan exists
    const artisan = await Artisan.findById(artisanId);
    if (!artisan) {
      return res.status(404).json({ message: "Artisan not found" });
    }

    const histories = await History.find({ artisan: artisanId })
      .populate("customer", "walletAddress")
      .sort({ createdAt: -1 });

    res.json(histories);
  } catch (error) {
    console.error("Error getting artisan history:", error);
    res.status(500).json({ 
      error: "Failed to get artisan history",
      message: error.message 
    });
  }
};