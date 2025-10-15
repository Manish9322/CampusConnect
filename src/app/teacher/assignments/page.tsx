
"use client"
import * as React from "react";
import { AssignmentDataTable } from "@/components/teacher/assignments/assignment-data-table";
import { useGetAssignmentsQuery, useGetClassesQuery } from "@/services/api";
import { Teacher } from "@/lib/types";

export default function TeacherAssignmentsPage() {
    const [user, setUser] = React.useState<Teacher | null>(null);

    React.useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const { data: allAssignments = [], isLoading: isLoadingAssignments } = useGetAssignmentsQuery({});
    const { data: allClasses = [], isLoading: isLoadingClasses } = useGetClassesQuery(undefined);

    const teacherClasses = React.useMemo(() => {
        if (user && allClasses.length > 0) {
            return allClasses.filter((c: any) => c.teacherId?._id === user.id);
        }
        return [];
    }, [user, allClasses]);
    
    const teacherClassIds = React.useMemo(() => teacherClasses.map((c: any) => c._id), [teacherClasses]);

    const teacherAssignments = React.useMemo(() => {
        return allAssignments.filter((a: any) => teacherClassIds.includes(a.courseId));
    }, [allAssignments, teacherClassIds]);

    const isLoading = isLoadingAssignments || isLoadingClasses || !user;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Manage Assignments</h1>
            <AssignmentDataTable 
                initialAssignments={teacherAssignments}
                teacherClasses={teacherClasses}
                isLoading={isLoading}
            />
        </div>
    );
}
