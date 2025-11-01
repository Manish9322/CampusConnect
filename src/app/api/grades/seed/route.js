import { NextResponse } from 'next/server';
import _db from '@/lib/db';
import { Grade } from '@/models/grade.model.js';
import { Assignment } from '@/models/assignment.model.js';
import { Student } from '@/models/student.model.js';

export async function POST(request) {
  await _db();
  try {
    // Get all assignments and students
    const assignments = await Assignment.find();
    const students = await Student.find();
    
    if (assignments.length === 0 || students.length === 0) {
      return NextResponse.json({ 
        message: 'No assignments or students found. Please create some first.' 
      }, { status: 400 });
    }

    const gradesCreated = [];
    const errors = [];
    
    // Create sample submissions for 60-80% of students for each assignment
    for (const assignment of assignments) {
      // Filter students by class
      const classStudents = students.filter(s => s.classId === assignment.courseId);
      
      // Randomly select 60-80% of students to have submitted
      const submissionRate = Math.random() * 0.2 + 0.6; // 0.6 to 0.8
      const numSubmissions = Math.floor(classStudents.length * submissionRate);
      
      // Shuffle and take first N students
      const shuffled = [...classStudents].sort(() => Math.random() - 0.5);
      const submittingStudents = shuffled.slice(0, numSubmissions);
      
      for (const student of submittingStudents) {
        try {
          // Check if submission already exists
          const existing = await Grade.findOne({
            studentId: student._id.toString(),
            assignmentId: assignment._id.toString()
          });
          
          if (existing) {
            continue; // Skip if already exists
          }
          
          // Determine if submission is late (20% chance)
          const isLate = Math.random() < 0.2;
          const status = isLate ? 'Late' : 'Submitted';
          
          // 70% of submissions are already graded
          const isGraded = Math.random() < 0.7;
          const marks = isGraded 
            ? Math.floor(Math.random() * (assignment.totalMarks - assignment.totalMarks * 0.5) + assignment.totalMarks * 0.5)
            : null;
          
          // Create submission date (within last 30 days)
          const daysAgo = Math.floor(Math.random() * 30);
          const submittedAt = new Date();
          submittedAt.setDate(submittedAt.getDate() - daysAgo);
          
          const newGrade = new Grade({
            studentId: student._id.toString(),
            assignmentId: assignment._id.toString(),
            marks: marks,
            status: status,
            submittedAt: submittedAt.toISOString(),
            feedback: marks !== null ? (marks >= assignment.totalMarks * 0.8 ? 'Excellent work!' : marks >= assignment.totalMarks * 0.6 ? 'Good effort!' : 'Needs improvement.') : '',
            submissionUrl: `/uploads/assignments/sample_${student._id}_${assignment._id}.pdf`
          });
          
          await newGrade.save();
          gradesCreated.push({
            student: student.name,
            assignment: assignment.title,
            status: status,
            marks: marks
          });
        } catch (error) {
          if (error.code !== 11000) { // Ignore duplicate key errors
            errors.push({
              student: student.name,
              assignment: assignment.title,
              error: error.message
            });
          }
        }
      }
    }
    
    return NextResponse.json({ 
      message: 'Sample submissions created successfully',
      created: gradesCreated.length,
      details: gradesCreated,
      errors: errors
    }, { status: 201 });
    
  } catch (error) {
    return NextResponse.json({ 
      message: 'Error creating sample submissions', 
      error: error.message 
    }, { status: 500 });
  }
}

// DELETE endpoint to clear all grades (for testing)
export async function DELETE(request) {
  await _db();
  try {
    const result = await Grade.deleteMany({});
    return NextResponse.json({ 
      message: 'All submissions cleared successfully',
      deletedCount: result.deletedCount
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ 
      message: 'Error clearing submissions', 
      error: error.message 
    }, { status: 500 });
  }
}
