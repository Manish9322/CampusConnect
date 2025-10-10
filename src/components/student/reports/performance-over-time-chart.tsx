
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

const chartData = [
  { month: "Jan", assignments: 82, exams: 78 },
  { month: "Feb", assignments: 85, exams: 80 },
  { month: "Mar", assignments: 95, exams: 88 },
  { month: "Apr", assignments: 93, exams: 91 },
  { month: "May", assignments: 88, exams: 85 },
  { month: "Jun", assignments: 97, exams: 94 },
];

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

export function PerformanceOverTimeChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Performance Trend</CardTitle>
                <CardDescription>Your scores over the last 6 months.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-64 w-full">
                    <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[60, 100]} tickFormatter={(tick) => `${tick}%`} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line type="monotone" dataKey="assignments" stroke="var(--color-assignments)" strokeWidth={2} activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="exams" stroke="var(--color-exams)" strokeWidth={2} />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
