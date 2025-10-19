
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
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <div className="space-y-6">
            <StudentStatCards />
            <AttendanceDetails />
        </div>
    );
}
