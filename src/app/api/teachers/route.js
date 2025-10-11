import { NextResponse } from 'next/server';
import _db from '@/lib/db';
import { Teacher } from '@/models/teacher.model.js';

export async function GET() {
  await _db();
  try {
    const teachers = await Teacher.find({});
    return NextResponse.json(teachers, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching teachers', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  await _db();
  try {
    const body = await request.json();
    const newTeacher = new Teacher(body);
    await newTeacher.save();
    return NextResponse.json(newTeacher, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating teacher', error: error.message }, { status: 400 });
  }
}

export async function PUT(request) {
    await _db();
    try {
        const body = await request.json();
        const { _id, ...updateData } = body;
        const updatedTeacher = await Teacher.findByIdAndUpdate(_id, updateData, { new: true });
        if (!updatedTeacher) {
            return NextResponse.json({ message: 'Teacher not found' }, { status: 404 });
        }
        return NextResponse.json(updatedTeacher, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating teacher', error: error.message }, { status: 400 });
    }
}

export async function DELETE(request) {
    await _db();
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const deletedTeacher = await Teacher.findByIdAndDelete(id);
        if (!deletedTeacher) {
            return NextResponse.json({ message: 'Teacher not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Teacher deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error deleting teacher', error: error.message }, { status: 400 });
    }
}
