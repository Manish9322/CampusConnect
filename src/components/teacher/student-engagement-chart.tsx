
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pie, PieChart, Cell } from "recharts";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "../ui/skeleton";

interface StudentEngagementChartProps {
    data?: Array<{ type: string; value: number }>;
    isLoading?: boolean;
}

const chartConfig = {
  value: {
    label: "Students",
  },
  "Highly Engaged": {
    label: "Highly Engaged",
    color: "hsl(var(--chart-1))",
  },
  "Moderately Engaged": {
    label: "Moderately Engaged",
    color: "hsl(var(--chart-2))",
  },
  "Low Engagement": {
    label: "Low Engagement",
    color: "hsl(var(--chart-3))",
  },
};

const defaultData = [
  { type: "Highly Engaged", value: 0, fill: "hsl(var(--chart-1))" },
  { type: "Moderately Engaged", value: 0, fill: "hsl(var(--chart-2))" },
  { type: "Low Engagement", value: 0, fill: "hsl(var(--chart-3))" },
];

export function StudentEngagementChart({ data, isLoading }: StudentEngagementChartProps) {
  const chartData = data && data.length > 0
    ? data.map(item => ({ ...item, fill: chartConfig[item.type as keyof typeof chartConfig]?.color || 'hsl(var(--muted))' }))
    : defaultData;
  const hasData = data && data.some(item => item.value > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Engagement</CardTitle>
        <CardDescription>Based on attendance across all your classes.</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        {isLoading ? (
            <div className="h-64 w-full flex items-center justify-center">
                <Skeleton className="h-full w-full" />
            </div>
        ) : hasData ? (
            <ChartContainer
                config={chartConfig}
                className="h-64 w-full max-w-xs"
            >
            <PieChart>
                <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                data={chartData}
                dataKey="value"
                nameKey="type"
                innerRadius={50}
                strokeWidth={5}
                >
                    {chartData.map((entry) => (
                        <Cell key={entry.type} fill={entry.fill} />
                    ))}
                </Pie>
                <ChartLegend
                content={<ChartLegendContent nameKey="type" />}
                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                />
            </PieChart>
            </ChartContainer>
        ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
                No student data available to show engagement.
            </div>
        )}
      </CardContent>
    </Card>
  );
}
