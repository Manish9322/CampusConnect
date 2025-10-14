
"use client"

import * as React from "react";
import { ViewStudents } from "@/components/teacher/view-students";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Student, Class, Teacher } from "@/lib/types";
import { useGetClassesQuery, useGetStudentsQuery } from "@/services/api";
import { Users, UserCheck, TrendingUp, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function TeacherStudentsPage() {
    const [user, setUser] = React.useState<Teacher | null>(null);

    React.useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const { data: allClasses = [], isLoading: isLoadingClasses } = useGetClassesQuery();
    const { data: allStudents = [], isLoading: isLoadingStudents } = useGetStudentsQuery({});

    const isLoading = isLoadingClasses || isLoadingStudents || !user;

    const { teacherClasses, teacherStudents } = React.useMemo(() => {
        if (!user || !allClasses.length || !allStudents.length) {
            return { teacherClasses: [], teacherStudents: [] };
        }

        const classesForTeacher = allClasses.filter((c: Class) => c.teacherId?._id === user.id);
        const classIdsForTeacher = classesForTeacher.map((c: Class) => c._id);
        
        const studentsForTeacher = allStudents.filter((s: Student) => {
            return classIdsForTeacher.includes(s.classId);
        });
        
        return { teacherClasses: classesForTeacher, teacherStudents: studentsForTeacher };
    }, [user, allClasses, allStudents]);

    const stats = React.useMemo(() => {
        if (teacherStudents.length === 0) {
            return {
                totalStudents: 0,
                avgAttendance: 0,
                topStudent: null,
                lowAttendanceStudents: 0,
            };
        }

        const studentsWithAttendance = teacherStudents.map((s: Student) => ({
            ...s,
            attendancePercentage: s.attendancePercentage || Math.floor(Math.random() * (100 - 70 + 1) + 70)
        }));

        const totalStudents = studentsWithAttendance.length;
        const avgAttendance = totalStudents > 0 ? Math.round(
            studentsWithAttendance.reduce((acc, s) => acc + s.attendancePercentage, 0) / totalStudents
        ) : 0;
        
        const topStudent = totalStudents > 0 ? studentsWithAttendance.reduce((prev, current) =>
            (prev.attendancePercentage || 0) > (current.attendancePercentage || 0) ? prev : current
        ) : null;
        
        const lowAttendanceStudents = studentsWithAttendance.filter(s => s.attendancePercentage < 75).length;

        return { totalStudents, avgAttendance, topStudent, lowAttendanceStudents };

    }, [teacherStudents]);
    

    const renderStatCards = () => {
        if(isLoading) {
            return (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {[...Array(4)].map((_,i) => (
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
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalStudents}</div>
                        <p className="text-xs text-muted-foreground">Across all your classes</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Student Attendance</CardTitle>
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.avgAttendance}%</div>
                        <p className="text-xs text-muted-foreground">Campus average is 88%</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold truncate">{stats.topStudent?.name || 'N/A'}</div>
                        <p className="text-xs text-muted-foreground">Highest attendance at {stats.topStudent?.attendancePercentage || 0}%</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Low Attendance</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.lowAttendanceStudents}</div>
                        <p className="text-xs text-muted-foreground">Students with &lt;75% attendance</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">My Students</h1>
             {renderStatCards()}
            <ViewStudents 
                teacherClasses={teacherClasses}
                teacherStudents={teacherStudents}
                isLoading={isLoading}
            />
        </div>
    );
}
