"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartData = [
  { day: "Mon", attendance: 95 },
  { day: "Tue", attendance: 98 },
  { day: "Wed", attendance: 92 },
  { day: "Thu", attendance: 88 },
  { day: "Fri", attendance: 96 },
];

const chartConfig = {
  attendance: {
    label: "Attendance %",
    color: "hsl(var(--chart-1))",
  },
};

export function TeacherAttendanceOverviewChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Attendance Overview</CardTitle>
        <CardDescription>CS101 - Attendance for the current week.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="attendance" fill="var(--color-attendance)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
