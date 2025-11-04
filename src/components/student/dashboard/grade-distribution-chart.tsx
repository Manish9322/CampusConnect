
"use client"

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { Assignment, Grade } from "@/lib/types";

interface GradeDistributionChartProps {
  assignments: Assignment[];
  grades: Grade[];
}

const chartConfig = {
  count: {
    label: "Count",
    color: "hsl(var(--chart-2))",
  },
};

export function GradeDistributionChart({ assignments, grades }: GradeDistributionChartProps) {
    // Calculate grade distribution from real grades
    const generateChartData = () => {
        const gradeCounts = { A: 0, B: 0, C: 0, D: 0, F: 0 };

        grades.forEach((grade: Grade) => {
            if (grade.marks === null || grade.marks === undefined) return;
            
            const assignment = assignments.find((a: Assignment) => a._id === grade.assignmentId);
            if (!assignment) return;

            const percentage = (grade.marks / assignment.totalMarks) * 100;
            
            if (percentage >= 90) gradeCounts.A++;
            else if (percentage >= 80) gradeCounts.B++;
            else if (percentage >= 70) gradeCounts.C++;
            else if (percentage >= 60) gradeCounts.D++;
            else gradeCounts.F++;
        });

        return [
            { grade: "A", count: gradeCounts.A },
            { grade: "B", count: gradeCounts.B },
            { grade: "C", count: gradeCounts.C },
            { grade: "D", count: gradeCounts.D },
            { grade: "F", count: gradeCounts.F },
        ];
    };

    const chartData = generateChartData();
    const hasData = chartData.some(d => d.count > 0);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
                <CardDescription>Your grade distribution across all assignments.</CardDescription>
            </CardHeader>
            <CardContent>
                {hasData ? (
                    <ChartContainer config={chartConfig} className="h-64 w-full">
                        <RechartsBarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: -10 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="grade" />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="count" fill="var(--color-count)" radius={4} />
                        </RechartsBarChart>
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
