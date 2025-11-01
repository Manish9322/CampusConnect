
import { NextResponse } from 'next/server';
import _db from '@/lib/db';
import { Student } from '@/models/student.model.js';
import { Class } from '@/models/class.model.js';
import { Teacher } from '@/models/teacher.model.js';

async function seedClass(className, studentNames, teacher) {
  let courseClass = await Class.findOne({ name: className });
  if (!courseClass) {
    if (!teacher) {
      throw new Error(`No teachers found in the database. Please create a teacher first to assign to the ${className} class.`);
    }
    courseClass = new Class({
      name: className,
      year: new Date().getFullYear(),
      teacherId: teacher._id,
      subjects: ['Marketing', 'Finance', 'HR', 'Operations'],
      status: 'active',
    });
    await courseClass.save();
  }

  const createdStudents = [];
  const existingStudents = [];

  for (let i = 0; i < studentNames.length; i++) {
    const name = studentNames[i];
    const email = `${name.toLowerCase().replace(/\s/g, '.')}@campus.edu`;
    const rollNo = `${className}-${String(i + 1).padStart(3, '0')}`;
    const studentId = `SID-${className}-${String(i + 1).padStart(3, '0')}`;

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      existingStudents.push({ name, email, class: className });
      continue;
    }

    const newStudent = new Student({
      name,
      email,
      rollNo,
      studentId,
      password: 'Pass@123',
      phone: `987-654-321${i}`,
      classId: courseClass._id.toString(),
      role: 'student',
      status: 'active',
    });

    await newStudent.save();
    const studentObj = newStudent.toObject();
    delete studentObj.password;
    createdStudents.push(studentObj);
  }

  return { createdStudents, existingStudents };
}

export async function POST() {
  await _db();

  try {
    const teacher = await Teacher.findOne();
    if (!teacher) {
      return NextResponse.json({ message: 'No teachers found in the database. Please create a teacher first to assign to classes.' }, { status: 400 });
    }

    const mcaStudentNames = [
      'Manish Sonawane', 'Rahul Barhate', 'Vivek Patil', 'Shubham Vanarase', 'Harshal Mutadak',
      'Saurabh Lambhad', 'Siddhesh Gaonkar', 'Lakshit Patil', 'Ganesh Pawar', 'Tejas Patil',
    ];

    const mbaStudentNames = [
      'Priya Sharma', 'Rohan Gupta', 'Anjali Mehta', 'Aditya Kumar', 'Sneha Singh',
      'Vikram Reddy', 'Isha Desai', 'Arjun Nair', 'Natasha Joshi', 'Karan Malhotra'
    ];
    
    const mcaResults = await seedClass('MCA', mcaStudentNames, teacher);
    const mbaResults = await seedClass('MBA', mbaStudentNames, teacher);

    const allCreatedStudents = [...mcaResults.createdStudents, ...mbaResults.createdStudents];
    const allExistingStudents = [...mcaResults.existingStudents, ...mbaResults.existingStudents];

    return NextResponse.json({
      message: 'Student seeding process completed.',
      created: allCreatedStudents.length,
      existing: allExistingStudents.length,
      createdDetails: allCreatedStudents,
      existingDetails: allExistingStudents,
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ message: 'Error seeding students', error: error.message }, { status: 500 });
  }
}
