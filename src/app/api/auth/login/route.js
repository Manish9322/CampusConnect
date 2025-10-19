import { NextResponse } from 'next/server';
import _db from '@/lib/db';
import { Teacher } from '@/models/teacher.model.js';
import { Student } from '@/models/student.model.js';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  await _db();
  try {
    const { email, password, role } = await request.json();

    let user;
    if (role === 'teacher') {
      user = await Teacher.findOne({ email }).select('+password');
    } else if (role === 'student') {
      user = await Student.findOne({ email }).select('+password');
    } else {
        // For now, we only support teacher and student login
        // We can add other roles like admin later
        return NextResponse.json({ message: 'Invalid role' }, { status: 400 });
    }

    if (user && (await user.matchPassword(password))) {
      const token = jwt.sign(
        { id: user._id, role: user.role, name: user.name, email: user.email },
        process.env.JWT_SECRET || 'your_default_secret_key',
        { expiresIn: '1h' }
      );
      
      const userPayload = user.toObject();
      delete userPayload.password;

      return NextResponse.json({
        message: "Login successful",
        token,
        user: userPayload
      }, { status: 200 });

    } else {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Server error during login', error: error.message }, { status: 500 });
  }
}
