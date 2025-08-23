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

export interface Teacher extends User {
  role: 'teacher';
  teacherId: string;
  department: string;
  courses: string[];
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
