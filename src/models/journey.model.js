
import mongoose from 'mongoose';

const journeySchema = new mongoose.Schema({
  year: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

export const Journey = mongoose.models.Journey || mongoose.model('Journey', journeySchema);
