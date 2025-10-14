
import { NextResponse } from 'next/server';
import _db from '@/lib/db';
import { Student } from '@/models/student.model.js';
import bcrypt from 'bcryptjs';

export async function GET(request) {
  await _db();
  try {
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId');
    
    const filter = {};
    if (classId) {
      filter.classId = classId;
    }

    const students = await Student.find(filter).populate('classId');
    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching students', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  await _db();
  try {
    const body = await request.json();
    const newStudent = new Student(body);
    await newStudent.save();
    return NextResponse.json(newStudent, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating student', error: error.message }, { status: 400 });
  }
}

export async function PUT(request) {
    await _db();
    try {
        const body = await request.json();
        const { _id, currentPassword, newPassword, ...updateData } = body;
        
        const student = await Student.findById(_id);

        if (!student) {
            return NextResponse.json({ message: 'Student not found' }, { status: 404 });
        }

        // If a new password is provided, we need to handle the password change
        if (newPassword) {
            // If it's a password change request, currentPassword is required
            if (!currentPassword) {
                return NextResponse.json({ message: 'Current password is required to change password' }, { status: 400 });
            }

            const isMatch = await student.matchPassword(currentPassword);

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

        const updatedStudent = await Student.findByIdAndUpdate(_id, updateData, { new: true }).select('-password');
        
        if (!updatedStudent) {
            return NextResponse.json({ message: 'Student not found during update' }, { status: 404 });
        }

        return NextResponse.json(updatedStudent, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating student', error: error.message }, { status: 400 });
    }
}

export async function DELETE(request) {
    await _db();
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const deletedStudent = await Student.findByIdAndDelete(id);
        if (!deletedStudent) {
            return NextResponse.json({ message: 'Student not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Student deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error deleting student', error: error.message }, { status: 400 });
    }
}
