
"use client"

import * as React from "react";
import { FeePaymentDetails } from "@/components/student/fees/fee-payment-details";
import { Student } from "@/lib/types";

export default function StudentFeesPage() {
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

    if (!student) {
        return <div>Loading student details...</div>;
    }

    return (
        <div className="space-y-6">
            <FeePaymentDetails student={student} />
        </div>
    );
}
