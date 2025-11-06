
import { NextResponse } from 'next/server';
import _db from '@/lib/db';
import { Student } from '@/models/student.model.js';
import { Attendance } from '@/models/attendance.model.js';
import bcrypt from 'bcryptjs';

// Helper function to calculate attendance percentage
async function calculateAttendancePercentage(studentId, classId) {
  try {
    // Get current month start and end dates
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    // Format dates as YYYY-MM-DD
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    const startDateStr = formatDate(startOfMonth);
    const endDateStr = formatDate(endOfMonth);
    
    // Get all attendance records for this student in current month
    const attendanceRecords = await Attendance.find({
      studentId: studentId,
      classId: classId,
      date: { $gte: startDateStr, $lte: endDateStr }
    });
    
    if (attendanceRecords.length === 0) {
      return 0; // No attendance records yet
    }
    
    // Count present and late as attended
    const attendedDays = attendanceRecords.filter(
      record => record.status === 'present' || record.status === 'late'
    ).length;
    
    // Total days with records (present + absent + late)
    const totalDays = attendanceRecords.length;
    
    // Calculate percentage
    const percentage = Math.round((attendedDays / totalDays) * 100);
    
    return percentage;
  } catch (error) {
    console.error('Error calculating attendance:', error);
    return 0;
  }
}

export async function GET(request) {
  await _db();
  try {
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId');
    const includeAttendance = searchParams.get('includeAttendance') !== 'false'; // Default to true
    
    const filter = {};
    if (classId) {
      filter.classId = classId;
    }

    const students = await Student.find(filter).populate('classId');
    
    // Calculate attendance percentage for each student if requested
    if (includeAttendance) {
      const studentsWithAttendance = await Promise.all(
        students.map(async (student) => {
          const studentObj = student.toObject();
          // Fallback for students with a classId that no longer exists
          if (!studentObj.classId) {
              studentObj.attendancePercentage = 0;
              return studentObj;
          }
          const actualClassId = typeof studentObj.classId === 'object' ? studentObj.classId._id : studentObj.classId;
          studentObj.attendancePercentage = await calculateAttendancePercentage(
            studentObj._id.toString(),
            actualClassId.toString()
          );
          return studentObj;
        })
      );
      return NextResponse.json(studentsWithAttendance, { status: 200 });
    }
    
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
    const studentObj = newStudent.toObject();
    delete studentObj.password;
    return NextResponse.json(studentObj, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating student', error: error.message }, { status: 400 });
  }
}

export async function PUT(request) {
    await _db();
    try {
        const body = await request.json();
        const { _id, currentPassword, newPassword, ...updateData } = body;
        
        // Use .select('+password') to include the password field in the query
        const student = await Student.findById(_id).select('+password');

        if (!student) {
            return NextResponse.json({ message: 'Student not found' }, { status: 404 });
        }

        // If a new password is provided, it's a password change from the student's profile
        if (newPassword) {
            if (!currentPassword) {
                return NextResponse.json({ message: 'Current password is required to change password' }, { status: 400 });
            }
            const isMatch = await student.matchPassword(currentPassword);
            if (!isMatch) {
                return NextResponse.json({ message: 'Invalid current password' }, { status: 401 });
            }
            const salt = await bcrypt.genSalt(10);
            student.password = await bcrypt.hash(newPassword, salt);
            await student.save();
            
            // remove password fields from updateData if they exist
            delete updateData.password;
            delete updateData.newPassword;
            delete updateData.currentPassword;
            
        } else if (updateData.password) {
            // If only 'password' is in updateData, it's likely an admin resetting it
            const salt = await bcrypt.genSalt(10);
            student.password = await bcrypt.hash(updateData.password, salt);
            await student.save();
        }

        // Update other fields
        Object.assign(student, updateData);
        await student.save();


        const updatedStudent = await Student.findById(_id).select('-password');
        
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
