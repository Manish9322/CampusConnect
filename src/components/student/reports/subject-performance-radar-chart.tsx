"use client"

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend } from "recharts";
import { Assignment, Grade, Student } from "@/lib/types";

interface SubjectPerformanceRadarChartProps {
    student: Student;
    assignments: Assignment[];
    grades: Grade[];
}

const chartConfig = {
  performance: {
    label: "Performance",
    color: "hsl(var(--primary))",
  },
  attendance: {
    label: "Attendance",
    color: "hsl(var(--accent))",
  },
};

export function SubjectPerformanceRadarChart({ student, assignments, grades }: SubjectPerformanceRadarChartProps) {
    // Generate chart data from real grades grouped by subject
    const generateChartData = () => {
        const subjectData = new Map<string, { totalMarks: number; earnedMarks: number; count: number }>();

        // Calculate performance per subject
        grades.forEach((grade: Grade) => {
            if (grade.marks === null || grade.marks === undefined) return;
            
            const assignment = assignments.find((a: Assignment) => a._id === grade.assignmentId);
            if (!assignment) return;

            const courseName = assignment.courseName;
            if (!subjectData.has(courseName)) {
                subjectData.set(courseName, { totalMarks: 0, earnedMarks: 0, count: 0 });
            }

            const data = subjectData.get(courseName)!;
            data.totalMarks += assignment.totalMarks;
            data.earnedMarks += grade.marks;
            data.count += 1;
        });

        // Create chart data
        const chartData = Array.from(subjectData.entries()).map(([subject, data]) => {
            const performance = (data.earnedMarks / data.totalMarks) * 100;
            // Use overall attendance as proxy since we don't have per-subject attendance
            // In a real scenario, you'd fetch per-subject attendance
            const attendance = student.attendancePercentage;

            return {
                subject: subject,
                performance: Math.round(performance),
                attendance: Math.round(attendance),
            };
        });

        return chartData.length > 0 ? chartData : [];
    };

    const chartData = generateChartData();
    const hasData = chartData.length > 0;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Subject-wise Overview</CardTitle>
                <CardDescription>Performance vs. attendance.</CardDescription>
            </CardHeader>
            <CardContent>
                {hasData ? (
                    <ChartContainer config={chartConfig} className="h-64 w-full">
                        <RadarChart data={chartData}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Radar name="Performance" dataKey="performance" stroke="var(--color-performance)" fill="var(--color-performance)" fillOpacity={0.6} />
                            <Radar name="Attendance" dataKey="attendance" stroke="var(--color-attendance)" fill="var(--color-attendance)" fillOpacity={0.6} />
                            <Legend />
                        </RadarChart>
                    </ChartContainer>
                ) : (
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                        <p className="text-center">No subject data available yet.<br/>Complete assignments to see your performance.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
