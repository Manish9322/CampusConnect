
import mongoose from 'mongoose';

const periodSchema = new mongoose.Schema({
  periodNumber: {
    type: Number,
    required: true,
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  },
  subjectName: {
    type: String,
    required: true,
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true,
  },
  teacherName: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  room: {
    type: String,
    required: false,
  },
}, { _id: false });

const timetableSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
    index: true,
  },
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    required: true,
  },
  periods: {
    type: [periodSchema],
    default: [],
  },
}, { timestamps: true });

// Compound index for efficient queries
timetableSchema.index({ classId: 1, day: 1 }, { unique: true });

export const Timetable = mongoose.models.Timetable || mongoose.model('Timetable', timetableSchema);
