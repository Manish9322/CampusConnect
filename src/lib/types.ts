

export type UserRole = 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  _id?: string;
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
  subjects: string[];
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
  _id: string;
  id: string;
  subjectId: string;
  subjectName: string;
  title: string;
  description: string;
  type: AssignmentType;
  dueDate: string;
  totalMarks: number;
  attachments?: { name: string; url: string }[];
}

export type SubmissionStatus = 'Submitted' | 'Late' | 'Pending';

export interface Grade {
    _id: string;
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
  id?: string;
  studentId: string;
  studentName?: string;
  classId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  subject?: string;
  recordedBy: string; // teacherId
}

export interface AttendanceRequest {
    _id: string;
    studentId: string;
    attendanceId: string;
    currentStatus: AttendanceStatus;
    requestedStatus: AttendanceStatus;
    reason: string;
    status: 'pending' | 'approved' | 'denied';
}

export type NotePriority = 'low' | 'medium' | 'high' | 'urgent';
export type NoteCategory = 'academic' | 'disciplinary' | 'attendance' | 'fees' | 'general' | 'achievement';
export type SenderRole = 'teacher' | 'admin';

export interface Note {
    _id: string;
    studentId: string | Student;
    teacherId?: string | Teacher;
    senderRole: SenderRole;
    senderName: string;
    subject: string;
    message: string;
    priority: NotePriority;
    category: NoteCategory;
    isRead: boolean;
    readAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface Subject {
    _id: string;
    name: string;
    description?: string;
    departmentId?: string;
    departmentName?: string;
    createdAt: Date;
    updatedAt: Date;
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export interface Period {
    periodNumber: number;
    subjectId: string;
    subjectName: string;
    teacherId: string;
    teacherName: string;
    startTime: string; // HH:mm format
    endTime: string; // HH:mm format
    room?: string;
}

export interface Timetable {
    _id: string;
    classId: string;
    className?: string;
    day: DayOfWeek;
    periods: Period[];
    createdAt: Date;
    updatedAt: Date;
}
