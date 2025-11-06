
import { NextResponse } from 'next/server';
import _db from '@/lib/db';
import { StudentFeeSettings } from '@/models/student-fee-settings.model.js';

export async function POST(request) {
  await _db();
  try {
    // This action deletes all student-specific fee settings,
    // which causes the system to fall back to the global default for all students.
    const result = await StudentFeeSettings.deleteMany({});
    
    return NextResponse.json({ 
        message: 'Successfully reset all student fee settings to default.',
        updatedCount: result.deletedCount 
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: 'Error applying settings to all students', error: error.message }, { status: 500 });
  }
}
