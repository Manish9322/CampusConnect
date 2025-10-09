
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Line, LineChart as RechartsLineChart, XAxis, YAxis, CartesianGrid } from "recharts";

const chartData = [
  { month: "Jan", attendance: 88 },
  { month: "Feb", attendance: 92 },
  { month: "Mar", attendance: 95 },
  { month: "Apr", attendance: 93 },
  { month: "May", attendance: 85 },
  { month: "Jun", attendance: 97 },
];

const chartConfig = {
  attendance: {
    label: "Attendance (%)",
    color: "hsl(var(--primary))",
  },
};

export function StudentAttendanceChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Monthly Attendance Trend</CardTitle>
                <CardDescription>Your attendance percentage over the last 6 months.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-64 w-full">
                    <RechartsLineChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: -10 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[70, 100]} tickFormatter={(tick) => `${tick}%`} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="attendance" stroke="var(--color-attendance)" strokeWidth={2} />
                    </RechartsLineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
