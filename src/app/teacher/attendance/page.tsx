
"use client"

import * as React from "react";
import { AttendanceTool } from "@/components/teacher/attendance-tool";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookCopy, Users, BarChart, Clock } from "lucide-react";
import { useGetClassesQuery, useGetStudentsQuery, useGetTimetableQuery } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Class, Student, Teacher, Timetable, DayOfWeek } from "@/lib/types";

const DAYS: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function TeacherAttendancePage() {
    const [user, setUser] = React.useState<Teacher | null>(null);
    const [today, setToday] = React.useState<DayOfWeek>('Monday');

    React.useEffect(() => {
        const storedUser = localStorage.getItem('teacher_user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser.id && !parsedUser._id) {
                parsedUser._id = parsedUser.id;
            }
            setUser(parsedUser);
        }
        setToday(DAYS[new Date().getDay()]);
    }, []);
    
    const { data: allClasses = [], isLoading: isLoadingClasses } = useGetClassesQuery(undefined);
    const { data: allStudents = [], isLoading: isLoadingStudents } = useGetStudentsQuery({});
    const { data: allTimetables = [], isLoading: isLoadingTimetables } = useGetTimetableQuery({ day: today }, { skip: !today });

    const isLoading = isLoadingClasses || isLoadingStudents || isLoadingTimetables || !user;

    const teacherClassesForToday = React.useMemo(() => {
        if (isLoading || !allTimetables || !allClasses) return [];
        
        const teacherId = user?._id || user?.id;
        if (!teacherId) return [];
        
        // Find all unique class IDs the teacher is scheduled for today from the timetables
        const scheduledClassIds = allTimetables
            .filter((tt: Timetable) => tt.day === today)
            .flatMap((tt: Timetable) => 
                tt.periods.filter(p => (p.teacherId?._id || p.teacherId) === teacherId).map(() => tt.classId?._id || tt.classId)
            );
        
        const uniqueClassIds = [...new Set(scheduledClassIds)];
        
        // Get the full class details for those IDs
        return allClasses.filter((c: Class) => uniqueClassIds.includes(c._id!));

    }, [user, allClasses, allTimetables, today, isLoading]);

    const teacherStudents = React.useMemo(() => {
        if (!teacherClassesForToday.length || !allStudents.length) return [];
        const classIds = teacherClassesForToday.map(c => c._id);
        return allStudents.filter((s: Student) => {
             const studentClassId = typeof s.classId === 'object' ? (s.classId as any)?._id : s.classId;
             return classIds.includes(studentClassId);
        });
    }, [teacherClassesForToday, allStudents]);

    const stats = React.useMemo(() => {
        if (isLoading || teacherClassesForToday.length === 0) {
            return {
                coursesAssigned: 0,
                totalStudents: 0,
                avgClassSize: 0,
                activeCourses: 0,
            };
        }

        const coursesAssigned = teacherClassesForToday.length;
        const activeCourses = teacherClassesForToday.filter((c: any) => c.status === 'active').length;
        const totalStudents = teacherStudents.length;
        const avgClassSize = coursesAssigned > 0 ? Math.round(totalStudents / coursesAssigned) : 0;

        return {
            coursesAssigned,
            totalStudents,
            avgClassSize,
            activeCourses,
        };

    }, [isLoading, teacherClassesForToday, teacherStudents]);

    const renderStatCards = () => {
        if(isLoading) {
            return (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <Skeleton className="h-4 w-2/3" />
                                <Skeleton className="h-4 w-4" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-8 w-1/3" />
                                <Skeleton className="h-3 w-1/2 mt-1" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )
        }

        return (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Courses Today</CardTitle>
                        <BookCopy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.coursesAssigned}</div>
                        <p className="text-xs text-muted-foreground truncate">
                            {teacherClassesForToday.length > 0 
                                ? teacherClassesForToday.map((c: Class) => c.name).join(', ')
                                : 'No classes scheduled today'}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students Today</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalStudents}</div>
                        <p className="text-xs text-muted-foreground">
                            Across all your classes today
                        </p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Class Size</CardTitle>
                        <BarChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.avgClassSize}</div>
                        <p className="text-xs text-muted-foreground">
                            Average students per class
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Courses in Session</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeCourses}</div>
                        <p className="text-xs text-muted-foreground">
                            Currently active
                        </p>
                    </CardContent>
                </Card>
             </div>
        )
    }

    return (
        <div className="space-y-6">
            {renderStatCards()}
            <AttendanceTool 
                teacher={user}
                teacherClasses={teacherClassesForToday}
            />
        </div>
    );
}
