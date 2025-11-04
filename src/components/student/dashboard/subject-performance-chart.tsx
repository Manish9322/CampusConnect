
"use client"

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Pie, PieChart as RechartsPieChart, Cell } from "recharts";
import { Assignment, Grade } from "@/lib/types";

interface SubjectPerformanceChartProps {
  assignments: Assignment[];
  grades: Grade[];
}

const chartConfig = {
  score: {
    label: "Score",
  },
};

const chartColors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
];

export function SubjectPerformanceChart({ assignments, grades }: SubjectPerformanceChartProps) {
    // Calculate subject-wise performance
    const generateChartData = () => {
        const subjectData = new Map<string, { totalMarks: number; earnedMarks: number }>();

        grades.forEach((grade: Grade) => {
            if (grade.marks === null || grade.marks === undefined) return;
            
            const assignment = assignments.find((a: Assignment) => a._id === grade.assignmentId);
            if (!assignment) return;

            const courseName = assignment.courseName;
            if (!subjectData.has(courseName)) {
                subjectData.set(courseName, { totalMarks: 0, earnedMarks: 0 });
            }

            const data = subjectData.get(courseName)!;
            data.totalMarks += assignment.totalMarks;
            data.earnedMarks += grade.marks;
        });

        return Array.from(subjectData.entries()).map(([subject, data], index) => {
            const score = Math.round((data.earnedMarks / data.totalMarks) * 100);
            return {
                subject,
                score,
                fill: chartColors[index % chartColors.length],
            };
        });
    };

    const chartData = generateChartData();
    const hasData = chartData.length > 0;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Subject-wise Performance</CardTitle>
                <CardDescription>Your current average score in each subject.</CardDescription>
            </CardHeader>
            <CardContent>
                {hasData ? (
                    <ChartContainer config={chartConfig} className="h-64 w-full">
                        <RechartsPieChart>
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Pie data={chartData} dataKey="score" nameKey="subject" cx="50%" cy="50%" outerRadius={80} label>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                        </RechartsPieChart>
                    </ChartContainer>
                ) : (
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                        <p>No graded assignments yet.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
