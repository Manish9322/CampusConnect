
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Percent, BookOpen, ArrowUp, ArrowDown } from "lucide-react";
import { AttendanceChart } from "@/components/admin/attendance-chart";
import { EnrollmentChart } from "@/components/admin/enrollment-chart";
import { RecentAttendance } from "@/components/admin/recent-attendance";
import { Badge } from "@/components/ui/badge";
import { ClassSizeChart } from "@/components/admin/class-size-chart";
import { TeacherStudentRatioChart } from "@/components/admin/teacher-student-ratio-chart";
import { NewEnrollmentsChart } from "@/components/admin/new-enrollments-chart";
import { CoursesInSessionChart } from "@/components/admin/courses-in-session-chart";
import { useGetDashboardStatsQuery } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardPage() {
  const { data: dashboardData, isLoading } = useGetDashboardStatsQuery(undefined);

  const stats = dashboardData?.stats || {
    totalStudents: 0,
    totalTeachers: 0,
    totalSubjects: 0,
    departmentCount: 0,
    studentGrowth: 0,
    teacherGrowth: 0,
    attendanceRate: 0,
    attendanceChange: 0
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
              {isLoading ? (
                <>
                  <Skeleton className="h-8 w-24 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.totalStudents.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground flex items-center">
                      {stats.studentGrowth >= 0 ? (
                        <ArrowUp className="h-3 w-3 mr-1 text-green-500"/>
                      ) : (
                        <ArrowDown className="h-3 w-3 mr-1 text-red-500"/>
                      )}
                      {Math.abs(stats.studentGrowth)}% from last month
                  </p>
                </>
              )}
          </CardContent>
        </Card>
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
              {isLoading ? (
                <>
                  <Skeleton className="h-8 w-24 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.totalTeachers}</div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    {stats.teacherGrowth >= 0 ? (
                      <ArrowUp className="h-3 w-3 mr-1 text-green-500"/>
                    ) : (
                      <ArrowDown className="h-3 w-3 mr-1 text-red-500"/>
                    )}
                    {Math.abs(stats.teacherGrowth) > 0 ? `${Math.abs(stats.teacherGrowth)} from last year` : 'No change from last year'}
                  </p>
                </>
              )}
          </CardContent>
        </Card>
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance Rate (Today)</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
              {isLoading ? (
                <>
                  <Skeleton className="h-8 w-24 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.attendanceRate}%</div>
                  <p className="text-xs text-muted-foreground flex items-center">
                      {stats.attendanceChange >= 0 ? (
                        <ArrowUp className="h-3 w-3 mr-1 text-green-500"/>
                      ) : (
                        <ArrowDown className="h-3 w-3 mr-1 text-red-500"/>
                      )}
                      {Math.abs(stats.attendanceChange)}% from yesterday
                  </p>
                </>
              )}
          </CardContent>
        </Card>
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subjects Offered</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
              {isLoading ? (
                <>
                  <Skeleton className="h-8 w-24 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.totalSubjects}</div>
                  <p className="text-xs text-muted-foreground">
                    Across {stats.departmentCount} departments
                  </p>
                </>
              )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceChart data={dashboardData?.weeklyAttendance} isLoading={isLoading} />
        <EnrollmentChart data={dashboardData?.enrollmentData} isLoading={isLoading} />
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ClassSizeChart />
          <TeacherStudentRatioChart />
          <NewEnrollmentsChart />
          <CoursesInSessionChart />
        </div>

        <div className="lg:col-span-2">
          <RecentAttendance data={dashboardData?.recentAttendance} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
