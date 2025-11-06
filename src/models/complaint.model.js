import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  studentRollNo: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Academic', 'Hostel', 'Faculty', 'Infrastructure', 'Other'],
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
    default: 'Pending',
  },
}, { timestamps: true });

export const Complaint = mongoose.models.Complaint || mongoose.model('Complaint', complaintSchema);
