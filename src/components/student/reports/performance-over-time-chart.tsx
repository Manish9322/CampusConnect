
"use client"

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { Assignment, Grade } from "@/lib/types";

interface PerformanceOverTimeChartProps {
    assignments: Assignment[];
    grades: Grade[];
}

const chartConfig = {
  assignments: {
    label: "Assignments (%)",
    color: "hsl(var(--primary))",
  },
  exams: {
    label: "Exams (%)",
    color: "hsl(var(--accent))",
  },
};

export function PerformanceOverTimeChart({ assignments, grades }: PerformanceOverTimeChartProps) {
    // Generate chart data from real grades
    const generateChartData = () => {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthlyData = new Map<string, { assignments: number[], exams: number[] }>();

        // Group grades by month
        grades.forEach((grade: Grade) => {
            if (grade.marks === null || grade.marks === undefined || !grade.submittedAt) return;
            
            const assignment = assignments.find((a: Assignment) => a._id === grade.assignmentId);
            if (!assignment) return;

            const date = new Date(grade.submittedAt);
            const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
            const monthLabel = monthNames[date.getMonth()];

            if (!monthlyData.has(monthKey)) {
                monthlyData.set(monthKey, { assignments: [], exams: [] });
            }

            const percentage = (grade.marks / assignment.totalMarks) * 100;
            const data = monthlyData.get(monthKey)!;

            if (assignment.type === 'Exam' || assignment.type === 'Quiz') {
                data.exams.push(percentage);
            } else {
                data.assignments.push(percentage);
            }
        });

        // Calculate averages and create chart data
        const sortedMonths = Array.from(monthlyData.keys()).sort();
        const recentMonths = sortedMonths.slice(-6); // Last 6 months

        if (recentMonths.length === 0) {
            // Return default data if no submissions yet
            return [
                { month: monthNames[new Date().getMonth()], assignments: 0, exams: 0 }
            ];
        }

        return recentMonths.map(monthKey => {
            const [year, monthIndex] = monthKey.split('-').map(Number);
            const data = monthlyData.get(monthKey)!;
            
            const avgAssignments = data.assignments.length > 0
                ? data.assignments.reduce((a, b) => a + b, 0) / data.assignments.length
                : null;
            
            const avgExams = data.exams.length > 0
                ? data.exams.reduce((a, b) => a + b, 0) / data.exams.length
                : null;

            return {
                month: monthNames[monthIndex],
                assignments: avgAssignments ? Math.round(avgAssignments) : null,
                exams: avgExams ? Math.round(avgExams) : null,
            };
        });
    };

    const chartData = generateChartData();
    const hasData = chartData.some(d => d.assignments !== null || d.exams !== null);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Performance Trend</CardTitle>
                <CardDescription>Your scores over recent months.</CardDescription>
            </CardHeader>
            <CardContent>
                {hasData ? (
                    <ChartContainer config={chartConfig} className="h-64 w-full">
                        <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Legend />
                            <Line 
                                type="monotone" 
                                dataKey="assignments" 
                                stroke="var(--color-assignments)" 
                                strokeWidth={2} 
                                activeDot={{ r: 8 }}
                                connectNulls
                            />
                            <Line 
                                type="monotone" 
                                dataKey="exams" 
                                stroke="var(--color-exams)" 
                                strokeWidth={2}
                                connectNulls
                            />
                        </LineChart>
                    </ChartContainer>
                ) : (
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                        <p>No performance data available yet. Complete assignments to see your trend.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
