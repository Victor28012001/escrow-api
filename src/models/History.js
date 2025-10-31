import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
  artisan: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Artisan", 
    required: true 
  },
  customer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  service: { type: String },
  amount: { type: Number },
  status: { 
    type: String, 
    enum: ["pending", "completed", "cancelled"], 
    default: "pending" 
  },
  transactionHash: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('History', historySchema);