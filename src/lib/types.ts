
export type UserRole = 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
}

export type StudentStatus = 'active' | 'inactive';


export interface Student extends User {
  _id?: string;
  role: 'student';
  studentId: string;
  rollNo: string;
  classId: string;
  phone: string;
  status: StudentStatus;
  attendancePercentage: number;
}

export type TeacherStatus = 'active' | 'inactive';

export interface Teacher extends User {
  _id?: string;
  role: 'teacher';
  teacherId: string;
  designation?: string;
  department: string;
  courses: string[];
  phone: string;
  status: TeacherStatus;
}

export type ClassStatus = 'active' | 'inactive';

export interface Class {
  _id?: string;
  id: string;
  name: string;
  year: number;
  status: ClassStatus;
  teacherId: Teacher | string;
  subjects: string[];
  studentCount: number;
}

export interface ClassWithDetails extends Class {
    teacher: string;
}

export type AnnouncementCategory = 'General' | 'Event' | 'Academic' | 'Urgent';

export interface Announcement {
  _id: string;
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

export type AssignmentType = 'Assignment' | 'Quiz' | 'Exam';

export interface Assignment {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  description: string;
  type: AssignmentType;
  dueDate: string;
  totalMarks: number;
  attachments?: { name: string; url: string }[];
}

export type SubmissionStatus = 'Submitted' | 'Late' | 'Pending';

export interface Grade {
    studentId: string;
    assignmentId: string;
    marks: number | null;
    status: SubmissionStatus;
    submittedAt: string | null;
    feedback?: string;
    submissionUrl?: string;
}

export type AttendanceStatus = 'present' | 'late' | 'absent';

export interface AttendanceRecord {
  _id?: string;
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  date: string;
  status: AttendanceStatus;
  course: string;
  recordedBy: string;
}

    