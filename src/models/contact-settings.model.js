
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

const contactSettingsSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  mapUrl: {
    type: String,
    required: true,
    trim: true,
  },
  socials: [socialLinkSchema],
}, { timestamps: true });

export const ContactSettings = mongoose.models.ContactSettings || mongoose.model('ContactSettings', contactSettingsSchema);

    