
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

export default function StudentDashboardPage() {
  const user = { name: "Alice Johnson" };

  return (
    <div className="space-y-6">
      <StudentDashboardHeader name={user.name} />
      <StudentStatCards />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="grid gap-6 lg:col-span-2">
          <StudentAttendanceChart />
        </div>
        <div className="grid gap-6 lg:col-span-1">
            <MarkAttendanceCard />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <GradeDistributionChart />
        <SubjectPerformanceChart />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
            <UpcomingClasses />
            <RecentAttendance />
        </div>
        <div className="lg:col-span-1 space-y-6">
            <UpcomingAssignments />
            <QuickLinks />
        </div>
      </div>
    </div>
  );
}
