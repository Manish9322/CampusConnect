
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Line, LineChart as RechartsLineChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

const defaultChartData = [
  { month: "Jan", students: 0 },
  { month: "Feb", students: 0 },
  { month: "Mar", students: 0 },
  { month: "Apr", students: 0 },
  { month: "May", students: 0 },
  { month: "Jun", students: 0 },
];

const chartConfig = {
  students: {
    label: "Enrollments",
    color: "hsl(var(--accent))",
  },
};

interface EnrollmentChartProps {
    data?: Array<{ month: string; students: number }>;
    isLoading?: boolean;
}

export function EnrollmentChart({ data, isLoading }: EnrollmentChartProps) {
    const chartData = data && data.length > 0 ? data : defaultChartData;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Enrollment Trends</CardTitle>
                 <CardDescription>New student enrollments over the last 6 months.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="h-80 w-full flex items-center justify-center">
                        <Skeleton className="h-full w-full" />
                    </div>
                ) : (
                    <ChartContainer config={chartConfig} className="h-80 w-full">
                        <RechartsLineChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: -10 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Line type="monotone" dataKey="students" stroke="var(--color-students)" strokeWidth={2} />
                        </RechartsLineChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}
