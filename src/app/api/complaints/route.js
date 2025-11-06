import { NextResponse } from 'next/server';
import _db from '@/lib/db';
import { Complaint } from '@/models/complaint.model.js';
import { Student } from '@/models/student.model.js';

// GET all complaints (or by studentId)
export async function GET(request) {
  await _db();
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    
    const filter = {};
    if (studentId) {
      filter.studentId = studentId;
    }

    const complaints = await Complaint.find(filter).sort({ createdAt: -1 });
    return NextResponse.json(complaints, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching complaints', error: error.message }, { status: 500 });
  }
}

// POST a new complaint
export async function POST(request) {
  await _db();
  try {
    const body = await request.json();

    // Get student details for consistency
    const student = await Student.findById(body.studentId);
    if (!student) {
        return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }

    const newComplaint = new Complaint({
        ...body,
        studentName: student.name,
        studentRollNo: student.rollNo,
    });
    
    await newComplaint.save();
    return NextResponse.json(newComplaint, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating complaint', error: error.message }, { status: 400 });
  }
}

// PUT to update a complaint status
export async function PUT(request) {
    await _db();
    try {
        const body = await request.json();
        const { _id, status } = body;

        if (!_id || !status) {
            return NextResponse.json({ message: 'Complaint ID and status are required' }, { status: 400 });
        }

        const updatedComplaint = await Complaint.findByIdAndUpdate(_id, { status }, { new: true });

        if (!updatedComplaint) {
            return NextResponse.json({ message: 'Complaint not found' }, { status: 404 });
        }
        
        return NextResponse.json(updatedComplaint, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating complaint', error: error.message }, { status: 400 });
    }
}
