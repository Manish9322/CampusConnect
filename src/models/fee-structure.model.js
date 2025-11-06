
import mongoose from 'mongoose';

const feeStructureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Academic', 'Hostel', 'Transportation', 'Miscellaneous'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

export const FeeStructure = mongoose.models.FeeStructure || mongoose.model('FeeStructure', feeStructureSchema);
