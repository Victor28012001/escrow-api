import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true, unique: true },
  nonce: { type: String },
  role: { type: String, enum: ["customer", "artisan"], default: "customer" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', userSchema);