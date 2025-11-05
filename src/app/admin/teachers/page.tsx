
"use client"

import { TeachersTable } from "@/components/admin/teachers-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetTeachersQuery } from "@/services/api";
import { Building, UserCheck, UserX, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ManageTeachersPage() {
    const { data: teachers = [], isLoading } = useGetTeachersQuery(undefined);
    
    // Debug logging
    console.log('Teachers data:', teachers);
    console.log('Teachers length:', teachers.length);
    console.log('Is loading:', isLoading);

    const totalTeachers = teachers.length;
    const activeTeachers = teachers.filter((t: { status: string; }) => t.status === 'active').length;
    const inactiveTeachers = totalTeachers - activeTeachers;
    const totalDepartments = new Set(teachers.map((t: { department: string; }) => t.department)).size;

    const statsCards = (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {isLoading ? <Skeleton className="h-8 w-1/3" /> : <div className="text-2xl font-bold">{totalTeachers}</div>}
                    <p className="text-xs text-muted-foreground">in the entire system</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Teachers</CardTitle>
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {isLoading ? <Skeleton className="h-8 w-1/3" /> : <div className="text-2xl font-bold">{activeTeachers}</div>}
                    <p className="text-xs text-muted-foreground">Currently employed</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Inactive Teachers</CardTitle>
                    <UserX className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {isLoading ? <Skeleton className="h-8 w-1/3" /> : <div className="text-2xl font-bold">{inactiveTeachers}</div>}
                    <p className="text-xs text-muted-foreground">Past or on-leave</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Departments</CardTitle>
                    <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {isLoading ? <Skeleton className="h-8 w-1/3" /> : <div className="text-2xl font-bold">{totalDepartments}</div>}
                    <p className="text-xs text-muted-foreground">Across all faculties</p>
                </CardContent>
            </Card>
        </div>
    );

    return (
        <div className="space-y-4 md:space-y-6 p-4 md:p-6">
            {statsCards}
            <Card>
                <CardHeader className="space-y-1.5">
                    <CardTitle className="text-xl md:text-2xl">Manage Teachers</CardTitle>
                    <CardDescription className="text-sm">
                        A list of all teachers in the system. You can add, edit, or delete teacher records.
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-2 md:px-6">
                    <TeachersTable data={teachers} isLoading={isLoading}/>
                </CardContent>
            </Card>
        </div>
    );
}
