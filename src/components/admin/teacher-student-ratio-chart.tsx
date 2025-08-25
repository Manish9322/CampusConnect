"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
} from "@/components/ui/chart";
import { DonutChart } from '@tremor/react';


export function TeacherStudentRatioChart() {
    const data = [
        {
            name: 'Teachers',
            value: 82,
        },
        {
            name: 'Students',
            value: 1254,
        },
    ];

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base">Teacher:Student Ratio</CardTitle>
            </CardHeader>
            <CardContent className="pb-0">
                <div className="text-2xl font-bold">1:15</div>
                <p className="text-xs text-muted-foreground">Campus-wide average</p>
                <div className="h-32 mt-4">
                    <ChartContainer config={{}} className="w-full h-full">
                         <DonutChart
                            data={data}
                            category="value"
                            index="name"
                            variant="pie"
                            colors={['hsl(var(--chart-1))', 'hsl(var(--chart-2))']}
                            className="h-28"
                        />
                    </ChartContainer>
                </div>
            </CardContent>
        </Card>
    )
}
