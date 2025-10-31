import mongoose from 'mongoose';

const artisanSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true, unique: true },
  name: { type: String },
  service: { type: String },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: [0, 0] },
  },
  averageRating: { type: Number, default: 0 },
  completedJobs: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Artisan', artisanSchema);