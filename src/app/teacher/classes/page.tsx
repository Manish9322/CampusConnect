
"use client"

import * as React from "react";
import { MyClasses } from "@/components/teacher/my-classes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookCopy, Users, BarChart, Clock } from "lucide-react";
import { useGetClassesQuery, useGetStudentsQuery } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Class } from "@/lib/types";

export default function TeacherClassesPage() {
    const [user, setUser] = React.useState<any>(null);

    React.useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);
    
    const { data: allClasses = [], isLoading: isLoadingClasses } = useGetClassesQuery();
    const { data: allStudents = [], isLoading: isLoadingStudents } = useGetStudentsQuery({});

    const isLoading = isLoadingClasses || isLoadingStudents || !user;

    const teacherClasses = React.useMemo(() => {
        if (!user || allClasses.length === 0) return [];
        return allClasses.filter((c: Class) => c.teacherId?._id === user.id);
    }, [user, allClasses]);

    const stats = React.useMemo(() => {
        if (isLoading || teacherClasses.length === 0) {
            return {
                coursesAssigned: 0,
                totalStudents: 0,
                avgClassSize: 0,
                activeCourses: 0,
            };
        }

        const coursesAssigned = teacherClasses.length;
        const activeCourses = teacherClasses.filter(c => c.status === 'active').length;

        const classIds = teacherClasses.map(c => c._id);
        const totalStudents = allStudents.filter((s: any) => classIds.includes(s.classId)).length;
        
        const avgClassSize = coursesAssigned > 0 ? Math.round(totalStudents / coursesAssigned) : 0;

        return {
            coursesAssigned,
            totalStudents,
            avgClassSize,
            activeCourses,
        };

    }, [isLoading, teacherClasses, allStudents]);

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
                            {teacherClasses.map((c: Class) => c.name).join(', ')}
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
            <h1 className="text-2xl font-bold">My Classes</h1>
            {renderStatCards()}
            <MyClasses 
                teacher={user}
                teacherClasses={teacherClasses} 
                allStudents={allStudents}
                isLoading={isLoading}
            />
        </div>
    );
}
