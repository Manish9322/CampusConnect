"use client";

import * as React from "react";
import { StudentDashboardHeader } from "@/components/student/dashboard/student-dashboard-header";
import { StudentStatCards } from "@/components/student/dashboard/student-stat-cards";
import { UpcomingClasses } from "@/components/student/dashboard/upcoming-classes";
import { RecentAttendance } from "@/components/student/dashboard/recent-attendance";
import { QuickLinks } from "@/components/student/dashboard/quick-links";
import { UpcomingAssignments } from "@/components/student/dashboard/upcoming-assignments";
import { MarkAttendanceCard } from "@/components/student/dashboard/mark-attendance-card";
import { StudentAttendanceChart } from "@/components/student/dashboard/student-attendance-chart";
import { GradeDistributionChart } from "@/components/student/dashboard/grade-distribution-chart";
import { SubjectPerformanceChart } from "@/components/student/dashboard/subject-performance-chart";
import { Student } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAssignmentsForStudentQuery, useGetGradesQuery, useGetAttendanceQuery } from "@/services/api";

export default function StudentDashboardPage() {
  const [student, setStudent] = React.useState<Student | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const storedUser = localStorage.getItem('student_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.id && !parsedUser._id) {
          parsedUser._id = parsedUser.id;
        }
        setStudent(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const { data: assignments = [], isLoading: isLoadingAssignments } = useGetAssignmentsForStudentQuery(student?._id, { skip: !student?._id });
  const { data: grades = [], isLoading: isLoadingGrades } = useGetGradesQuery(student?._id, { skip: !student?._id });
  const { data: attendanceRecords = [], isLoading: isLoadingAttendance } = useGetAttendanceQuery({ studentId: student?._id }, { skip: !student?._id });

  if (isLoading || !student) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StudentDashboardHeader name={student.name} profileImage={student.profileImage} />
      <StudentStatCards 
        student={student} 
        attendanceRecords={attendanceRecords}
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:order-2 lg:col-span-1">
            <MarkAttendanceCard student={student} />
        </div>
        <div className="lg:order-1 lg:col-span-2">
          <StudentAttendanceChart 
            attendanceRecords={attendanceRecords}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <GradeDistributionChart 
          assignments={assignments}
          grades={grades}
        />
        <SubjectPerformanceChart 
          assignments={assignments}
          grades={grades}
        />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
            <UpcomingClasses student={student} />
            <RecentAttendance 
              studentId={student._id!}
              attendanceRecords={attendanceRecords}
            />
        </div>
        <div className="lg:col-span-1 space-y-6">
            <UpcomingAssignments 
              assignments={assignments}
              grades={grades}
            />
            <QuickLinks />
        </div>
      </div>
    </div>
  );
}
