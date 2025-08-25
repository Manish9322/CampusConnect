
import { TeacherDashboardCards } from "@/components/teacher/teacher-dashboard-cards";

export default function TeacherDashboardPage() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                 <h1 className="text-2xl font-bold">Welcome back, Dr. Alan Turing!</h1>
                 <p className="text-muted-foreground">Here's your dashboard overview for today.</p>
            </div>
            <TeacherDashboardCards />
        </div>
    );
}
