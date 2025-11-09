
import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
  },
  answer: {
    type: String,
    required: true,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    required: true,
    default: 'General'
  }
}, { timestamps: true });

export const FAQ = mongoose.models.FAQ || mongoose.model('FAQ', faqSchema);
