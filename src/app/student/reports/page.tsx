
"use client";

import * as React from "react";
import { ReportStatCard } from "@/components/student/reports/report-stat-card";
import { AttendanceHeatmap } from "@/components/student/reports/attendance-heatmap";
import { PerformanceOverTimeChart } from "@/components/student/reports/performance-over-time-chart";
import { SubjectPerformanceRadarChart } from "@/components/student/reports/subject-performance-radar-chart";
import { EngagementOverview } from "@/components/student/reports/engagement-overview";
import { BookCheck, CalendarDays, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { ActionableInsights } from "@/components/student/reports/actionable-insights";
import { Achievements } from "@/components/student/reports/achievements";
import { Student } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAssignmentsForStudentQuery, useGetGradesQuery } from "@/services/api";

export default function StudentReportsPage() {
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

    // Calculate statistics
    const totalAssignments = assignments.length;
    const completedAssignments = grades.length;
    const lateSubmissions = grades.filter((g: any) => g.status === 'Late').length;
    const gradedAssignments = grades.filter((g: any) => g.marks !== null && g.marks !== undefined);
    
    const averageScore = gradedAssignments.length > 0
        ? (gradedAssignments.reduce((sum: number, g: any) => {
            const assignment = assignments.find((a: any) => a._id === g.assignmentId);
            if (assignment && g.marks !== null && g.marks !== undefined) {
                return sum + (g.marks / assignment.totalMarks) * 100;
            }
            return sum;
        }, 0) / gradedAssignments.length).toFixed(0)
        : 0;

    // Calculate classes attended from attendance percentage
    const totalClassesDays = 200; // Approximate for a semester
    const classesAttended = Math.round((student?.attendancePercentage || 0) * totalClassesDays / 100);

    if (isLoading || !student) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-8 w-64" />
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-32 w-full" />
                    ))}
                </div>
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Reports & Insights</h1>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
                <ReportStatCard
                    title="Overall Attendance"
                    value={`${student.attendancePercentage}%`}
                    icon={CalendarDays}
                />
                <ReportStatCard
                    title="Assignments Completed"
                    value={`${completedAssignments}/${totalAssignments}`}
                    icon={BookCheck}
                />
                 <ReportStatCard
                    title="Late Submissions"
                    value={lateSubmissions.toString()}
                    icon={Clock}
                />
                <ReportStatCard
                    title="Overall Score"
                    value={`${averageScore}%`}
                    icon={TrendingUp}
                />
                <ReportStatCard
                    title="Classes Attended"
                    value={classesAttended.toString()}
                    icon={CheckCircle}
                />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <ActionableInsights 
                        student={student} 
                        assignments={assignments} 
                        grades={grades}
                    />
                </div>
                <div>
                   <Achievements 
                        student={student} 
                        assignments={assignments} 
                        grades={grades}
                   />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <PerformanceOverTimeChart 
                        assignments={assignments} 
                        grades={grades}
                    />
                </div>
                <div>
                    <SubjectPerformanceRadarChart 
                        student={student}
                        assignments={assignments} 
                        grades={grades}
                    />
                </div>
            </div>
            
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-2">
                    <AttendanceHeatmap studentId={student._id!} />
                </div>
                <div>
                   <EngagementOverview 
                        assignments={assignments} 
                        grades={grades}
                        attendancePercentage={student.attendancePercentage}
                   />
                </div>
            </div>
        </div>
    );
}
