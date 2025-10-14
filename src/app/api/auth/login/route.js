import { NextResponse } from 'next/server';
import _db from '@/lib/db';
import { Teacher } from '@/models/teacher.model.js';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  await _db();
  try {
    const { email, password, role } = await request.json();

    if (role !== 'teacher') {
        // For now, we only support teacher login
        // We can add other roles later
        return NextResponse.json({ message: 'Invalid role' }, { status: 400 });
    }

    const teacher = await Teacher.findOne({ email });

    if (teacher && (await teacher.matchPassword(password))) {
      const token = jwt.sign(
        { id: teacher._id, role: teacher.role, name: teacher.name, email: teacher.email },
        process.env.JWT_SECRET || 'your_default_secret_key',
        { expiresIn: '1h' }
      );

      return NextResponse.json({
        message: "Login successful",
        token,
        user: {
            id: teacher._id,
            name: teacher.name,
            email: teacher.email,
            role: teacher.role
        }
      }, { status: 200 });

    } else {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Server error during login', error: error.message }, { status: 500 });
  }
}
