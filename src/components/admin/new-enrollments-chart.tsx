"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Line, LineChart as RechartsLineChart } from "recharts";

const chartData = [
  { day: 1, enrollments: 5 },
  { day: 2, enrollments: 8 },
  { day: 3, enrollments: 3 },
  { day: 4, enrollments: 10 },
  { day: 5, enrollments: 12 },
  { day: 6, enrollments: 4 },
];

const chartConfig = {
  enrollments: {
    label: "New Enrollments",
    color: "hsl(var(--chart-2))",
  },
};

export function NewEnrollmentsChart() {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base">New Enrollments</CardTitle>
            </CardHeader>
            <CardContent>
                 <div className="text-2xl font-bold">+42</div>
                <p className="text-xs text-muted-foreground">This week</p>
                <div className="h-32 mt-4">
                    <ChartContainer config={chartConfig} className="w-full h-full">
                        <RechartsLineChart data={chartData} margin={{ top: 0, right: 5, bottom: 0, left: 5 }}>
                            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                            <Line type="natural" dataKey="enrollments" stroke="var(--color-enrollments)" strokeWidth={2} dot={false} />
                        </RechartsLineChart>
                    </ChartContainer>
                </div>
            </CardContent>
        </Card>
    )
}
