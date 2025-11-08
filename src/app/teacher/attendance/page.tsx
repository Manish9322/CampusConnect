
"use client"

import * as React from "react";
import { AttendanceTool } from "@/components/teacher/attendance-tool";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookCopy, Users, BarChart, Clock } from "lucide-react";
import { useGetClassesQuery, useGetStudentsQuery } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Class, Student, Teacher } from "@/lib/types";

export default function TeacherAttendancePage() {
    const [user, setUser] = React.useState<Teacher | null>(null);

    React.useEffect(() => {
        const storedUser = localStorage.getItem('teacher_user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser.id && !parsedUser._id) {
                parsedUser._id = parsedUser.id;
            }
            setUser(parsedUser);
        }
    }, []);
    
    const { data: allClasses = [], isLoading: isLoadingClasses } = useGetClassesQuery(undefined);
    const { data: allStudents = [], isLoading: isLoadingStudents } = useGetStudentsQuery({});

    const isLoading = isLoadingClasses || isLoadingStudents || !user;

    const stats = React.useMemo(() => {
        if (isLoading) {
            return {
                coursesAssigned: 0,
                totalStudents: 0,
                avgClassSize: 0,
                activeCourses: 0,
            };
        }

        const coursesAssigned = allClasses.length;
        const activeCourses = allClasses.filter((c: any) => c.status === 'active').length;
        const totalStudents = allStudents.length;
        const avgClassSize = coursesAssigned > 0 ? Math.round(totalStudents / coursesAssigned) : 0;

        return {
            coursesAssigned,
            totalStudents,
            avgClassSize,
            activeCourses,
        };

    }, [allClasses, allStudents, isLoading]);

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
                        <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                        <BookCopy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.coursesAssigned}</div>
                        <p className="text-xs text-muted-foreground truncate">
                            All available classes
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
                            Across all classes
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
                        <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeCourses}</div>
                        <p className="text-xs text-muted-foreground">
                            Currently in session
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
                teacherClasses={allClasses}
            />
        </div>
    );
}
