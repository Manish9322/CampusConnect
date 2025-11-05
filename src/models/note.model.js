
import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
    index: true,
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: false, // Can be null if sent by admin
  },
  senderRole: {
    type: String,
    enum: ['teacher', 'admin'],
    required: true,
  },
  senderName: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  category: {
    type: String,
    enum: ['academic', 'disciplinary', 'attendance', 'fees', 'general', 'achievement'],
    default: 'general',
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  readAt: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

// Indexes for better query performance
noteSchema.index({ studentId: 1, createdAt: -1 });
noteSchema.index({ isRead: 1 });
noteSchema.index({ priority: 1 });

export const Note = mongoose.models.Note || mongoose.model('Note', noteSchema);
