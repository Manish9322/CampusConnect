export type UserRole = 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Student extends User {
  role: 'student';
  studentId: string;
  major: string;
}

export type TeacherStatus = 'active' | 'inactive';

export interface Teacher extends User {
  role: 'teacher';
  teacherId: string;
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

export interface Class {
  id: string;
  name: string;
  year: number;
}
