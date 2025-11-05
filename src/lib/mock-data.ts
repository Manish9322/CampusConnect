
import type { Student, Teacher, AttendanceRecord, Class, Announcement, FeeRecord, Assignment, Grade } from './types';

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
  { id: '101', teacherId: 'T01', designation: 'Dr.', name: 'Alan Turing', email: 'turing@example.com', role: 'teacher', department: 'Computer Science', subjects: ['CS101', 'CS303'], phone: '123-456-7890', status: 'active' },
  { id: '102', teacherId: 'T02', designation: 'Dr.', name: 'Marie Curie', email: 'curie@example.com', role: 'teacher', department: 'Physics', subjects: ['PHY101'], phone: '123-456-7891', status: 'active' },
  { id: '103', teacherId: 'T03', designation: 'Dr.', name: 'Ada Lovelace', email: 'lovelace@example.com', role: 'teacher', department: 'Mathematics', subjects: ['MATH201'], phone: '123-456-7892', status: 'inactive' },
];

const generateDailyAttendance = (studentId: string, studentName: string, subject: string, teacherId: string) => {
    const records: AttendanceRecord[] = [];
    const today = new Date();
    for (let i = 0; i < 90; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dayOfWeek = date.getDay();

        if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Skip weekends
            let status: 'present' | 'absent' | 'late' = 'present';
            const random = Math.random();
            if (random > 0.95) status = 'absent';
            else if (random > 0.9) status = 'late';
            
            records.push({
                id: `att-${studentId}-${subject}-${i}`,
                studentId,
                studentName,
                classId: subject,
                date: date.toISOString().split('T')[0],
                status,
                subject,
                recordedBy: teacherId,
            });
        }
    }
    return records;
}

export const mockAttendance: AttendanceRecord[] = [
  ...generateDailyAttendance('S001', 'Alice Johnson', 'CS101', 'T01'),
  ...generateDailyAttendance('S001', 'Alice Johnson', 'PHY101', 'T02'),
  { id: 'a1', studentId: 'S001', studentName: 'Alice Johnson', classId: 'CS101', date: '2023-10-26', status: 'present', subject: 'CS101', recordedBy: 'T01' },
  { id: 'a2', studentId: 'S002', studentName: 'Bob Williams', classId: 'PHY101', date: '2023-10-26', status: 'absent', subject: 'PHY101', recordedBy: 'T02' },
  { id: 'a3', studentId: 'S003', studentName: 'Charlie Brown', classId: 'MATH201', date: '2023-10-26', status: 'present', subject: 'MATH201', recordedBy: 'T03' },
  { id: 'a4', studentId: 'S004', studentName: 'Diana Miller', classId: 'CS101', date: '2023-10-26', status: 'late', subject: 'CS101', recordedBy: 'T01' },
  { id: 'a5', studentId: 'S001', studentName: 'Alice Johnson', classId: 'CS101', date: '2023-10-25', status: 'present', subject: 'CS101', recordedBy: 'T01' },
  { id: 'a6', studentId: 'S002', studentName: 'Bob Williams', classId: 'PHY101', date: '2023-10-25', status: 'present', subject: 'PHY101', recordedBy: 'T02' },
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

export const mockFeeRecords: FeeRecord[] = [
  {
    id: 'F001',
    studentId: 'S001',
    studentName: 'Alice Johnson',
    totalAmount: 5000,
    dueAmount: 500,
    dueDate: '2024-08-01',
    status: 'Pending',
    components: [
      { name: 'Tuition Fee', amount: 4000 },
      { name: 'Library Fee', amount: 200 },
      { name: 'Exam Fee', amount: 300 },
      { name: 'Hostel Fee', amount: 500 },
    ],
    paymentHistory: [
      { id: 'P001', date: '2024-07-15', amount: 4500, method: 'Credit Card', transactionId: 'TXN12345' },
    ],
  },
  {
    id: 'F002',
    studentId: 'S002',
    studentName: 'Bob Williams',
    totalAmount: 4500,
    dueAmount: 0,
    dueDate: '2024-08-01',
    status: 'Paid',
    components: [
      { name: 'Tuition Fee', amount: 4000 },
      { name: 'Library Fee', amount: 200 },
      { name: 'Exam Fee', amount: 300 },
    ],
    paymentHistory: [
      { id: 'P002', date: '2024-07-20', amount: 4500, method: 'UPI', transactionId: 'TXN12346' },
    ],
  },
  {
    id: 'F003',
    studentId: 'S004',
    studentName: 'Diana Miller',
    totalAmount: 4500,
    dueAmount: 4500,
    dueDate: '2024-06-01',
    status: 'Overdue',
    components: [
      { name: 'Tuition Fee', amount: 4000 },
      { name: 'Library Fee', amount: 200 },
      { name: 'Exam Fee', amount: 300 },
    ],
    paymentHistory: [],
  },
   {
    id: 'F004',
    studentId: 'S005',
    studentName: 'Eve Davis',
    totalAmount: 4500,
    dueAmount: 1000,
    dueDate: '2024-08-01',
    status: 'Pending',
    components: [
      { name: 'Tuition Fee', amount: 4000 },
      { name: 'Library Fee', amount: 200 },
      { name: 'Exam Fee', amount: 300 },
    ],
    paymentHistory: [
      { id: 'P003', date: '2024-07-25', amount: 3500, method: 'Net Banking', transactionId: 'TXN12347' },
    ],
  },
];

export const mockAssignments: Assignment[] = [
  { _id: 'ASG01', id: 'ASG01', subjectId: 'C01', subjectName: 'CS101', title: 'Data Structures Fundamentals', description: 'Implement a linked list and a binary search tree.', type: 'Assignment', dueDate: '2024-08-15', totalMarks: 100 },
  { _id: 'ASG02', id: 'ASG02', subjectId: 'C01', subjectName: 'CS101', title: 'Mid-Term Quiz', description: 'Quiz covering all topics from week 1 to 6.', type: 'Quiz', dueDate: '2024-08-20', totalMarks: 50 },
  { _id: 'ASG03', id: 'ASG03', subjectId: 'C02', subjectName: 'PHY101', title: 'Lab Report: Projectile Motion', description: 'Submit a detailed report of the projectile motion experiment.', type: 'Assignment', dueDate: '2024-08-18', totalMarks: 100 },
  { _id: 'ASG04', id: 'ASG04', subjectId: 'C04', subjectName: 'CS303', title: 'Final Project Proposal', description: 'Submit a proposal for your final year project.', type: 'Exam', dueDate: '2024-09-01', totalMarks: 200 },
];

export const mockGrades: Grade[] = [
    // Alice Johnson (S001)
    { studentId: '1', assignmentId: 'ASG01', marks: 85, status: 'Submitted', submittedAt: '2024-08-14', feedback: 'Good work on the BST implementation.' },
    { studentId: '1', assignmentId: 'ASG02', marks: 45, status: 'Submitted', submittedAt: '2024-08-20', feedback: 'Excellent score!' },
    { studentId: '1', assignmentId: 'ASG03', marks: null, status: 'Pending', submittedAt: null },
    { studentId: '1', assignmentId: 'ASG04', marks: 180, status: 'Submitted', submittedAt: '2024-08-30' },
    
    // Diana Miller (S004)
    { studentId: '4', assignmentId: 'ASG01', marks: 92, status: 'Submitted', submittedAt: '2024-08-13' },
    { studentId: '4', assignmentId: 'ASG02', marks: 48, status: 'Submitted', submittedAt: '2024-08-19' },
    { studentId: '4', assignmentId: 'ASG04', marks: null, status: 'Late', submittedAt: '2024-09-02' },

    // Frank White (S006)
    { studentId: '6', assignmentId: 'ASG01', marks: 70, status: 'Late', submittedAt: '2024-08-16' },
    { studentId: '6', assignmentId: 'ASG02', marks: 35, status: 'Submitted', submittedAt: '2024-08-20' },
    { studentId: '6', assignmentId: 'ASG04', marks: null, status: 'Pending', submittedAt: null },
];
