
import mongoose from 'mongoose';

const installmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
}, { _id: false });

const studentFeeSettingsSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
    unique: true,
    index: true,
  },
  mode: {
    type: String,
    enum: ['Full Payment', 'Installments'],
    required: true,
  },
  installments: [installmentSchema],
}, { timestamps: true });

export const StudentFeeSettings = mongoose.models.StudentFeeSettings || mongoose.model('StudentFeeSettings', studentFeeSettingsSchema);
