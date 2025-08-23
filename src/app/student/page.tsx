import { AttendanceCard } from "@/components/student/attendance-card";
import { AttendanceHistory } from "@/components/student/attendance-history";

export default function StudentDashboardPage() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="lg:col-span-3">
                <AttendanceCard />
            </div>
            <div className="lg:col-span-4">
                <AttendanceHistory />
            </div>
        </div>
    );
}
