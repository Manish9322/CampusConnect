
import { NextResponse } from 'next/server';
import _db from '@/lib/db';
import { StudentFeeSettings } from '@/models/student-fee-settings.model.js';

// GET student-specific fee settings
export async function GET(request) {
  await _db();
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');

    const filter = {};
    if (studentId) {
      filter.studentId = studentId;
      const settings = await StudentFeeSettings.findOne(filter);
      return NextResponse.json(settings, { status: 200 });
    }

    const allSettings = await StudentFeeSettings.find({});
    return NextResponse.json(allSettings, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching student fee settings', error: error.message }, { status: 500 });
  }
}

// POST or PUT (upsert) student-specific fee settings
export async function POST(request) {
  await _db();
  try {
    const body = await request.json();
    const { studentId } = body;

    const settings = await StudentFeeSettings.findOneAndUpdate(
      { studentId },
      body,
      { new: true, upsert: true }
    );
    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating student fee settings', error: error.message }, { status: 400 });
  }
}
