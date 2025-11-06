
"use client";

import * as React from "react";
import { GradeDetails } from "@/components/student/grades/grade-details";
import { GradeStatCards } from "@/components/student/grades/grade-stat-cards";
import { Student } from "@/lib/types";
import { useGetAssignmentsForStudentQuery, useGetGradesQuery } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudentGradesPage() {
    const [student, setStudent] = React.useState<Student | null>(null);

    React.useEffect(() => {
        const storedUser = localStorage.getItem('student_user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser.id && !parsedUser._id) {
                parsedUser._id = parsedUser.id;
            }
            setStudent(parsedUser);
        }
    }, []);

    const { data: assignments = [], isLoading: isLoadingAssignments } = useGetAssignmentsForStudentQuery(student?._id, { skip: !student });
    const { data: grades = [], isLoading: isLoadingGrades } = useGetGradesQuery(student?._id, { skip: !student });

    const isLoading = !student || isLoadingAssignments || isLoadingGrades;

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-8 w-48 mb-2" />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28" />)}
                </div>
                <Skeleton className="h-96" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">My Grades</h1>
                <p className="text-muted-foreground">An overview of your academic performance.</p>
            </div>
            <GradeStatCards assignments={assignments} grades={grades} />
            <GradeDetails assignments={assignments} grades={grades} />
        </div>
    );
}
