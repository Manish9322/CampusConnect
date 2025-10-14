
"use client";
import * as React from "react";
import { GradebookTable } from "@/components/teacher/gradebook/gradebook-table";
import { useGetAssignmentsQuery, useGetClassesQuery, useGetGradesQuery, useGetStudentsQuery } from "@/services/api";
import { Teacher, Student, Class } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function TeacherGradebookPage() {
    const [user, setUser] = React.useState<Teacher | null>(null);

    React.useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const { data: allClasses = [], isLoading: isLoadingClasses } = useGetClassesQuery();
    const { data: assignments = [], isLoading: isLoadingAssignments } = useGetAssignmentsQuery({});
    const { data: allStudents = [], isLoading: isLoadingStudents } = useGetStudentsQuery({});
    const { data: grades = [], isLoading: isLoadingGrades, refetch: refetchGrades } = useGetGradesQuery();

    const isLoading = isLoadingClasses || isLoadingAssignments || isLoadingStudents || isLoadingGrades || !user;

    const teacherClasses = React.useMemo(() => {
        if (!user || !allClasses) return [];
        return allClasses.filter((c: Class) => c.teacherId?._id === user.id);
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

