"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function CoursesInSessionChart() {
    const coursesInSession = 78;
    const totalCourses = 120;
    const progress = (coursesInSession / totalCourses) * 100;

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base">Courses in Session</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{coursesInSession}</div>
                <p className="text-xs text-muted-foreground">{totalCourses - coursesInSession} courses starting soon</p>
                <div className="h-32 mt-4 flex items-end">
                  <Progress value={progress} className="h-2 w-full" />
                </div>
            </CardContent>
        </Card>
    )
}
