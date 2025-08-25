"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, XAxis, YAxis } from "recharts";

const chartData = [
  { class: "CS101", size: 35 },
  { class: "PHY101", size: 28 },
  { class: "MTH201", size: 22 },
  { class: "CHM101", size: 31 },
];

const chartConfig = {
  size: {
    label: "Students",
    color: "hsl(var(--chart-1))",
  },
};

export function ClassSizeChart() {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base">Avg. Class Size</CardTitle>
            </CardHeader>
            <CardContent>
                 <div className="text-2xl font-bold">28</div>
                <p className="text-xs text-muted-foreground">Across all courses</p>
                <div className="h-32 mt-4">
                    <ChartContainer config={chartConfig} className="w-full h-full">
                        <RechartsBarChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                            <XAxis dataKey="class" hide />
                            <YAxis domain={[0, 40]} hide />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                            <Bar dataKey="size" fill="var(--color-size)" radius={2} />
                        </RechartsBarChart>
                    </ChartContainer>
                </div>
            </CardContent>
        </Card>
    )
}
