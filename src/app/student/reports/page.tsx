
import { ReportStatCard } from "@/components/student/reports/report-stat-card";
import { AttendanceHeatmap } from "@/components/student/reports/attendance-heatmap";
import { PerformanceOverTimeChart } from "@/components/student/reports/performance-over-time-chart";
import { SubjectPerformanceRadarChart } from "@/components/student/reports/subject-performance-radar-chart";
import { EngagementOverview } from "@/components/student/reports/engagement-overview";
import { mockStudents } from "@/lib/mock-data";
import { BookCheck, CalendarDays, CheckCircle, Clock, TrendingUp } from "lucide-react";

export default function StudentReportsPage() {
    const student = mockStudents[0];
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Reports & Insights</h1>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
                <ReportStatCard
                    title="Overall Attendance"
                    value={`${student.attendancePercentage}%`}
                    icon={CalendarDays}
                    trend="2%"
                    trendDirection="up"
                />
                <ReportStatCard
                    title="Assignments Completed"
                    value="12/15"
                    icon={BookCheck}
                />
                 <ReportStatCard
                    title="Late Submissions"
                    value="1"
                    icon={Clock}
                    trend="1"
                    trendDirection="down"
                />
                <ReportStatCard
                    title="Overall Score"
                    value="88%"
                    icon={TrendingUp}
                    trend="5%"
                    trendDirection="up"
                />
                <ReportStatCard
                    title="Classes Attended"
                    value="142"
                    icon={CheckCircle}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <PerformanceOverTimeChart />
                </div>
                <div>
                    <SubjectPerformanceRadarChart />
                </div>
            </div>
            
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-2">
                    <AttendanceHeatmap />
                </div>
                <div>
                   <EngagementOverview />
                </div>
            </div>
        </div>
    );
}
