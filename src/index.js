// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import mongoose from "mongoose";

// // Your other imports...
// import authRoutes from "./routes/authRoutes.js";
// import reviewRoutes from "./routes/reviewRoutes.js";
// import historyRoutes from "./routes/historyRoutes.js";
// import artisanRoutes from "./routes/artisans.js";
// import escrowRoutes from "./routes/escrow.js";

// dotenv.config();

// const app = express();

// // Middleware
// app.use(cors({
//   origin: [
//     "http://localhost:3000",
//     "https://escrow-api-topaz.vercel.app",
//     process.env.FRONTEND_URL
//   ].filter(Boolean),
//   credentials: true
// }));

// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true }));

// // MongoDB connection
// const connectDB = async () => {
//   try {
//     if (process.env.MONGO_URI) {
//       await mongoose.connect(process.env.MONGO_URI);
//       console.log("MongoDB Connected");
//     } else {
//       console.warn("MONGO_URI not set, running without database");
//     }
//   } catch (error) {
//     console.error("MongoDB connection error:", error.message);
//     // Don't crash the app, continue without DB
//   }
// };

// connectDB();

// // Routes
// app.get("/", (req, res) => {
//   res.json({ 
//     message: "Artisan Escrow API is running", 
//     timestamp: new Date().toISOString() 
//   });
// });

// app.get("/api/health", (req, res) => {
//   res.json({ 
//     status: "OK", 
//     database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
//     timestamp: new Date().toISOString()
//   });
// });

// app.use("/api/auth", authRoutes);
// app.use("/api/artisans", artisanRoutes);
// app.use("/api/reviews", reviewRoutes);
// app.use("/api/history", historyRoutes);
// app.use("/api/escrow", escrowRoutes);

// // Error handling
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ 
//     error: "Something went wrong!",
//     message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
//   });
// });

// // 404 handler
// app.use((req, res) => {
//   res.status(404).json({ error: "Route not found" });
// });

// const PORT = process.env.PORT || 4000;

// // Export the app for Vercel
// export default app;

// // Only listen if not in Vercel environment
// if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
//   app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//   });
// }
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://escrow-api-topaz.vercel.app",
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
const connectDB = async () => {
  try {
    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("MongoDB Connected");
    } else {
      console.warn("MONGO_URI not set, running without database");
    }
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
  }
};

connectDB();

// Routes
app.get("/", (req, res) => {
  res.json({ 
    message: "Artisan Escrow API is running", 
    timestamp: new Date().toISOString() 
  });
});

app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    timestamp: new Date().toISOString()
  });
});

// TEST: Add routes one by one to find which one crashes

// First, test without any routes
app.get("/api/test", (req, res) => {
  res.json({ message: "Basic route working" });
});

// Then uncomment one by one:
import authRoutes from "./routes/authRoutes.js";
app.use("/api/auth", authRoutes);

import artisanRoutes from "./routes/artisans.js";
app.use("/api/artisans", artisanRoutes);

import escrowRoutes from "./routes/escrow.js";
app.use("/api/escrow", escrowRoutes);

// import reviewRoutes from "./routes/reviewRoutes.js";
// app.use("/api/reviews", reviewRoutes);

// try {
//   import("./routes/historyRoutes.js").then(module => {
//     app.use("/api/history", module.default);
//   });
// } catch (error) {
//   console.error("Failed to load history routes:", error);
// }

// Test route for history
// app.get("/api/history-test", (req, res) => {
//   res.json({ message: "History route test - working" });
// });

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: "Something went wrong!",
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

export default app;