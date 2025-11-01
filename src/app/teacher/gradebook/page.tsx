
"use client";
import * as React from "react";
import { GradebookTable } from "@/components/teacher/gradebook/gradebook-table";
import { useGetAssignmentsQuery, useGetClassesQuery, useGetGradesQuery, useGetStudentsQuery } from "@/services/api";
import { Teacher, Student, Class, Assignment } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clock, CheckCircle, TrendingUp } from "lucide-react";

export default function TeacherGradebookPage() {
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
    const { data: allAssignments = [], isLoading: isLoadingAssignments } = useGetAssignmentsQuery({});
    const { data: allStudents = [], isLoading: isLoadingStudents } = useGetStudentsQuery({});
    // Fetch ALL grades without filtering by studentId to see all submissions
    const { data: grades = [], isLoading: isLoadingGrades, refetch: refetchGrades } = useGetGradesQuery(undefined);

    const isLoading = isLoadingClasses || isLoadingAssignments || isLoadingStudents || isLoadingGrades || !user;

    const teacherClasses = React.useMemo(() => {
        if (!user || !allClasses) return [];
        const userId = user._id || user.id;
        const filtered = allClasses.filter((c: Class) => {
            const classTeacherId = (c.teacherId as any)?._id || c.teacherId;
            return classTeacherId === userId || classTeacherId?.toString() === userId?.toString();
        });
        
        console.log('Teacher Classes Debug:', {
            userId,
            totalClasses: allClasses.length,
            teacherClasses: filtered.length,
            teacherClassesData: filtered.map((c: Class) => ({
                id: c._id,
                name: c.name,
                teacherId: c.teacherId
            }))
        });
        
        return filtered;
    }, [user, allClasses]);

    const teacherClassIds = React.useMemo(() => {
        const ids = teacherClasses.map((c: Class) => c._id);
        console.log('Teacher Class IDs:', ids);
        return ids;
    }, [teacherClasses]);

    const teacherStudents = React.useMemo(() => {
        if (!allStudents || teacherClassIds.length === 0) {
            console.log('No students or teacherClassIds:', { 
                allStudentsCount: allStudents?.length, 
                teacherClassIds 
            });
            return [];
        }
        
        const filtered = allStudents.filter((s: Student) => {
            // Handle both string and object ID comparisons
            const studentClassId = typeof s.classId === 'object' ? (s.classId as any)?._id : s.classId;
            const match = teacherClassIds.some((tcId: string) => 
                tcId === studentClassId || 
                tcId?.toString() === studentClassId?.toString()
            );
            return match;
        });
        
        console.log('Teacher Students Filter Debug:', {
            totalStudents: allStudents.length,
            teacherClassIds,
            filteredStudents: filtered.length,
            sampleStudent: allStudents[0] ? {
                id: allStudents[0]._id,
                name: allStudents[0].name,
                classId: allStudents[0].classId
            } : null
        });
        
        return filtered;
    }, [allStudents, teacherClassIds]);

    // Filter assignments to only show those belonging to teacher's classes
    const teacherAssignments = React.useMemo(() => {
        if (!allAssignments || teacherClassIds.length === 0) return [];
        return allAssignments.filter((a: Assignment) => {
            // Handle both string and object ID comparisons
            const assignmentCourseId = typeof a.courseId === 'object' ? (a.courseId as any)?._id : a.courseId;
            return teacherClassIds.some((tcId: string) => 
                tcId === assignmentCourseId || 
                tcId?.toString() === assignmentCourseId?.toString()
            );
        });
    }, [allAssignments, teacherClassIds]);

    const stats = React.useMemo(() => {
        if (isLoading) {
            return {
                totalSubmissions: 0,
                gradedSubmissions: 0,
                pendingGrading: 0,
                averageGrade: 0,
            };
        }

        // Filter grades to only include those from teacher's assignments
        const teacherAssignmentIds = teacherAssignments.map((a: Assignment) => a._id);
        const teacherGrades = grades.filter((g: any) => {
            const gradeAssignmentId = typeof g.assignmentId === 'object' ? (g.assignmentId as any)?._id : g.assignmentId;
            return teacherAssignmentIds.includes(gradeAssignmentId);
        });

        const totalSubmissions = teacherGrades.length;
        
        // Graded submissions have a grade value that's not null/undefined
        const gradedSubmissions = teacherGrades.filter((g: any) => 
            g.grade !== null && g.grade !== undefined && g.grade !== ''
        ).length;
        
        const pendingGrading = totalSubmissions - gradedSubmissions;

        // Calculate average grade from graded submissions
        const gradedGrades = teacherGrades.filter((g: any) => 
            g.grade !== null && g.grade !== undefined && g.grade !== ''
        );
        
        let averageGrade = 0;
        if (gradedGrades.length > 0) {
            const totalGrade = gradedGrades.reduce((acc: number, g: any) => {
                const grade = typeof g.grade === 'string' ? parseFloat(g.grade) : g.grade;
                return acc + (isNaN(grade) ? 0 : grade);
            }, 0);
            averageGrade = Math.round(totalGrade / gradedGrades.length);
        }

        return {
            totalSubmissions,
            gradedSubmissions,
            pendingGrading,
            averageGrade,
        };
    }, [isLoading, grades, teacherAssignments]);

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
                        <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
                        <p className="text-xs text-muted-foreground">
                            All student submissions
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Grading</CardTitle>
                        <Clock className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pendingGrading}</div>
                        <p className="text-xs text-muted-foreground">
                            Awaiting review
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Graded</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.gradedSubmissions}</div>
                        <p className="text-xs text-muted-foreground">
                            Completed reviews
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.averageGrade}%</div>
                        <p className="text-xs text-muted-foreground">
                            Overall class performance
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if(isLoading) {
        return (
             <div className="space-y-6">
                <div>
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64 mt-2" />
                </div>
                {renderStatCards()}
                <Skeleton className="h-96 w-full" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Gradebook</h1>
                <p className="text-muted-foreground mt-1">Review and grade student submissions</p>
            </div>
            {renderStatCards()}
            <GradebookTable 
                students={teacherStudents}
                assignments={teacherAssignments}
                grades={grades}
                classes={teacherClasses}
                onGradeUpdate={refetchGrades}
            />
        </div>
    );
}
