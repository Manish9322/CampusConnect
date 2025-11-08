
import { NextResponse } from 'next/server';
import _db from '@/lib/db';
import { AcademicYear } from '@/models/academic-year.model.js';

// GET the current academic year settings
export async function GET() {
  await _db();
  try {
    // Find the most recently created setting
    const settings = await AcademicYear.findOne().sort({ createdAt: -1 });
    if (!settings) {
      // Return default/empty settings if none exist
      return NextResponse.json({ semesterStartDate: null, semesterEndDate: null }, { status: 200 });
    }
    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching academic year settings', error: error.message }, { status: 500 });
  }
}

// POST to create or update academic year settings
export async function POST(request) {
  await _db();
  try {
    const body = await request.json();
    // Use findOneAndUpdate with upsert to either update the existing document or create a new one.
    // We sort by createdAt descending to ensure we always update the latest entry.
    const settings = await AcademicYear.findOneAndUpdate({}, body, {
      new: true,
      upsert: true,
      sort: { createdAt: -1 }
    });
    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating academic year settings', error: error.message }, { status: 400 });
  }
}

    