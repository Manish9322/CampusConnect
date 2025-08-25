
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
  major: string;
  phone: string;
  status: StudentStatus;
  attendancePercentage: number;
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
