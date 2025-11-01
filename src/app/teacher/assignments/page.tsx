
"use client"
import * as React from "react";
import { AssignmentDataTable } from "@/components/teacher/assignments/assignment-data-table";
import { useGetAssignmentsQuery, useGetClassesQuery } from "@/services/api";
import { Teacher } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Clock, CheckCircle, Calendar } from "lucide-react";

export default function TeacherAssignmentsPage() {
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

    const { data: allAssignments = [], isLoading: isLoadingAssignments } = useGetAssignmentsQuery({});
    const { data: allClasses = [], isLoading: isLoadingClasses } = useGetClassesQuery(undefined);

    const teacherClasses = React.useMemo(() => {
        if (user && allClasses.length > 0) {
            const userId = user._id || user.id;
            return allClasses.filter((c: any) => {
                const classTeacherId = c.teacherId?._id || c.teacherId;
                return classTeacherId === userId;
            });
        }
        return [];
    }, [user, allClasses]);
    
    const teacherClassIds = React.useMemo(() => teacherClasses.map((c: any) => c._id), [teacherClasses]);

    const teacherAssignments = React.useMemo(() => {
        return allAssignments.filter((a: any) => teacherClassIds.includes(a.courseId));
    }, [allAssignments, teacherClassIds]);

    const isLoading = isLoadingAssignments || isLoadingClasses || !user;

    const stats = React.useMemo(() => {
        if (isLoading || teacherAssignments.length === 0) {
            return {
                totalAssignments: 0,
                activeAssignments: 0,
                completedAssignments: 0,
                upcomingDeadlines: 0,
            };
        }

        const totalAssignments = teacherAssignments.length;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Assignments with future due dates
        const activeAssignments = teacherAssignments.filter((a: any) => {
            const dueDate = new Date(a.dueDate);
            return dueDate >= today;
        }).length;

        // Assignments with past due dates
        const completedAssignments = teacherAssignments.filter((a: any) => {
            const dueDate = new Date(a.dueDate);
            return dueDate < today;
        }).length;

        // Assignments due within next 7 days
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        const upcomingDeadlines = teacherAssignments.filter((a: any) => {
            const dueDate = new Date(a.dueDate);
            return dueDate >= today && dueDate <= nextWeek;
        }).length;

        return {
            totalAssignments,
            activeAssignments,
            completedAssignments,
            upcomingDeadlines,
        };
    }, [isLoading, teacherAssignments]);

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
                        <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalAssignments}</div>
                        <p className="text-xs text-muted-foreground">
                            All assignments created
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active</CardTitle>
                        <Clock className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeAssignments}</div>
                        <p className="text-xs text-muted-foreground">
                            Currently active
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.completedAssignments}</div>
                        <p className="text-xs text-muted-foreground">
                            Past deadline
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Due This Week</CardTitle>
                        <Calendar className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.upcomingDeadlines}</div>
                        <p className="text-xs text-muted-foreground">
                            Due within 7 days
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Manage Assignments</h1>
                <p className="text-muted-foreground mt-1">Create, edit, and track assignments for your classes</p>
            </div>
            {renderStatCards()}
            <AssignmentDataTable 
                initialAssignments={teacherAssignments}
                teacherClasses={teacherClasses}
                isLoading={isLoading}
            />
        </div>
    );
}
