"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pie, PieChart, Cell } from "recharts";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartData = [
  { type: "Highly Engaged", value: 18, fill: "hsl(var(--chart-1))" },
  { type: "Moderately Engaged", value: 20, fill: "hsl(var(--chart-2))" },
  { type: "Low Engagement", value: 7, fill: "hsl(var(--chart-3))" },
];

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

export function StudentEngagementChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Engagement</CardTitle>
        <CardDescription>Across all your classes.</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
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
      </CardContent>
    </Card>
  );
}
