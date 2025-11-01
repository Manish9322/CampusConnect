
"use client";
import * as React from "react";
import { GradebookTable } from "@/components/teacher/gradebook/gradebook-table";
import { useGetAssignmentsQuery, useGetClassesQuery, useGetGradesQuery, useGetStudentsQuery } from "@/services/api";
import { Teacher, Student, Class, Assignment } from "@/lib/types";
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
                assignments={teacherAssignments}
                grades={grades}
                classes={teacherClasses}
                onGradeUpdate={refetchGrades}
            />
        </div>
    );
}
