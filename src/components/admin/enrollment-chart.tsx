"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Line, LineChart as RechartsLineChart, XAxis, YAxis, CartesianGrid } from "recharts";

const chartData = [
  { month: "Jan", enrollments: 120 },
  { month: "Feb", enrollments: 150 },
  { month: "Mar", enrollments: 175 },
  { month: "Apr", enrollments: 210 },
  { month: "May", enrollments: 190 },
  { month: "Jun", enrollments: 240 },
];

const chartConfig = {
  enrollments: {
    label: "Enrollments",
    color: "hsl(var(--accent))",
  },
};

export function EnrollmentChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Enrollment Trends</CardTitle>
                 <CardDescription>New student enrollments over the last 6 months.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-80 w-full">
                    <RechartsLineChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: -10 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="enrollments" stroke="var(--color-enrollments)" strokeWidth={2} />
                    </RechartsLineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
