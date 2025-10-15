
import mongoose from 'mongoose';

const attendanceRequestSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  attendanceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Attendance',
    required: true,
  },
  currentStatus: {
    type: String,
    enum: ['present', 'absent', 'late'],
    required: true,
  },
  requestedStatus: {
    type: String,
    enum: ['present', 'absent', 'late'],
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'denied'],
    default: 'pending',
  },
}, { timestamps: true });

export const AttendanceRequest = mongoose.models.AttendanceRequest || mongoose.model('AttendanceRequest', attendanceRequestSchema);
