import { NextResponse } from 'next/server';
import _db from '@/lib/db';
import { Student } from '@/models/student.model.js';
import { Attendance } from '@/models/attendance.model.js';

/**
 * GET endpoint to fetch attendance statistics for a specific student
 * Query params: studentId (required), month (optional, defaults to current month), year (optional, defaults to current year)
 */
export async function GET(request) {
  await _db();
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const monthParam = searchParams.get('month');
    const yearParam = searchParams.get('year');
    
    if (!studentId) {
      return NextResponse.json({ message: 'studentId is required' }, { status: 400 });
    }

    // Get the student to verify existence and get classId
    const student = await Student.findById(studentId);
    if (!student) {
      return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }

    const classId = typeof student.classId === 'object' ? student.classId._id : student.classId;

    // Parse month and year, default to current month/year
    const now = new Date();
    const month = monthParam ? parseInt(monthParam) : now.getMonth() + 1; // 1-12
    const year = yearParam ? parseInt(yearParam) : now.getFullYear();

    // Calculate start and end dates for the month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0); // Last day of the month
    
    // Format dates as YYYY-MM-DD
    const formatDate = (date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };
    
    const startDateStr = formatDate(startDate);
    const endDateStr = formatDate(endDate);
    
    // Get all attendance records for this student in the specified month
    const attendanceRecords = await Attendance.find({
      studentId: studentId,
      classId: classId.toString(),
      date: { $gte: startDateStr, $lte: endDateStr }
    }).sort({ date: 1 });
    
    // Calculate statistics
    const totalDays = attendanceRecords.length;
    const presentDays = attendanceRecords.filter(r => r.status === 'present').length;
    const lateDays = attendanceRecords.filter(r => r.status === 'late').length;
    const absentDays = attendanceRecords.filter(r => r.status === 'absent').length;
    
    const attendedDays = presentDays + lateDays;
    const percentage = totalDays > 0 ? Math.round((attendedDays / totalDays) * 100) : 0;
    
    return NextResponse.json({
      studentId,
      month,
      year,
      statistics: {
        totalDays,
        presentDays,
        lateDays,
        absentDays,
        attendedDays,
        percentage
      },
      records: attendanceRecords
    }, { status: 200 });
    
  } catch (error) {
    return NextResponse.json({ 
      message: 'Error fetching attendance statistics', 
      error: error.message 
    }, { status: 500 });
  }
}
