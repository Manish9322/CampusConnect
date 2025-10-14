
"use client"
import * as React from "react";
import { AssignmentsList } from "@/components/student/assignments/assignments-list";
import { useGetAssignmentsQuery, useGetGradesQuery } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Student } from "@/lib/types";

export default function StudentAssignmentsPage() {
    const [user, setUser] = React.useState<Student | null>(null);
    
    React.useEffect(() => {
        // Mocking user login. In a real app, this would come from an auth context.
        const loggedInUser: Student = {
            id: '1', // Alice Johnson's ID from mock-data
            _id: '1',
            studentId: 'S001',
            name: 'Alice Johnson',
            email: 'alice@example.com',
            role: 'student',
            classId: '', // These details aren't strictly needed for this page's logic
            rollNo: '',
            phone: '',
            status: 'active',
            attendancePercentage: 0
        };
        setUser(loggedInUser);
    }, []);
    
    const { data: assignments = [], isLoading: isLoadingAssignments } = useGetAssignmentsQuery({});
    const { data: grades = [], isLoading: isLoadingGrades, refetch: refetchGrades } = useGetGradesQuery(user?.id, { skip: !user });

    const isLoading = isLoadingAssignments || isLoadingGrades || !user;

    if(isLoading) {
        return (
             <div className="space-y-6">
                <Skeleton className="h-40 w-full" />
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Skeleton className="h-72 w-full" />
                    <Skeleton className="h-72 w-full" />
                    <Skeleton className="h-72 w-full" />
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <AssignmentsList 
                assignments={assignments}
                grades={grades}
                studentId={user!.id}
                onGradeUpdate={refetchGrades}
            />
        </div>
    );
}
