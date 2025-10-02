
// This file was created to define a data schema as requested.
// The standard architecture for this project uses TypeScript interfaces (see src/lib/types.ts)
// and Firebase for data modeling, not Mongoose-style schemas. This file is not
// currently integrated with the rest of the application.

// Mongoose-like schema definition for a Teacher
const teacherSchema = {
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
};

// In a Mongoose setup, you would create a model like this:
// import mongoose from 'mongoose';
// const schema = new mongoose.Schema(teacherSchema, { timestamps: true });
// export const Teacher = mongoose.models.Teacher || mongoose.model('Teacher', schema);

// For the purpose of this file, we'll just export the schema object.
module.exports = teacherSchema;
