
import { NextResponse } from 'next/server';
import _db from '@/lib/db';
import { Teacher } from '@/models/teacher.model.js';
import bcrypt from 'bcryptjs';

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
        const { _id, currentPassword, newPassword, ...updateData } = body;
        
        const teacher = await Teacher.findById(_id);

        if (!teacher) {
            return NextResponse.json({ message: 'Teacher not found' }, { status: 404 });
        }

        // If a new password is provided, we need to handle the password change
        if (newPassword) {
            // If it's a password change request, currentPassword is required
            if (!currentPassword) {
                return NextResponse.json({ message: 'Current password is required to change password' }, { status: 400 });
            }

            const isMatch = await teacher.matchPassword(currentPassword);

            if (!isMatch) {
                return NextResponse.json({ message: 'Invalid current password' }, { status: 401 });
            }
            
            // Hash the new password before saving
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(newPassword, salt);
        } else if (updateData.password) {
            // If password is in updateData but it's not a password change flow (e.g. admin reset)
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(updateData.password, salt);
        }


        const updatedTeacher = await Teacher.findByIdAndUpdate(_id, updateData, { new: true }).select('-password');
        
        if (!updatedTeacher) {
            return NextResponse.json({ message: 'Teacher not found during update' }, { status: 404 });
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
