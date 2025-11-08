
import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  year: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  teacherId: {
    type: String,
    ref: 'Teacher',
    required: true,
  },
  subjects: {
    type: [String],
    required: true,
  },
  studentCount: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

export const Class = mongoose.models.Class || mongoose.model('Class', classSchema);
