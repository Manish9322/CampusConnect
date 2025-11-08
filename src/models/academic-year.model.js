
import mongoose from 'mongoose';

const academicYearSchema = new mongoose.Schema({
  semesterStartDate: {
    type: Date,
    required: true,
  },
  semesterEndDate: {
    type: Date,
    required: true,
  },
}, { timestamps: true });

export const AcademicYear = mongoose.models.AcademicYear || mongoose.model('AcademicYear', academicYearSchema);

    