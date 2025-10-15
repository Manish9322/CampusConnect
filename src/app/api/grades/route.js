
import { NextResponse } from 'next/server';
import _db from '@/lib/db';
import { Grade } from '@/models/grade.model.js';

export async function GET(request) {
  await _db();
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const filter = studentId ? { studentId } : {};
    const grades = await Grade.find(filter);
    return NextResponse.json(grades, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching grades', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  await _db();
  try {
    const body = await request.json();
    const newGrade = new Grade(body);
    await newGrade.save();
    return NextResponse.json(newGrade, { status: 201 });
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
        return NextResponse.json({ message: 'Submission for this assignment already exists.' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Error creating grade', error: error.message }, { status: 400 });
  }
}

export async function PUT(request) {
    await _db();
    try {
        const body = await request.json();
        const { _id, ...updateData } = body;
        const updatedGrade = await Grade.findByIdAndUpdate(_id, updateData, { new: true });
        if (!updatedGrade) {
            return NextResponse.json({ message: 'Grade not found' }, { status: 404 });
        }
        return NextResponse.json(updatedGrade, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating grade', error: error.message }, { status: 400 });
    }
}
