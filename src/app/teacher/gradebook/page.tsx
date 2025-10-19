
"use client";
import * as React from "react";
import { GradebookTable } from "@/components/teacher/gradebook/gradebook-table";
import { useGetAssignmentsQuery, useGetClassesQuery, useGetGradesQuery, useGetStudentsQuery } from "@/services/api";
import { Teacher, Student, Class } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

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
    const { data: assignments = [], isLoading: isLoadingAssignments } = useGetAssignmentsQuery({});
    const { data: allStudents = [], isLoading: isLoadingStudents } = useGetStudentsQuery({});
    const { data: grades = [], isLoading: isLoadingGrades, refetch: refetchGrades } = useGetGradesQuery(undefined);

    const isLoading = isLoadingClasses || isLoadingAssignments || isLoadingStudents || isLoadingGrades || !user;

    const teacherClasses = React.useMemo(() => {
        if (!user || !allClasses) return [];
        const userId = user._id || user.id;
        return allClasses.filter((c: Class) => {
            const classTeacherId = (c.teacherId as any)?._id || c.teacherId;
            return classTeacherId === userId;
        });
    }, [user, allClasses]);

    const teacherClassIds = React.useMemo(() => teacherClasses.map((c: Class) => c._id), [teacherClasses]);

    const teacherStudents = React.useMemo(() => {
        if (!allStudents || teacherClassIds.length === 0) return [];
        return allStudents.filter((s: Student) => teacherClassIds.includes(s.classId));
    }, [allStudents, teacherClassIds]);


    if(isLoading) {
        return (
             <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-10 w-32" />
                </div>
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
            <GradebookTable 
                students={teacherStudents}
                assignments={assignments}
                grades={grades}
                classes={teacherClasses}
                onGradeUpdate={refetchGrades}
            />
        </div>
    );
}
