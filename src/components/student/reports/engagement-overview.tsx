
"use client"

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Assignment, Grade } from "@/lib/types";

interface EngagementOverviewProps {
    assignments: Assignment[];
    grades: Grade[];
    attendancePercentage: number;
}

export function EngagementOverview({ assignments, grades, attendancePercentage }: EngagementOverviewProps) {
    // Calculate engagement metrics from real data
    const calculateEngagement = () => {
        // 1. Assignment Submission Rate
        const submissionRate = assignments.length > 0 
            ? Math.round((grades.length / assignments.length) * 100)
            : 0;

        // 2. On-Time Submission Rate
        const onTimeSubmissions = grades.filter((g: Grade) => g.status === 'Submitted').length;
        const onTimeRate = grades.length > 0
            ? Math.round((onTimeSubmissions / grades.length) * 100)
            : 0;

        // 3. Assignment Completion (graded assignments)
        const gradedCount = grades.filter((g: Grade) => g.marks !== null && g.marks !== undefined).length;
        const completionRate = assignments.length > 0
            ? Math.round((gradedCount / assignments.length) * 100)
            : 0;

        // 4. Average Performance (for graded work)
        const gradedAssignments = grades.filter((g: Grade) => g.marks !== null && g.marks !== undefined);
        const avgPerformance = gradedAssignments.length > 0
            ? Math.round(gradedAssignments.reduce((sum: number, g: Grade) => {
                const assignment = assignments.find((a: Assignment) => a._id === g.assignmentId);
                if (assignment && g.marks !== null && g.marks !== undefined) {
                    return sum + (g.marks / assignment.totalMarks) * 100;
                }
                return sum;
            }, 0) / gradedAssignments.length)
            : 0;

        return [
            { 
                title: "Assignment Submission", 
                value: submissionRate, 
                color: "bg-primary",
                description: `${grades.length} of ${assignments.length} submitted`
            },
            { 
                title: "On-Time Submissions", 
                value: onTimeRate, 
                color: "bg-green-500",
                description: `${onTimeSubmissions} on time`
            },
            { 
                title: "Class Attendance", 
                value: Math.round(attendancePercentage), 
                color: "bg-accent",
                description: `Overall attendance rate`
            },
            { 
                title: "Average Performance", 
                value: avgPerformance, 
                color: "bg-orange-500",
                description: gradedAssignments.length > 0 ? `Based on ${gradedAssignments.length} graded work` : 'No graded work yet'
            },
        ];
    };

    const engagementData = calculateEngagement();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Engagement Analytics</CardTitle>
                <CardDescription>Your participation across various activities.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {engagementData.map(item => (
                    <div key={item.title}>
                        <div className="flex justify-between items-center mb-1">
                            <p className="text-sm font-medium">{item.title}</p>
                            <p className="text-sm text-muted-foreground">{item.value}%</p>
                        </div>
                        <Progress value={item.value} className="h-2" indicatorClassName={item.color} />
                        <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
