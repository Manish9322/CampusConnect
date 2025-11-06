
import mongoose from 'mongoose';

const installmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
}, { _id: false });

const feeSettingsSchema = new mongoose.Schema({
  mode: {
    type: String,
    enum: ['Full Payment', 'Installments'],
    default: 'Full Payment',
  },
  installments: [installmentSchema],
}, { timestamps: true });

export const FeeSettings = mongoose.models.FeeSettings || mongoose.model('FeeSettings', feeSettingsSchema);
