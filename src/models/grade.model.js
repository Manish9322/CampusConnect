
import mongoose from 'mongoose';

const gradeSchema = new mongoose.Schema({
  studentId: {
    type: String,
    ref: 'Student',
    required: true,
  },
  assignmentId: {
    type: String,
    ref: 'Assignment',
    required: true,
  },
  marks: {
    type: Number,
    default: null,
  },
  status: {
    type: String,
    enum: ['Pending', 'Submitted', 'Late'],
    default: 'Pending',
  },
  submittedAt: {
    type: Date,
    default: null,
  },
  feedback: {
    type: String,
    default: '',
  },
  submissionUrl: {
    type: String,
    default: '',
  }
}, { timestamps: true });

gradeSchema.index({ studentId: 1, assignmentId: 1 }, { unique: true });

export const Grade = mongoose.models.Grade || mongoose.model('Grade', gradeSchema);
