
import { AttendanceDetails } from "@/components/student/attendance-details";
import { StudentStatCards } from "@/components/student/dashboard/student-stat-cards";

export default function StudentAttendancePage() {
    return (
        <div className="space-y-6">
            <StudentStatCards />
            <AttendanceDetails />
        </div>
    );
}
