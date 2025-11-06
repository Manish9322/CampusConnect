
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useGetTimetableQuery } from "@/services/api";
import { Student, Timetable, Period, DayOfWeek } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Clock, Book, User, Calendar } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function ClassSchedule() {
    const [student, setStudent] = React.useState<Student | null>(null);

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
    
    const classId = typeof student?.classId === 'object' 
        ? (student.classId as any)?._id 
        : student?.classId;

    const { data: timetables = [], isLoading } = useGetTimetableQuery({ classId }, { skip: !classId });

    // Process timetable data into a structured format for the table
    const { schedule, maxPeriods } = React.useMemo(() => {
        if (isLoading || timetables.length === 0) {
            return { schedule: [], maxPeriods: 0 };
        }

        const scheduleMap = new Map<number, { [key in DayOfWeek]?: Period }>();
        let maxPeriods = 0;

        timetables.forEach((tt: Timetable) => {
            tt.periods.forEach(period => {
                if (period.periodNumber > maxPeriods) {
                    maxPeriods = period.periodNumber;
                }
                if (!scheduleMap.has(period.periodNumber)) {
                    scheduleMap.set(period.periodNumber, {});
                }
                const daySchedule = scheduleMap.get(period.periodNumber)!;
                daySchedule[tt.day] = period;
            });
        });

        const schedule = Array.from({ length: maxPeriods }, (_, i) => {
            const periodNumber = i + 1;
            return {
                periodNumber,
                ...scheduleMap.get(periodNumber),
            };
        });

        return { schedule, maxPeriods };
    }, [timetables, isLoading]);

    const renderTableBody = () => {
        if (isLoading) {
            return (
                <TableBody>
                    {[...Array(8)].map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-6 w-12" /></TableCell>
                            {[...Array(6)].map((_, j) => (
                                <TableCell key={j}><Skeleton className="h-16 w-full" /></TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            );
        }

        if (schedule.length === 0) {
            return (
                <TableBody>
                    <TableRow>
                        <TableCell colSpan={DAYS.length + 1}>
                             <EmptyState title="No Schedule Available" description="A timetable has not been set for your class yet." />
                        </TableCell>
                    </TableRow>
                </TableBody>
            );
        }

        return (
            <TableBody>
                {schedule.map(({ periodNumber, ...days }) => (
                    <TableRow key={periodNumber}>
                        <TableCell className="font-semibold text-center align-middle p-2">
                            <div className="flex flex-col items-center justify-center h-full">
                                <span>Period</span>
                                <span className="text-xl">{periodNumber}</span>
                            </div>
                        </TableCell>
                        {DAYS.map(day => {
                            const period = (days as any)[day];
                            return (
                                <TableCell key={day} className="p-2 align-top h-28">
                                    {period ? (
                                        <div className="p-2 rounded-md bg-muted/50 h-full flex flex-col justify-between">
                                            <div>
                                                <p className="font-semibold text-sm">{period.subjectName}</p>
                                                <p className="text-xs text-muted-foreground">{period.teacherName}</p>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                                                <Clock className="h-3 w-3" />
                                                <span>{period.startTime} - {period.endTime}</span>
                                            </div>
                                        </div>
                                    ) : null}
                                </TableCell>
                            );
                        })}
                    </TableRow>
                ))}
            </TableBody>
        );
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Calendar className="h-6 w-6" />
                    <CardTitle className="text-2xl">My Class Schedule</CardTitle>
                </div>
                <CardDescription>Your weekly timetable for all subjects.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border overflow-x-auto">
                    <Table className="min-w-[1000px]">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-24 text-center">Period</TableHead>
                                {DAYS.map(day => (
                                    <TableHead key={day} className="text-center">{day}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        {renderTableBody()}
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
