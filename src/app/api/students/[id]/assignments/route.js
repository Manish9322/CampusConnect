import { NextResponse } from 'next/server';
import _db from '@/lib/db';
import { Assignment } from '@/models/assignment.model.js';
import { Student } from '@/models/student.model.js';

export async function GET(request, { params }) {
  await _db();
  try {
    const studentId = params.id;
    if (!studentId) {
      return NextResponse.json({ message: 'Student ID is required' }, { status: 400 });
    }
    
    // 1. Find the student to get their classId
    const student = await Student.findById(studentId);
    if (!student) {
        return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }
    const studentClassId = student.classId;

    // 2. Find all assignments that belong to the student's class
    const assignments = await Assignment.find({ courseId: studentClassId }).sort({ dueDate: -1 });
    
    return NextResponse.json(assignments, { status: 200 });
  } catch (error) {
    console.error('Error fetching assignments for student:', error);
    return NextResponse.json({ 
      message: 'Error fetching assignments for student', 
      error: error.message 
    }, { status: 500 });
  }
}
