
// This file was created to define a data schema as requested.
// The standard architecture for this project uses TypeScript interfaces (see src/lib/types.ts)
// and Firebase for data modeling, not Mongoose-style schemas. This file is not
// currently integrated with the rest of the application and will not function
// without a connection to a MongoDB database.

import mongoose from 'mongoose';

// Mongoose schema definition for a Teacher
const teacherSchema = new mongoose.Schema({
  teacherId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
  },
  department: {
    type: String,
    required: true,
  },
  courses: {
    type: [String],
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  role: {
    type: String,
    default: 'teacher',
  },
}, { timestamps: true });

// In a Mongoose setup, you would create and export a model like this.
// This line will cause an error if a MongoDB connection is not established.
export const Teacher = mongoose.models.Teacher || mongoose.model('Teacher', teacherSchema);
