
"use client"
import * as React from "react";
import { AssignmentsList } from "@/components/student/assignments/assignments-list";
import { Skeleton } from "@/components/ui/skeleton";
import { Student } from "@/lib/types";

export default function StudentAssignmentsPage() {
    const [user, setUser] = React.useState<Student | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    
    React.useEffect(() => {
        // Get the logged-in student from localStorage
        const storedUser = localStorage.getItem('student_user');
        console.log('=== STUDENT ASSIGNMENTS PAGE DEBUG ===');
        console.log('Stored user from localStorage:', storedUser);
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                console.log('Parsed user:', parsedUser);
                // Ensure both id and _id are set for compatibility
                if (parsedUser.id && !parsedUser._id) {
                    parsedUser._id = parsedUser.id;
                    console.log('Added _id field from id:', parsedUser._id);
                }
                console.log('Final user object:', parsedUser);
                setUser(parsedUser);
            } catch (error) {
                console.error('Error parsing stored user:', error);
            }
        } else {
            console.log('No student_user found in localStorage. Please log in.');
        }
        setIsLoading(false);
    }, []);

    if(isLoading || !user) {
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
            <AssignmentsList student={user} />
        </div>
    );
}
