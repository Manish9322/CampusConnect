
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, XAxis, YAxis, CartesianGrid } from "recharts";

const chartData = [
  { grade: "A", count: 8 },
  { grade: "B", count: 12 },
  { grade: "C", count: 5 },
  { grade: "D", count: 1 },
  { grade: "F", count: 0 },
];

const chartConfig = {
  count: {
    label: "Count",
    color: "hsl(var(--chart-2))",
  },
};

export function GradeDistributionChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
                <CardDescription>Your grade distribution across all subjects.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-64 w-full">
                    <RechartsBarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: -10 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="grade" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="count" fill="var(--color-count)" radius={4} />
                    </RechartsBarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
