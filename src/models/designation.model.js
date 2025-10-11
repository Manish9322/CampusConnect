import mongoose from 'mongoose';

const designationSchema = new mongoose.Schema({
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
}, { timestamps: true });

export const Designation = mongoose.models.Designation || mongoose.model('Designation', designationSchema);
