
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

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold">1,254</div>
              <p className="text-xs text-muted-foreground flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1 text-green-500"/>
                  +20.1% from last month
              </p>
          </CardContent>
        </Card>
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold">82</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1 text-green-500"/>
                  +5 from last year
              </p>
          </CardContent>
        </Card>
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance Rate (Today)</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold">92.3%</div>
              <p className="text-xs text-muted-foreground flex items-center">
                  <ArrowDown className="h-3 w-3 mr-1 text-red-500"/>
                  -1.2% from yesterday
              </p>
          </CardContent>
        </Card>
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Courses Offered</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold">120</div>
                <p className="text-xs text-muted-foreground">
                  Across 15 departments
              </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceChart />
        <EnrollmentChart />
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ClassSizeChart />
          <TeacherStudentRatioChart />
          <NewEnrollmentsChart />
          <CoursesInSessionChart />
        </div>

        <div className="lg:col-span-2">
          <RecentAttendance />
        </div>
      </div>
    </div>
  );
}
