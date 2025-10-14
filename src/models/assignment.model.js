
import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  courseId: {
    type: String,
    required: true,
  },
  courseName: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  type: {
    type: String,
    enum: ['Assignment', 'Quiz', 'Exam'],
    required: true,
  },
  dueDate: {
    type: String,
    required: true,
  },
  totalMarks: {
    type: Number,
    required: true,
  },
  attachments: [{
    name: String,
    url: String,
  }],
}, { timestamps: true });

export const Assignment = mongoose.models.Assignment || mongoose.model('Assignment', assignmentSchema);
