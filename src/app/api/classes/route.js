
import { NextResponse } from 'next/server';
import _db from '@/lib/db';
import { Class } from '@/models/class.model.js';
import { Teacher } from '@/models/teacher.model.js';

export async function GET() {
  await _db();
  try {
    const classes = await Class.find({}).populate({
      path: 'teacherId',
      model: Teacher,
      select: 'name designation'
    });
    return NextResponse.json(classes, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching classes', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  await _db();
  try {
    const body = await request.json();
    const newClass = new Class(body);
    await newClass.save();
    return NextResponse.json(newClass, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating class', error: error.message }, { status: 400 });
  }
}

export async function PUT(request) {
    await _db();
    try {
        const body = await request.json();
        const { _id, ...updateData } = body;
        const updatedClass = await Class.findByIdAndUpdate(_id, updateData, { new: true });
        if (!updatedClass) {
            return NextResponse.json({ message: 'Class not found' }, { status: 404 });
        }
        return NextResponse.json(updatedClass, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating class', error: error.message }, { status: 400 });
    }
}

export async function DELETE(request) {
    await _db();
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const deletedClass = await Class.findByIdAndDelete(id);
        if (!deletedClass) {
            return NextResponse.json({ message: 'Class not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Class deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error deleting class', error: error.message }, { status: 400 });
    }
}
