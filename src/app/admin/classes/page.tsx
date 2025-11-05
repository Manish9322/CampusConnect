
"use client"

import { ClassesTable } from "@/components/admin/classes-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetClassesQuery, useGetStudentsQuery } from "@/services/api";
import { BookCopy, School, Users, BarChart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ManageClassesPage() {
    const { data: classes = [], isLoading: isLoadingClasses, isError, refetch } = useGetClassesQuery(undefined);
    const { data: students = [], isLoading: isLoadingStudents } = useGetStudentsQuery(undefined);
    
    // Debug logging
    console.log('Classes data:', classes);
    console.log('Classes length:', classes.length);
    console.log('Is loading classes:', isLoadingClasses);
    console.log('Is error:', isError);

    const totalClasses = classes.length;
    const activeClasses = classes.filter((c: { status: string; }) => c.status === 'active').length;
    const totalStudents = students.length; 
    const avgStudentsPerClass = totalClasses > 0 ? Math.round(totalStudents / totalClasses) : 0;
    
    const isLoading = isLoadingClasses || isLoadingStudents;

    return (
        <div className="space-y-4 md:space-y-6 p-4 md:p-6">
            <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium">Total Classes</CardTitle>
                        <School className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {isLoading ? <Skeleton className="h-8 w-1/3" /> : <div className="text-xl sm:text-2xl font-bold">{totalClasses}</div>}
                        <p className="text-xs text-muted-foreground hidden sm:block">Across all departments</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium">Active Classes</CardTitle>
                        <BookCopy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                         {isLoading ? <Skeleton className="h-8 w-1/3" /> : <div className="text-xl sm:text-2xl font-bold">{activeClasses}</div>}
                        <p className="text-xs text-muted-foreground hidden sm:block">Currently in session</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {isLoading ? <Skeleton className="h-8 w-1/3" /> : <div className="text-xl sm:text-2xl font-bold">{totalStudents}</div>}
                        <p className="text-xs text-muted-foreground hidden sm:block">Enrolled in all classes</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium">Avg. Students/Class</CardTitle>
                        <BarChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {isLoading ? <Skeleton className="h-8 w-1/3" /> : <div className="text-xl sm:text-2xl font-bold">{avgStudentsPerClass}</div>}
                        <p className="text-xs text-muted-foreground hidden sm:block">Average class size</p>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader className="space-y-1.5">
                    <CardTitle className="text-xl md:text-2xl">Manage Classes</CardTitle>
                    <CardDescription className="text-sm">
                        A list of all classes offered. You can add, edit, or delete class records.
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-2 md:px-6">
                    <ClassesTable 
                        classes={classes} 
                        isLoading={isLoadingClasses} 
                        isError={isError}
                        refetch={refetch}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
