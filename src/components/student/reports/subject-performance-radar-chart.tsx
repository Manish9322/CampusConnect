"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend } from "recharts";

const chartData = [
  { subject: "CS101", performance: 92, attendance: 98 },
  { subject: "PHY101", performance: 85, attendance: 92 },
  { subject: "MTH201", performance: 88, attendance: 95 },
  { subject: "CS303", performance: 95, attendance: 88 },
  { subject: "CHM101", performance: 80, attendance: 90 },
];

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

export function SubjectPerformanceRadarChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Subject-wise Overview</CardTitle>
                <CardDescription>Performance vs. attendance.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-64 w-full">
                    <RadarChart data={chartData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={30} domain={[60, 100]} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Radar name="Performance" dataKey="performance" stroke="var(--color-performance)" fill="var(--color-performance)" fillOpacity={0.6} />
                        <Radar name="Attendance" dataKey="attendance" stroke="var(--color-attendance)" fill="var(--color-attendance)" fillOpacity={0.6} />
                        <Legend />
                    </RadarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
