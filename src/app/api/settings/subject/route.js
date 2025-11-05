import { NextResponse } from 'next/server';
import _db from '@/lib/db';
import { Subject } from '@/models/subject.model.js';

export async function GET() {
  await _db();
  try {
    const subjects = await Subject.find({});
    return NextResponse.json(subjects, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching subjects', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  await _db();
  try {
    const body = await request.json();
    
    // Check if it's an array (bulk insert)
    if (Array.isArray(body)) {
      const newSubjects = await Subject.insertMany(body);
      return NextResponse.json({ 
        message: `${newSubjects.length} subjects created successfully`,
        subjects: newSubjects 
      }, { status: 201 });
    }
    
    // Single insert
    const newSubject = new Subject(body);
    await newSubject.save();
    return NextResponse.json(newSubject, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating subject', error: error.message }, { status: 400 });
  }
}

export async function PUT(request) {
    await _db();
    try {
        const body = await request.json();
        const { _id, ...updateData } = body;
        const updatedSubject = await Subject.findByIdAndUpdate(_id, updateData, { new: true });
        if (!updatedSubject) {
            return NextResponse.json({ message: 'Subject not found' }, { status: 404 });
        }
        return NextResponse.json(updatedSubject, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating subject', error: error.message }, { status: 400 });
    }
}

export async function DELETE(request) {
    await _db();
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const deletedSubject = await Subject.findByIdAndDelete(id);
        if (!deletedSubject) {
            return NextResponse.json({ message: 'Subject not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Subject deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error deleting subject', error: error.message }, { status: 400 });
    }
}
