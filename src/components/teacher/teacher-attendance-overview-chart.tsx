
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "../ui/skeleton";

const defaultChartData = [
  { day: "Mon", attendance: 0 },
  { day: "Tue", attendance: 0 },
  { day: "Wed", attendance: 0 },
  { day: "Thu", attendance: 0 },
  { day: "Fri", attendance: 0 },
  { day: "Sat", attendance: 0 },
];

const chartConfig = {
  attendance: {
    label: "Attendance %",
    color: "hsl(var(--chart-1))",
  },
};

interface TeacherAttendanceOverviewChartProps {
    data?: Array<{ day: string; attendance: number }>;
    isLoading?: boolean;
}

export function TeacherAttendanceOverviewChart({ data, isLoading }: TeacherAttendanceOverviewChartProps) {
  const chartData = data && data.length > 0 ? data.filter(d => d.day !== 'Sun') : defaultChartData;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Attendance Overview</CardTitle>
        <CardDescription>Average attendance for your classes this week.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
            <div className="h-64 w-full flex items-center justify-center">
                <Skeleton className="h-full w-full" />
            </div>
        ) : (
            <ChartContainer config={chartConfig} className="h-64 w-full">
            <RechartsBarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                dataKey="day"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                />
                <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
                />
                <Bar dataKey="attendance" fill="var(--color-attendance)" radius={4} />
            </RechartsBarChart>
            </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
