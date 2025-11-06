
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useGetTimetableQuery, useGetClassesQuery } from "@/services/api";
import { Teacher, Timetable, Period, DayOfWeek, Class } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Clock, Book, User, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "@/components/ui/badge";

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function TeacherSchedule() {
    const [teacher, setTeacher] = React.useState<Teacher | null>(null);

    React.useEffect(() => {
        const storedUser = localStorage.getItem('teacher_user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser.id && !parsedUser._id) {
                parsedUser._id = parsedUser.id;
            }
            setTeacher(parsedUser);
        }
    }, []);
    
    const { data: allClasses = [], isLoading: isLoadingClasses } = useGetClassesQuery(undefined);
    const { data: allTimetables = [], isLoading: isLoadingTimetables } = useGetTimetableQuery({}, { skip: !teacher });
    
    const isLoading = isLoadingClasses || isLoadingTimetables || !teacher;

    const teacherClasses = React.useMemo(() => {
        if (!teacher || !allClasses) return [];
        const teacherId = teacher._id || teacher.id;
        return allClasses.filter((c: Class) => {
            const classTeacherId = c.teacherId?._id || c.teacherId;
            return classTeacherId === teacherId;
        });
    }, [teacher, allClasses]);

    const getTimetableForDay = (day: DayOfWeek): Period[] => {
        if (!teacher) return [];

        const teacherId = teacher._id || teacher.id;
        let dailyPeriods: Period[] = [];

        allTimetables.forEach((tt: Timetable) => {
            if (tt.day === day) {
                tt.periods.forEach(p => {
                    const periodTeacherId = p.teacherId?._id || p.teacherId;
                    if (periodTeacherId === teacherId) {
                        dailyPeriods.push({ ...p, className: tt.className || tt.classId });
                    }
                });
            }
        });
        
        return dailyPeriods.sort((a, b) => a.startTime.localeCompare(b.startTime));
    };

    const renderTimetableContent = (day: DayOfWeek) => {
        if (isLoading) {
            return (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
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
            return <EmptyState title="No Classes Today" description="You have no classes scheduled for this day." />;
        }

        return (
            <div className="space-y-4">
                {periods.map((period, index) => (
                    <Card key={index}>
                        <CardContent className="p-4">
                            <div className="flex flex-col sm:flex-row justify-between gap-4">
                                <div className="flex-1 space-y-1">
                                    <h4 className="font-semibold text-lg">{period.subjectName}</h4>
                                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                                        <Book className="h-4 w-4" /> Class: {period.className}
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                                    <Badge variant="outline" className="text-base px-3 py-1 w-fit">Period {period.periodNumber}</Badge>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        <span>{period.startTime} - {period.endTime}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Calendar className="h-6 w-6" />
                    <CardTitle className="text-2xl">My Schedule</CardTitle>
                </div>
                <CardDescription>Your weekly teaching timetable.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="Monday" className="w-full">
                    <TabsList className="mb-6 grid-cols-3 sm:grid-cols-6 h-auto w-full grid">
                        {DAYS.map(day => (
                            <TabsTrigger key={day} value={day}>{day}</TabsTrigger>
                        ))}
                    </TabsList>
                    {DAYS.map(day => (
                        <TabsContent key={day} value={day}>
                            {renderTimetableContent(day)}
                        </TabsContent>
                    ))}
                </Tabs>
            </CardContent>
        </Card>
    );
}
