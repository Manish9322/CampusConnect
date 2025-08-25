
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Bar, CartesianGrid, Line, XAxis, YAxis } from "recharts";
import { Badge } from "../ui/badge";

const monthlyData = [
  { month: "Jan", attendance: 88 },
  { month: "Feb", attendance: 92 },
  { month: "Mar", attendance: 95 },
  { month: "Apr", attendance: 93 },
  { month: "May", attendance: 85 },
  { month: "Jun", attendance: 97 },
];

const subjectData = [
    { subject: "CS101", attendance: 98 },
    { subject: "PHY101", attendance: 92 },
    { subject: "MTH201", attendance: 95 },
    { subject: "CS303", attendance: 88 },
];

const chartConfig = {
  attendance: {
    label: "Attendance (%)",
    color: "hsl(var(--primary))",
  },
};

export function ReportsView() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Reports & Insights</CardTitle>
                    <CardDescription>Visualize your attendance trends and performance.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="text-lg font-medium">Your average attendance is <Badge>92%</Badge>, which is <Badge className="bg-green-100 text-green-800">above</Badge> the class average of 88%.</div>
                    <div className="text-lg font-medium">Your attendance has <Badge className="bg-green-100 text-green-800">improved by 4%</Badge> compared to last month.</div>
                </CardContent>
            </Card>
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Attendance Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-80 w-full">
                            <LineChart data={monthlyData} margin={{ top: 20, right: 20, bottom: 20, left: -10 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis domain={[70, 100]} tickFormatter={(tick) => `${tick}%`} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Line type="monotone" dataKey="attendance" stroke="var(--color-attendance)" strokeWidth={2} />
                            </LineChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Subject-wise Attendance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-80 w-full">
                            <BarChart data={subjectData} margin={{ top: 20, right: 20, bottom: 20, left: -10 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="subject" />
                                <YAxis domain={[70, 100]} tickFormatter={(tick) => `${tick}%`} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="attendance" fill="var(--color-attendance)" radius={4} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
