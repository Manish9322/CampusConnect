import { NextResponse } from 'next/server';
import _db from '@/lib/db';
import { Assignment } from '@/models/assignment.model.js';
import { Student } from '@/models/student.model.js';

export async function GET(request, { params }) {
  await _db();
  try {
    const { id: studentId } = await params;
    
    // For now, we'll return all assignments since we don't have a direct relationship
    // In a real application, you would:
    // 1. Get the student's enrolled courses
    // 2. Filter assignments by those courses
    // 3. Return only relevant assignments
    
    // Skip student validation for now since we're using mock data with string IDs
    // In production, you would validate the student exists in the database
    
    // For now, return all assignments
    // TODO: Filter by student's enrolled courses when that relationship is implemented
    const assignments = await Assignment.find({}).sort({ dueDate: -1 });
    
    return NextResponse.json(assignments, { status: 200 });
  } catch (error) {
    console.error('Error fetching assignments for student:', error);
    return NextResponse.json({ 
      message: 'Error fetching assignments for student', 
      error: error.message 
    }, { status: 500 });
  }
}