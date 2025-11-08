
import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  designation: {
    type: String,
    trim: true,
  },
  quote: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: false,
  },
  initials: {
    type: String,
    required: true,
  },
  approved: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

export const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', testimonialSchema);
