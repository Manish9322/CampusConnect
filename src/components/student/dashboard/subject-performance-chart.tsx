
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Pie, PieChart as RechartsPieChart, Cell } from "recharts";

const chartData = [
    { subject: "CS101", score: 92, fill: "hsl(var(--chart-1))" },
    { subject: "PHY101", score: 85, fill: "hsl(var(--chart-2))" },
    { subject: "MTH201", score: 88, fill: "hsl(var(--chart-3))" },
    { subject: "CS303", score: 95, fill: "hsl(var(--chart-4))" },
];

const chartConfig = {
  score: {
    label: "Score",
  },
};

export function SubjectPerformanceChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Subject-wise Performance</CardTitle>
                <CardDescription>Your current average score in each subject.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-64 w-full">
                    <RechartsPieChart>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Pie data={chartData} dataKey="score" nameKey="subject" cx="50%" cy="50%" outerRadius={80} label>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                    </RechartsPieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
