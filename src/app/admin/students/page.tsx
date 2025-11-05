
"use client";

import { StudentsTable } from "@/components/admin/students-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetClassesQuery, useGetStudentsQuery } from "@/services/api";
import { GraduationCap, Users, UserCheck, UserX } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ManageStudentsPage() {
    const studentsQuery = useGetStudentsQuery(undefined);
    const classesQuery = useGetClassesQuery(undefined);
    
    // Debug logging - check the entire query result
    console.log('=== STUDENTS QUERY DEBUG ===');
    console.log('Full studentsQuery object:', studentsQuery);
    console.log('studentsQuery.data:', studentsQuery.data);
    console.log('studentsQuery.isLoading:', studentsQuery.isLoading);
    console.log('studentsQuery.isSuccess:', studentsQuery.isSuccess);
    console.log('studentsQuery.isError:', studentsQuery.isError);
    console.log('studentsQuery.error:', studentsQuery.error);
    console.log('=== CLASSES QUERY DEBUG ===');
    console.log('Full classesQuery object:', classesQuery);
    console.log('classesQuery.data:', classesQuery.data);
    console.log('classesQuery.isLoading:', classesQuery.isLoading);
    console.log('classesQuery.isSuccess:', classesQuery.isSuccess);
    console.log('classesQuery.isError:', classesQuery.isError);
    console.log('classesQuery.error:', classesQuery.error);
    
    const students = studentsQuery.data || [];
    const classes = classesQuery.data || [];
    const isLoading = studentsQuery.isLoading || classesQuery.isLoading;

    const totalStudents = students.length;
    const activeStudents = students.filter((s: { status: string; }) => s.status === 'active').length;
    const inactiveStudents = totalStudents - activeStudents;
    const totalMajors = new Set(classes.map((c: { name: any; }) => c.name)).size;
    
    const renderCardContent = (value: number) => {
        return isLoading ? <Skeleton className="h-8 w-1/3" /> : <div className="text-2xl font-bold">{value}</div>
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {renderCardContent(totalStudents)}
                        <p className="text-xs text-muted-foreground">in the entire system</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Students</CardTitle>
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {renderCardContent(activeStudents)}
                        <p className="text-xs text-muted-foreground">Currently enrolled</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Inactive Students</CardTitle>
                        <UserX className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {renderCardContent(inactiveStudents)}
                        <p className="text-xs text-muted-foreground">Past or unenrolled</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {renderCardContent(totalMajors)}
                        <p className="text-xs text-muted-foreground">Across all departments</p>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Manage Students</CardTitle>
                    <CardDescription>
                        A list of all students in the system. You can add, edit, or delete student records.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <StudentsTable key={students.length} students={students} classes={classes} isLoading={isLoading} />
                </CardContent>
            </Card>
        </div>
    );
}
