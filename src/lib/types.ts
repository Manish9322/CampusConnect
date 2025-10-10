

export type UserRole = 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type StudentStatus = 'active' | 'inactive';


export interface Student extends User {
  role: 'student';
  studentId: string;
  rollNo: string;
  major: string;
  phone: string;
  status: StudentStatus;
  attendancePercentage: number;
}

export type TeacherStatus = 'active' | 'inactive';

export interface Teacher extends User {
  role: 'teacher';
  teacherId: string;
  designation?: string;
  department: string;
  courses: string[];
  phone: string;
  status: TeacherStatus;
}

export type AttendanceStatus = 'present' | 'absent' | 'late';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  status: AttendanceStatus;
  course: string;
  recordedBy: string; // Teacher ID
}

export type ClassStatus = 'active' | 'inactive';

export interface Class {
  id: string;
  name: string;
  year: number;
  status: ClassStatus;
}

export interface ClassWithDetails extends Class {
    teacher: string;
    subjects: string[];
    studentCount: number;
}

export type AnnouncementCategory = 'General' | 'Event' | 'Academic' | 'Urgent';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  category: AnnouncementCategory;
  isPublished: boolean;
}

export type FeeStatus = 'Paid' | 'Pending' | 'Overdue';

export interface FeeComponent {
  name: string;
  amount: number;
}

export interface PaymentHistory {
  id: string;
  date: string;
  amount: number;
  method: 'Credit Card' | 'UPI' | 'Net Banking';
  transactionId: string;
}

export interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  totalAmount: number;
  dueAmount: number;
  dueDate: string;
  status: FeeStatus;
  components: FeeComponent[];
  paymentHistory: PaymentHistory[];
}
