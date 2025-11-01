import { NextResponse } from 'next/server';
import _db from '@/lib/db';
import { Student } from '@/models/student.model.js';
import { Class } from '@/models/class.model.js';
import { Teacher } from '@/models/teacher.model.js';

export async function POST() {
  await _db();

  try {
    // 1. Find or create the 'MCA' class
    let mcaClass = await Class.findOne({ name: 'MCA' });

    if (!mcaClass) {
      // Find a teacher to assign to the class
      const teacher = await Teacher.findOne();
      if (!teacher) {
        return NextResponse.json({ message: 'No teachers found in the database. Please create a teacher first to assign to the MCA class.' }, { status: 400 });
      }

      mcaClass = new Class({
        name: 'MCA',
        year: new Date().getFullYear(),
        teacherId: teacher._id,
        subjects: ['Data Structures', 'Algorithms', 'Database Management', 'Operating Systems'],
        status: 'active',
      });
      await mcaClass.save();
    }

    const studentNames = [
      'Manish Sonawane',
      'Rahul Barhate',
      'Vivek Patil',
      'Shubham Vanarase',
      'Harshal Mutadak',
      'Saurabh Lambhad',
      'Siddhesh Gaonkar',
      'Lakshit Patil',
      'Ganesh Pawar',
      'Tejas Patil',
    ];

    const createdStudents = [];
    const existingStudents = [];

    for (let i = 0; i < studentNames.length; i++) {
      const name = studentNames[i];
      const email = `${name.toLowerCase().replace(/\s/g, '.')}@campus.edu`;
      const rollNo = `MCA-${String(i + 1).padStart(3, '0')}`;
      const studentId = `SID-MCA-${String(i + 1).padStart(3, '0')}`;

      // Check if student already exists
      const existingStudent = await Student.findOne({ email });
      if (existingStudent) {
        existingStudents.push({ name, email });
        continue;
      }

      const newStudent = new Student({
        name,
        email,
        rollNo,
        studentId,
        password: 'Pass@123',
        phone: `555-010${i}`,
        classId: mcaClass._id.toString(),
        role: 'student',
        status: 'active',
      });

      await newStudent.save();
      const studentObj = newStudent.toObject();
      delete studentObj.password;
      createdStudents.push(studentObj);
    }

    return NextResponse.json({
      message: 'Student seeding process completed.',
      created: createdStudents.length,
      existing: existingStudents.length,
      createdStudents,
      existingStudents,
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ message: 'Error seeding students', error: error.message }, { status: 500 });
  }
}
