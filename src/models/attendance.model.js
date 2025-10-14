
import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  studentId: {
    type: String,
    ref: 'Student',
    required: true,
  },
  classId: {
    type: String,
    ref: 'Class',
    required: true,
  },
  date: {
    type: String, // Storing as YYYY-MM-DD string
    required: true,
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late'],
    required: true,
  },
  recordedBy: {
    type: String,
    ref: 'Teacher',
    required: true,
  },
}, { timestamps: true });

// To prevent duplicate records for the same student, class, and date
attendanceSchema.index({ studentId: 1, classId: 1, date: 1 }, { unique: true });

export const Attendance = mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);
