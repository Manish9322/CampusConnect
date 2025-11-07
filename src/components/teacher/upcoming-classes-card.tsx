
"use client"
import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "../shared/empty-state";
import { useGetTimetableQuery } from "@/services/api";
import { DayOfWeek, Period, Teacher, Timetable } from "@/lib/types";

interface UpcomingClassesCardProps {
    teacher: Teacher | null;
}

const DAYS: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function UpcomingClassesCard({ teacher }: UpcomingClassesCardProps) {
    const today = new Date();
    const currentDay = DAYS[today.getDay()];
    const { data: allTimetables = [], isLoading } = useGetTimetableQuery({}, { skip: !teacher });

    const todaysSchedule: (Period & {className?: string})[] = React.useMemo(() => {
        if (isLoading || !teacher) return [];

        const teacherId = teacher._id || teacher.id;
        let dailyPeriods: (Period & {className?: string})[] = [];

        allTimetables.forEach((tt: Timetable) => {
            if (tt.day === currentDay) {
                tt.periods.forEach(p => {
                    const periodTeacherId = p.teacherId?._id || p.teacherId;
                    if (periodTeacherId === teacherId) {
                        dailyPeriods.push({ ...p, className: tt.className || tt.classId });
                    }
                });
            }
        });
        
        return dailyPeriods.sort((a, b) => a.startTime.localeCompare(b.startTime));
    }, [allTimetables, currentDay, isLoading, teacher]);

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle>Today's Schedule ({currentDay})</CardTitle>
                <CardDescription>Here are your classes for today.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
                {todaysSchedule.length > 0 ? (
                    todaysSchedule.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                            <div>
                                <p className="font-semibold">{item.subjectName} <span className="text-xs text-muted-foreground">({item.className})</span></p>
                                <p className="text-sm text-muted-foreground">{item.startTime} - {item.endTime}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="h-full flex items-center justify-center">
                        <EmptyState title="No Classes Today" description="You have no classes scheduled for today." className="border-none" />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
