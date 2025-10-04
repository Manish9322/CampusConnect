
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";

interface StudentStatCardsProps {
    attendancePercentage: number;
    presentDays: number;
    absentDays: number;
    totalClasses: number;
}

export function StudentStatCards({ attendancePercentage, presentDays, absentDays, totalClasses }: StudentStatCardsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
                <span className="text-sm text-muted-foreground">{presentDays}/{totalClasses}</span>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
                <div className="relative h-28 w-28">
                    <svg className="h-full w-full" width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-gray-200 dark:text-gray-700" strokeWidth="2"></circle>
                        <g className="origin-center -rotate-90 transform">
                            <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-primary" strokeWidth="2" strokeDasharray="100" strokeDashoffset={100 - attendancePercentage}></circle>
                        </g>
                    </svg>
                    <div className="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2">
                        <span className="text-center text-2xl font-bold text-gray-800 dark:text-white">{attendancePercentage}%</span>
                    </div>
                </div>
            </CardContent>
        </Card>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Days Present</CardTitle>
                <Check className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold text-green-600">{presentDays}</div>
                <p className="text-xs text-muted-foreground">This Semester</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Days Absent</CardTitle>
                <X className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold text-red-600">{absentDays}</div>
                <p className="text-xs text-muted-foreground">Keep an eye on this</p>
            </CardContent>
        </Card>
    </div>
  )
}
