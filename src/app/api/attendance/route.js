
import { NextResponse } from 'next/server';
import _db from '@/lib/db';
import { Attendance } from '@/models/attendance.model.js';

export async function GET(request) {
  await _db();
  try {
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId');
    const date = searchParams.get('date');

    const filter = {};
    if (classId) filter.classId = classId;
    if (date) filter.date = date;

    const attendanceRecords = await Attendance.find(filter);
    return NextResponse.json(attendanceRecords, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching attendance records', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  await _db();
  try {
    const body = await request.json();
    
    if (!Array.isArray(body) || body.length === 0) {
        return NextResponse.json({ message: 'Request body must be a non-empty array of attendance records' }, { status: 400 });
    }

    const operations = body.map(record => ({
        updateOne: {
            filter: { studentId: record.studentId, classId: record.classId, date: record.date },
            update: { $set: record },
            upsert: true,
        },
    }));

    const result = await Attendance.bulkWrite(operations);

    return NextResponse.json({ message: 'Attendance recorded successfully', result }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error recording attendance', error: error.message }, { status: 400 });
  }
}
