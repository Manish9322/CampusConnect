
"use client"

import * as React from "react";
import { MyClasses } from "@/components/teacher/my-classes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookCopy, Users, BarChart, Clock } from "lucide-react";
import { useGetClassesQuery, useGetStudentsQuery } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Class, Student } from "@/lib/types";

export default function TeacherClassesPage() {
    const [user, setUser] = React.useState<any>(null);

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

    const teacherClassesWithDetails = React.useMemo(() => {
        if (!user || allClasses.length === 0) return [];
        
        const userId = user._id || user.id;
        return allClasses
            .filter((c: Class) => {
                const classTeacherId = typeof c.teacherId === 'object' ? c.teacherId?._id : c.teacherId;
                return classTeacherId === userId;
            })
            .map((c: Class) => {
                // Filter students by matching classId (handle both string and object ID)
                const studentsInClass = allStudents.filter((s: Student) => {
                    const studentClassId = typeof s.classId === 'object' ? (s.classId as any)?._id : s.classId;
                    return studentClassId === c._id || studentClassId === (c._id as any)?.toString();
                });
                
                console.log(`Class ${c.name}:`, {
                    classId: c._id,
                    totalStudents: allStudents.length,
                    studentsInClass: studentsInClass.length,
                    studentIds: studentsInClass.map((s: Student) => s._id)
                });
                
                return {
                    ...c,
                    teacher: typeof c.teacherId === 'object' ? c.teacherId?.name : user.name,
                    studentCount: studentsInClass.length,
                    students: studentsInClass,
                };
            });
    }, [user, allClasses, allStudents]);

    const stats = React.useMemo(() => {
        if (isLoading || teacherClassesWithDetails.length === 0) {
            return {
                coursesAssigned: 0,
                totalStudents: 0,
                avgClassSize: 0,
                activeCourses: 0,
            };
        }

        const coursesAssigned = teacherClassesWithDetails.length;
        const activeCourses = teacherClassesWithDetails.filter((c: any) => c.status === 'active').length;
        const totalStudents = teacherClassesWithDetails.reduce((acc: number, c: any) => acc + c.studentCount, 0);
        const avgClassSize = coursesAssigned > 0 ? Math.round(totalStudents / coursesAssigned) : 0;

        return {
            coursesAssigned,
            totalStudents,
            avgClassSize,
            activeCourses,
        };

    }, [isLoading, teacherClassesWithDetails]);

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
                        <CardTitle className="text-sm font-medium">Courses Assigned</CardTitle>
                        <BookCopy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.coursesAssigned}</div>
                        <p className="text-xs text-muted-foreground">
                            {teacherClassesWithDetails.map((c: Class) => c.name).join(', ')}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalStudents}</div>
                        <p className="text-xs text-muted-foreground">
                            Across all your classes
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
            <div>
                <h1 className="text-2xl font-bold">My Classes</h1>
                <p className="text-muted-foreground mt-1">Manage your classes and view enrolled students</p>
            </div>
            {renderStatCards()}
            <MyClasses 
                teacher={user}
                classesWithDetails={teacherClassesWithDetails} 
                isLoading={isLoading}
            />
        </div>
    );
}
