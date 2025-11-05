
import { NextResponse } from 'next/server';
import _db from '@/lib/db';
import { Note } from '@/models/note.model.js';
import { Student } from '@/models/student.model.js';
import { Teacher } from '@/models/teacher.model.js';

// GET - Fetch notes
export async function GET(request) {
  await _db();
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const isRead = searchParams.get('isRead');
    const priority = searchParams.get('priority');
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');
    
    const filter = {};
    
    if (studentId) {
      filter.studentId = studentId;
    }
    
    if (isRead !== null && isRead !== undefined && isRead !== '') {
      filter.isRead = isRead === 'true';
    }
    
    if (priority && priority !== 'all') {
      filter.priority = priority;
    }
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    let query = Note.find(filter)
      .populate('studentId', 'name email rollNo')
      .populate('teacherId', 'name email')
      .sort({ createdAt: -1 });
    
    if (limit) {
      query = query.limit(parseInt(limit));
    }
    
    const notes = await query;
    
    return NextResponse.json(notes, { status: 200 });
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json(
      { message: 'Error fetching notes', error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new note
export async function POST(request) {
  await _db();
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.studentId || !body.subject || !body.message || !body.senderName || !body.senderRole) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Verify student exists
    const student = await Student.findById(body.studentId);
    if (!student) {
      return NextResponse.json(
        { message: 'Student not found' },
        { status: 404 }
      );
    }
    
    // If teacherId provided, verify teacher exists
    if (body.teacherId) {
      const teacher = await Teacher.findById(body.teacherId);
      if (!teacher) {
        return NextResponse.json(
          { message: 'Teacher not found' },
          { status: 404 }
        );
      }
    }
    
    const newNote = new Note(body);
    await newNote.save();
    
    const populatedNote = await Note.findById(newNote._id)
      .populate('studentId', 'name email rollNo')
      .populate('teacherId', 'name email');
    
    return NextResponse.json(populatedNote, { status: 201 });
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json(
      { message: 'Error creating note', error: error.message },
      { status: 400 }
    );
  }
}

// PUT - Update note (mark as read, edit, etc.)
export async function PUT(request) {
  await _db();
  try {
    const body = await request.json();
    const { _id, ...updateData } = body;
    
    if (!_id) {
      return NextResponse.json(
        { message: 'Note ID is required' },
        { status: 400 }
      );
    }
    
    // If marking as read, set readAt timestamp
    if (updateData.isRead === true && !updateData.readAt) {
      updateData.readAt = new Date();
    }
    
    const updatedNote = await Note.findByIdAndUpdate(
      _id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('studentId', 'name email rollNo')
      .populate('teacherId', 'name email');
    
    if (!updatedNote) {
      return NextResponse.json(
        { message: 'Note not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedNote, { status: 200 });
  } catch (error) {
    console.error('Error updating note:', error);
    return NextResponse.json(
      { message: 'Error updating note', error: error.message },
      { status: 400 }
    );
  }
}

// DELETE - Delete note
export async function DELETE(request) {
  await _db();
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { message: 'Note ID is required' },
        { status: 400 }
      );
    }
    
    const deletedNote = await Note.findByIdAndDelete(id);
    
    if (!deletedNote) {
      return NextResponse.json(
        { message: 'Note not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'Note deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting note:', error);
    return NextResponse.json(
      { message: 'Error deleting note', error: error.message },
      { status: 400 }
    );
  }
}
