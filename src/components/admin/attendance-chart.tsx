"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

const defaultChartData = [
  { day: "Mon", attendance: 0 },
  { day: "Tue", attendance: 0 },
  { day: "Wed", attendance: 0 },
  { day: "Thu", attendance: 0 },
  { day: "Fri", attendance: 0 },
  { day: "Sat", attendance: 0 },
  { day: "Sun", attendance: 0 },
];

const chartConfig = {
  attendance: {
    label: "Attendance (%)",
    color: "hsl(var(--primary))",
  },
};

interface AttendanceChartProps {
    data?: Array<{ day: string; attendance: number }>;
    isLoading?: boolean;
}

export function AttendanceChart({ data, isLoading }: AttendanceChartProps) {
    const chartData = data && data.length > 0 ? data : defaultChartData;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Weekly Attendance Trend</CardTitle>
                <CardDescription>A look at student attendance over the past week.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="h-80 w-full flex items-center justify-center">
                        <Skeleton className="h-full w-full" />
                    </div>
                ) : (
                    <ChartContainer config={chartConfig} className="h-80 w-full">
                    <RechartsBarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: -10 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="attendance" fill="var(--color-attendance)" radius={4} />
                    </RechartsBarChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}
