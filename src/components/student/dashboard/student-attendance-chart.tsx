
"use client"

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Line, LineChart as RechartsLineChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { AttendanceRecord } from "@/lib/types";

interface StudentAttendanceChartProps {
  attendanceRecords: AttendanceRecord[];
}

const chartConfig = {
  attendance: {
    label: "Attendance (%)",
    color: "hsl(var(--primary))",
  },
};

export function StudentAttendanceChart({ attendanceRecords }: StudentAttendanceChartProps) {
    // Calculate monthly attendance from records
    const generateChartData = () => {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthlyData = new Map<string, { present: number; total: number }>();

        attendanceRecords.forEach((record: AttendanceRecord) => {
            const date = new Date(record.date);
            const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
            const monthLabel = monthNames[date.getMonth()];

            if (!monthlyData.has(monthKey)) {
                monthlyData.set(monthKey, { present: 0, total: 0 });
            }

            const data = monthlyData.get(monthKey)!;
            data.total++;
            if (record.status === 'present' || record.status === 'late') {
                data.present++;
            }
        });

        // Get last 6 months
        const sortedMonths = Array.from(monthlyData.keys()).sort();
        const recentMonths = sortedMonths.slice(-6);

        if (recentMonths.length === 0) {
            // Return current month with 0 if no data
            const currentMonth = new Date().getMonth();
            return [{ month: monthNames[currentMonth], attendance: 0 }];
        }

        return recentMonths.map(monthKey => {
            const [year, monthIndex] = monthKey.split('-').map(Number);
            const data = monthlyData.get(monthKey)!;
            const percentage = data.total > 0 ? Math.round((data.present / data.total) * 100) : 0;

            return {
                month: monthNames[monthIndex],
                attendance: percentage,
            };
        });
    };

    const chartData = generateChartData();
    const hasData = chartData.some(d => d.attendance > 0);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Monthly Attendance Trend</CardTitle>
                <CardDescription>Your attendance percentage over recent months.</CardDescription>
            </CardHeader>
            <CardContent>
                {hasData ? (
                    <ChartContainer config={chartConfig} className="h-64 w-full">
                        <RechartsLineChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: -10 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Line type="monotone" dataKey="attendance" stroke="var(--color-attendance)" strokeWidth={2} />
                        </RechartsLineChart>
                    </ChartContainer>
                ) : (
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                        <p>No attendance data available yet.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
