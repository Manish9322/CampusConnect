
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetTimetableQuery } from "@/services/api";
import { Student, Timetable, Period, DayOfWeek } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Clock, Book, User } from "lucide-react";

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function ClassSchedule() {
    const [student, setStudent] = React.useState<Student | null>(null);
    const [selectedDay, setSelectedDay] = React.useState<DayOfWeek>(DAYS[new Date().getDay() - 1] || 'Monday');

    React.useEffect(() => {
        const storedUser = localStorage.getItem('student_user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser.id && !parsedUser._id) {
                parsedUser._id = parsedUser.id;
            }
            setStudent(parsedUser);
        }
    }, []);
    
    // Handle both string and object ID for classId
    const classId = typeof student?.classId === 'object' 
        ? (student.classId as any)?._id 
        : student?.classId;

    const { data: timetables = [], isLoading } = useGetTimetableQuery({ classId }, { skip: !classId });

    const getTimetableForDay = (day: DayOfWeek): Period[] => {
        const timetableForDay = timetables.find((tt: Timetable) => tt.day === day);
        // Create a copy of the array before sorting to avoid mutating read-only data
        return [...(timetableForDay?.periods || [])].sort((a,b) => a.periodNumber - b.periodNumber);
    };

    const renderTimetableContent = (day: DayOfWeek) => {
        if (isLoading) {
            return (
                <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i}>
                            <CardContent className="p-4 space-y-2">
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )
        }

        const periods = getTimetableForDay(day);

        if (periods.length === 0) {
            return <EmptyState title={`No Classes on ${day}`} description="Enjoy your day off!" />;
        }

        return (
            <div className="space-y-4">
                {periods.map(period => (
                    <Card key={period.periodNumber} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl flex-shrink-0">
                                {period.periodNumber}
                            </div>
                            <div className="flex-1 space-y-1">
                                <h4 className="font-semibold text-lg">{period.subjectName}</h4>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                                    <div className="flex items-center gap-1.5">
                                        <User className="h-4 w-4" />
                                        <span>{period.teacherName}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="h-4 w-4" />
                                        <span>{period.startTime} - {period.endTime}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>My Class Schedule</CardTitle>
                <CardDescription>Your weekly timetable for all subjects.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Tabs value={selectedDay} onValueChange={(value) => setSelectedDay(value as DayOfWeek)}>
                    <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 mb-6">
                        {DAYS.map((day) => (
                            <TabsTrigger key={day} value={day}>
                                {day}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {DAYS.map((day) => (
                        <TabsContent key={day} value={day}>
                           {renderTimetableContent(day)}
                        </TabsContent>
                    ))}
                </Tabs>
            </CardContent>
        </Card>
    );
}
