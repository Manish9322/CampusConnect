import type { Student, Teacher, AttendanceRecord } from './types';

export const mockStudents: Student[] = [
  { id: '1', studentId: 'S001', name: 'Alice Johnson', email: 'alice@example.com', role: 'student', major: 'Computer Science' },
  { id: '2', studentId: 'S002', name: 'Bob Williams', email: 'bob@example.com', role: 'student', major: 'Physics' },
  { id: '3', studentId: 'S003', name: 'Charlie Brown', email: 'charlie@example.com', role: 'student', major: 'Mathematics' },
  { id: '4', studentId: 'S004', name: 'Diana Miller', email: 'diana@example.com', role: 'student', major: 'Computer Science' },
  { id: '5', studentId: 'S005', name: 'Eve Davis', email: 'eve@example.com', role: 'student', major: 'Chemistry' },
];

export const mockTeachers: Teacher[] = [
  { id: '101', teacherId: 'T01', name: 'Dr. Alan Turing', email: 'turing@example.com', role: 'teacher', department: 'Computer Science', courses: ['CS101', 'CS303'] },
  { id: '102', teacherId: 'T02', name: 'Dr. Marie Curie', email: 'curie@example.com', role: 'teacher', department: 'Physics', courses: ['PHY101'] },
  { id: '103', teacherId: 'T03', name: 'Dr. Ada Lovelace', email: 'lovelace@example.com', role: 'teacher', department: 'Mathematics', courses: ['MATH201'] },
];

export const mockAttendance: AttendanceRecord[] = [
  { id: 'a1', studentId: 'S001', studentName: 'Alice Johnson', date: '2023-10-26', status: 'present', course: 'CS101', recordedBy: 'T01' },
  { id: 'a2', studentId: 'S002', studentName: 'Bob Williams', date: '2023-10-26', status: 'absent', course: 'PHY101', recordedBy: 'T02' },
  { id: 'a3', studentId: 'S003', studentName: 'Charlie Brown', date: '2023-10-26', status: 'present', course: 'MATH201', recordedBy: 'T03' },
  { id: 'a4', studentId: 'S004', studentName: 'Diana Miller', date: '2023-10-26', status: 'late', course: 'CS101', recordedBy: 'T01' },
  { id: 'a5', studentId: 'S001', studentName: 'Alice Johnson', date: '2023-10-25', status: 'present', course: 'CS101', recordedBy: 'T01' },
  { id: 'a6', studentId: 'S002', studentName: 'Bob Williams', date: '2023-10-25', status: 'present', course: 'PHY101', recordedBy: 'T02' },
];
