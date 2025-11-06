
import mongoose from 'mongoose';

const feeNameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
}, { timestamps: true });

export const FeeName = mongoose.models.FeeName || mongoose.model('FeeName', feeNameSchema);
