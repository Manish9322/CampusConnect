
"use client"

import * as React from "react";
import { AttendanceDetails } from "@/components/student/attendance-details";
import { StudentStatCards } from "@/components/student/dashboard/student-stat-cards";
import { Student } from "@/lib/types";

export default function StudentAttendancePage() {
    const [user, setUser] = React.useState<Student | null>(null);

    React.useEffect(() => {
        const storedUser = localStorage.getItem('student_user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            // Ensure both id and _id are set for compatibility
            if (parsedUser.id && !parsedUser._id) {
                parsedUser._id = parsedUser.id;
            }
            setUser(parsedUser);
        }
    }, []);

    return (
        <div className="space-y-6">
            <StudentStatCards />
            <AttendanceDetails />
        </div>
    );
}
