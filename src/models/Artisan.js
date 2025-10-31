import mongoose from "mongoose";

const artisanSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true, unique: true },
  name: { type: String },
  service: { type: String },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], index: "2dsphere" },
  },
  averageRating: { type: Number, default: 0 },
  completedJobs: { type: Number, default: 0 },
});

export default mongoose.model("Artisan", artisanSchema);
