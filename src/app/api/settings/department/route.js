import { NextResponse } from 'next/server';
import _db from '@/lib/db';
import { Department } from '@/models/department.model.js';

export async function GET() {
  await _db();
  try {
    const departments = await Department.find({});
    return NextResponse.json(departments, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching departments', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  await _db();
  try {
    const body = await request.json();
    const newDepartment = new Department(body);
    await newDepartment.save();
    return NextResponse.json(newDepartment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating department', error: error.message }, { status: 400 });
  }
}

export async function PUT(request) {
    await _db();
    try {
        const body = await request.json();
        const { _id, ...updateData } = body;
        const updatedDepartment = await Department.findByIdAndUpdate(_id, updateData, { new: true });
        if (!updatedDepartment) {
            return NextResponse.json({ message: 'Department not found' }, { status: 404 });
        }
        return NextResponse.json(updatedDepartment, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating department', error: error.message }, { status: 400 });
    }
}

export async function DELETE(request) {
    await _db();
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const deletedDepartment = await Department.findByIdAndDelete(id);
        if (!deletedDepartment) {
            return NextResponse.json({ message: 'Department not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Department deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error deleting department', error: error.message }, { status: 400 });
    }
}
