
import mongoose from 'mongoose';

const socialLinkSchema = new mongoose.Schema({
  platform: {
    type: String,
    enum: ['LinkedIn', 'GitHub', 'Twitter'],
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
}, { _id: false });

const staffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String, // URL to the image
    required: false,
  },
  initials: {
    type: String,
    required: true,
  },
  socials: [socialLinkSchema],
  order: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

export const Staff = mongoose.models.Staff || mongoose.model('Staff', staffSchema);
