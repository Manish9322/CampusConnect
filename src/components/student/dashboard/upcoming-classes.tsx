
"use client";
import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Student, Timetable, Period, DayOfWeek } from "@/lib/types";
import { useGetTimetableQuery } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";

interface UpcomingClassesProps {
  student: Student;
}

const DAYS: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function UpcomingClasses({ student }: UpcomingClassesProps) {
  const today = new Date();
  const currentDay = DAYS[today.getDay()];

  const classId = typeof student.classId === 'object' ? (student.classId as any)?._id : student.classId;

  const { data: timetables = [], isLoading } = useGetTimetableQuery(
    { classId: classId, day: currentDay },
    { skip: !classId }
  );

  const todaysSchedule: Period[] = React.useMemo(() => {
    if (isLoading || timetables.length === 0) return [];
    const dayTimetable = timetables.find((tt: Timetable) => tt.day === currentDay);
    if (!dayTimetable || !dayTimetable.periods) return [];
    return [...dayTimetable.periods].sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [timetables, currentDay, isLoading]);


  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Schedule ({currentDay})</CardTitle>
        <CardDescription>Here are your classes for today.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <>
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </>
        ) : todaysSchedule.length > 0 ? (
          todaysSchedule.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-md bg-muted/50"
            >
              <div>
                <p className="font-semibold">{item.subjectName}</p>
                <p className="text-sm text-muted-foreground">{item.startTime} - {item.endTime}</p>
              </div>
              <Badge
                variant={"secondary"}
              >
                {item.teacherName}
              </Badge>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-6">
            No classes scheduled for today.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
