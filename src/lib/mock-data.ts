
import type { Student, Teacher, AttendanceRecord, Class, Announcement } from './types';

export const mockStudents: Student[] = [
  { id: '1', studentId: 'S001', rollNo: 'CS-001', name: 'Alice Johnson', email: 'alice@example.com', role: 'student', major: 'Computer Science', phone: '202-555-0182', status: 'active', attendancePercentage: 95 },
  { id: '2', studentId: 'S002', rollNo: 'PHY-001', name: 'Bob Williams', email: 'bob@example.com', role: 'student', major: 'Physics', phone: '202-555-0191', status: 'active', attendancePercentage: 88 },
  { id: '3', studentId: 'S003', rollNo: 'MTH-001', name: 'Charlie Brown', email: 'charlie@example.com', role: 'student', major: 'Mathematics', phone: '202-555-0143', status: 'inactive', attendancePercentage: 74 },
  { id: '4', studentId: 'S004', rollNo: 'CS-002', name: 'Diana Miller', email: 'diana@example.com', role: 'student', major: 'Computer Science', phone: '202-555-0123', status: 'active', attendancePercentage: 98 },
  { id: '5', studentId: 'S005', rollNo: 'CHM-001', name: 'Eve Davis', email: 'eve@example.com', role: 'student', major: 'Chemistry', phone: '202-555-0187', status: 'active', attendancePercentage: 82 },
  { id: '6', studentId: 'S006', rollNo: 'CS-003', name: 'Frank White', email: 'frank@example.com', role: 'student', major: 'Computer Science', phone: '202-555-0165', status: 'inactive', attendancePercentage: 65 },
  { id: '7', studentId: 'S007', rollNo: 'PHY-002', name: 'Grace Hall', email: 'grace@example.com', role: 'student', major: 'Physics', phone: '202-555-0154', status: 'active', attendancePercentage: 91 },
];

export const mockTeachers: Teacher[] = [
  { id: '101', teacherId: 'T01', designation: 'Dr.', name: 'Alan Turing', email: 'turing@example.com', role: 'teacher', department: 'Computer Science', courses: ['CS101', 'CS303'], phone: '123-456-7890', status: 'active' },
  { id: '102', teacherId: 'T02', designation: 'Dr.', name: 'Marie Curie', email: 'curie@example.com', role: 'teacher', department: 'Physics', courses: ['PHY101'], phone: '123-456-7891', status: 'active' },
  { id: '103', teacherId: 'T03', designation: 'Dr.', name: 'Ada Lovelace', email: 'lovelace@example.com', role: 'teacher', department: 'Mathematics', courses: ['MATH201'], phone: '123-456-7892', status: 'inactive' },
];

export const mockAttendance: AttendanceRecord[] = [
  { id: 'a1', studentId: 'S001', studentName: 'Alice Johnson', date: '2023-10-26', status: 'present', course: 'CS101', recordedBy: 'T01' },
  { id: 'a2', studentId: 'S002', studentName: 'Bob Williams', date: '2023-10-26', status: 'absent', course: 'PHY101', recordedBy: 'T02' },
  { id: 'a3', studentId: 'S003', studentName: 'Charlie Brown', date: '2023-10-26', status: 'present', course: 'MATH201', recordedBy: 'T03' },
  { id: 'a4', studentId: 'S004', studentName: 'Diana Miller', date: '2023-10-26', status: 'late', course: 'CS101', recordedBy: 'T01' },
  { id: 'a5', studentId: 'S001', studentName: 'Alice Johnson', date: '2023-10-25', status: 'present', course: 'CS101', recordedBy: 'T01' },
  { id: 'a6', studentId: 'S002', studentName: 'Bob Williams', date: '2023-10-25', status: 'present', course: 'PHY101', recordedBy: 'T02' },
];

export const mockClasses: Class[] = [
  { id: 'C01', name: 'CS101', year: 2024, status: 'active' },
  { id: 'C02', name: 'PHY101', year: 2024, status: 'active' },
  { id: 'C03', name: 'MATH201', year: 2024, status: 'inactive' },
  { id: 'C04', name: 'CS303', year: 2024, status: 'active' },
];

export const mockAnnouncements: Announcement[] = [
    {
        id: 'AN001',
        title: 'Mid-Term Examinations Schedule',
        content: 'The schedule for the upcoming mid-term examinations has been published. Please check the student portal for details.',
        author: 'Admin User',
        createdAt: '2024-05-15',
        category: 'Academic',
        isPublished: true,
    },
    {
        id: 'AN002',
        title: 'Annual Sports Day 2024',
        content: 'Get ready for the Annual Sports Day on June 10th! Registrations for events are now open. Contact the sports committee for more information.',
        author: 'Admin User',
        createdAt: '2024-05-14',
        category: 'Event',
        isPublished: true,
    },
    {
        id: 'AN003',
        title: 'Library Closure for Maintenance',
        content: 'The central library will be closed from May 20th to May 22nd for annual maintenance. E-resources will remain available.',
        author: 'Admin User',
        createdAt: '2024-05-12',
        category: 'General',
        isPublished: true,
    },
    {
        id: 'AN004',
        title: 'Campus Wi-Fi Network Upgrade',
        content: 'Please be advised that the campus Wi-Fi network will undergo a scheduled upgrade this weekend. Intermittent connectivity issues may occur.',
        author: 'Admin User',
        createdAt: '2024-05-10',
        category: 'Urgent',
        isPublished: false,
    }
];
