
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
        const storedUser = localStorage.getItem('teacher_user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            // Ensure both id and _id are set for compatibility
            if (parsedUser.id && !parsedUser._id) {
                parsedUser._id = parsedUser.id;
            }
            setUser(parsedUser);
        }
    }, []);

    const { data: allClasses = [], isLoading: isLoadingClasses } = useGetClassesQuery(undefined);
    const { data: allStudents = [], isLoading: isLoadingStudents } = useGetStudentsQuery({});

    const isLoading = isLoadingClasses || isLoadingStudents || !user;

    const { teacherClasses, teacherStudents } = React.useMemo(() => {
        if (!user || !allClasses.length || !allStudents.length) {
            return { teacherClasses: [], teacherStudents: [] };
        }

        const userId = user._id || user.id;
        const classesForTeacher = allClasses.filter((c: Class) => {
            const classTeacherId = (c.teacherId as any)?._id || c.teacherId;
            return classTeacherId === userId || classTeacherId?.toString() === userId?.toString();
        });
        const classIdsForTeacher = classesForTeacher.map((c: Class) => c._id);
        
        console.log('Teacher Students Filter Debug:', {
            userId,
            totalClasses: allClasses.length,
            teacherClasses: classesForTeacher.length,
            classIdsForTeacher,
            totalStudents: allStudents.length,
            sampleStudent: allStudents[0] ? {
                id: allStudents[0]._id,
                name: allStudents[0].name,
                classId: allStudents[0].classId,
                classIdType: typeof allStudents[0].classId
            } : null
        });
        
        const studentsForTeacher = allStudents.filter((s: Student) => {
            // Handle both string and object ID comparisons
            const studentClassId = typeof s.classId === 'object' ? (s.classId as any)?._id : s.classId;
            const match = classIdsForTeacher.some((classId: string) => 
                classId === studentClassId || classId?.toString() === studentClassId?.toString()
            );
            return match;
        });
        
        console.log('Filtered Students Result:', {
            studentsForTeacher: studentsForTeacher.length,
            studentNames: studentsForTeacher.map((s: Student) => s.name)
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

        // Use real attendance data from API (already calculated in students query)
        const totalStudents = teacherStudents.length;
        const avgAttendance = totalStudents > 0 ? Math.round(
            teacherStudents.reduce((acc: number, s: Student) => acc + (s.attendancePercentage || 0), 0) / totalStudents
        ) : 0;
        
        const topStudent = totalStudents > 0 ? teacherStudents.reduce((prev: Student, current: Student) =>
            (prev.attendancePercentage || 0) > (current.attendancePercentage || 0) ? prev : current
        ) : null;
        
        const lowAttendanceStudents = teacherStudents.filter((s: Student) => (s.attendancePercentage || 0) < 75).length;

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
            <div>
                <h1 className="text-2xl font-bold">My Students</h1>
                <p className="text-muted-foreground mt-1">View and manage all students across your classes</p>
            </div>
             {renderStatCards()}
            <ViewStudents 
                teacherClasses={teacherClasses}
                teacherStudents={teacherStudents}
                isLoading={isLoading}
            />
        </div>
    );
}
