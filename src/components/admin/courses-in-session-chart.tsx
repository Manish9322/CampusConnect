"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function CoursesInSessionChart() {
    const subjectsInSession = 78;
    const totalSubjects = 120;
    const progress = (subjectsInSession / totalSubjects) * 100;

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base">Subjects in Session</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{subjectsInSession}</div>
                <p className="text-xs text-muted-foreground">{totalSubjects - subjectsInSession} subjects starting soon</p>
                <div className="h-32 mt-4 flex items-end">
                  <Progress value={progress} className="h-2 w-full" />
                </div>
            </CardContent>
        </Card>
    )
}
