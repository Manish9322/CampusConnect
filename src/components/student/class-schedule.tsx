
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useGetTimetableQuery } from "@/services/api";
import { Student, Timetable, Period, DayOfWeek } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Clock, Book, User, Calendar } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

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
        let maxPeriodsFound = 0;

        timetables.forEach((tt: Timetable) => {
            tt.periods.forEach(period => {
                if (period.periodNumber > maxPeriodsFound) {
                    maxPeriodsFound = period.periodNumber;
                }
                if (!scheduleMap.has(period.periodNumber)) {
                    scheduleMap.set(period.periodNumber, {});
                }
                const daySchedule = scheduleMap.get(period.periodNumber)!;
                daySchedule[tt.day] = period;
            });
        });
        
        // Ensure at least 8 periods are shown, even if fewer are defined
        const maxPeriods = Math.max(8, maxPeriodsFound);

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
                    {DAYS.map(day => (
                        <TableRow key={day}>
                            <TableCell className="font-semibold align-middle p-2 w-28 text-center">{day}</TableCell>
                            {[...Array(8)].map((_, i) => (
                                <TableCell key={i} className="p-1 w-40"><Skeleton className="h-24 w-full" /></TableCell>
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
                        <TableCell colSpan={maxPeriods + 1}>
                             <EmptyState title="No Schedule Available" description="A timetable has not been set for your class yet." />
                        </TableCell>
                    </TableRow>
                </TableBody>
            );
        }

        return (
            <TableBody>
                {DAYS.map(day => (
                    <TableRow key={day}>
                        <TableCell className="font-semibold align-middle p-2 w-28 text-center">{day}</TableCell>
                        {Array.from({ length: maxPeriods }, (_, i) => i + 1).map(periodNumber => {
                            const period = schedule.find(p => p.periodNumber === periodNumber)?.[day];
                            return (
                                <TableCell key={periodNumber} className="p-1 w-40">
                                    {period ? (
                                        <div className="p-2 rounded-md bg-muted/50 h-full flex flex-col justify-between text-left">
                                            <div className="space-y-1">
                                                <p className="font-semibold text-sm flex items-start gap-1.5">
                                                    <Book className="h-4 w-4 mt-0.5 text-primary shrink-0"/>
                                                    {period.subjectName}
                                                </p>
                                                <p className="text-xs text-muted-foreground flex items-start gap-1.5">
                                                     <User className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0"/>
                                                    {period.teacherName}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
                                                <Clock className="h-3 w-3 shrink-0" />
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
                    <Table className="min-w-[1200px]">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-28 text-center">Day</TableHead>
                                {Array.from({ length: maxPeriods }, (_, i) => i + 1).map(periodNum => (
                                     <TableHead key={periodNum} className="text-center w-40">Period {periodNum}</TableHead>
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
