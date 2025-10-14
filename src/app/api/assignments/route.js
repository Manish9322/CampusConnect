
import { NextResponse } from 'next/server';
import _db from '@/lib/db';
import { Assignment } from '@/models/assignment.model.js';

export async function GET(request) {
  await _db();
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const filter = courseId ? { courseId } : {};
    const assignments = await Assignment.find(filter).sort({ dueDate: -1 });
    return NextResponse.json(assignments, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching assignments', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  await _db();
  try {
    const body = await request.json();
    const newAssignment = new Assignment(body);
    await newAssignment.save();
    return NextResponse.json(newAssignment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating assignment', error: error.message }, { status: 400 });
  }
}

export async function PUT(request) {
    await _db();
    try {
        const body = await request.json();
        const { _id, ...updateData } = body;
        const updatedAssignment = await Assignment.findByIdAndUpdate(_id, updateData, { new: true });
        if (!updatedAssignment) {
            return NextResponse.json({ message: 'Assignment not found' }, { status: 404 });
        }
        return NextResponse.json(updatedAssignment, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating assignment', error: error.message }, { status: 400 });
    }
}

export async function DELETE(request) {
    await _db();
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const deletedAssignment = await Assignment.findByIdAndDelete(id);
        if (!deletedAssignment) {
            return NextResponse.json({ message: 'Assignment not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Assignment deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error deleting assignment', error: error.message }, { status: 400 });
    }
}
